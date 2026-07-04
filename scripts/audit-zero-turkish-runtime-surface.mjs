#!/usr/bin/env node
/**
 * scripts/audit-zero-turkish-runtime-surface.mjs
 * V5.3.1 Zero Turkish Runtime Surface Auditor
 *
 * Scans all active build/runtime/public/schema surfaces for Turkish tokens.
 * Uses strict word-boundary and camelCase-boundary matching to avoid false positives.
 * Fails on any PUBLIC, SCHEMA, RUNTIME, EXPORT, or BUILD_REACHABLE violation.
 *
 * Matching strategy:
 *   - Multi-character tokens (>=3 chars): matched at word boundaries
 *   - Two-character tokens (ic, ag, dis, cap, etc.): only matched in camelCase tokens
 *   - Turkish characters: always matched at character level
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── Turkish characters ────────────────────────────────────────────────────
const TURKISH_CHARS_REGEX = /[çÇğĞıİöÖşŞüÜ]/;

// ── Forbidden Turkish terms (multi-character only) ────────────────────────
// These are matched at word boundaries and camelCase boundaries.
const TURKISH_TERMS = new Set([
  // 3+ character transliterated Turkish terms
  "engineer", "danismani", "danışmanı", "uzmani", "uzmanı",
  "yapisal", "yapısal", "istatistik", "istatistikci",
  "marangoz", "realestate", "degerleme", "değerleme", "investment", "yatırım",
  "cost", "waste", "capacity", "efficiency", "ratio",
  "profit", "kâr", "count", "unit", "area", "volume", "pressure", "basınç",
  "temperature", "sıcaklık", "production", "üduction", "design", "tasarım",
  "environment", "çevre", "sustainability", "sürdürülebilirlik",
  "hydraulic", "railway", "sinyalizasyon", "solar", "güneş",
  "wind", "rüzgar", "elektrikci", "elektrikçi", "tesisatci", "tesisatçı",
  "kaynakci", "resourceçı", "tornaci", "tornacı", "frezeci",
  "tamirci", "boya", "construction", "inşaat",
  "steel", "çelik", "torna", "tesfiye", "labor", "işçilik",
  "inventory", "alacak", "borc", "borç", "veresiye",
  "weight", "ağırlık", "length", "width", "genişlik",
  "height", "yükseklik", "derinlik", "yaricap", "yarıçap",
  "kesit", "speed", "hız", "acceleration", "start", "başlangıç",
  "finish", "bitiş", "result", "sonuç", "average", "standard", "deviation",
  "coefficient", "katsayı", "tutar", "hisse", "tahvil",
  "payment", "ödeme", "quantity", "total", "price", "resistance", "direnç",
  "stress", "akim", "akım", "taksit", "interest", "kazanc", "loss",
  "gelir", "expense", "period", "dönem", "rent", "teslimat", "quality",
  "customer", "müşteri", "supplier", "supplyçi", "running", "calışan",
  "uretici", "üretici", "yay", "rulman", "yatak", "kasnak",
  "kayis", "kayış", "zincir", "bant", "piston",
  "valf", "pompa", "kompresor", "kompresör",
  "pervane", "kanat", "diyafram", "debimetre",
  "slope", "eğim", "egme", "bukulme", "bükülme",
  "burkulma", "burulma", "sarfiyat", "annual", "aylik", "haftalik",
  "user", "useıcı", "calculate", "report", "record", "kayıt",
  "yeni", "eski", "mevcut", "guncel", "güncel",
  "saniye", "katman", "tabaka", "levha", "plaka",
  "eksen", "dilim", "kose", "köşe", "kenar", "kare",
  "dikdortgen", "dikdörtgen", "ucgen", "üçgen", "daire", "cokgen", "çokgen",
  "dikey", "column", "beam", "kiriş", "doseme", "döşeme",
  "temel", "wall", "perde", "roof", "çatı",
  "kubbe", "kemer", "merdiven", "korkuluk",
  "donati", "donatı", "concrete",
  "wood", "ahşap", "kompozit",
]);

// Short tokens (2 chars) — only matched inside camelCase/snake_case identifiers
const SHORT_TURKISH_TERMS = new Set(["ic", "iç", "dis", "dış", "ag", "ağ", "cap", "çap"]);

// False positive allowlist for short terms
const SHORT_FALSE_POSITIVE_IDENTIFIERS = new Set([
  "ic", "ic_", "_ic", "dis", "ag", "cap",
  "capacity", "capital", "caption", "capture",
  "agile", "agent", "agency", "agenda", "aggregate",
  "discuss", "display", "distance", "district", "distinct",
  "disable", "disable", "disabled", "disablement",
]);

// ── Exclude patterns ──────────────────────────────────────────────────────
const EXCLUDE_DIRS = new Set([
  "node_modules", ".next", ".git", "coverage", "dist", ".cursor",
]);

const EXCLUDE_FILES = new Set([
  "forbidden-turkish-tokens.json",
  "turkish-to-english-canonical-map.json",
  "turkish-to-english-dictionary.json",
  "turkish-en-list.txt",
  "audit-v531-schema-quality.mjs",
  "audit-zero-turkish-runtime-surface.mjs",
  "audit-public-english-only.mjs",
]);

const ARCHIVE_PREFIXES = ["archive", "archived", "old"];

// ── Results ────────────────────────────────────────────────────────────────
const results = {
  PUBLIC_SURFACE_VIOLATION: [],
  SCHEMA_CONTRACT_VIOLATION: [],
  RUNTIME_DATA_VIOLATION: [],
  EXPORT_SURFACE_VIOLATION: [],
  BUILD_REACHABLE_SOURCE_VIOLATION: [],
  TEST_FIXTURE_ALLOWED: [],
  DOCS_EXCLUDED: [],
  FALSE_POSITIVE_TECHNICAL_ENGLISH: [],
};

function isExcluded(filePath) {
  const parts = filePath.replace(ROOT + "/", "").split("/");
  for (const part of parts) {
    if (EXCLUDE_DIRS.has(part)) return true;
  }
  for (const prefix of ARCHIVE_PREFIXES) {
    if (parts.some((p) => p.startsWith(prefix))) return true;
  }
  const basename = path.basename(filePath);
  if (EXCLUDE_FILES.has(basename)) return true;
  return false;
}

/**
 * Tokenize a line into identifier tokens.
 * Splits on: whitespace, non-alphanumeric characters, camelCase boundaries.
 */
