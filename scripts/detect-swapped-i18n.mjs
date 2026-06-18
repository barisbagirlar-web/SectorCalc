#!/usr/bin/env node
/**
 * Detect TR↔EN swapped schema i18n fields + other residual defects.
 * Scans ALL generated/schemas/*.json and reports:
 *   1. SWAPPED: tr field has English/EN field has Turkish
 *   2. EN-IDENTICAL: non-EN locale same as EN (legitimate?): classified
 *   3. MISSING: locale slot absent
 *   4. RAW_SAME: raw label === raw en (no i18n at all)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.resolve(__dirname, "..", "generated", "schemas");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

const TR_MARKERS = /[çğıöşüÇĞİÖŞÜ]/;
const DE_MARKERS = /[äöüßÄÖÜ]/;
const FR_MARKERS = /[àâçéèêëîïôùûüÀÂÇÉÈÊËÎÏÔÙÛÜ]/;
const ES_MARKERS = /[áéíóúñü¿¡ÁÉÍÓÚÑÜ]/;
const AR_MARKERS = /[\u0600-\u06FF]/;

const LOCALE_CHARS = { tr: TR_MARKERS, de: DE_MARKERS, fr: FR_MARKERS, es: ES_MARKERS, ar: AR_MARKERS };

function hasLocaleChars(text, locale) {
  return LOCALE_CHARS[locale]?.test(text) ?? false;
}

function isEnglish(text) {
  // Heuristic: contains common English words
  return /\b(the|this|that|with|from|when|your|enter|number of|used for|input for)\b/i.test(text);
}

const reports = {
  swapped: [],
  enIdentical: [],
  rawSame: [],
  missingEn: [],
};

const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));

for (const fn of files) {
  const slug = fn.replace(/-schema\.json$/, "");
  const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, fn), "utf8"));

  for (const input of raw.inputs ?? []) {
    const id = input.id;
    const rawLabel = (input.label ?? "").trim();
    const rawBc = (input.businessContext ?? "").trim();
    const li18n = input.label_i18n ?? {};
    const bi18n = input.businessContext_i18n ?? {};

    // Check if schema has any _i18n data at all
    const hasAnyI18n = Object.keys(li18n).length > 0 || Object.keys(bi18n).length > 0;

    // --- RAW_SAME: raw label is same as raw businessContext (likely auto-generated) ---
    if (rawLabel && rawBc && rawLabel === rawBc && rawLabel.length > 3) {
      reports.rawSame.push({ slug, id, field: "raw", text: rawLabel.slice(0, 80) });
    }

    // --- SWAPPED: locale text contains foreign markers indicating a swap ---
    for (const loc of LOCALES) {
      const lLabel = (li18n[loc] ?? "").trim();
      const lBc = (bi18n[loc] ?? "").trim();
      const enLabel = (li18n.en ?? "").trim();
      const enBc = (bi18n.en ?? "").trim();

      // SWAPPED: TR field has English words AND EN field has TR chars
      if (loc === "tr" && lLabel && enLabel) {
        const trHasEn = isEnglish(lLabel) && !hasLocaleChars(lLabel, "tr");
        const enHasTr = hasLocaleChars(enLabel, "tr");
        if (trHasEn && enHasTr) {
          reports.swapped.push({
            slug,
            id,
            field: "label_i18n",
            detail: `tr="${lLabel.slice(0, 60)}" ↔ en="${enLabel.slice(0, 60)}"`,
          });
        }
        if (lBc && enBc) {
          const trBcHasEn = isEnglish(lBc) && !hasLocaleChars(lBc, "tr");
          const enBcHasTr = hasLocaleChars(enBc, "tr");
          if (trBcHasEn && enBcHasTr) {
            reports.swapped.push({
              slug,
              id,
              field: "businessContext_i18n",
              detail: `tr="${lBc.slice(0, 60)}" ↔ en="${enBc.slice(0, 60)}"`,
            });
          }
        }
      }

      // EN-IDENTICAL: non-EN same as EN
      if (lLabel && enLabel && lLabel === enLabel && lLabel.length > 3 && loc !== "en") {
        reports.enIdentical.push({ slug, id, locale: loc, field: "label", text: lLabel.slice(0, 80) });
      }
      if (lBc && enBc && lBc === enBc && lBc.length > 3 && loc !== "en") {
        reports.enIdentical.push({ slug, id, locale: loc, field: "helper", text: lBc.slice(0, 80) });
      }

      // MISSING EN: non-EN locale exists but EN is empty
      if (lLabel && !enLabel) {
        reports.missingEn.push({ slug, id, locale: loc, field: "label", text: lLabel.slice(0, 60) });
      }
    }
  }
}

console.log("=== DEEP I18N INSPECTION REPORT ===");
console.log(`Schemas scanned: ${files.length}`);
console.log("");

console.log(`1. TR↔EN SWAPPED: ${reports.swapped.length}`);
for (const r of reports.swapped.slice(0, 30)) {
  console.log(`   ${r.slug}.${r.id}.${r.field}: ${r.detail}`);
}
if (reports.swapped.length > 30) console.log(`   ... +${reports.swapped.length - 30} more`);

console.log(`\n2. EN-IDENTICAL (non-EN locale === EN): ${reports.enIdentical.length}`);
const byLoc = {};
for (const r of reports.enIdentical) {
  byLoc[r.locale] = (byLoc[r.locale] ?? 0) + 1;
}
for (const [loc, count] of Object.entries(byLoc)) {
  console.log(`   ${loc}: ${count}`);
}
// Show first 5 per locale
for (const loc of LOCALES) {
  const samples = reports.enIdentical.filter((r) => r.locale === loc).slice(0, 5);
  if (samples.length > 0) {
    console.log(`   ${loc} samples:`);
    for (const s of samples) console.log(`      ${s.slug}.${s.id}.${s.field}: "${s.text.slice(0, 60)}"`);
  }
}

console.log(`\n3. RAW_SAME (label === businessContext): ${reports.rawSame.length}`);
for (const r of reports.rawSame.slice(0, 10)) {
  console.log(`   ${r.slug}.${r.id}: "${r.text}"`);
}
if (reports.rawSame.length > 10) console.log(`   ... +${reports.rawSame.length - 10} more`);

console.log(`\n4. MISSING EN (locale has data but EN anchor missing): ${reports.missingEn.length}`);
for (const r of reports.missingEn.slice(0, 10)) {
  console.log(`   ${r.slug}.${r.id}.${r.locale}.${r.field}: "${r.text}"`);
}
if (reports.missingEn.length > 10) console.log(`   ... +${reports.missingEn.length - 10} more`);
