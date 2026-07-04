#!/usr/bin/env node
/**
 * Non-calculator message surfaces — 6-locale parity (zero EN-identical on ar/de/fr/es/tr).
 * Calculator namespaces are excluded and managed by generate:calculator-i18n.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const TARGET_LOCALES = ["tr", "de", "fr", "es", "ar"];

const CALC_ROOTS = new Set([
  "freeToolInputs",
  "freeToolUi",
  "smartForm",
  "calculator",
  "premiumSchema",
  "toolDefinitions",
  "reports",
  "seoPages",
  "freeTrafficCatalog",
]);

const PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);
const WORD_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "archive/migration-only/scripts/data/calculator-word-glossary.json"), "utf8"),
);
const EXPAND = JSON.parse(
  readFileSync(join(ROOT, "archive/migration-only/scripts/data/calculator-glossary-expand.json"), "utf8"),
);
const MANUAL_PATH = join(ROOT, "archive/migration-only/scripts/data/marketing-surface-translations.json");
const MANUAL = existsSync(MANUAL_PATH)
  ? JSON.parse(readFileSync(MANUAL_PATH, "utf8"))
  : {};

const BRAND_TOKENS = [
  "SectorCalc",
  "OEE",
  "EOQ",
  "ERP",
  "PDF",
  "CSV",
  "API",
  "PRO",
  "kWh",
  "CBAM",
  "VAT",
  "ROI",
  "LLMs",
  "USD",
  "EUR",
  "TRY",
  "IN",
];

function runPatches() {
  const patches = [
    "patch-homepage-positioning-i18n.mjs",
    "patch-about-home-locales-i18n.mjs",
    "patch-marketing-ar-residual-i18n.mjs",
    "patch-sector-footer-i18n.mjs",
    "patch-calculator-library-i18n.mjs",
    "patch-catalog-explorer-categories-i18n.mjs",
    "patch-catalog-function-categories-i18n.mjs",
  ];
  for (const script of patches) {
    execSync(`node scripts/${script}`, { cwd: ROOT, stdio: "inherit" });
  }
}

function sortedEntries(locale) {
  const merged = {
    ...(MANUAL[locale] ?? {}),
    ...(EXPAND[locale] ?? {}),
    ...(WORD_GLOSSARY[locale] ?? {}),
    ...(PHRASE_GLOSSARY[locale] ?? {}),
  };
  return Object.entries(merged).sort((a, b) => b[0].length - a[0].length);
}

function protectBrands(text) {
  const placeholders = new Map();
  let i = 0;
  let protectedText = text;
  for (const token of BRAND_TOKENS) {
    const re = new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    protectedText = protectedText.replace(re, () => {
      const key = `__BRAND_${i++}__`;
      placeholders.set(key, token);
      return key;
    });
  }
  return { protectedText, placeholders };
}

function restoreBrands(text, placeholders) {
  let result = text;
  for (const [key, token] of placeholders) {
    result = result.replaceAll(key, token);
  }
  return result;
}

function translateString(text, locale) {
  if (!text || locale === "en") {
    return text;
  }
  if (MANUAL[locale]?.[text]) {
    return MANUAL[locale][text];
  }
  const { protectedText, placeholders } = protectBrands(text);
  let result = protectedText;
  for (const [en, localized] of sortedEntries(locale)) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, localized);
  }
  return restoreBrands(result, placeholders);
}

function leaves(obj, path = []) {
  if (typeof obj === "string") {
    return [{ path: path.join("."), v: obj }];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap((x, i) => leaves(x, [...path, String(i)]));
  }
  if (obj && typeof obj === "object") {
    return Object.entries(obj).flatMap(([k, v]) => leaves(v, [...path, k]));
  }
  return [];
}

function setAt(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const p = parts[i];
    if (cur[p] === undefined || typeof cur[p] !== "object") {
      cur[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    }
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

function isTechnicalToken(text) {
  return (
    /^[A-Z0-9_./:?=&+\-{}$,%·|]+$/i.test(text) ||
    text.length <= 3 ||
    BRAND_TOKENS.includes(text)
  );
}

function shouldTranslate(enValue, localeValue, locale) {
  if (locale === "en") {
    return false;
  }
  if (localeValue !== enValue) {
    return false;
  }
  if (!enValue || typeof enValue !== "string") {
    return false;
  }
  if (isTechnicalToken(enValue)) {
    return false;
  }
  if (!/[a-zA-Z]{4,}/.test(enValue)) {
    return false;
  }
  return true;
}

runPatches();

const en = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));
const enLeaves = leaves(en).filter(({ path }) => !CALC_ROOTS.has(path.split(".")[0]));

for (const locale of TARGET_LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  let updated = 0;
  let unresolved = 0;

  for (const { path, v: enValue } of enLeaves) {
    const parts = path.split(".");
    let cur = messages;
    for (const p of parts) {
      cur = cur?.[p];
    }
    if (!shouldTranslate(enValue, cur, locale)) {
      continue;
    }
    const translated = translateString(enValue, locale);
    if (translated === enValue) {
      unresolved += 1;
      continue;
    }
    setAt(messages, path, translated);
    updated += 1;
  }

  // Force-apply exact manual dictionary entries still identical to EN
  let forced = 0;
  for (const { path, v: enValue } of enLeaves) {
    const parts = path.split(".");
    let cur = messages;
    for (const p of parts) {
      cur = cur?.[p];
    }
    const manualValue = MANUAL[locale]?.[enValue];
    if (
      typeof cur === "string" &&
      cur === enValue &&
      manualValue &&
      manualValue !== enValue
    ) {
      setAt(messages, path, manualValue);
      forced += 1;
    }
  }

  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`${locale}: updated ${updated}, forced ${forced}, unresolved ${unresolved}`);
}
