#!/usr/bin/env node
/**
 * Zero-tolerance EN residue polish — non-calculator messages + calculator field labels.
 * DeepSeek translates remaining EN-identical copy for tr/de/fr/es/ar.
 *
 * Run: node scripts/polish-locale-en-identical-residue.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { loadEnvLocal } from "./ai/load-env-local.mjs";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["tr", "de", "fr", "es", "ar"];
const FIELD_LABEL_MAP_PATH = join(ROOT, "archive/migration-only/scripts/data/calculator-field-labels-i18n.json");
const LOCALE_LABELS = {
  tr: "Turkish",
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};

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

const COGNATES = new Set([
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
  "Stripe",
  "Google",
  "Premium",
  "Enterprise",
  "Free",
  "Pro",
  "Team",
  "Feature",
  "P90",
  "MarginCore",
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
  "A",
  "B",
  "C",
]);

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

function getAt(obj, path) {
  return path.split(".").reduce((cur, key) => cur?.[key], obj);
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

function isAllowedIdentical(enValue, path = "") {
  if (!enValue || enValue.length <= 3) return true;
  if (COGNATES.has(enValue)) return true;
  if (path.endsWith("Tr") || path.includes(".Tr")) return true;
  if (/^[A-Z0-9_./:?=&+\-{}$,%·|()]+$/i.test(enValue)) return true;
  if (!/[a-zA-Z]{4,}/.test(enValue)) return true;
  return false;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function deepseekTranslateBatch(locale, entries) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing");
  }

  const payload = Object.fromEntries(entries.map(({ key, enValue }) => [key, enValue]));
  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            `Professional industrial calculator UI localizer (${LOCALE_LABELS[locale]} / ${locale}).`,
            "Translate each English UI string to natural, concise product copy.",
            "Return ONLY JSON with identical keys.",
            "Preserve placeholders: {name}, {count}, {min}, {max}, {fieldLabel}, {tool}, {price}, {credits}.",
            "Keep brands/tokens: SectorCalc, Premium, Pro, OEE, PDF, CSV, API, Stripe, USD, EUR, TRY, SF.",
            locale === "ar" ? "Modern Standard Arabic." : "",
            locale === "tr"
              ? "Turkish — no English residue; standard industrial Turkish terminology."
              : "",
          ]
            .filter(Boolean)
            .join("\n"),
        },
        { role: "user", content: JSON.stringify(payload, null, 2) },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }

  const json = await response.json();
  const raw = json?.choices?.[0]?.message?.content;
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  return JSON.parse(cleaned);
}

function collectNonCalculatorLeaks(en, localeData) {
  const leaks = [];
  for (const { path, v: enValue } of leaves(en)) {
    if (CALC_ROOTS.has(path.split(".")[0])) {
      continue;
    }
    const cur = getAt(localeData, path);
    if (typeof cur !== "string" || cur !== enValue) {
      continue;
    }
    if (isAllowedIdentical(enValue, path)) {
      continue;
    }
    leaks.push({ key: path, enValue });
  }
  return leaks;
}

function collectFieldLabelLeaks(en, localeData, fieldLabelMap, locale) {
  const leaks = [];
  const seen = new Set();
  for (const [slug, fields] of Object.entries(localeData.freeToolInputs ?? {})) {
    const enFields = en.freeToolInputs?.[slug] ?? {};
    for (const [fieldKey, copy] of Object.entries(fields ?? {})) {
      const enLabel = enFields[fieldKey]?.label ?? "";
      const label = copy?.label ?? "";
      if (!enLabel || label !== enLabel || seen.has(enLabel)) {
        continue;
      }
      if (isAllowedIdentical(enLabel)) {
        continue;
      }
      if (fieldLabelMap[locale]?.[enLabel] && fieldLabelMap[locale][enLabel] !== enLabel) {
        continue;
      }
      seen.add(enLabel);
      leaks.push({ key: enLabel, enValue: enLabel });
    }
  }
  return leaks;
}

loadEnvLocal(ROOT);
const en = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));
const fieldLabelMap = JSON.parse(readFileSync(FIELD_LABEL_MAP_PATH, "utf8"));

console.log("polish-locale-en-identical-residue");

for (const locale of LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  let messages = JSON.parse(readFileSync(messagesPath, "utf8"));

  const messageLeaks = collectNonCalculatorLeaks(en, messages);
  console.log(`${locale}: ${messageLeaks.length} non-calculator EN-identical strings`);

  let messageApplied = 0;
  for (const [index, chunk] of chunkArray(messageLeaks, 45).entries()) {
    console.log(`  messages batch ${index + 1}/${Math.ceil(messageLeaks.length / 45) || 1}`);
    const translatedMap = await deepseekTranslateBatch(locale, chunk);
    messages = JSON.parse(readFileSync(messagesPath, "utf8"));
    for (const item of chunk) {
      const translated = translatedMap[item.key];
      if (typeof translated === "string" && translated.trim() && translated !== item.enValue) {
        setAt(messages, item.key, translated.trim());
        messageApplied += 1;
      }
    }
    writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  }

  messages = JSON.parse(readFileSync(messagesPath, "utf8"));

  // freeToolInputs field labels: SSOT is free-tool-inputs-i18n.generated.json — do not polish here
  console.log(`${locale}: field label polish skipped (bundle SSOT)`);
  const labelApplied = 0;

  writeFileSync(FIELD_LABEL_MAP_PATH, `${JSON.stringify(fieldLabelMap, null, 2)}\n`, "utf8");
  console.log(`  ${locale}: messages ${messageApplied}, field labels ${labelApplied}`);
}

writeFileSync(FIELD_LABEL_MAP_PATH, `${JSON.stringify(fieldLabelMap, null, 2)}\n`, "utf8");

console.log("\nRunning marketing-surface polish...");
execSync("npm run generate:marketing-surface-i18n", { cwd: ROOT, stdio: "inherit" });

console.log("\nRe-applying legal page translations (SSOT)...");
execSync("node scripts/merge-legal-i18n.mjs", { cwd: ROOT, stdio: "inherit" });

console.log("\npolish-locale-en-identical-residue complete");
