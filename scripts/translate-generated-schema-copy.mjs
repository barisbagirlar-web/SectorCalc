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
const OUT_MAP = join(ROOT, "archive/migration-only/scripts/data/generated-schema-copy-i18n.json");
const OUT_TITLES = join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const OUT_DESCRIPTIONS = join(ROOT, "src/data/generated-tool-descriptions-i18n.generated.json");
const TARGET_LOCALES = ["tr", "de", "fr", "es", "ar"];
const LOCALE_NAMES = {
  tr: "Turkish",
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};
const BATCH_SIZE = 50;

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

const ENGLISH_MARKERS = [
  /\bthe\b/i,
  /\bfor\b/i,
  /\bper\b/i,
  /\bwith\b/i,
  /\bfrom\b/i,
  /\bwhen\b/i,
  /\bthat\b/i,
  /\bthis\b/i,
  /\bused\b/i,
  /\bminimum\b/i,
  /\bmaximum\b/i,
  /\bacceptable\b/i,
  /\bmeasure\b/i,
  /\bprocess\b/i,
  /\bengineering\b/i,
  /\bcustomer\b/i,
  /\bspecification\b/i,
  /\bideal\b/i,
  /\bcharacteristic\b/i,
  /\binclude\b/i,
  /\bif true\b/i,
  /\be\.g\./i,
  /\btypical\b/i,
  /\bexpected\b/i,
  /\bavailable\b/i,
  /\bnumber of\b/i,
];

const LOCALE_MARKERS = {
  tr: [/[çğıöşüÇĞİÖŞÜ]/, /\b(için|veya|başına|olarak|girin|hedef|process|cost|unit)\b/i],
  de: [/[äöüßÄÖÜ]/, /\b(und|oder|für|pro|eingeben|der|die|das)\b/i],
  fr: [/[àâçéèêëîïôùûü]/i, /\b(pour|ou|de|le|la|saisir)\b/i],
  es: [/[áéíóúñü¿¡]/i, /\b(para|o|de|el|la|introduzca)\b/i],
  ar: [/[\u0600-\u06FF]/],
};

function isHybrid(text, locale) {
  if (!text || locale === "en") {
    return false;
  }
  const hasEnglish = ENGLISH_MARKERS.some((re) => re.test(text));
  if (!hasEnglish) {
    return false;
  }
  const markers = LOCALE_MARKERS[locale] ?? [];
  return markers.some((re) => re.test(text));
}

function localeNeedsTranslation(entry, locale, enSource) {
  const value = entry?.[locale]?.trim();
  if (!value) {
    return true;
  }
  if (enSource && value === enSource.trim()) {
    return true;
  }
  return isHybrid(value, locale);
}

function collectWork(tools, map) {
  const labelQueue = [];
  const helperQueue = [];
  const titleQueue = [];
  const descriptionQueue = [];

  for (const { slug, raw } of tools) {
    const titleEn = resolveToolTitleEn(raw, slug);
    if (!map.toolTitles[slug]) {
      map.toolTitles[slug] = { en: titleEn };
    } else if (!map.toolTitles[slug].en) {
      map.toolTitles[slug].en = titleEn;
    }
    for (const locale of TARGET_LOCALES) {
      if (localeNeedsTranslation(map.toolTitles[slug], locale, titleEn)) {
        titleQueue.push({ kind: "title", slug, en: titleEn });
        break;
      }
    }

    const descEn = raw.description?.trim();
    if (descEn) {
      if (!map.descriptions) map.descriptions = {};
      if (!map.descriptions[slug]) {
        map.descriptions[slug] = { en: descEn };
      }
      if (TARGET_LOCALES.some((locale) => localeNeedsTranslation(map.descriptions[slug], locale, descEn))) {
        descriptionQueue.push({ slug, en: descEn });
      }
    }

    for (const input of raw.inputs ?? []) {
      const labelEn = input.label?.trim();
      const helperEn = input.businessContext?.trim();
      if (labelEn) {
        if (!map.labels[labelEn]) {
          map.labels[labelEn] = {};
        }
        if (TARGET_LOCALES.some((locale) => localeNeedsTranslation(map.labels[labelEn], locale, labelEn))) {
          if (!labelQueue.includes(labelEn)) {
            labelQueue.push(labelEn);
          }
        }
      }
      if (helperEn) {
        if (!map.helpers[helperEn]) {
          map.helpers[helperEn] = {};
        }
        if (TARGET_LOCALES.some((locale) => localeNeedsTranslation(map.helpers[helperEn], locale, helperEn))) {
          if (!helperQueue.includes(helperEn)) {
            helperQueue.push(helperEn);
          }
        }
      }
    }
  }

  return { labelQueue, helperQueue, titleQueue, descriptionQueue };
}

