#!/usr/bin/env npx tsx
/**
 * Final DeepSeek polish: fix remaining 239 bundle entries that still have
 * English+suffix patterns (e.g. "Absorbed Dose Hesaplama Aracı").
 * These entries don't have copy map matches, so we use Direct DeepSeek.
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

async function translateBatch(items: Array<{ slug: string; en: string }>) {
  const results = new Map<string, Partial<Record<string, string>>>();
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
            "Translate industrial calculator product titles to Turkish (tr), German (de), French (fr), Spanish (es), Arabic (ar). " +
            "Return JSON only. Each key maps to {tr,de,fr,es,ar}. " +
            "Use natural locale-specific naming. Never leave English words in non-English titles. " +
            "Preserve acronyms (OEE, CNC, SMED, ISO, ROI, NPV, MTBF, pH, CO2)." +
            "SHORT TITLES: for very short EN titles like 'Base', 'Color', 'Combination', translate fully.",
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 400)}`);
  }

  const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const raw = json.choices?.[0]?.message?.content ?? "{}";
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  for (const [key, value] of Object.entries(parsed)) {
    const slug = reverse[key];
    if (!slug || !value || typeof value !== "object") continue;
    const locales: Partial<Record<string, string>> = {};
    for (const locale of LOCALES) {
      const translated = (value as Record<string, unknown>)[locale];
      if (typeof translated === "string" && translated.trim()) {
        locales[locale] = translated.trim();
      }
    }
    if (Object.keys(locales).length > 0) results.set(slug, locales);
  }
  return results;
}

function isBadEnSuffix(tr: string, en: string): boolean {
  return tr.startsWith(en) && tr.length > en.length;
}

async function main() {
  loadEnvLocal();
  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    console.error("DEEPSEEK_API_KEY missing");
    process.exit(1);
  }

  const titles = JSON.parse(fs.readFileSync(TITLES_PATH, "utf8"));
  const bundle = titles as Record<string, Partial<Record<string, string>>>;

  // Find all entries where TR is English+suffix
  const needFix: Array<{ slug: string; en: string }> = [];
  for (const [slug, entry] of Object.entries(bundle)) {
    const en = (entry.en || "").trim();
    const tr = (entry.tr || "").trim();
    if (en && tr && isBadEnSuffix(tr, en)) {
      needFix.push({ slug, en });
    }
  }

  console.log(`Entries needing polish: ${needFix.length}`);

  if (needFix.length === 0) {
    console.log("All clean! ✅");
    return;
  }

  let fixed = 0;
  for (let i = 0; i < needFix.length; i += BATCH_SIZE) {
    const batch = needFix.slice(i, i + BATCH_SIZE);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(needFix.length / BATCH_SIZE)}...`);
    const translated = await translateBatch(batch);
    for (const [slug, locales] of translated) {
      if (bundle[slug]) {
        for (const [locale, value] of Object.entries(locales)) {
          bundle[slug][locale] = value;
        }
        fixed++;
      }
    }
    // Progress save
    fs.writeFileSync(TITLES_PATH, JSON.stringify(bundle, null, 2), "utf8");
    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  console.log(`✅ Fixed ${fixed} entries`);
}

main().catch((err) => {
  console.error("FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
