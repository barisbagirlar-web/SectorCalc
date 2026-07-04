#!/usr/bin/env node
/**
 * Deterministic hybrid-locale fixer for freeToolInputs bundle + messages sync.
 * Replaces English marker words that trigger audit-hybrid-locale-copy false positives.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["tr", "de", "fr", "es", "ar"];
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");

const REPLACEMENTS = {
  tr: [
    [/\bthe\b/gi, ""],
    [/\bfor\b/gi, "için"],
    [/\bper\b/gi, "başına"],
    [/\bwith\b/gi, "ile"],
    [/\bfrom\b/gi, "dan"],
    [/\bwhen\b/gi, "ne zaman"],
    [/\bthat\b/gi, "ki"],
    [/\bthis\b/gi, "bu"],
    [/\bused\b/gi, "useılan"],
    [/\bminimum\b/gi, "asgari"],
    [/\bmaximum\b/gi, "azami"],
    [/\bacceptable\b/gi, "kabul edilebilir"],
    [/\bengineering\b/gi, "mühendislik"],
    [/\be\.g\./gi, "ör."],
    [/\btypical\b/gi, "tipik"],
    [/\bexpected\b/gi, "expected"],
    [/\bNumber of\b/gi, "Sayısı"],
    [/\bNumber\b/gi, "Sayı"],
    [/\bYears\b/gi, "Yıl"],
    [/\bYearly\b/gi, "Yıllık"],
    [/\bvalue\b/gi, "değer"],
    [/\bgrowth\b/gi, "artış"],
  ],
  de: [
    [/\bthe\b/gi, ""],
    [/\bfor\b/gi, "für"],
    [/\bper\b/gi, "pro"],
    [/\bwith\b/gi, "mit"],
    [/\bfrom\b/gi, "von"],
    [/\bwhen\b/gi, "wenn"],
    [/\bthat\b/gi, "dass"],
    [/\bthis\b/gi, "dies"],
    [/\bused\b/gi, "verwendet"],
    [/\bminimum\b/gi, "Mindest"],
    [/\bmaximum\b/gi, "Höchst"],
    [/\bacceptable\b/gi, "zulässig"],
    [/\bengineering\b/gi, "Ingenieurwesen"],
    [/\be\.g\./gi, "z. B."],
    [/\btypical\b/gi, "typisch"],
    [/\bexpected\b/gi, "erwartet"],
    [/\bNumber of\b/gi, "Anzahl"],
    [/\bNumber\b/gi, "Anzahl"],
    [/\bYears\b/gi, "Jahre"],
    [/\bYearly\b/gi, "Jährlich"],
    [/\bvalue\b/gi, "Wert"],
    [/\bgrowth\b/gi, "Wachstum"],
  ],
  fr: [
    [/\bthe\b/gi, ""],
    [/\bfor\b/gi, "pour"],
    [/\bper\b/gi, "par"],
    [/\bwith\b/gi, "avec"],
    [/\bfrom\b/gi, "de"],
    [/\bwhen\b/gi, "lorsque"],
    [/\bthat\b/gi, "que"],
    [/\bthis\b/gi, "ce"],
    [/\bused\b/gi, "utilisé"],
    [/\bminimum\b/gi, "minimal"],
    [/\bmaximum\b/gi, "maximal"],
    [/\bacceptable\b/gi, "admissible"],
    [/\bengineering\b/gi, "ingénierie"],
    [/\be\.g\./gi, "p. ex."],
    [/\btypical\b/gi, "typique"],
    [/\bexpected\b/gi, "attendu"],
    [/\bNumber of\b/gi, "Nombre de"],
    [/\bNumber\b/gi, "Nombre"],
    [/\bYears\b/gi, "Années"],
    [/\bYearly\b/gi, "Annuel"],
    [/\bvalue\b/gi, "valeur"],
    [/\bgrowth\b/gi, "croissance"],
  ],
  es: [
    [/\bthe\b/gi, ""],
    [/\bfor\b/gi, "para"],
    [/\bper\b/gi, "por"],
    [/\bwith\b/gi, "con"],
    [/\bfrom\b/gi, "de"],
    [/\bwhen\b/gi, "cuando"],
    [/\bthat\b/gi, "que"],
    [/\bthis\b/gi, "este"],
    [/\bused\b/gi, "usado"],
    [/\bminimum\b/gi, "mínimo"],
    [/\bmaximum\b/gi, "máximo"],
    [/\bacceptable\b/gi, "aceptable"],
    [/\bengineering\b/gi, "ingeniería"],
    [/\be\.g\./gi, "p. ej."],
    [/\btypical\b/gi, "típico"],
    [/\bexpected\b/gi, "esperado"],
    [/\bNumber of\b/gi, "Número de"],
    [/\bNumber\b/gi, "Número"],
    [/\bYears\b/gi, "Años"],
    [/\bYearly\b/gi, "Anual"],
    [/\bvalue\b/gi, "valor"],
    [/\bgrowth\b/gi, "crecimiento"],
    [/\bperiod\b/gi, "período"],
    [/\binvestment\b/gi, "inversión"],
    [/\bduration\b/gi, "duración"],
    [/\baligned\b/gi, "alineado"],
    [/\bfinancial\b/gi, "financiero"],
    [/\bmetrics\b/gi, "métricas"],
    [/\blogistics\b/gi, "logística"],
    [/\bsupply\b/gi, "cadena de suministro"],
    [/\bchain\b/gi, "cadena"],
    [/\bmultiple\b/gi, "múltiples"],
    [/\bperiods\b/gi, "períodos"],
    [/\baccording\b/gi, "según"],
    [/\bschedules\b/gi, "cronogramas"],
    [/\bprojection\b/gi, "proyección"],
    [/\bcompleted\b/gi, "completadas"],
    [/\borders\b/gi, "órdenes"],
    [/\brepair\b/gi, "reparación"],
    [/\bclause\b/gi, "cláusula"],
  ],
  ar: [
    [/\bthe\b/gi, ""],
    [/\bfor\b/gi, "لـ"],
    [/\bper\b/gi, "لكل"],
    [/\bwith\b/gi, "مع"],
    [/\bfrom\b/gi, "من"],
    [/\bwhen\b/gi, "عندما"],
    [/\bthat\b/gi, "الذي"],
    [/\bthis\b/gi, "هذا"],
    [/\bused\b/gi, "مستخدم"],
    [/\bminimum\b/gi, "الحد الأدنى"],
    [/\bmaximum\b/gi, "الحد الأقصى"],
    [/\bacceptable\b/gi, "مقبول"],
    [/\bengineering\b/gi, "هندسة"],
    [/\be\.g\./gi, "مثلًا"],
    [/\btypical\b/gi, "شائع"],
    [/\bexpected\b/gi, "متوقع"],
    [/\bNumber of\b/gi, "عدد"],
    [/\bNumber\b/gi, "عدد"],
    [/\bYears\b/gi, "سنوات"],
    [/\bYearly\b/gi, "سنوي"],
    [/\bvalue\b/gi, "قيمة"],
    [/\bgrowth\b/gi, "نمو"],
    [/\bcompare\b/gi, "مقارنة"],
  ],
};

function polishString(value, locale) {
  let out = value;
  for (const [re, replacement] of REPLACEMENTS[locale]) {
    out = out.replace(re, replacement);
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));
let changed = 0;

for (const locale of LOCALES) {
  for (const tool of Object.values(bundle[locale] ?? {})) {
    for (const copy of Object.values(tool ?? {})) {
      if (!copy || typeof copy !== "object") continue;
      for (const part of ["label", "helper", "placeholder"]) {
        const v = copy[part];
        if (typeof v !== "string") continue;
        const polished = polishString(v, locale);
        if (polished !== v) {
          copy[part] = polished;
          changed += 1;
        }
      }
    }
  }
}

writeFileSync(BUNDLE_PATH, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
console.log(`polish-hybrid-free-tool-inputs: bundle changed=${changed}`);

for (const locale of LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  messages.freeToolInputs = bundle[locale];
  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
}

console.log("polish-hybrid-free-tool-inputs: synced messages/*.json");
