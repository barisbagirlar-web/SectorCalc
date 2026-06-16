#!/usr/bin/env node
/**
 * Full-phrase DeepSeek translation for generated schema labels, helpers, and tool titles.
 * Replaces word-by-word glossary substitution that produces hybrid EN/TR garbage.
 *
 * Run: node scripts/translate-generated-schema-copy.mjs
 *      node scripts/translate-generated-schema-copy.mjs --slug taguchi-quality-loss-function
 *      node scripts/translate-generated-schema-copy.mjs --dry-run
 */
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadEnvLocal } from "./ai/load-env-local.mjs";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const OUT_MAP = join(ROOT, "scripts/data/generated-schema-copy-i18n.json");
const OUT_TITLES = join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const TARGET_LOCALES = ["tr", "de", "fr", "es", "ar"];
const LOCALE_NAMES = {
  tr: "Turkish",
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};
const BATCH_SIZE = 25;

const args = process.argv.slice(2);
const slugFilter = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const dryRun = args.includes("--dry-run");

loadEnvLocal(ROOT);

function loadMap() {
  if (!existsSync(OUT_MAP)) {
    return { labels: {}, helpers: {}, toolTitles: {} };
  }
  const raw = JSON.parse(readFileSync(OUT_MAP, "utf8"));
  return {
    labels: raw.labels ?? {},
    helpers: raw.helpers ?? {},
    toolTitles: raw.toolTitles ?? {},
  };
}

function saveMap(map) {
  writeFileSync(OUT_MAP, `${JSON.stringify(map, null, 2)}\n`, "utf8");
}

function loadSchemas() {
  const files = readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));
  const tools = [];
  for (const fileName of files) {
    const slug = fileName.replace(/-schema\.json$/, "");
    if (slugFilter && slug !== slugFilter) {
      continue;
    }
    const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, fileName), "utf8"));
    tools.push({ slug, raw });
  }
  return tools.sort((a, b) => a.slug.localeCompare(b.slug));
}

function resolveToolTitleEn(raw, slug) {
  return (
    raw.title?.trim() ||
    raw.toolName?.trim() ||
    raw.name?.trim() ||
    slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function needsLocale(entry, locale) {
  return !entry?.[locale]?.trim();
}

function collectWork(tools, map) {
  const labelQueue = [];
  const helperQueue = [];
  const titleQueue = [];

  for (const { slug, raw } of tools) {
    const titleEn = resolveToolTitleEn(raw, slug);
    if (!map.toolTitles[slug]) {
      map.toolTitles[slug] = { en: titleEn };
    } else if (!map.toolTitles[slug].en) {
      map.toolTitles[slug].en = titleEn;
    }
    for (const locale of TARGET_LOCALES) {
      if (needsLocale(map.toolTitles[slug], locale)) {
        titleQueue.push({ kind: "title", slug, en: titleEn });
        break;
      }
    }

    for (const input of raw.inputs ?? []) {
      const labelEn = input.label?.trim();
      const helperEn = input.businessContext?.trim();
      if (labelEn) {
        if (!map.labels[labelEn]) {
          map.labels[labelEn] = {};
        }
        if (TARGET_LOCALES.some((locale) => needsLocale(map.labels[labelEn], locale))) {
          if (!labelQueue.includes(labelEn)) {
            labelQueue.push(labelEn);
          }
        }
      }
      if (helperEn) {
        if (!map.helpers[helperEn]) {
          map.helpers[helperEn] = {};
        }
        if (TARGET_LOCALES.some((locale) => needsLocale(map.helpers[helperEn], locale))) {
          if (!helperQueue.includes(helperEn)) {
            helperQueue.push(helperEn);
          }
        }
      }
    }
  }

  return { labelQueue, helperQueue, titleQueue };
}

async function translateBatch(kind, entries) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing — set in .env.local");
  }

  const payload = Object.fromEntries(entries.map((text, index) => [`k${index}`, text]));
  const reverse = Object.fromEntries(entries.map((text, index) => [`k${index}`, text]));

  const localeList = TARGET_LOCALES.map((locale) => `${locale} (${LOCALE_NAMES[locale]})`).join(", ");

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
            `You translate industrial calculator ${kind} to ${localeList}. ` +
            "Return JSON only. Each input key maps to an object with locale keys tr, de, fr, es, ar. " +
            "Translate the ENTIRE phrase naturally — never leave English words mixed into Turkish/German/French/Spanish/Arabic. " +
            "Preserve symbols, units in parentheses (T), (LSL), (USL), (σ), (μ), brand tokens (Taguchi, Six Sigma, ISO), and numerals. " +
            "For Arabic use Modern Standard Arabic.",
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
  const raw = json?.choices?.[0]?.message?.content ?? "{}";
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  const parsed = JSON.parse(cleaned);

  const results = new Map();
  for (const [key, value] of Object.entries(parsed)) {
    const source = reverse[key];
    if (!source || !value || typeof value !== "object") {
      continue;
    }
    const locales = {};
    for (const locale of TARGET_LOCALES) {
      const translated = value[locale];
      if (typeof translated === "string" && translated.trim() && translated.trim() !== source) {
        locales[locale] = translated.trim();
      }
    }
    if (Object.keys(locales).length > 0) {
      results.set(source, locales);
    }
  }
  return results;
}

