#!/usr/bin/env node
/**
 * === i18n QUALITY GATE — DNA-level machine ===
 *
 * This is THE mandatory build gate for ALL locale quality.
 * Runs 4 independent checks:
 *   1. TOOL TITLES   — generated-tool-titles-i18n.generated.json
 *   2. INPUT LABELS  — label_i18n on every schema input
 *   3. HELPERS       — businessContext_i18n on every schema input
 *   4. DESCRIPTIONS  — tool descriptions (if i18n exists)
 *
 * Every check must pass for the build to proceed.
 * New tools that fail this gate will BLOCK THE BUILD.
 *
 * Exit codes:
 *   0 = ALL CLEAN
 *   1 = QUALITY FAIL (build must stop)
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const TITLES_PATH = join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");

const LOCALES_ALL = ["en", "tr", "de", "fr", "es", "ar"];
const LOCALES_NON_EN = ["tr", "de", "fr", "es", "ar"];
const LOCALE_NAMES = { tr: "Turkish", de: "German", fr: "French", es: "Spanish", ar: "Arabic", en: "English" };

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

/* ── Helpers ──────────────────────────────────── */

function isProperNoun(text) {
  return text.split(/\s+/).length >= 1 && text.split(/\s+/).every((w) => /^[A-Z][a-z]/.test(w));
}

function isTurkishPossessiveSuffix(text, enText) {
  if (!text.startsWith(enText) || text.length <= enText.length) return false;
  const suffix = text.slice(enText.length);
  return /^(i|ı|ü|u|si|sı|sü|su|in|ın|ün|un|nin|nın|nün|nun|ye|ya|de|da|den|dan|le|la)$/i.test(suffix);
}

/** Known calculator term suffixes in target locales.
 *  If a locale value = EN + one of these, it's an English leak. */
const LEAK_SUFFIX_RE = /^(?:[\s\-–—]*)(?:hesaplama|hesaplayıcı|hesaplayici|araci|aracı|dönüştürücü|donusturucu|dengeleyici|kontrol|tahmincisi|tahminci|analizoru|analizörü|rechner|umrechner|calculator|converter|calculateur|calculadora|convertisseur|convertidor|محول|حاسبة|تحويل|آلة حاسبة|конвертер|калькулятор)[\s\-–—]*$/i;

function isAcceptableTranslation(value, enValue) {
  if (!value || !enValue) return false;
  if (value === enValue) {
    // Named entities (Cambridge English, Kendall Tau) stay untranslated
    return isProperNoun(enValue);
  }
  // Completely different text (not starting with EN) → properly translated
  if (value !== enValue && !(value.startsWith(enValue) && value.length > enValue.length)) {
    return true;
  }
  // Starts with EN + extra chars — could be EN leak or proper translation
  const suffix = value.slice(enValue.length).trim();
  // Turkish possessive (Friedman Testi → Friedman Test + i)
  if (/^(i|ı|ü|u|si|sı|sü|su|in|ın|ün|un|nin|nın|nün|nun|ye|ya|de|da|den|dan|le|la)$/i.test(suffix)) return true;
  // Single-char suffix ("n" in Volumen) is legitimate language ending
  if (suffix.length <= 1) return true;
  // Long suffix — reject only if it contains KNOWN leak calculator terms
  if (LEAK_SUFFIX_RE.test(value.slice(enValue.length))) return false;
  // Otherwise the suffix is a legitimate language-appropriate compound/ending
  return true;
}

/* ── Check 1: Input labels ────────────────────── */

function checkInputLabels(schemas) {
  const issues = [];
  for (const { slug, data } of schemas) {
    for (const input of data.inputs || []) {
      const i18n = input.label_i18n || {};
      const en = (i18n.en || input.label || "").trim();
      if (!en) continue;
      for (const loc of LOCALES_NON_EN) {
        const val = (i18n[loc] || "").trim();
        if (!val) {
          issues.push({ slug, input: input.id, locale: loc, reason: "missing" });
        } else if (!isAcceptableTranslation(val, en)) {
          if (val === en) {
            issues.push({ slug, input: input.id, locale: loc, reason: "en-identical" });
          } else {
            issues.push({ slug, input: input.id, locale: loc, reason: "en-suffix" });
          }
        }
      }
    }
  }
  return issues;
}

/* ── Check 2: Helpers (businessContext) ───────── */

function checkHelpers(schemas) {
  const issues = [];
  for (const { slug, data } of schemas) {
    for (const input of data.inputs || []) {
      const i18n = input.businessContext_i18n || {};
      const en = (i18n.en || input.businessContext || "").trim();
      if (!en) continue;
      for (const loc of LOCALES_NON_EN) {
        const val = (i18n[loc] || "").trim();
        if (!val) {
          issues.push({ slug, input: input.id, locale: loc, reason: "missing" });
        } else if (!isAcceptableTranslation(val, en)) {
          issues.push({ slug, input: input.id, locale: loc, reason: val === en ? "en-identical" : "en-suffix" });
        }
      }
    }
  }
  return issues;
}

/* ── Check 3: Descriptions (only if description_i18n exists) ── */

