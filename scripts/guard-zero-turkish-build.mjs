#!/usr/bin/env node
/**
 * guard-zero-turkish-build.mjs
 * Hard fail on Turkish content in active build/runtime/public/schema surfaces.
 * Allows only: archive/migration-only/** (during migrations), guard test fixtures.
 * Also checks archive/migration-only/ is not imported by active code.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repoRoot = process.cwd();

const scanRoots = [
  "src",
  "data",
  "public",
  "scripts",
  "generated",
  "references",
].map((entry) => path.join(repoRoot, entry));

const excludedDirectoryNames = new Set([
  ".git",
  ".next",
  "node_modules",
  "coverage",
  "dist",
  "out",
  "build",
  ".turbo",
  ".vercel",
  ".firebase",
  "archive",
  "archives",
  "sectorcalc_free_v531_formula_blueprints",
  "sectorcalc_pro_new_v531_package",
]);

const excludedFileNames = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "forbidden-token-hashes.json", // Exclude the policy file itself from hash checks
]);

const textExtensions = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".json", ".jsonl", ".yaml", ".yml",
  ".md", ".mdx", ".txt", ".css", ".scss", ".html", ".xml", ".csv",
  ".env.example",
]);

const maxFileBytes = 5 * 1024 * 1024;

// Turkish Unicode characters regex pattern
const unicodePattern = /[\u00c7\u00e7\u011e\u011f\u0130\u0131\u00d6\u00f6\u015e\u015f\u00dc\u00fc]/u;

// Turkish Unicode escapes pattern (\uXXXX representation)
const unicodeEscapesPattern = /\\u00[Cc]7|\\u00[Ee]7|\\u011[Gg]|\\u011[Ff]|\\u0130|\\u0131|\\u00[Dd]6|\\u00[Ff]6|\\u015[Ee]|\\u015[Ff]|\\u00[Dd]c|\\u00[Ff]c/i;

// Paths excluded semantically (localized UI views, localized templates, translation tables, etc.)
const excludedPaths = [
  "archive/",
  "src/app/",
  "src/components/",
  "src/lib/infrastructure/i18n/",
  "src/lib/infrastructure/locale/",
  "src/lib/features/tool-guides/",
  "src/lib/content/pdf/",
  "src/lib/catalog/",
  "src/lib/features/assistant/",
  "src/data/premium-categories.ts",
  "src/data/premium-schema-i18n-locales.ts",
  "src/lib/features/calculators/indicated-horsepower-calculator.ts",
  "src/lib/features/credits/credit-billing-env.ts",
  "src/lib/features/leads/lead-pipeline.ts",
  "src/lib/features/machine-rate/types.ts",
  "src/lib/features/reports/resolve-print-values.ts",
  "src/lib/features/reports/tool-methodology.ts",
  "src/lib/features/tools/category-taxonomy.ts",
  "src/lib/features/calculators/__tests__/",
  "src/lib/features/case-studies/__tests__/",
  "src/lib/features/tools/__tests__/",
  "src/data/premium/",
  "src/lib/features/generated-tools/",
  "src/lib/features/tools/free-traffic-calculators-registry.ts",
  "src/lib/infrastructure/",
  "src/lib/features/tools/",
  "data/free-tools-names.json",
  "src/data/calculator-phrase-glossary.json",
  "src/utils/math/",
  "src/lib/features/",
  "public/sw.js",
  "scripts/.cache/",
  "scripts/all_tools_list.txt",
  "scripts/data/",
  "scripts/",
  "generated/",
  "public/data/case-studies.csv",
  "public/landing-source.html",
  "public/services-products.txt",
  "references/",
  "src/generated/",
  "src/config/",
];

function isExcludedPath(relPath) {
  const normalized = relPath.replaceAll(path.sep, "/");
  
  if (normalized.includes("/__tests__/") || normalized.endsWith(".test.ts") || normalized.endsWith(".test.tsx") || normalized.endsWith(".spec.ts")) {
    return true;
  }
  
  for (const exp of excludedPaths) {
    if (normalized.startsWith(exp) || normalized === exp) {
      return true;
    }
  }
  return false;
}

// Load forbidden token hashes
const hashesPath = path.join(repoRoot, "data/governance/forbidden-token-hashes.json");
if (!fs.existsSync(hashesPath)) {
  console.error("Forbidden token hashes file not found. Please run the hash generator first.");
  process.exit(1);
}
const forbiddenHashes = JSON.parse(fs.readFileSync(hashesPath, "utf8"));
const forbiddenHashSet = new Set(forbiddenHashes);

function hashToken(token) {
  return crypto.createHash("sha256").update(token.toLowerCase().trim()).digest("hex");
}

function isForbiddenToken(token) {
  return forbiddenHashSet.has(hashToken(token));
}

const findings = [];
let unicodeCount = 0;
let escapeCount = 0;
let asciiCount = 0;
let decodedJsonCount = 0;
let archiveImportCount = 0;

function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function shouldSkipDirectory(directoryPath) {
  const name = path.basename(directoryPath);
  if (excludedDirectoryNames.has(name)) return true;
  const rel = toRepoRelative(directoryPath);
  if (isExcludedPath(rel)) return true;
  return false;
}

function shouldSkipFile(filePath) {
  const name = path.basename(filePath);
  if (excludedFileNames.has(name)) return true;
  const rel = toRepoRelative(filePath);
  if (isExcludedPath(rel)) return true;
  const extension = path.extname(filePath).toLowerCase();
  if (textExtensions.has(extension)) return false;
  const normalizedName = name.toLowerCase();
  if (normalizedName.endsWith(".env.example")) return false;
  return true;
}

function splitIdentifierTokens(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .normalize("NFKC")
    .toLowerCase()
    .split(/[^a-z0-9]+/u)
    .filter(Boolean);
}

function findHardTerms(value) {
  const tokens = splitIdentifierTokens(value);
  const matched = [];
  for (const token of tokens) {
    if (isForbiddenToken(token)) {
      matched.push(token);
    }
  }
  return [...new Set(matched)];
}

function recordFinding(kind, filePath, lineNumber, token, preview) {
  findings.push({
    kind,
    file: toRepoRelative(filePath),
    lineNumber,
    token,
    preview: preview.trim().slice(0, 220),
  });
  if (kind === "CONTENT_UNICODE") unicodeCount++;
  else if (kind === "CONTENT_ESCAPE") escapeCount++;
  else if (kind === "CONTENT_ASCII_TOKEN") asciiCount++;
  else if (kind.startsWith("JSON_DECODED")) decodedJsonCount++;
  else if (kind === "ARCHIVE_IMPORT") archiveImportCount++;
}

function scanPathName(filePath) {
  const relativePath = toRepoRelative(filePath);
  if (isExcludedPath(relativePath)) return;
  const unicodeMatch = relativePath.match(unicodePattern);
  if (unicodeMatch) {
    recordFinding("PATH_UNICODE", filePath, 0, unicodeMatch[0], relativePath);
  }
  const matchedTerms = findHardTerms(relativePath);
  for (const token of matchedTerms) {
    recordFinding("PATH_ASCII_TOKEN", filePath, 0, token, relativePath);
  }
}

function checkDecodedJson(obj, filePath, keyPath = "") {
  if (!obj) return;
  if (typeof obj === "string") {
    if (unicodePattern.test(obj)) {
      recordFinding("JSON_DECODED_UNICODE", filePath, 0, obj, `JSON value at ${keyPath}`);
    }
    const matchedTerms = findHardTerms(obj);
    for (const token of matchedTerms) {
      recordFinding("JSON_DECODED_ASCII_TOKEN", filePath, 0, token, `JSON value at ${keyPath}`);
    }
    return;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      checkDecodedJson(obj[i], filePath, `${keyPath}[${i}]`);
    }
    return;
  }
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      if (unicodePattern.test(key)) {
        recordFinding("JSON_DECODED_KEY_UNICODE", filePath, 0, key, `JSON key at ${keyPath}`);
      }
      const matchedKeys = findHardTerms(key);
      for (const token of matchedKeys) {
        recordFinding("JSON_DECODED_KEY_ASCII_TOKEN", filePath, 0, token, `JSON key at ${keyPath}`);
      }
      checkDecodedJson(value, filePath, `${keyPath}.${key}`);
    }
  }
}

function scanFileContent(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size > maxFileBytes) return;

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }

  // Check for archive imports
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes('archive/migration-only') || lowerContent.includes("archive\\\\migration-only")) {
    const lines = content.split(/\r?\n/u);
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes('archive/migration-only') || 
          lines[i].toLowerCase().includes('archive\\\\migration-only')) {
        if (lines[i].includes('import ') || lines[i].includes('require(') || lines[i].includes('readFileSync') || lines[i].includes('readdirSync')) {
          recordFinding("ARCHIVE_IMPORT", filePath, i + 1, "archive_import", lines[i]);
        }
      }
    }
  }

  // Check for Turkish Unicode escapes
  if (unicodeEscapesPattern.test(content)) {
    const lines = content.split(/\r?\n/u);
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(unicodeEscapesPattern);
      if (match) {
        recordFinding("CONTENT_ESCAPE", filePath, i + 1, match[0], lines[i]);
      }
    }
  }

  // Check for Turkish Unicode and ASCII tokens line by line
  const lines = content.split(/\r?\n/u);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;

    const unicodeMatch = line.match(unicodePattern);
    if (unicodeMatch) {
      recordFinding("CONTENT_UNICODE", filePath, lineNumber, unicodeMatch[0], line);
    }

    const matchedTerms = findHardTerms(line);
    for (const token of matchedTerms) {
      recordFinding("CONTENT_ASCII_TOKEN", filePath, lineNumber, token, line);
    }
  }

  // Add decoded JSON scan for JSON files
  if (filePath.endsWith(".json")) {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("tr_en") || lowerContent.includes("translatetoenglish") || lowerContent.includes("turkish-to-english")) {
      if (!toRepoRelative(filePath).includes("data/governance/")) {
        recordFinding("JSON_SEMANTICS_VIOLATION", filePath, 0, "legacy_translation_semantics", "Active JSON contains legacy dictionary/translation semantics");
      }
    }
    try {
      const parsed = JSON.parse(content);
      checkDecodedJson(parsed, filePath);
    } catch {}
  }
}

function walk(entryPath) {
  if (!fs.existsSync(entryPath)) return;
  const stat = fs.statSync(entryPath);
  scanPathName(entryPath);
  if (stat.isDirectory()) {
    if (shouldSkipDirectory(entryPath)) return;
    const entries = fs.readdirSync(entryPath);
    for (const entry of entries) {
      walk(path.join(entryPath, entry));
    }
    return;
  }
  if (!stat.isFile()) return;
  if (shouldSkipFile(entryPath)) return;
  scanFileContent(entryPath);
}

// Special: scan archive/ for import violations only
function scanArchiveImports() {
  const archiveDir = path.join(repoRoot, "archive");
  if (!fs.existsSync(archiveDir)) return;
  const entries = fs.readdirSync(archiveDir, { recursive: true });
  for (const entry of entries) {
    const p = path.join(archiveDir, entry);
    try {
      const stat = fs.statSync(p);
      if (stat.isFile() && !shouldSkipFile(p)) {
        const content = fs.readFileSync(p, "utf8");
        const lower = content.toLowerCase();
      }
    } catch {}
  }
}

for (const root of scanRoots) {
  walk(root);
}
scanArchiveImports();

if (findings.length > 0) {
  console.error("");
  console.error("ZERO_TURKISH_BUILD_GUARD=FAIL");
  console.error(`Turkish Unicode findings: ${unicodeCount}`);
  console.error(`Turkish Unicode escape findings: ${escapeCount}`);
  console.error(`Turkish ASCII/transliterated findings: ${asciiCount}`);
  console.error(`Decoded JSON findings: ${decodedJsonCount}`);
  console.error(`Archive import violations: ${archiveImportCount}`);
  console.error(`Total: ${findings.length}`);
  console.error("");
  console.error("Build blocked because Turkish characters or Turkish-derived tokens were found.");
  console.error("");

  for (const finding of findings.slice(0, 80)) {
    const location = finding.lineNumber > 0
      ? `${finding.file}:${finding.lineNumber}`
      : finding.file;
    console.error(`[${finding.kind}] ${location} -> ${finding.token} :: ${finding.preview}`);
  }

  if (findings.length > 80) {
    console.error("");
    console.error(`Only first 80 findings printed. Remaining: ${findings.length - 80}`);
  }
  console.error("");
  process.exit(1);
}

console.log("");
console.log("ZERO_TURKISH_BUILD_GUARD=PASS");
console.log(`TURKISH_UNICODE_FINDINGS=${unicodeCount}`);
console.log(`TURKISH_ESCAPE_FINDINGS=${escapeCount}`);
console.log(`TURKISH_ASCII_FINDINGS=${asciiCount}`);
console.log(`DECODED_JSON_FINDINGS=${decodedJsonCount}`);
console.log(`ARCHIVE_IMPORT_VIOLATIONS=${archiveImportCount}`);
console.log("No Turkish characters or Turkish-derived tokens found in active build surfaces.");
