#!/usr/bin/env npx tsx
/**
 * DeepSeek polish for missing copy map locale entries.
 * Processes only the 926 schemas missing locale translations, batched 40 at a time.
 * Updates both the copy map AND the titles bundle.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "../ai/load-env-local.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "../..");
const COPY_MAP_PATH = path.join(ROOT, "scripts/data/generated-schema-copy-i18n.json");
const TITLES_PATH = path.join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const SCHEMAS_DIR = path.join(ROOT, "generated", "schemas");

const LOCALES = ["tr", "de", "fr", "es", "ar"] as const;
const LOCALE_NAMES: Record<string, string> = {
  tr: "Turkish",
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};

const BATCH_SIZE = 40;

interface CopyMap {
  toolTitles?: Record<string, Partial<Record<string, string>>>;
}

async function translateBatch(items: Array<{ slug: string; en: string }>): Promise<Map<string, Partial<Record<string, string>>>> {
  const results = new Map<string, Partial<Record<string, string>>>();
  const payload = Object.fromEntries(items.map((item, i) => [`k${i}`, item.en]));
  const reverse = Object.fromEntries(items.map((item, i) => [`k${i}`, item.slug]));
  const localeList = LOCALES.map((l) => `${l} (${LOCALE_NAMES[l]})`).join(", ");

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
            `Translate industrial calculator product titles to ${localeList}. ` +
            "Return JSON only. Each key maps to {tr,de,fr,es,ar}. " +
            "Use natural locale-specific calculator naming. " +
            "Never leave English words in non-English titles. Preserve acronyms (OEE, APY, CNC, SMED, ISO, ROI, NPV, MTBF).",
        },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 400)}`);
  }

  const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
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
    if (Object.keys(locales).length > 0) {
      results.set(slug, locales);
    }
  }

  return results;
}

async function main() {
  loadEnvLocal();

  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    console.error("DEEPSEEK_API_KEY missing in .env.local");
    process.exit(1);
  }

  const copyMap: CopyMap = JSON.parse(fs.readFileSync(COPY_MAP_PATH, "utf8"));
  const titles = JSON.parse(fs.readFileSync(TITLES_PATH, "utf8"));
  const copyTitles = copyMap.toolTitles ?? {};

  // Find entries missing locale translations
  const needPolish: Array<{ slug: string; en: string }> = [];
  
  // Get all slugs from schemas dir
  const allSlugs = fs.readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith("-schema.json"))
    .map((f) => f.replace(/-schema\.json$/, ""));

  // Check bundle for tools that have EN but missing/incomplete TR
  const checked = new Set<string>();
  for (const slug of allSlugs) {
    // Try multiple key formats
    const candidates = [
      slug,
      slug + "-calculator",
      slug.replace(/-(hesaplama|hesaplayici|hesaplayıcı|donusturucu|dönüştürücü|dengeleyici|kontrol|araci|aracı|analizoru|analizörü|tahmincisi|tahminci)$/i, ""),
    ];
    
    let bundleKey: string | null = null;
    for (const c of candidates) {
      if (titles[c]) { bundleKey = c; break; }
    }
    if (!bundleKey) continue;
    if (checked.has(bundleKey)) continue;
    checked.add(bundleKey);

    const entry = titles[bundleKey];
    const en = (entry.en || "").trim();
    if (!en) continue;

    const trVal = (entry.tr || "").trim();
    const isBadTr = !trVal || trVal === en || (trVal.startsWith(en) && trVal.length > en.length);
    
    if (isBadTr) {
      needPolish.push({ slug: bundleKey, en });
    }
  }

  console.log(`Need DeepSeek polish: ${needPolish.length} entries`);
  
  if (needPolish.length === 0) {
    console.log("Nothing to polish. Exiting.");
    return;
  }

  let polished = 0;
  for (let i = 0; i < needPolish.length; i += BATCH_SIZE) {
    const batch = needPolish.slice(i, i + BATCH_SIZE);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(needPolish.length / BATCH_SIZE)} (${batch.length} items)...`);
    
    try {
      const translated = await translateBatch(batch);
      
      for (const [slug, locales] of translated) {
        // Update bundle
        if (titles[slug]) {
          for (const [locale, value] of Object.entries(locales)) {
            titles[slug][locale] = value;
          }
        }
        
        // Update copy map
        if (copyTitles[slug]) {
          for (const [locale, value] of Object.entries(locales)) {
            copyTitles[slug][locale] = value;
          }
        } else {
          // Try to find matching copy map entry
          copyTitles[slug] = { en: titles[slug]?.en || slug, ...locales };
        }
        
        polished++;
      }
    } catch (err) {
      console.error(`Batch failed:`, err instanceof Error ? err.message : String(err));
    }

    // Save progress after each batch
    fs.writeFileSync(TITLES_PATH, JSON.stringify(titles, null, 2), "utf8");
    copyMap.toolTitles = copyTitles;
    fs.writeFileSync(COPY_MAP_PATH, JSON.stringify(copyMap, null, 2), "utf8");
    console.log(`  Progress saved. Total polished: ${polished}`);

    await new Promise((resolve) => setTimeout(resolve, 350));
  }

  console.log(`\n✅ DeepSeek polish complete: ${polished} entries updated`);
  console.log(`   Bundle: ${TITLES_PATH}`);
  console.log(`   Copy map: ${COPY_MAP_PATH}`);
}

main().catch((err) => {
  console.error("FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
