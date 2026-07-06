#!/usr/bin/env node

/**
 * guard-pro-v531-baris-non-english.mjs
 *
 * Checks that all string values in pro-v531 schema JSON files are English-only.
 * Exits 0 (PASS) if clean, 1 (FAIL) if any Turkish/non-English text is found.
 *
 * Usage:
 *   node scripts/guard-pro-v531-baris-non-english.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SCHEMAS_DIR = path.join(ROOT, 'src', 'sectorcalc', 'schemas', 'pro-v531');

// ── Turkish-specific character check ──────────────────────────────────────────
const TURKISH_RE = /[ğüşıöçĞÜŞİÖÇ]/;

function hasTurkishChars(str) {
  return TURKISH_RE.test(str);
}

// ── Cyrillic (Russian, etc.) range U+0400–U+04FF ────────────────────────────
const CYRILLIC_RE = /[\u0400-\u04FF]/;

function hasCyrillic(str) {
  return CYRILLIC_RE.test(str);
}

// ── CJK Unified Ideographs U+4E00–U+9FFF ─────────────────────────────────────
const CJK_RE = /[\u4E00-\u9FFF]/;

function hasCJK(str) {
  return CJK_RE.test(str);
}

// ── Hiragana U+3040–U+309F / Katakana U+30A0–U+30FF ─────────────────────────
const JAPANESE_KANA_RE = /[\u3040-\u309F\u30A0-\u30FF]/;

function hasJapaneseKana(str) {
  return JAPANESE_KANA_RE.test(str);
}

// ── Hangul Syllables U+AC00–U+D7AF ───────────────────────────────────────────
const HANGUL_RE = /[\uAC00-\uD7AF]/;

function hasHangul(str) {
  return HANGUL_RE.test(str);
}

// ── Arabic U+0600–U+06FF ─────────────────────────────────────────────────────
const ARABIC_RE = /[\u0600-\u06FF]/;

function hasArabic(str) {
  return ARABIC_RE.test(str);
}

// ── Devanagari (Hindi, etc.) U+0900–U+097F ──────────────────────────────────
const DEVANAGARI_RE = /[\u0900-\u097F]/;

function hasDevanagari(str) {
  return DEVANAGARI_RE.test(str);
}

// ── Thai U+0E00–U+0E7F ───────────────────────────────────────────────────────
const THAI_RE = /[\u0E00-\u0E7F]/;

function hasThai(str) {
  return THAI_RE.test(str);
}

// ── Hebrew U+0590–U+05FF ─────────────────────────────────────────────────────
const HEBREW_RE = /[\u0590-\u05FF]/;

function hasHebrew(str) {
  return HEBREW_RE.test(str);
}

/**
 * Check if a string contains any non-English script.
 * Returns null if clean, or an object with { detected: string[], scripts: string[] }.
 */
function checkNonEnglish(str) {
  const issues = [];
  const scripts = [];

  if (hasTurkishChars(str)) {
    issues.push('Turkish characters');
    scripts.push('Turkish');
  }
  if (hasCyrillic(str)) {
    issues.push('Cyrillic characters');
    scripts.push('Cyrillic');
  }
  if (hasCJK(str)) {
    issues.push('CJK characters');
    scripts.push('CJK');
  }
  if (hasJapaneseKana(str)) {
    issues.push('Japanese kana characters');
    scripts.push('Japanese');
  }
  if (hasHangul(str)) {
    issues.push('Hangul characters');
    scripts.push('Korean');
  }
  if (hasArabic(str)) {
    issues.push('Arabic characters');
    scripts.push('Arabic');
  }
  if (hasDevanagari(str)) {
    issues.push('Devanagari characters');
    scripts.push('Devanagari');
  }
  if (hasThai(str)) {
    issues.push('Thai characters');
    scripts.push('Thai');
  }
  if (hasHebrew(str)) {
    issues.push('Hebrew characters');
    scripts.push('Hebrew');
  }

  if (issues.length === 0) return null;

  return { detected: issues.join(', '), scripts };
}

/**
 * Recursively traverse a JSON value (object, array, or primitive).
 * Calls cb(pathParts, value) for every string encountered.
 *
 * @param {*} value      Current node in the JSON tree
 * @param {string[]} pathParts  Array of key segments leading to this node
 * @param {function} cb         Callback (pathParts, stringValue) => void
 */
function walkStrings(value, pathParts, cb) {
  if (typeof value === 'string') {
    cb(pathParts, value);
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      pathParts.push(`[${i}]`);
      walkStrings(value[i], pathParts, cb);
      pathParts.pop();
    }
  } else if (value !== null && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      pathParts.push(key);
      walkStrings(value[key], pathParts, cb);
      pathParts.pop();
    }
  }
  // numbers, booleans, null — ignore
}

/**
 * Format a path array into a human-readable dotted path like:
 *   "ui_contract.input_groups[0].title"
 */
function formatPath(parts) {
  let result = '';
  for (const part of parts) {
    if (/^\[\d+\]$/.test(part)) {
      result += part;
    } else if (result === '') {
      result += part;
    } else {
      result += '.' + part;
    }
  }
  return result;
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  // Verify schemas directory exists
  if (!fs.existsSync(SCHEMAS_DIR)) {
    console.error(`ERROR: Schema directory not found: ${SCHEMAS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SCHEMAS_DIR)
    .filter(f => f.endsWith('.schema.json'))
    .sort();

  if (files.length === 0) {
    console.error('ERROR: No .schema.json files found in', SCHEMAS_DIR);
    process.exit(1);
  }

  console.log(`\nScanning ${files.length} schema files for non-English text...\n`);

  let totalViolations = 0;
  let filesWithIssues = 0;
  const allReports = [];

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    let doc;
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      doc = JSON.parse(raw);
    } catch (err) {
      console.error(`  ERROR parsing ${file}: ${err.message}`);
      totalViolations++;
      filesWithIssues++;
      continue;
    }

    const fileViolations = [];

    walkStrings(doc, [], (pathParts, str) => {
      // Skip empty strings and strings that are only whitespace / punctuation
      if (str.trim().length === 0) return;

      // Skip strings that are purely numeric
      if (/^\d+(\.\d+)?$/.test(str.trim())) return;

      // Skip short codes / IDs that are purely uppercase letters, digits, underscores, hyphens
      // e.g., "PRO_031", "FORBIDDEN", "HIGH"
      if (/^[A-Z][A-Z0-9_-]+$/.test(str) && !hasTurkishChars(str)) return;

      const check = checkNonEnglish(str);
      if (check !== null) {
        fileViolations.push({
          path: formatPath(pathParts),
          value: str,
          detected: check.detected,
        });
      }
    });

    if (fileViolations.length > 0) {
      filesWithIssues++;
      totalViolations += fileViolations.length;
      allReports.push({ file, violations: fileViolations });
    }
  }

  // ── Output Report ───────────────────────────────────────────────────────────
  if (allReports.length === 0) {
    console.log('  ✓ All schema strings are English-only (PASS)\n');
    process.exit(0);
  }

  console.log(`  ✗ Found ${totalViolations} non-English text violation(s) across ${filesWithIssues} file(s):\n`);

  for (const { file, violations } of allReports) {
    console.log(`  ── ${file}`);
    for (const v of violations) {
      console.log(`       Path:   ${v.path}`);
      console.log(`       Value:  ${JSON.stringify(v.value)}`);
      console.log(`       Issue:  ${v.detected}`);
      console.log();
    }
  }

  console.log(`\n  FAIL: ${totalViolations} violation(s) in ${filesWithIssues} file(s).\n`);
  process.exit(1);
}

main();