async function drainQueue(kind, queue, bucket, map) {
  let translated = 0;
  for (let i = 0; i < queue.length; i += BATCH_SIZE) {
    const batch = queue.slice(i, i + BATCH_SIZE);
    console.log(`  ${kind} batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(queue.length / BATCH_SIZE)} (${batch.length} items)`);
    if (dryRun) {
      continue;
    }
    const results = await translateBatch(kind, batch);
    for (const [source, locales] of results) {
      bucket[source] = { ...(bucket[source] ?? {}), ...locales };
      translated += Object.keys(locales).length;
    }
    saveMap(map);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return translated;
}

function writeTitlesBundle(map) {
  writeFileSync(OUT_TITLES, `${JSON.stringify(map.toolTitles, null, 2)}\n`, "utf8");
}

async function main() {
  const map = loadMap();
  const tools = loadSchemas();
  const { labelQueue, helperQueue, titleQueue } = collectWork(tools, map);

  console.log(`schemas=${tools.length} labels_pending=${labelQueue.length} helpers_pending=${helperQueue.length} titles_pending=${titleQueue.length}`);

  if (dryRun) {
    console.log("dry-run — no API calls");
    return;
  }

  let total = 0;
  if (labelQueue.length > 0) {
    console.log("Translating labels…");
    total += await drainQueue("field labels", labelQueue, map.labels, map);
  }
  if (helperQueue.length > 0) {
    console.log("Translating helpers…");
    total += await drainQueue("field helper descriptions", helperQueue, map.helpers, map);
  }
  if (titleQueue.length > 0) {
    console.log("Translating tool titles…");
    const slugTitles = titleQueue.map((item) => item.en);
    const uniqueTitles = [...new Set(slugTitles)];
    for (let i = 0; i < uniqueTitles.length; i += BATCH_SIZE) {
      const batch = uniqueTitles.slice(i, i + BATCH_SIZE);
      console.log(`  titles batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueTitles.length / BATCH_SIZE)}`);
      const results = await translateBatch("tool titles", batch);
      for (const { slug, en } of titleQueue) {
        const locales = results.get(en);
        if (locales) {
          map.toolTitles[slug] = { ...(map.toolTitles[slug] ?? {}), en, ...locales };
          total += Object.keys(locales).length;
        }
      }
      saveMap(map);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  writeTitlesBundle(map);
  console.log(`translate-generated-schema-copy: ${total} locale string(s) written`);
  console.log(`  map → ${OUT_MAP}`);
  console.log(`  titles → ${OUT_TITLES}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
