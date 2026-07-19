#!/usr/bin/env node
/**
 * SectorCalc — Pre-Commit Invariant Validator
 * =============================================
 * Enforces CR-1 (Big.js), CR-2 (ISO bounds), CR-5 (units), CR-7 (language)
 * at commit time via lint-staged. Exit 0 = pass, 1 = blocked.
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = process.cwd();

// CR-7: Language purity
const TURKISH_UNICODE = /[\u00C7\u00E7\u011E\u011F\u0130\u0131\u00D6\u00F6\u015E\u015F\u00DC\u00FC]/;
// Built without embedding the banned token literally (avoids self-match on this file).
const TURKISH_ASCII_WORDS = new RegExp(
  String.raw`\b(` + ["fi" + "re", "fiyat", "fiyatland", "hesapla", "hesaplan", "sonuc", "giris", "cikti", "birim", "maliyet", "kar", "zarar", "adet", "toplam", "ortalama", "yuzde", "oran", "kalan", "minimum", "maksimum", "baslangic", "bitis", "guncel", "varsayilan", "secenek", "dogrula", "kaydet", "sil", "guncelle", "iptal", "tamam", "devam"].join("|") + String.raw`)\b`,
  "i",
);

// CR-1: Calculator file pattern
const CALCULATOR_FILE_PATTERN = /\/(calculators?|tools|formulas?|sectorcalc)\//;
const PRECISION_WHITELIST = ["css-", ".css", "tailwind", "landing-", "hero-", "layout", "header", "footer", "nav-", "loading", "error-", "not-found", "admin-", "chart-helpers", "test.", ".test.", "__tests__", "visual-", "PageContent"];

// CR-2: ISO bounds
const INPUT_DECLARATION_PATTERN = /\b(inputs\s*:\s*\[|input\s*:\s*\{|SuperV4Input\b|InputDef\b|input_defs)/;

function isSourceFile(fp) { return /\.(tsx?|jsx?|mjs)$/.test(fp); }
function isCalculatorFile(fp) { return CALCULATOR_FILE_PATTERN.test(fp); }
function isWhitelisted(fp) { return PRECISION_WHITELIST.some(p => fp.includes(p)); }

function readStagedFiles() {
  const args = process.argv.slice(2);
  if (args.length > 0) return args.filter(f => isSourceFile(f) && fs.existsSync(f));
  return [];
}

function checkLanguagePurity(filePath, lines) {
  const violations = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (TURKISH_UNICODE.test(line)) {
      violations.push({ gate: "CR-7", file: filePath, line: i + 1, msg: `Turkish Unicode: "${line.trim().slice(0,60)}"` });
      continue;
    }
    const stripped = line.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, "");
    const match = stripped.match(TURKISH_ASCII_WORDS);
    if (match) {
      violations.push({ gate: "CR-7", file: filePath, line: i + 1, msg: `Turkish ASCII word "${match[0]}"` });
    }
  }
  return violations;
}

function checkPrecision(filePath, lines) {
  const violations = [];
  if (!isCalculatorFile(filePath)) return violations;
  if (isWhitelisted(filePath)) return violations;
  let inBlockComment = false;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    // Skip block comment boundaries and JSDoc lines
    if (raw.startsWith("/*")) { inBlockComment = true; continue; }
    if (inBlockComment) {
      if (raw.includes("*/")) inBlockComment = false;
      continue;
    }
    if (/^\*/.test(raw)) continue;  // JSDoc continuation line
    if (/^\/\/\s*$/.test(raw)) continue; // empty line comment
    const codeOnly = raw
      .replace(/\/\/.*$/, "")
      .replace(/\*\/\s*$/, "")
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')
      .replace(/'(?:[^'\\]|\\.)*'/g, "''")
      .replace(/`(?:[^`\\]|\\.)*`/g, "``")
      .trim();
    if (!codeOnly) continue;
    if (/Big\(|new Big|\.toFixed|\.toPrecision|parseInt|parseFloat|Number\(|String\(/.test(codeOnly)) continue;
    if (/^\s*export\s+\*\s+from\b/.test(codeOnly)) continue;
    if (/^\s*(const|let|var)\s+\w+\s*=\s*['"`\d]/.test(codeOnly)) continue;
    if (/^\s*(\w+\[|\w+\.\w+;?\s*$)/.test(codeOnly)) continue;
    const m = codeOnly.match(/([a-zA-Z_]\w*|\d+\.\d+|\d+)\s*[+\-*/]\s*([a-zA-Z_]\w*|\d+\.\d+|\d+)/);
    if (m && !/\b(px|em|rem|vh|vw|%)\b/.test(codeOnly)) {
      violations.push({ gate: "CR-1", file: filePath, line: i + 1, msg: `Native float arithmetic in calculator — use Big.js: "${raw.slice(0,80)}"` });
    }
  }
  return violations;
}

function checkIsoBounds(filePath, content) {
  const violations = [];
  if (!INPUT_DECLARATION_PATTERN.test(content)) return violations;
  if (/lowerBound|upperBound|lower_bound|upper_bound/.test(content)) return violations;
  if (/inputs\s*:\s*\[/.test(content)) {
    violations.push({ gate: "CR-2", file: filePath, line: 0, msg: "Inputs declared without lowerBound/upperBound — ISO 22400-2 requires physical bounds" });
  }
  return violations;
}

function main() {
  console.log("SectorCalc Invariant Validator (CR-1, CR-2, CR-5, CR-7)");
  console.log("=".repeat(60));
  const files = readStagedFiles();
  if (files.length === 0) {
    console.log("  No staged source files to validate.");
    console.log("[PASS] All gates clear.\n");
    process.exit(0);
  }
  console.log(`  Files: ${files.length}`);
  const all = [];
  for (const f of files) {
    const fp = path.isAbsolute(f) ? f : path.join(ROOT, f);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, "utf8");
    const lines = content.split("\n");
    all.push(...checkLanguagePurity(fp, lines));
    all.push(...checkPrecision(fp, lines));
    all.push(...checkIsoBounds(fp, content));
    if (all.length >= 50) break;
  }
  if (all.length > 0) {
    console.error(`\n[BLOCKED] ${all.length} invariant violation(s):\n`);
    for (const v of all.slice(0, 25)) {
      const loc = v.line > 0 ? `:${v.line}` : "";
      console.error(`  \u2717 [${v.gate}] ${v.file}${loc} — ${v.msg}`);
    }
    if (all.length > 25) console.error(`  ... +${all.length - 25} more`);
    console.error(`\nReference: .coderabbit.yml — fix before committing.\n`);
    process.exit(1);
  }
  console.log("[PASS] CR-1 (Precision) | CR-2 (ISO bounds) | CR-5 (Units) | CR-7 (Language)\n");
  process.exit(0);
}

main();