function tokenize(line) {
  const tokens = new Set();

  // Check for Turkish characters
  if (TURKISH_CHARS_REGEX.test(line)) {
    const chars = line.match(TURKISH_CHARS_REGEX);
    if (chars) {
      for (const c of chars) tokens.add(c);
    }
  }

  // Split into words by non-alphanumeric boundaries
  const words = line.split(/[^a-zA-Z0-9]+/).filter(Boolean);

  for (const word of words) {
    const lower = word.toLowerCase();

    // Check full word against Turkish terms
    if (TURKISH_TERMS.has(lower)) {
      tokens.add(lower);
    }

    // For short terms, check if part of a camelCase token
    // A camelCase token like "icBasinc" would split to ["ic", "Pressure"]
    // We detect camelCase splits and check each part
    const camelParts = lower.split(/(?<=[a-z])(?=[A-Z])|_/);
    for (const part of camelParts) {
      const partLower = part.toLowerCase();
      if (TURKISH_TERMS.has(partLower)) {
        tokens.add(partLower);
      }
      if (SHORT_TURKISH_TERMS.has(partLower)) {
        // Verify this is a real Turkish token by checking context
        // — only flag if it appears in a camelCase compound with another Turkish word
        // or if the whole word is a known Turkish compound
        if (camelParts.length >= 2) {
          const otherParts = camelParts.filter((p) => p !== part).map((p) => p.toLowerCase());
          const hasOtherTurkish = otherParts.some((p) => TURKISH_TERMS.has(p) || SHORT_TURKISH_TERMS.has(p));
          if (hasOtherTurkish) {
            tokens.add(partLower);
          }
        }
      }
    }
  }

  return tokens;
}

function isTestFixture(filePath) {
  const lower = filePath.toLowerCase();
  return (filePath.includes("__tests__") || filePath.includes("/test/")) &&
         (lower.includes("turkish") || lower.includes("turk"));
}

function classifyFinding(filePath, lineNum, tokens) {
  if (isTestFixture(filePath)) {
    results.TEST_FIXTURE_ALLOWED.push({ file: filePath, line: lineNum, tokens: [...tokens] });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".md" && !filePath.startsWith("src/") && !filePath.startsWith("public/") && !filePath.startsWith("data/")) {
    results.DOCS_EXCLUDED.push({ file: filePath, line: lineNum, tokens: [...tokens] });
    return;
  }

  // Schema contract violations
  if (filePath.includes("generated/schemas") || filePath.includes("sectorcalc_pro_new_v531_package")) {
    results.SCHEMA_CONTRACT_VIOLATION.push({ file: filePath, line: lineNum, tokens: [...tokens] });
    return;
  }
  if (filePath.endsWith("-schema.json") || filePath.endsWith(".schema.json")) {
    results.SCHEMA_CONTRACT_VIOLATION.push({ file: filePath, line: lineNum, tokens: [...tokens] });
    return;
  }

  // Export/proof-pack
  if (filePath.includes("export") || filePath.includes("proof-pack") ||
      filePath.includes("proof_pack") || filePath.includes("audit-seal") ||
      filePath.includes("public-response-redactor")) {
    results.EXPORT_SURFACE_VIOLATION.push({ file: filePath, line: lineNum, tokens: [...tokens] });
    return;
  }

  // Public surface
  if (filePath.startsWith("src/app") || filePath.startsWith("src/components") ||
      filePath.startsWith("public/")) {
    results.PUBLIC_SURFACE_VIOLATION.push({ file: filePath, line: lineNum, tokens: [...tokens] });
    return;
  }

  // Runtime data
  if (filePath.startsWith("data/") || filePath.startsWith("src/data") ||
      filePath.startsWith("generated/") || filePath.includes("registry") ||
      filePath.includes("catalog") || filePath.includes("manifest")) {
    results.RUNTIME_DATA_VIOLATION.push({ file: filePath, line: lineNum, tokens: [...tokens] });
    return;
  }

  // Everything else in src/
  if (filePath.startsWith("src/")) {
    results.BUILD_REACHABLE_SOURCE_VIOLATION.push({ file: filePath, line: lineNum, tokens: [...tokens] });
    return;
  }

  results.BUILD_REACHABLE_SOURCE_VIOLATION.push({ file: filePath, line: lineNum, tokens: [...tokens] });
}

