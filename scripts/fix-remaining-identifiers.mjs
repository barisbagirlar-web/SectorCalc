#!/usr/bin/env node
/**
 * fix-remaining-identifiers — Fix remaining Turkish identifiers after transliteration
 *
 * Handles: hesabi, doviz, pozisyonu, kur-farki, riski, urunler, Turkish Lira
 * These remain because they contain only ASCII characters (no diacritics).
 */

import { readFileSync, writeFileSync, existsSync } from "fs";

const files = [
  "src/lib/features/formula-governance/contracts/premium-schema-extended-critical.ts",
  "src/lib/features/formula-governance/oracle/compare-premium-schema-extended-oracle.ts",
  "src/lib/features/formula-governance/oracle/compare-roadmap-free-batch-oracle.ts",
  "src/lib/features/formula-governance/oracle/roadmap-free-batch-oracles.ts",
  "src/lib/features/content/case-studies/case-study-seo.ts",
  "src/lib/tools/social-proof-registry.ts",
  "src/lib/features/content/case-studies/__tests__/case-study-seo.test.ts",
  "src/lib/content/pdf/industrial-pdf/content/engineering-explanations.ts",
  "src/lib/infrastructure/i18n/taxonomy-display-labels.ts",
  "src/lib/infrastructure/seo/__tests__/entity-graph-seo.test.ts",
  "src/lib/content/guidance/build-guidance-fields.ts",
  "src/lib/core/format/localization.ts",
];

const replacements = [
  // Slug patterns (hyphenated)
  [/hesabi\b/g, "calc"],
  [/hesabi-/g, "calc-"],
  [/-hesabi/g, "-calc"],
  [/doviz-/g, "fx-"],
  [/-doviz-/g, "-exchange-rate-"],
  [/\bdoviz\b/g, "fx"],
  [/-pozisyonu/g, "-position"],
  [/\bpozisyonu\b/g, "position"],
  [/kur-farki/g, "exchange-rate"],
  [/\bkur farki\b/g, "exchange rate"],
  [/-riski/g, "-risk"],
  [/\briski\b/g, "risk"],
  [/\burunler\b/g, "products"],
  // Capitalized / sentence context
  [/\bHESABI\b/g, "CALC"],
  [/\bDOVIZ\b/g, "FX"],
  [/\bPOZISYONU\b/g, "POSITION"],
  [/\bPOZISYON\b/g, "POSITION"],
  [/\bKUR FARKI\b/g, "EXCHANGE RATE"],
  [/\bKUR_FARKI\b/g, "EXCHANGE_RATE"],
  [/\bRISKI\b/g, "RISK"],
  [/\bURUNLER\b/g, "PRODUCTS"],
  // Turkish Lira phrase
  [/Turkish Lira/gi, "TRY"],
  [/Türk Lirası/gi, "TRY"],
  [/TRY currency/gi, "TRY currency"],
  // Specific purpose text fixes
  [/hesabi yapilmazsa/g, "calculation not performed"],
  [/hesabi yapilmadan/g, "calculation without"],
  [/hesabi olmadan/g, "without calculation"],
  // Description context: "hesabi" as part of Turkish sentence
  [/\bhesabi\b(?!\s*[=:])/g, "calculation"],
];

let totalFixes = 0;

for (const file of files) {
  const fp = `/Users/macair1/projects/SectorCalc-p5a/${file}`;
  if (!existsSync(fp)) {
    console.log(`  [SKIP] ${file} — not found`);
    continue;
  }
  
  let content = readFileSync(fp, "utf-8");
  let original = content;
  
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  
  if (content !== original) {
    const changes = [...original].filter((c,i) => c !== content[i]).length;
    writeFileSync(fp, content, "utf-8");
    console.log(`  [FIX] ${file} (${changes} chars)`);
    totalFixes += changes;
  }
}

console.log(`\n  Total fixes applied: ${totalFixes}`);