function parseDeepSeekJson(raw) {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/i, "$1").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error(`Unparseable DeepSeek JSON (${cleaned.length} chars)`);
  }
}

async function translateBatch(kind, entries, attempt = 1) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing — set in .env.local");
  }

  const payload = Object.fromEntries(entries.map((text, index) => [`k${index}`, text]));
  const reverse = Object.fromEntries(entries.map((text, index) => [`k${index}`, text]));

  const localeList = TARGET_LOCALES.map((locale) => `${locale} (${LOCALE_NAMES[locale]})`).join(", ");

  try {
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
    const parsed = parseDeepSeekJson(raw);

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
  } catch (error) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
      return translateBatch(kind, entries, attempt + 1);
    }
    throw error;
  }
}

async function translateBatchResilient(kind, entries) {
  try {
    return await translateBatch(kind, entries);
  } catch (error) {
    if (entries.length <= 1) {
      console.warn(`  skip ${kind} item (${entries[0]?.slice(0, 60) ?? "?"}): ${error.message}`);
      return new Map();
    }
    const mid = Math.ceil(entries.length / 2);
    const left = await translateBatchResilient(kind, entries.slice(0, mid));
    const right = await translateBatchResilient(kind, entries.slice(mid));
    return new Map([...left, ...right]);
  }
}

async function drainQueue(kind, queue, bucket, map) {
  let translated = 0;
  for (let i = 0; i < queue.length; i += BATCH_SIZE) {
    const batch = queue.slice(i, i + BATCH_SIZE);
    console.log(`  ${kind} batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(queue.length / BATCH_SIZE)} (${batch.length} items)`);
    if (dryRun) {
      continue;
    }
    const results = await translateBatchResilient(kind, batch);
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

function writeDescriptionsBundle(map) {
  const bundle = map.descriptions ?? {};
  writeFileSync(OUT_DESCRIPTIONS, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
}

async function main() {
  const map = loadMap();
  const tools = loadSchemas();
  const { labelQueue, helperQueue, titleQueue, descriptionQueue } = collectWork(tools, map);

  console.log(`schemas=${tools.length} labels_pending=${labelQueue.length} helpers_pending=${helperQueue.length} titles_pending=${titleQueue.length} descriptions_pending=${descriptionQueue.length}`);

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
      const results = await translateBatchResilient("tool titles", batch);
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

  if (descriptionQueue.length > 0) {
    console.log(`Translating ${descriptionQueue.length} tool descriptions…`);
    const uniqueDesc = [...new Set(descriptionQueue.map((item) => item.en))];
    for (let i = 0; i < uniqueDesc.length; i += BATCH_SIZE) {
      const batch = uniqueDesc.slice(i, i + BATCH_SIZE);
      console.log(`  descriptions batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueDesc.length / BATCH_SIZE)}`);
      const results = await translateBatchResilient("tool descriptions", batch);
      for (const { slug, en } of descriptionQueue) {
        const locales = results.get(en);
        if (locales) {
          map.descriptions[slug] = { ...(map.descriptions[slug] ?? {}), en, ...locales };
          total += Object.keys(locales).length;
        }
      }
      saveMap(map);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  writeTitlesBundle(map);
  writeDescriptionsBundle(map);
  console.log(`translate-generated-schema-copy: ${total} locale string(s) written`);
  console.log(`  map → ${OUT_MAP}`);
  console.log(`  titles → ${OUT_TITLES}`);
  console.log(`  descriptions → ${OUT_DESCRIPTIONS}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
