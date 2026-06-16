#!/usr/bin/env node
/**
 * Backfill missing message keys in de/fr/es/ar to match en.json parity (TR-level coverage).
 * 1) Deep-merge missing branches from messages/en.json
 * 2) Glossary translation for EN-identical strings (marketing-surface pipeline)
 * 3) DeepSeek batch translation for remaining EN-identical backfilled strings
 *
 * Run: node scripts/backfill-locale-message-parity.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { loadEnvLocal } from "./ai/load-env-local.mjs";

const ROOT = join(import.meta.dirname, "..");
const TARGET_LOCALES = ["de", "fr", "es", "ar"];
const LOCALE_LABELS = {
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};

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
  "Stripe",
  "Google",
  "Premium",
  "P90",
];

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

function deepMergeMissing(base, target) {
  const result = { ...target };
  for (const [key, value] of Object.entries(base)) {
    if (!(key in result)) {
      result[key] = structuredClone(value);
      continue;
    }
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      result[key] &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMergeMissing(value, result[key]);
    }
  }
  return result;
}

function collectMissingPaths(enTree, localeTree) {
  const missing = [];
  for (const { path, v } of leaves(enTree)) {
    const localeValue = getAt(localeTree, path);
    if (localeValue === undefined) {
      missing.push({ path, enValue: v });
    }
  }
  return missing;
}

function isTechnicalToken(text) {
  return (
    /^[A-Z0-9_./:?=&+\-{}$,%·|]+$/i.test(text) ||
    text.length <= 3 ||
    BRAND_TOKENS.includes(text)
  );
}

function loadGlossary() {
  const phrase = JSON.parse(
    readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
  );
  const word = JSON.parse(
    readFileSync(join(ROOT, "scripts/data/calculator-word-glossary.json"), "utf8"),
  );
  const expand = JSON.parse(
    readFileSync(join(ROOT, "scripts/data/calculator-glossary-expand.json"), "utf8"),
  );
  const manualPath = join(ROOT, "scripts/data/marketing-surface-translations.json");
  const manual = existsSync(manualPath)
    ? JSON.parse(readFileSync(manualPath, "utf8"))
    : {};
  return { phrase, word, expand, manual };
}

function sortedEntries(locale, glossary) {
  const merged = {
    ...(glossary.manual[locale] ?? {}),
    ...(glossary.expand[locale] ?? {}),
    ...(glossary.word[locale] ?? {}),
    ...(glossary.phrase[locale] ?? {}),
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

function translateString(text, locale, glossary) {
  if (!text || locale === "en") {
    return text;
  }
  if (glossary.manual[locale]?.[text]) {
    return glossary.manual[locale][text];
  }
  const { protectedText, placeholders } = protectBrands(text);
  let result = protectedText;
  for (const [en, localized] of sortedEntries(locale, glossary)) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, localized);
  }
  return restoreBrands(result, placeholders);
}

async function deepseekTranslateBatch(locale, entries) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing — required for unresolved backfill strings.");
  }

  const payload = Object.fromEntries(entries.map(({ path, enValue }) => [path, enValue]));
  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";

  const system = [
    `You are a professional industrial SaaS localizer for SectorCalc.`,
    `Translate UI copy to ${LOCALE_LABELS[locale]} (${locale}).`,
    `Return ONLY valid JSON: same keys as input, translated string values.`,
    `Preserve placeholders exactly: {name}, {count}, {price}, {credits}, {fieldLabel}, {tool}, {sector}, {inputs}, {outputs}, {inputCount}, {pain}, {region}, {currency}.`,
    `Keep brand tokens unchanged: SectorCalc, Premium, Pro, OEE, PDF, CSV, API, Stripe, Google, USD, EUR, TRY.`,
    `No English leakage unless the source is already a proper noun or brand.`,
    locale === "ar" ? "Use Modern Standard Arabic, RTL-friendly phrasing." : "",
  ]
    .filter(Boolean)
    .join("\n");

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
        { role: "system", content: system },
        {
          role: "user",
          content: JSON.stringify(payload, null, 2),
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 400)}`);
  }

  const json = await response.json();
  const raw = json?.choices?.[0]?.message?.content;
  if (!raw) {
    throw new Error("DeepSeek returned empty content.");
  }

  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("DeepSeek response is not a JSON object.");
  }
  return parsed;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

loadEnvLocal(ROOT);

const glossary = loadGlossary();
const en = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));

console.log("backfill-locale-message-parity");

for (const locale of TARGET_LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  let messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  const missingBefore = new Set(collectMissingPaths(en, messages).map((x) => x.path));

  messages = deepMergeMissing(en, messages);
  let glossaryUpdated = 0;
  const unresolved = [];

  for (const { path, v: enValue } of leaves(en)) {
    if (!missingBefore.has(path)) {
      continue;
    }
    const cur = getAt(messages, path);
    if (typeof cur !== "string" || typeof enValue !== "string") {
      continue;
    }
    if (cur !== enValue) {
      continue;
    }
    if (isTechnicalToken(enValue) || !/[a-zA-Z]{4,}/.test(enValue)) {
      continue;
    }
    const translated = translateString(enValue, locale, glossary);
    if (translated !== enValue) {
      setAt(messages, path, translated);
      glossaryUpdated += 1;
    } else {
      unresolved.push({ path, enValue });
    }
  }

  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  const afterMissing = collectMissingPaths(en, messages).length;
  console.log(
    `${locale}: structure gaps ${missingBefore.size} → ${afterMissing}; glossary ${glossaryUpdated}; unresolved ${unresolved.length}`,
  );

  if (unresolved.length > 0) {
    const chunks = chunkArray(unresolved, 40);
    let deepseekApplied = 0;
    for (const [index, chunk] of chunks.entries()) {
      console.log(`  DeepSeek batch ${index + 1}/${chunks.length} (${chunk.length} strings)...`);
      const translatedMap = await deepseekTranslateBatch(locale, chunk);
      messages = JSON.parse(readFileSync(messagesPath, "utf8"));
      for (const { path, enValue } of chunk) {
        const candidate = translatedMap[path];
        if (typeof candidate === "string" && candidate.trim() && candidate !== enValue) {
          setAt(messages, path, candidate.trim());
          deepseekApplied += 1;
        }
      }
      writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
    }
    console.log(`  ${locale}: DeepSeek applied ${deepseekApplied}/${unresolved.length}`);
  }
}

console.log("\nRunning generate:marketing-surface-i18n polish pass...");
execSync("npm run generate:marketing-surface-i18n", { cwd: ROOT, stdio: "inherit" });

console.log("\nRunning patch:p31-i18n...");
execSync("npm run patch:p31-i18n", { cwd: ROOT, stdio: "inherit" });

console.log("\nbackfill-locale-message-parity complete");
