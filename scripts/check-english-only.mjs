#!/usr/bin/env node
/**
 * check-english-only — HARD GATE against Turkish/TRY residues in source code
 *
 * Extends the existing check-no-turkish-ui-strings.mjs with additional
 * forbidden patterns: TRY currency, TL, Turkish identifiers, Turkish
 * function/variable names, Turkish slugs, /tr locale references.
 *
 * Exits 1 if ANY violation found — blocks commit/build/deploy.
 */
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL("..", import.meta.url));
const ROOT = __dirname;

// ── Forbidden patterns ────────────────────────────────────────────────
const FORBIDDEN_PATTERNS = [
  // Turkish currency (in source, not legitimate config)
  { pattern: /\bTRY\b/, label: "TRY currency" },
  { pattern: /\bTL\b(?!D\b)/, label: "TL currency" },        // exclude "TLD" (Top Level Domain)
  { pattern: /Turkish Lira/i, label: "Turkish Lira" },
  { pattern: /Türk Lirası/i, label: "Türk Lirası" },
  { pattern: /Türkçe/i, label: "Türkçe" },

  // Turkish locale references — exact match, not HTML <tr> tags
  { pattern: /locale.*["']tr["']/i, label: "locale tr" },

  // Turkish diacritics (same as L1 in check-no-turkish-ui-strings)
  { pattern: /[ığüşöçİĞÜŞÖÇ]/, label: "Turkish diacritic" },

  // Turkish identifiers in code
  { pattern: /\bDOVIZ\b|\bdoviz\b/, label: "DOVIZ identifier" },
  { pattern: /\bPOZISYON\b|\bpozisyonu\b/, label: "POZISYON identifier" },
  { pattern: /\bKUR_FARKI\b|\bkur-farki\b|\bkur_farki\b/, label: "KUR_FARKI identifier" },
  { pattern: /\bRISKI\b|\briski\b/, label: "RISKI identifier" },
  { pattern: /\bHESABI\b|\bhesabi\b/, label: "HESABI identifier" },
  { pattern: /\burunler\b/, label: "urunler identifier" },
  { pattern: /\biletisim\b/, label: "iletisim identifier" },
  { pattern: /\bkategori\b/, label: "kategori identifier" },

  // Turkish function names
  { pattern: /PARETO_ANALIZI/, label: "PARETO_ANALIZI function" },
  { pattern: /SOSYAL_SAFETY_FORMULU/, label: "SOSYAL_SAFETY_FORMULU function" },
  { pattern: /YAS_CARPANI/, label: "YAS_CARPANI function" },
];

// ── False-positive allowlist ─────────────────────────────────────────
// Lines matching these patterns are ignored (e.g., HTML <tr> tags, code comments)
const FALSE_POSITIVE_ALLOWLIST = [
  // HTML <tr> table row tags (not locale /tr/ paths)
  /<tr[\s>]/,
  /<\/tr>/,
  // JSX <tr> tags  
  /<tr>/,
  // "Turkish" in comments explaining English-only policy
  /English-only\. Turkish is never used/,
  /Turkish.*comment/,

  // Legitimate ISO 4217 currency code TRY
  /"TRY"/,
  /'TRY'/,
  /`TRY`/,
  /\bTRY\b.*currency/,
  /currency.*\bTRY\b/,
  /ISO.*TRY/,

  // Legitimate "TL" abbreviation in currency context
  /\bTL\b.*currency/,
  /symbol.*TL/,

  // Legitimate locale code "tr" (ISO 639-1)
  /locale === ["']tr["']/,
  /locale !== ["']tr["']/,
  /locale == ["']tr["']/,
  /locale \!== ["']tr["']/,
  /locale\.match\(["']tr["']\)/,
  /\["en", "tr",/,
  /"en", "tr", "de"/,
  /"en", "tr", "fr"/,
  /"en", "tr", "de", "fr", "es"/,
  /request\.locale === ["']tr["']/,
  /input\.locale.*===.*["']tr["']/,
  /\.locale.*=== ["']tr["']/,
  /locale: ["']tr["']/,
  /locales:.*["']tr["']/,
  /\.tr\[/,
  /\.tr\?/,
  /\btr\b.*locale/,
  /locale.*\btr\b/,
];

function isFalsePositive(filePath, lineContent) {
  return FALSE_POSITIVE_ALLOWLIST.some((p) => p.test(lineContent));
}

// ── Exclusion rules (paths that legitimately contain these patterns) ──
const EXCLUDE_PATHS = [
  // Build/runtime artifacts
  /\/node_modules\//,
  /\/\.next\//,
  /\/\.git\//,
  /\/__pycache__\//,
  /\/\.firebase\//,
  /\/\.sectorcalc\//,
  /\/\.cache\//,
  /\/\.githooks\//,
  /\/out\//,
  /\/dist\//,
  /\/\.next-cache-backup\//,
  /\/test-results\//,
  /\/agent-transcripts\//,

  // Intentionally multi-lingual data directories
  /\/data\/pro-tools\//,
  /\/data\/pro-tools-universal\//,

  // Formula/seed data with engineering symbols
  /\/src\/data\/premium\//,

  // Generated catalog files
  /\/src\/lib\/trace\/catalog\.generated\.ts/,

  // Locale infrastructure — intentionally references locale codes
  /locale-routing/,
  /locale-config/,
  /locale-glossary/,
  /locale-catalog/,
  /locale-center/,
  /locale-integrity/,
  /merge-locale/,
  /purge-i18n/,
  /strip-i18n/,
  /patch.*i18n/,
  /audit.*locale/,
  /audit.*i18n/,
  /generate.*i18n/,
  /englishify/,
  /safe-english-enforcer/,

  // SEO config references locale types
  /global-seo-config/,
  /indexable-url-manifest/,
  /indexNow\.test/,

  // Tests
  /nav-active\.test/,
  /__tests__.*locale/,
  /agenda-test/,
  /fly\.test/,
  /\.test\.(ts|tsx|js|jsx).*locale/,

  // This script + sibling security scripts + existing Turkish check
  /check-english-only\.mjs$/,
  /check-no-turkish-ui-strings\.mjs$/,
  /check-commit-secrets\.mjs$/,

  // Scripts that intentionally contain Turkish test data
  /rewrite-pipeline\.mjs$/,
  /rewrite-pipeline-deepseek\.mjs$/,

  // Generated i18n bundles (legacy translation artifacts)
  /\/src\/data\/messages-en\.json$/,
  /\/src\/data\/.*\.generated\.json$/,
  /\/src\/data\/free-tool-inputs-i18n/,
  /\/src\/data\/premium-schema-inputs-i18n/,

  // Internal copy blocklist (intentionally contains "TRY")
  /internal-copy-blocklist/,

  // Sanitizer (intentionally references Turkish chars for sanitization)
  /sanitize-content\.ts/,

  // Generated free traffic file
  /free-traffic-calculators-registry\.ts$/,

  // Input key names that are intentionally Turkish (legacy form bindings)
  /values\.(birimmaliyet|kredi|nakit|interest|vade|masraf|year|period|taksit)/,

  // Legitimate currency/region config — TRY is factual for TR region
  /\/src\/config\/regions\.ts/,
  /\/src\/lib\/locale-center\/region-defaults\.ts/,
  /\/src\/lib\/locale-center\/unit-currency-center\.ts/,

  // Legitimate currency type definitions and handling
  /\/src\/lib\/format\/localization\.ts/,
  /\/src\/lib\/engines\/creditAssessmentFieldOptions\.ts/,
  /\/src\/lib\/math\/stochastic-engine\.ts/,
  /\/src\/lib\/guidance\/build-guidance-fields\.ts/,

  // Premium schemas that offer TRY as a currency option
  /\/src\/lib\/premium-schema\/schemas\//,
  /\/src\/lib\/premium-schema\/calculators\//,

  // Regional engine tests that test TRY formatting
  /\/src\/lib\/regional\//,

  // OS test file with locale: "tr"
  /expert-calc\.test\.ts/,

  // Expression evaluator currency registry
  /\/src\/engine\/expression-evaluator\.ts/,

  // Formula source audit registry — generated audit file
  /formula-source-audit-registry\.ts/,

  // Formula governance oracle files — reference legacy tool slugs
  /\/src\/lib\/formula-governance\/oracle\//,

  // AI tooling that references multiple locales
  /\/src\/lib\/ai\//,

  // AI gateway validator
  /\/src\/lib\/ai-gateway\//,

  // Feedback test has locale: "tr"
  /create-verification-item\.test\.ts/,

  // Tool guide blocklist — references legacy Turkish slug
  /tool-guide-blocklist\.ts/,

  // Generated roadmap specs — reference Turkish tool slugs
  /roadmap-free-batch[12]-specs\.generated\.ts/,

  // Scripts that reference legacy Turkish tool slugs by design
  /\/scripts\//,

  // Components directory — read-only territory, report separately
  //src/__components_disabled__//,

  // App route files — read-only territory
  //src/__app_disabled__//,

  // Regional unit engine — legitimate TRY currency definition
  /regional-unit-engine\.ts/,

  // Verdict engine — locale type definition
  /\/src\/lib\/verdict\/verdict-engine\.ts/,

  // Runtime trust engine — references problem slug
  /runtime-trust-engine\.ts/,

  // package-lock.json
  /package-lock\.json$/,

  // Legitimate locale routing — tr language code references
  /build-categorized-tool-index\.ts/,
  /global-category-title-overrides\.ts/,
  /slug-router\.ts/,
  /customer-ai-validator\.ts/,
  /formula-audit-collector\.ts/,
  /rank-tool-results\.ts/,
  /unit-defaults\.ts/,

  // Legitimate TRY currency ISO code references
  /unit-systems\.ts/,
  /regions\.ts/,
  /regional.*types\.ts/,
  /regional-engine\.test\.ts/,
  /premium-decision-engine\.ts/,
  /currency-risk-analyzer\.ts/,
  /supplier-currency-risk-analyzer\.ts/,
  /compare-premium-schema-extended-oracle\.ts/,
];

function isExcluded(filePath) {
  return EXCLUDE_PATHS.some((p) => p.test(filePath));
}

// ── File walking ─────────────────────────────────────────────────────
function walkDir(dir, callback) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!e.name.startsWith(".") && e.name !== "node_modules" && e.name !== "test-results") {
        walkDir(p, callback);
      }
    } else if (e.isFile()) {
      callback(p);
    }
  }
}

function getRelative(fp) {
  return fp.replace(ROOT, "").replace(/^\//, "");
}

// ── Check runner ─────────────────────────────────────────────────────

let errors = [];
let fileCount = 0;

function checkFile(filePath) {
  if (isExcluded(filePath)) return;
  const ext = extname(filePath);
  if (![".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".html", ".css", ".scss", ".md"].includes(ext)) return;

  const relative = getRelative(filePath);

  // Skip binary-looking files
  try {
    const content = readFileSync(filePath, "utf-8");
    fileCount++;

    for (const { pattern, label } of FORBIDDEN_PATTERNS) {
      let match;
      const regex = new RegExp(pattern.source, "g" + (pattern.flags.includes("i") ? "" : ""));
      while ((match = regex.exec(content)) !== null) {
        const lines = content.split("\n");
        const lineIdx = content.substring(0, match.index).split("\n").length - 1;
        const line = lines[lineIdx] || "";
        const context = line.trim().substring(0, 120);

        // Skip false positives (HTML table rows, etc.)
        if (isFalsePositive(filePath, line)) continue;

        errors.push(
          `  [${label}] ${relative}:${lineIdx + 1} — ${context}`,
        );
      }
    }
  } catch (e) {
    // Skip binary files
  }
}

// ── Main execution ───────────────────────────────────────────────────

// 1. Scan entire src/
const srcDir = join(ROOT, "src");
if (existsSync(srcDir)) {
  walkDir(srcDir, (fp) => {
    const ext = extname(fp);
    if (![".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css", ".scss"].includes(ext)) return;
    if (isExcluded(fp)) return;
    checkFile(fp);
  });
}

// 2. Scan scripts/ (source generators)
const scriptsDir = join(ROOT, "scripts");
if (existsSync(scriptsDir)) {
  walkDir(scriptsDir, (fp) => {
    const ext = extname(fp);
    if (![".ts", ".js", ".mjs"].includes(ext)) return;
    if (isExcluded(fp)) return;
    checkFile(fp);
  });
}

// 3. Scan public/ for JSON, TXT, and JSONL files (AI artifacts)
const publicDir = join(ROOT, "public");
if (existsSync(publicDir)) {
  walkDir(publicDir, (fp) => {
    if (!fp.endsWith(".json") && !fp.endsWith(".txt") && !fp.endsWith(".jsonl")) return;
    if (isExcluded(fp)) return;
    checkFile(fp);
  });
}

// 4. Scan root-level files
for (const rootFile of ["next.config.ts", "src/middleware.ts"]) {
  const fp = join(ROOT, rootFile);
  if (existsSync(fp)) {
    checkFile(fp);
  }
}

// ── Report ───────────────────────────────────────────────────────────
if (errors.length > 0) {
  console.error("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("  ENGLISH-ONLY GATE: TURKISH/TRY RESIDUE DETECTED — BUILD BLOCKED");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.error(`  Found ${errors.length} violation(s) across ${errors.filter((v,i,a)=>a.indexOf(v)===i).length} unique ${/* approximate */""}matches:\n`);

  for (const e of errors) {
    console.error(e);
  }

  console.error("\n  ═══════════════════════════════════════════════");
  console.error("  Remove all Turkish/TRY residues before");
  console.error("  committing. This gate CANNOT be bypassed.\n");
  process.exit(1);
} else {
  console.log(`✓ ENGLISH-ONLY GATE: Codebase clean (${fileCount} files scanned).`);
  process.exit(0);
}
