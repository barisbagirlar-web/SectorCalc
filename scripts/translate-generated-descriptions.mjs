#!/usr/bin/env node
/**
 * DeepSeek translation for generated tool descriptions.
 * Only translates the root `description` field from each schema.
 * Output: src/data/generated-tool-descriptions-i18n.generated.json
 *
 * Usage: node scripts/translate-generated-descriptions.mjs
 *        node scripts/translate-generated-descriptions.mjs --slug digital-twin-cost-comparator
 *        node scripts/translate-generated-descriptions.mjs --dry-run
 */
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadEnvLocal } from "./ai/load-env-local.mjs";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const OUT_PATH = join(ROOT, "src/data/generated-tool-descriptions-i18n.generated.json");
const TARGET_LOCALES = ["tr", "de", "fr", "es", "ar"];
const BATCH_SIZE = 50;

const args = process.argv.slice(2);
const slugFilter = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const dryRun = args.includes("--dry-run");

loadEnvLocal(ROOT);

const ENGLISH_MARKERS = [
  /\b(the|for|per|with|from|when|that|this|used)\b/i,
  /\b(and|are|can|has|have|been|based|using)\b/i,
];

const LOCALE_MARKERS = {
  tr: [/[çğıöşüÇĞİÖŞÜ]/, /\b(için|veya|başına|olarak|girin|hedef|cost|unit|hesaplanır)\b/i],
  de: [/[äöüßÄÖÜ]/, /\b(und|oder|für|pro|der|die|das|wird|berechnet)\b/i],
  fr: [/[àâçéèêëîïôùûü]/, /\b(pour|ou|de|le|la|est|calculé)\b/i],
  es: [/[áéíóúñü¿¡]/, /\b(para|o|de|el|la|se|calcula)\b/i],
  ar: [/[\u0600-\u06FF]/],
};

function isHybrid(text, locale) {
  if (!text || locale === "en") return false;
  const hasEnglish = ENGLISH_MARKERS.some((re) => re.test(text));
  if (!hasEnglish) return false;
  const markers = LOCALE_MARKERS[locale] ?? [];
  return markers.some((re) => re.test(text));
}

function localeNeedsTranslation(entry, locale, enSource) {
  const value = entry?.[locale]?.trim();
  if (!value) return true;
  if (enSource && value === enSource.trim()) return true;
  return isHybrid(value, locale);
}

function loadCurrentBundle() {
  if (!existsSync(OUT_PATH)) return {};
  try {
    return JSON.parse(readFileSync(OUT_PATH, "utf8"));
  } catch {
    return {};
  }
}

function collectDescriptions(tools) {
  const pending = [];
  const bundle = loadCurrentBundle();

  for (const { slug, raw } of tools) {
    const descEn = raw.description?.trim();
    if (!descEn) continue;

    if (!bundle[slug]) bundle[slug] = { en: descEn };

    if (TARGET_LOCALES.some((locale) => localeNeedsTranslation(bundle[slug], locale, descEn))) {
      pending.push({ slug, en: descEn });
    }
  }

  writeBundle(bundle);
  return { bundle, pending };
}

function writeBundle(bundle) {
  writeFileSync(OUT_PATH, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
}

function loadSchemas() {
  const files = readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));
  const tools = [];
  for (const fileName of files) {
    const slug = fileName.replace(/-schema\.json$/, "");
    if (slugFilter && slug !== slugFilter) continue;
    const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, fileName), "utf8"));
    if (raw.description?.trim()) {
      tools.push({ slug, raw });
    }
  }
  return tools.sort((a, b) => a.slug.localeCompare(b.slug));
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

async function translateBatch(descriptions, attempt = 1) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing — set in .env.local");

  const payload = Object.fromEntries(descriptions.map((d, i) => [`k${i}`, d.en]));
  const reverse = Object.fromEntries(descriptions.map((d, i) => [`k${i}`, d.en]));
  const localeList = TARGET_LOCALES.map((l) => `${l}`).join(", ");

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
              `You translate industrial/engineering calculator descriptions to ${localeList}. ` +
              "Return JSON only. Each input key maps to an object with locale keys tr, de, fr, es, ar. " +
              "Translate the ENTIRE phrase naturally — never leave English words mixed in. " +
              "Preserve symbols, standards references (ISO, Six Sigma, Lean, DIN, ASTM), units in parentheses, brand names, and numerals. " +
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
      if (!source || !value || typeof value !== "object") continue;
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
      return translateBatch(descriptions, attempt + 1);
    }
    throw error;
  }
}

async function translateBatchResilient(descriptions) {
  try {
    return await translateBatch(descriptions);
  } catch (error) {
    if (descriptions.length <= 1) {
      console.warn(`  skip item (${descriptions[0]?.en?.slice(0, 60) ?? "?"}): ${error.message}`);
      return new Map();
    }
    const mid = Math.ceil(descriptions.length / 2);
    const left = await translateBatchResilient(descriptions.slice(0, mid));
    const right = await translateBatchResilient(descriptions.slice(mid));
    return new Map([...left, ...right]);
  }
}

async function main() {
  const tools = loadSchemas();
  const { bundle, pending } = collectDescriptions(tools);
  const uniqueEnTexts = [...new Set(pending.map((p) => p.en))];

  console.log(`schemas_with_descriptions=${tools.length} pending=${pending.length} unique_texts=${uniqueEnTexts.length}`);

  if (dryRun) {
    console.log("dry-run — no API calls");
    return;
  }

  if (pending.length === 0) {
    console.log("All descriptions already translated.");
    return;
  }

  let total = 0;
  for (let i = 0; i < uniqueEnTexts.length; i += BATCH_SIZE) {
    const batchTexts = uniqueEnTexts.slice(i, i + BATCH_SIZE);
    const batchDesc = pending.filter((p) => batchTexts.includes(p.en));
    console.log(`  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueEnTexts.length / BATCH_SIZE)} (${batchTexts.length} texts, ${batchDesc.length} tools)`);
    const results = await translateBatchResilient(batchDesc);
    for (const { slug, en } of batchDesc) {
      const locales = results.get(en);
      if (locales) {
        bundle[slug] = { ...(bundle[slug] ?? {}), en, ...locales };
        total += Object.keys(locales).length;
      }
    }
    writeBundle(bundle);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log(`translate-generated-descriptions: ${total} locale strings written → ${OUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
