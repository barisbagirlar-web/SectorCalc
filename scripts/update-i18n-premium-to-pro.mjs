#!/usr/bin/env node
/**
 * Safely update i18n JSON values: "Premium" → "Pro" in display text.
 * Does NOT change JSON keys. Handles all 6 locales.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "..", "messages");

// ---- Replacement rules per locale ----
// Each rule: [search, replace]
// Order matters: longer/more-specific patterns first to avoid partial matches.

const RULES = {
  en: [
    // Badge / standalone values
    ['"Premium"', '"Pro"'],
    ['" premium "', '" pro "'],
    ['" premium.'],

    // "Premium" (capitalized) → "Pro" in display values
    ["Premium ", "Pro "],
    // "premium" (lowercase) as descriptor → "pro"
    [" premium ", " pro "],
    [" premium.", " pro."],
    [" premium,", " pro,"],
    [" premium\n", " pro\n"],
    [' premium"', ' pro"'],
    ['"premium ', '"pro '],
  ],
  tr: [
    ['"Premium"', '"Pro"'],
    ["Premium Hesaplayıcılar", "Pro Hesaplama Araçları"],
    ["Premium hesaplayıcılar", "Pro hesaplama araçları"],
    ["Premium hesaplayıcı", "Pro hesaplama aracı"],
    ["Premium Hesaplayıcı", "Pro Hesaplama Aracı"],
    ["Premium hesaplama araçları", "Pro hesaplama araçları"],
    ["Premium rapor", "Pro rapor"],
    ["Premium karar", "Pro karar"],
    ["Premium araç", "Pro araç"],
    ["Premium sürüm", "Pro sürüm"],
    ["Premium özellik", "Pro özellik"],
    ["Premium içerik", "Pro içerik"],
    ["Premium abone", "Pro abone"],
    ["Premium ", "Pro "],
    [" premium", " pro"],
  ],
  de: [
    // Badge
    ['"Premium"', '"Pro"'],
    // "Premium-" compound (German hyphenates)
    ["Premium-Urteile", "Pro-Urteile"],
    ["Premium-Urteil", "Pro-Urteil"],
    ["Premium-Bericht", "Pro-Bericht"],
    ["Premium-Berichte", "Pro-Berichte"],
    ["Premium-Branchenrechner", "Pro-Branchenrechner"],
    ["Premium-Rechner", "Pro-Rechner"],
    ["Premium-Rechnern", "Pro-Rechnern"],
    ["Premium-Tool", "Pro-Tool"],
    ["Premium-Tools", "Pro-Tools"],
    ["Premium-Tarif", "Pro-Tarif"],
    ["Premium-Zugang", "Pro-Zugang"],
    ["Premium-Entscheidungsnachweis", "Pro-Entscheidungsnachweis"],
    ["Premium-Funktionen", "Pro-Funktionen"],
    ["Premium-Funktion", "Pro-Funktion"],
    ["Premium-Nutzer", "Pro-Nutzer"],
    ["Premium-Abonnent", "Pro-Abonnent"],
    ["Premium-Inhalt", "Pro-Inhalt"],
    ["Premium-Version", "Pro-Version"],
    ["Premium-Bewertungen", "Pro-Bewertungen"],
    ["Premium-Bewertung", "Pro-Bewertung"],
    // "Premium " space-separated
    ["Premium ", "Pro "],
    // "premium " (lowercase) should remain in most cases as German uses "Premium" capitalized
    [" premium ", " pro "],
    [" premium.", " pro."],
    ['"premium ', '"pro '],
  ],
  fr: [
    ['"Premium"', '"Pro"'],
    // "premium" follows the noun in French: "calculateurs premium" → "calculateurs Pro"
    [" premium", " Pro"],
    ['"premium', '"Pro'],
    // Capitalized: "Premium outils" → "Pro outils" (rare but possible)
    ["Premium ", "Pro "],
  ],
  es: [
    ['"Premium"', '"Pro"'],
    // "premium" follows the noun in Spanish: "calculadoras premium" → "calculadoras Pro"
    [" premium", " Pro"],
    ['"premium', '"Pro'],
    ["Premium ", "Pro "],
  ],
  ar: [
    ["الحاسبات المميزة", "حاسبات Pro"],
    ["حاسبة مميزة", "حاسبة Pro"],
    ["حاسبة Premium", "حاسبة Pro"],
    ["حاسبات Premium", "حاسبات Pro"],
    ["أحكام Premium", "أحكام Pro"],
    [" Premium", " Pro"],
    ["مميزة", "Pro"],
    ["مميز", "Pro"],
    ["المميزة", "Pro"],
    ["المميز", "Pro"],
    ["Premium", "Pro"],
  ],
};

function walkAndReplace(obj, rules) {
  if (typeof obj === "string") {
    let result = obj;
    for (const [search, replace] of rules) {
      result = result.replaceAll(search, replace);
    }
    return result;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => walkAndReplace(item, rules));
  }
  if (obj && typeof obj === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      // Never change keys, only values
      newObj[key] = walkAndReplace(value, rules);
    }
    return newObj;
  }
  return obj;
}

function countPremiumValues(obj) {
  if (typeof obj === "string") {
    return (obj.match(/[Pp]remium/g) || []).length;
  }
  if (Array.isArray(obj)) {
    return obj.reduce((sum, item) => sum + countPremiumValues(item), 0);
  }
  if (obj && typeof obj === "object") {
    return Object.values(obj).reduce((sum, val) => sum + countPremiumValues(val), 0);
  }
  return 0;
}

const locales = ["tr", "en", "de", "fr", "es", "ar"];

for (const locale of locales) {
  const filePath = join(messagesDir, `${locale}.json`);
  console.log(`\nProcessing ${locale}.json...`);

  const raw = readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);

  const beforeCount = countPremiumValues(parsed);
  console.log(`  Premium references in values before: ${beforeCount}`);

  const rules = RULES[locale];
  const updated = walkAndReplace(parsed, rules);
  const afterCount = countPremiumValues(updated);
  console.log(`  Premium references in values after: ${afterCount}`);
  console.log(`  Changed: ${beforeCount - afterCount}`);

  const output = JSON.stringify(updated, null, 2) + "\n";
  writeFileSync(filePath, output, "utf-8");
}

console.log("\n✅ Done! All locale files updated.");
