#!/usr/bin/env node
/** Normalize stub-style calculator helpers across the full free-tool bundle. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { HELPER_TEMPLATES } from "./lib/generate-translate-phrase.mjs";

const ROOT = join(import.meta.dirname, "..");
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const STUB_HELPER_EN = [
  /^Primary input for .+ Calculator\.?$/i,
  /^Secondary input for .+ Calculator\.?$/i,
  /^Optional modifier for .+ Calculator\.?$/i,
];

const FIELD_GENERIC = {
  primary_value: {
    tr: "Hesaplamada kullanılan birincil girdi değeri.",
    de: "Primärer Eingabewert für die Berechnung.",
    fr: "Valeur d'entrée principale utilisée pour le calcul.",
    es: "Valor de entrada principal utilizado para el cálculo.",
    ar: "قيمة الإدخال الأساسية المستخدمة في الحساب.",
  },
  secondary_value: {
    tr: "Hesaplamada kullanılan ikincil girdi değeri.",
    de: "Sekundärer Eingabewert für die Berechnung.",
    fr: "Valeur d'entrée secondaire utilisée pour le calcul.",
    es: "Valor de entrada secundario utilizado para el cálculo.",
    ar: "قيمة الإدخال الثانوي المستخدمة في الحساب.",
  },
  tertiary_value: {
    tr: "Hesaplamayı ayarlamak için isteğe bağlı değer.",
    de: "Optionaler Modifikator für die Berechnung.",
    fr: "Modificateur optionnel pour le calcul.",
    es: "Modificador opcional para el cálculo.",
    ar: "قيمة تعديل اختيارية للحساب.",
  },
};

const TR_FORBIDDEN = [];

function hasForbiddenTr(_text) {
  return false;
}

function isStubHelper(enHelper) {
  return STUB_HELPER_EN.some((re) => re.test((enHelper ?? "").trim()));
}

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));
const enBundle = bundle.en ?? {};
let patched = 0;

for (const slug of Object.keys(enBundle)) {
  const enFields = enBundle[slug] ?? {};
  for (const [fieldKey, enCopy] of Object.entries(enFields)) {
    const enHelper = enCopy?.helper ?? "";
    const generic = FIELD_GENERIC[fieldKey];
    if (!generic) {
      continue;
    }
    const stub = isStubHelper(enHelper);
    for (const locale of LOCALES) {
      if (locale === "en") {
        continue;
      }
      const target = bundle[locale]?.[slug]?.[fieldKey];
      if (!target) {
        continue;
      }
      const current = target.helper ?? "";
      const needsPatch = stub;
      if (!needsPatch) {
        continue;
      }
      const nextHelper = generic[locale] ?? HELPER_TEMPLATES[locale]?.(target.label ?? enCopy.label ?? "");
      if (nextHelper && current !== nextHelper) {
        bundle[locale][slug][fieldKey].helper = nextHelper;
        patched += 1;
      }
    }
  }
}

writeFileSync(BUNDLE_PATH, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
console.log(`patch-stub-helper-bundle: ${patched} helper(s) normalized`);
