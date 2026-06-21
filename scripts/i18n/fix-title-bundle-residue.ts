#!/usr/bin/env npx tsx
/**
 * i18n AUTO-FIX — DeepSeek polish for remaining title bundle issues.
 * Fixes the 112 bundle entries where non-EN locales still contain
 * English+suffix or en-identical text.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "../ai/load-env-local.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const TITLES_PATH = path.join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const COPY_MAP_PATH = path.join(ROOT, "scripts/data/generated-schema-copy-i18n.json");

const LOCALES = ["tr", "de", "fr", "es", "ar"] as const;
const BATCH_SIZE = 40;

function isBadEntry(entry, locale, enValue) {
  const val = (entry[locale] || "").trim();
  if (!val) return true;
  // Accept proper nouns
  if (val === enValue && enValue.split(/\s+/).every((w) => /^[A-Z][a-z]/.test(w))) return false;
  // Accept Turkish possessive
  if (val.startsWith(enValue) && val.length > enValue.length) {
    const suffix = val.slice(enValue.length);
    if (/^(i|ı|ü|u|si|sı|sü|su)$/i.test(suffix)) return false;
  }
  // Flag if identical to EN or EN+suffix
  return val === enValue || (val.startsWith(enValue) && val.length > enValue.length);
}

async function translateBatch(items) {
  const results = new Map();
  const payload = Object.fromEntries(items.map((item, i) => [`k${i}`, item.en]));
  const reverse = Object.fromEntries(items.map((item, i) => [`k${i}`, item.slug]));

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY?.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Translate calculator tool names to Turkish (tr), German (de), French (fr), Spanish (es), Arabic (ar). " +
            "Return JSON only with each key mapping to {tr,de,fr,es,ar}. " +
            "Use natural locale-specific calculator naming. Never leave English words in non-English titles. " +
            "Preserve acronyms (OEE, CNC, ROI, pH, CO2). Translate fully including technical terms.",
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 400)}`);
  }

  const json = await response.json();
  const raw = json.choices?.[0]?.message?.content ?? "{}";
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  const parsed = JSON.parse(cleaned);

  for (const [key, value] of Object.entries(parsed)) {
    const slug = reverse[key];
    if (!slug || !value || typeof value !== "object") continue;
    const locales = {};
    for (const locale of LOCALES) {
      const translated = value[locale];
      if (typeof translated === "string" && translated.trim()) {
        locales[locale] = translated.trim();
      }
    }
    if (Object.keys(locales).length > 0) results.set(slug, locales);
  }
  return results;
}

async function main() {
  loadEnvLocal();
  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    console.error("DEEPSEEK_API_KEY missing");
    process.exit(1);
  }

  const titles = JSON.parse(fs.readFileSync(TITLES_PATH, "utf8"));
  const copyMap = JSON.parse(fs.readFileSync(COPY_MAP_PATH, "utf8"));
  const copyTitles = copyMap.toolTitles || {};

  // Find entries with bad non-EN locales
  const needFix = [];
  for (const [slug, entry] of Object.entries(titles)) {
    const en = (entry.en || "").trim();
    if (!en) continue;
    for (const locale of LOCALES) {
      if (isBadEntry(entry, locale, en)) {
        needFix.push({ slug, en, locale });
        break; // One fix per slug
      }
    }
  }

  console.log(`Need DeepSeek polish: ${needFix.length} entries`);
  if (needFix.length === 0) { console.log("All clean!"); return; }

  let fixed = 0;
  for (let i = 0; i < needFix.length; i += BATCH_SIZE) {
    const batch = needFix.slice(i, i + BATCH_SIZE);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(needFix.length / BATCH_SIZE)} (${batch.length})...`);
    const translated = await translateBatch(batch);
    for (const [slug, locales] of translated) {
      if (titles[slug]) {
        for (const [locale, value] of Object.entries(locales)) {
          titles[slug][locale] = value;
        }
        fixed++;
      }
    }
    // Save + update copy map
    for (const [slug, locales] of translated) {
      if (!copyTitles[slug]) copyTitles[slug] = { en: titles[slug]?.en || "" };
      for (const [locale, value] of Object.entries(locales)) {
        copyTitles[slug][locale] = value;
      }
    }
    fs.writeFileSync(TITLES_PATH, JSON.stringify(titles, null, 2), "utf8");
    copyMap.toolTitles = copyTitles;
    fs.writeFileSync(COPY_MAP_PATH, JSON.stringify(copyMap, null, 2), "utf8");
    console.log(`  Progress saved. Fixed: ${fixed}`);
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  console.log(`\n✅ Fixed ${fixed} entries`);
}

main().catch((err) => {
  console.error("FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
