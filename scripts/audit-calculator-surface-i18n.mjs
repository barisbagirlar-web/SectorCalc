#!/usr/bin/env node
/**
 * CI gate: calculator surface i18n — field labels, result phrases, validation keys, glossary coverage.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const NON_EN = LOCALES.filter((l) => l !== "en");

const GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);

const EN_FIELD_LEAK = /^Enter /i;
const EN_LABEL_PATTERNS = [
  /\bBag yield\b/i,
  /\bWaste percent\b/i,
  /\bRoom or slab\b/i,
  /\bTotal pour volume\b/i,
  /\bVolume per bag\b/i,
  /\bWeld throat\b/i,
  /\bWeld length\b/i,
  /\bBolt diameter\b/i,
  /\bBolt count\b/i,
  /\bAllowable stress\b/i,
  /\bSafety factor\b/i,
];

const PREMIUM_INPUTS = JSON.parse(
  readFileSync(join(ROOT, "src/data/premium-schema-inputs-i18n.generated.json"), "utf8"),
);
const PREMIUM_SCHEMA_SLUGS = Object.keys(PREMIUM_INPUTS.en ?? {});

function loadMessages(locale) {
  return JSON.parse(readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"));
}

function extractResultPhrases() {
  const files = [
    "src/lib/tools/free-traffic-calculators.ts",
    "src/lib/tools/roadmap-free-batch1-calculators.ts",
    "src/lib/tools/roadmap-free-batch2-calculators.ts",
  ];
  const phrases = new Set();
  const re = /(?:headline|primaryLabel|explanation|label):\s*"([^"]+)"/g;
  for (const rel of files) {
    const text = readFileSync(join(ROOT, rel), "utf8");
    let m;
    while ((m = re.exec(text)) !== null) {
      phrases.add(m[1]);
    }
  }
  return [...phrases];
}

function translatePhrase(text, locale) {
  if (!text || locale === "en") {
    return text;
  }
  if (GLOSSARY[locale]?.[text]) {
    return GLOSSARY[locale][text];
  }
  let result = text;
  const entries = Object.entries(GLOSSARY[locale] ?? {}).sort((a, b) => b[0].length - a[0].length);
  for (const [en, localized] of entries) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, localized);
  }
  return result;
}

const failures = [];
const resultPhrases = extractResultPhrases();

for (const locale of NON_EN) {
  const messages = loadMessages(locale);
  const validation = messages.freeToolUi?.fieldValidation;
  if (!validation?.required || !validation?.invalidNumber) {
    failures.push(`${locale}: missing freeToolUi.fieldValidation`);
  }

  const fieldInputs = messages.freeToolInputs ?? {};
  let enIdenticalLabels = 0;
  let totalLabels = 0;
  for (const [slug, fields] of Object.entries(fieldInputs)) {
    if (!fields || typeof fields !== "object") {
      continue;
    }
    const enFields = loadMessages("en").freeToolInputs?.[slug] ?? {};
    for (const [fieldKey, copy] of Object.entries(fields)) {
      if (!copy || typeof copy !== "object") {
        continue;
      }
      const label = copy.label ?? "";
      const placeholder = copy.placeholder ?? "";
      const enLabel = enFields[fieldKey]?.label ?? "";
      const COGNATES = new Set([
        "Minimum",
        "Maximum",
        "Million",
        "Radius",
        "Volume",
        "Transport",
        "Divisor",
        "Population",
        "Performance",
        "Distance",
        "Factor",
        "Minutes",
        "Module",
        "Base",
        "Material",
        "Total",
        "Favorable",
        "Proportion",
        "Dosage",
        "Portions",
        "Inspection",
        "kg/m",
        "DPMO",
        "OEE",
        "Base A",
        "Base B",
        "Quote A",
        "Quote B",
        "Package A",
        "Package B",
        "Item 1",
        "Item 2",
        "Item 3",
        "Item 4",
        "Item 5",
      ]);
      const isTechnicalToken =
        /^[A-Z0-9²³%/.\-]+$/.test(enLabel) ||
        enLabel.length <= 3 ||
        COGNATES.has(enLabel);
      totalLabels += 1;
      if (!isTechnicalToken && label === enLabel && enLabel.length > 2) {
        enIdenticalLabels += 1;
      }
      if (EN_FIELD_LEAK.test(placeholder)) {
        failures.push(`${locale}: English placeholder ${slug}.${fieldKey}`);
      }
      if (EN_LABEL_PATTERNS.some((p) => p.test(label))) {
        failures.push(`${locale}: English label leak ${slug}.${fieldKey} → "${label}"`);
      }
    }
  }

  const identicalPct = totalLabels > 0 ? (enIdenticalLabels / totalLabels) * 100 : 0;
  const maxIdenticalPct = 3;
  if (identicalPct > maxIdenticalPct) {
    failures.push(
      `${locale}: ${enIdenticalLabels}/${totalLabels} field labels identical to EN (${identicalPct.toFixed(1)}% > ${maxIdenticalPct}%)`,
    );
  }

  const sfValidation = messages.smartForm?.validation;
  const enValidation = loadMessages("en").smartForm?.validation;
  if (sfValidation?.required === enValidation?.required) {
    failures.push(`${locale}: smartForm.validation.required still English`);
  }
  if (messages.calculator?.calculate === loadMessages("en").calculator?.calculate) {
    failures.push(`${locale}: calculator.calculate still English`);
  }

  let untranslatedResults = 0;
  for (const phrase of resultPhrases) {
    const translated = translatePhrase(phrase, locale);
    if (
      translated === phrase &&
      phrase.length > 10 &&
      /\b(the|and|with|from|per|for|used|output|difference)\b/i.test(phrase)
    ) {
      untranslatedResults += 1;
      if (untranslatedResults <= 3) {
        failures.push(`${locale}: untranslated result phrase → "${phrase.slice(0, 80)}"`);
      }
    }
  }
  if (untranslatedResults > 0) {
    failures.push(`${locale}: ${untranslatedResults} untranslated result phrase(s) total`);
  }

  const categories = messages.catalogExplorer?.categories;
  if (
    categories?.metaTitle &&
    categories.metaTitle === loadMessages("en").catalogExplorer?.categories?.metaTitle
  ) {
    failures.push(`${locale}: catalogExplorer.categories.metaTitle still English`);
  }

  // Premium schema tools — zero English-identical labels on TR (user-reported welded-bolted leak)
  if (locale === "tr") {
    const enInputs = loadMessages("en").freeToolInputs ?? {};
    for (const slug of PREMIUM_SCHEMA_SLUGS) {
      const trFields = fieldInputs[slug] ?? {};
      const enFields = enInputs[slug] ?? {};
      for (const [fieldKey, copy] of Object.entries(trFields)) {
        const label = copy?.label ?? "";
        const enLabel = enFields[fieldKey]?.label ?? "";
        if (
          label &&
          enLabel &&
          label === enLabel &&
          enLabel.length > 3 &&
          !/^[A-Z0-9²³%/.\-]+$/.test(enLabel)
        ) {
          failures.push(`tr: premium EN label leak ${slug}.${fieldKey} → "${label}"`);
        }
      }
    }
  }
}

console.log("audit:calculator-surface-i18n");
console.log(`result phrases tracked: ${resultPhrases.length}`);
if (failures.length === 0) {
  console.log("PASS — calculator surface i18n OK");
  process.exit(0);
}

console.log(`FAIL — ${failures.length} issue(s):`);
for (const line of failures.slice(0, 60)) {
  console.log(`  - ${line}`);
}
if (failures.length > 60) {
  console.log(`  - … +${failures.length - 60} more`);
}
process.exit(1);