function scanFile(filePath) {
  if (isExcluded(filePath)) return;

  try {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const tokens = tokenize(lines[i]);
      if (tokens.size > 0) {
        classifyFinding(filePath, i + 1, tokens);
      }
    }
  } catch {
    // skip unreadable/binary
  }
}

function scanDirectory(dirPath) {
  if (isExcluded(dirPath)) return;

  let entries;
  try {
    entries = readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".yml", ".yaml",
           ".html", ".css", ".txt", ".md"].includes(ext)) {
        scanFile(fullPath);
      }
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────
console.log("\n\uD83D\uDD0D V5.3.1 Zero Turkish Runtime Surface Audit\n");

const scanPaths = [
  "src", "data", "public", "scripts",
  "generated", "sectorcalc_pro_new_v531_package",
];

for (const scanPath of scanPaths) {
  const fullPath = path.join(ROOT, scanPath);
  if (existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
}

// ── Report ─────────────────────────────────────────────────────────────────
const violationCategories = [
  "PUBLIC_SURFACE_VIOLATION",
  "SCHEMA_CONTRACT_VIOLATION",
  "RUNTIME_DATA_VIOLATION",
  "EXPORT_SURFACE_VIOLATION",
  "BUILD_REACHABLE_SOURCE_VIOLATION",
];

const totalViolations = violationCategories.reduce((sum, cat) => sum + results[cat].length, 0);

console.log("=== RESULTS ===\n");
console.log(`  public_surface_violations=            ${results.PUBLIC_SURFACE_VIOLATION.length}`);
console.log(`  schema_contract_violations=            ${results.SCHEMA_CONTRACT_VIOLATION.length}`);
console.log(`  runtime_data_violations=               ${results.RUNTIME_DATA_VIOLATION.length}`);
console.log(`  export_surface_violations=             ${results.EXPORT_SURFACE_VIOLATION.length}`);
console.log(`  build_reachable_source_violations=     ${results.BUILD_REACHABLE_SOURCE_VIOLATION.length}`);
console.log(`  test_fixture_allowed=                  ${results.TEST_FIXTURE_ALLOWED.length}`);
console.log(`  docs_excluded=                         ${results.DOCS_EXCLUDED.length}`);
console.log(`  false_positive_technical_english=      ${results.FALSE_POSITIVE_TECHNICAL_ENGLISH.length}`);

if (totalViolations > 0) {
  console.log("\n--- VIOLATIONS ---\n");
  for (const cat of violationCategories) {
    const items = results[cat];
    if (items.length === 0) continue;

    // Deduplicate by file
    const fileMap = new Map();
    for (const item of items) {
      const key = item.file;
      if (!fileMap.has(key)) fileMap.set(key, []);
      fileMap.get(key).push(item);
    }

    console.log(`\n${cat} (${items.length} total, ${fileMap.size} files):`);
    let count = 0;
    for (const [file, fileItems] of fileMap) {
      if (count >= 20) {
        console.log(`  ... and ${fileMap.size - count} more files`);
        break;
      }
      const allTokens = [...new Set(fileItems.flatMap((i) => i.tokens))];
      const lines = fileItems.map((i) => i.line).join(",");
      console.log(`  ${file.replace(ROOT + "/", "")}:${lines} [${allTokens.join(", ")}]`);
      count++;
    }
  }
}

console.log("\n--- OTHER ---");
console.log(`  Test fixtures allowed: ${results.TEST_FIXTURE_ALLOWED.length}`);
console.log(`  Docs excluded: ${results.DOCS_EXCLUDED.length}`);
console.log(`  False positive English: ${results.FALSE_POSITIVE_TECHNICAL_ENGLISH.length}`);

const hasViolations = totalViolations > 0;
console.log(`\n\uD83D\uDD11 Status: ${hasViolations ? "FAIL" : "PASS"}`);
console.log(`ZERO_TURKISH_RUNTIME_SURFACE_AUDIT=${hasViolations ? "FAIL" : "PASS"}\n`);

process.exit(hasViolations ? 1 : 0);
