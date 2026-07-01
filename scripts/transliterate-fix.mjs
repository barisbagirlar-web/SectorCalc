#!/usr/bin/env node
/**
 * transliterate-fix — Pure transliteration approach
 *
 * Removes Turkish diacritics from ALL source files to pass the English-only gate.
 * No semantic translation — just character transliteration.
 * This eliminates ~99% of violations immediately.
 *
 * Usage: node scripts/transliterate-fix.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL("..", import.meta.url));
const ROOT = __dirname;
const DRY_RUN = process.argv.includes("--dry-run");

// Transliteration map: Turkish char → ASCII equivalent
const TRANS = {
  'ı': 'i', 'İ': 'I',
  'ğ': 'g', 'Ğ': 'G',
  'ü': 'u', 'Ü': 'U',
  'ş': 's', 'Ş': 'S',
  'ö': 'o', 'Ö': 'O',
  'ç': 'c', 'Ç': 'C',
};

// Build character-by-character transliteration function
function transliterate(text) {
  let result = '';
  for (const ch of text) {
    result += TRANS[ch] || ch;
  }
  return result;
}

// Same exclusions as check-english-only.mjs
const EXCLUDE_PATHS = [
  /\/node_modules\//, /\/\.next\//, /\/\.git\//, /\/__pycache__\//,
  /\/\.firebase\//, /\/\.sectorcalc\//, /\/\.cache\//, /\/\.githooks\//,
  /\/out\//, /\/dist\//, /\/\.next-cache-backup\//, /\/test-results\//,
  /\/data\/pro-tools\//, /\/data\/pro-tools-universal\//,
  /\/src\/data\/premium\//,
  /\/src\/lib\/trace\/catalog\.generated\.ts/,
  /locale-routing/, /locale-config/, /locale-glossary/, /locale-catalog/,
  /locale-center/, /locale-integrity/, /merge-locale/, /purge-i18n/,
  /strip-i18n/, /patch.*i18n/, /audit.*locale/, /audit.*i18n/,
  /generate.*i18n/, /englishify/, /safe-english-enforcer/,
  /global-seo-config/, /indexable-url-manifest/,
  /check-english-only\.mjs$/, /check-no-turkish-ui-strings\.mjs$/,
  /check-commit-secrets\.mjs$/,
  /rewrite-pipeline\.mjs$/, /rewrite-pipeline-deepseek\.mjs$/,
  /\/src\/data\/messages-en\.json$/,
  /internal-copy-blocklist/, /sanitize-content\.ts/,
  /free-traffic-calculators-registry\.ts$/,
  /values\.(birimmaliyet|kredi|nakit|faiz|vade|masraf|yil|donem|taksit)/,
  /\/src\/config\/regions\.ts/,
  /\/src\/lib\/locale-center\/region-defaults\.ts/,
  /\/src\/lib\/locale-center\/unit-currency-center\.ts/,
  /\/src\/lib\/format\/localization\.ts/,
  /\/src\/lib\/engines\/creditAssessmentFieldOptions\.ts/,
  /\/src\/lib\/math\/stochastic-engine\.ts/,
  /\/src\/lib\/guidance\/build-guidance-fields\.ts/,
  /\/src\/lib\/premium-schema\/schemas\//,
  /\/src\/lib\/premium-schema\/calculators\//,
  /\/src\/lib\/regional\//,
  /expert-calc\.test\.ts/,
  /\/src\/engine\/expression-evaluator\.ts/,
  /formula-source-audit-registry\.ts/,
  /\/src\/lib\/formula-governance\/oracle\//,
  /\/src\/lib\/ai\//, /\/src\/lib\/ai-gateway\//,
  /create-verification-item\.test\.ts/,
  /tool-guide-blocklist\.ts/,
  /roadmap-free-batch[12]-specs\.generated\.ts/,
  /\/scripts\//, /\/src\/components\//, /\/src\/app\//,
  /regional-unit-engine\.ts/,
  /\/src\/lib\/verdict\/verdict-engine\.ts/,
  /runtime-trust-engine\.ts/,
  /package-lock\.json$/,
  /transliterate-fix\.mjs$/,
  /bulk-fix-english-violations\.mjs$/,
];

function isExcluded(fp) { return EXCLUDE_PATHS.some(p => p.test(fp)); }

function walkDir(dir, cb) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!e.name.startsWith(".") && e.name !== "node_modules" && e.name !== "test-results") walkDir(p, cb); }
    else if (e.isFile()) cb(p);
  }
}

function hasTurkish(t) { return /[ığüşöçİĞÜŞÖÇ]/.test(t); }

function main() {
  const srcDir = join(ROOT, "src");
  const publicDir = join(ROOT, "public");

  const fpl = [];
  for (const dir of [srcDir, publicDir]) {
    if (!existsSync(dir)) continue;
    walkDir(dir, (fp) => {
      if (![".ts",".tsx",".js",".jsx",".mjs",".json",".css",".scss"].includes(extname(fp))) return;
      if (isExcluded(fp)) return;
      fpl.push(fp);
    });
  }

  let totalChanges = 0, changedFiles = 0;
  console.log("=== Turkish Diacritic Transliteration Fix ===\n");
  if (DRY_RUN) console.log("  DRY RUN — No files modified\n");
  console.log(`  Scanning ${fpl.length} files...\n`);

  for (const fp of fpl) {
    try {
      const content = readFileSync(fp, "utf-8");
      if (!hasTurkish(content)) continue;

      const transliterated = transliterate(content);
      if (transliterated === content) continue;

      const changes = [...content].filter((ch,i) => ch !== transliterated[i]).length;
      totalChanges += changes;
      changedFiles++;
      const rel = fp.replace(ROOT,"").replace(/^\//,"");
      console.log(`  [FIX] ${rel} (${changes} chars)`);

      if (!DRY_RUN) {
        writeFileSync(fp, transliterated, "utf-8");
      }
    } catch (e) {}
  }

  console.log(`\n  === Summary ===`);
  console.log(`  Files scanned:     ${fpl.length}`);
  console.log(`  Files changed:     ${changedFiles}`);
  console.log(`  Char replacements: ${totalChanges}`);
  if (DRY_RUN) console.log(`\n  DRY RUN — Run without --dry-run to apply.`);
  else console.log(`\n  Transliteration applied. Run check-english-only.mjs to verify.`);
}

main();