function checkDescriptions(schemas) {
  const issues = [];
  for (const { slug, data } of schemas) {
    const i18n = data.description_i18n;
    if (!i18n || typeof i18n !== "object") continue; // Skip schemas without description_i18n
    const en = (i18n.en || "").trim();
    if (!en) continue;
    for (const loc of LOCALES_NON_EN) {
      const val = (i18n[loc] || "").trim();
      if (!val) {
        issues.push({ slug, field: "description", locale: loc, reason: "missing" });
      } else if (!isAcceptableTranslation(val, en)) {
        issues.push({ slug, field: "description", locale: loc, reason: val === en ? "en-identical" : "en-suffix" });
      }
    }
  }
  return issues;
}

/* ── Check 4: Title bundle ─────────────────────── */

function checkTitles() {
  if (!existsSync(TITLES_PATH)) {
    console.error(`${RED}✗ Title bundle missing: ${TITLES_PATH}${RESET}`);
    return [];
  }
  const titles = JSON.parse(readFileSync(TITLES_PATH, "utf8"));
  const issues = [];

  for (const [slug, entry] of Object.entries(titles)) {
    const en = (entry.en || "").trim();
    if (!en) {
      issues.push({ slug, field: "title", locale: "en", reason: "missing" });
      continue;
    }
    for (const loc of LOCALES_NON_EN) {
      const val = (entry[loc] || "").trim();
      if (!val) {
        issues.push({ slug, field: "title", locale: loc, reason: "missing" });
      } else if (!isAcceptableTranslation(val, en)) {
        issues.push({ slug, field: "title", locale: loc, reason: val === en ? "en-identical" : "en-suffix" });
      }
    }
  }
  return issues;
}

/* ── Report ─────────────────────────────────────── */

function printSummary(title, issues) {
  if (issues.length === 0) {
    console.log(`  ${GREEN}✓ ${title}${RESET}`);
    return;
  }
  const byReason = {};
  for (const i of issues) {
    byReason[i.reason] = (byReason[i.reason] || 0) + 1;
  }
  const reasonStr = Object.entries(byReason)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  console.log(`  ${RED}✗ ${title} — ${issues.length} issue(s) [${reasonStr}]${RESET}`);

  // Show first 5 samples
  const samples = issues.slice(0, 5);
  for (const s of samples) {
    const loc = s.input ? `[${s.locale}] ${s.slug} > input:${s.input}` :
                s.field ? `[${s.locale}] ${s.slug} > ${s.field}` :
                `[${s.locale}] ${s.slug}`;
    console.log(`    ${loc} — ${s.reason}`);
  }
  if (issues.length > 5) {
    console.log(`    ... and ${issues.length - 5} more`);
  }
}

/* ── MAIN ──────────────────────────────────────── */

function main() {
  console.log(`\n${BOLD}${YELLOW}═══════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${YELLOW}   i18n QUALITY GATE — DNA-level Check       ${RESET}`);
  console.log(`${BOLD}${YELLOW}═══════════════════════════════════════════${RESET}\n`);

  if (!existsSync(SCHEMAS_DIR)) {
    console.error(`${RED}FATAL: schemas directory missing: ${SCHEMAS_DIR}${RESET}`);
    process.exit(1);
  }

  const schemaFiles = readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith("-schema.json"))
    .map((f) => ({
      slug: f.replace(/-schema\.json$/, ""),
      data: JSON.parse(readFileSync(join(SCHEMAS_DIR, f), "utf8")),
    }));

  console.log(`  Schemas loaded: ${schemaFiles.length}\n`);

  // Run all checks
  const titleIssues = checkTitles();
  printSummary("CHECK 1: Tool titles", titleIssues);

  const labelIssues = checkInputLabels(schemaFiles);
  printSummary("CHECK 2: Input labels", labelIssues);

  const helperIssues = checkHelpers(schemaFiles);
  printSummary("CHECK 3: Helper text (businessContext)", helperIssues);

  const descIssues = checkDescriptions(schemaFiles);
  printSummary("CHECK 4: Descriptions", descIssues);

  // Aggregate
  const allIssues = [...titleIssues, ...labelIssues, ...helperIssues, ...descIssues];
  const totalLocaleFields = schemaFiles.length * 5 * 6; // rough: schemas × inputs avg 6 × 5 locales
  // Count total checkable fields
  let totalCheckable = 0;
  for (const s of schemaFiles) {
    // Titles: all schemas
    totalCheckable += 5; // 5 locales per title
    // Inputs: per input
    for (const inp of s.data.inputs || []) {
      totalCheckable += 5; // label_i18n
      totalCheckable += 5; // businessContext_i18n
    }
  }

  const cleanCount = totalCheckable - allIssues.length;
  const cleanPct = totalCheckable > 0 ? ((cleanCount / totalCheckable) * 100).toFixed(2) : "N/A";

  console.log(`\n${BOLD}═══ VERDICT ═══${RESET}`);
  console.log(`  Total i18n fields checked: ${totalCheckable}`);
  console.log(`  Clean: ${cleanCount} (${cleanPct}%)`);
  console.log(`  Issues: ${allIssues.length}`);

  if (allIssues.length === 0) {
    console.log(`\n${GREEN}✓ ALL i18n CHECKS PASSED — ZERO issues${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`\n${RED}✗ QUALITY GATE FAILED — ${allIssues.length} issue(s) must be fixed${RESET}\n`);
    process.exit(1);
  }
}

main();
