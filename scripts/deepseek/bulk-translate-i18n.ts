#!/usr/bin/env npx tsx
/**
 * DeepSeek bulk i18n translation — schema JSON files.
 *
 * 1. Scan 358 schema files for fields where DE/FR/ES/AR === EN
 * 2. Collect unique English strings
 * 3. Translate batches via DeepSeek API
 * 4. Write translations back to schema files
 *
 * USAGE:  npx tsx scripts/deepseek/bulk-translate-i18n.ts
 * ENV:    DEEPSEEK_API_KEY in .env.local
 */

import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT, loadEnv } from "./load-env";

loadEnv();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) {
  console.error("FATAL: DEEPSEEK_API_KEY not found in .env.local");
  process.exit(1);
}

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const BATCH_SIZE = 60;
const TARGET_LOCALES = ["de", "fr", "es", "ar"] as const;
type TargetLocale = (typeof TARGET_LOCALES)[number];

const LOCALE_NAMES: Record<TargetLocale, string> = {
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};

/* ── Collect all i18n fields that need translation ── */

type I18nSlot = {
  filePath: string;
  jsonPath: string; // e.g. "inputs.0.label_i18n" or "title_i18n"
};

function collectSlots(): { slots: I18nSlot[]; sourceEnBySlot: Map<string, string>; localeBySlot: Map<string, TargetLocale> } {
  const slots: I18nSlot[] = [];
  const sourceEnBySlot = new Map<string, string>();
  const localeBySlot = new Map<string, TargetLocale>();

  const files = fs.readdirSync(SCHEMAS_DIR).filter((n) => n.endsWith("-schema.json")).sort();

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;

    function check(slot: I18nSlot, i18n: Record<string, string> | undefined, locale: TargetLocale) {
      if (!i18n) return;
      const en = i18n.en ?? "";
      if (en.length <= 2) return;
      if (i18n[locale] === en) {
        const key = `${slot.filePath}::${slot.jsonPath}::${locale}`;
        slots.push(slot);
        sourceEnBySlot.set(key, en);
        localeBySlot.set(key, locale);
      }
    }

    // title_i18n
    const title = raw.title_i18n as Record<string, string> | undefined;
    for (const loc of TARGET_LOCALES) check({ filePath, jsonPath: "title_i18n" }, title, loc);

    // about.description.short_i18n / long_i18n
    const about = raw.about as Record<string, unknown> | undefined;
    const desc = about?.description as Record<string, unknown> | undefined;
    if (desc) {
      for (const p of ["short_i18n", "long_i18n"] as const) {
        const i18n = desc[p] as Record<string, string> | undefined;
        for (const loc of TARGET_LOCALES) check({ filePath, jsonPath: `about.description.${p}` }, i18n, loc);
      }
    }

    // inputs[].label_i18n, businessContext_i18n
    const inputs = raw.inputs as Array<Record<string, unknown>> | undefined;
    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        const inp = inputs[i]!;
        for (const f of ["label_i18n", "businessContext_i18n"] as const) {
          const i18n = inp[f] as Record<string, string> | undefined;
          for (const loc of TARGET_LOCALES) check({ filePath, jsonPath: `inputs.${i}.${f}` }, i18n, loc);
        }
      }
    }

    // outputs.breakdown_i18n
    const outputs = raw.outputs as Record<string, unknown> | undefined;
    const bd = outputs?.breakdown_i18n as Record<string, Record<string, string>> | undefined;
    if (bd) {
      for (const key of Object.keys(bd)) {
        const i18n = bd[key]!;
        for (const loc of TARGET_LOCALES) check({ filePath, jsonPath: `outputs.breakdown_i18n.${key}` }, i18n, loc);
      }
    }
  }

  return { slots, sourceEnBySlot, localeBySlot };
}

/* ── DeepSeek translation ── */

async function translateStrings(strings: string[], locale: TargetLocale): Promise<Map<string, string>> {
  const sysMsg = `You are an industrial/engineering translator. Translate from English to ${LOCALE_NAMES[locale]} (${locale}). Return ONLY valid JSON. No markdown. No explanations.`;

  const userMsg = `Translate each of these industrial/engineering short phrases to ${LOCALE_NAMES[locale]} (${locale}).

RULES:
- Preserve units in parentheses (kg, USD, N.m, %, mm, etc.) untranslated
- Preserve variable names, placeholders, and special notation
- Use correct technical/professional terminology
- Return ONLY a JSON object mapping numeric index to translated string

INPUT:
${strings.map((s, i) => `  "${i}": ${JSON.stringify(s)}`).join("\n")}

OUTPUT:`;

  const body = JSON.stringify({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: sysMsg },
      { role: "user", content: userMsg },
    ],
    temperature: 0.1,
    max_tokens: 4096,
  });

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body,
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "unknown");
    throw new Error(`API ${response.status}: ${err.slice(0, 200)}`);
  }

  const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response");

  let cleaned = content.trim();
  const m = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
  if (m?.[1]) cleaned = m[1].trim();

  const parsed = JSON.parse(cleaned) as Record<string, string>;
  const result = new Map<string, string>();
  for (const [k, v] of Object.entries(parsed)) {
    const idx = Number(k);
    if (!isNaN(idx) && idx < strings.length) {
      result.set(strings[idx]!, v);
    }
  }
  return result;
}

/* ── Apply translation to a schema file ── */

function applyToSchema(filePath: string, jsonPath: string, locale: TargetLocale, value: string): boolean {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
  const parts = jsonPath.split(".");
  let cur: unknown = raw;
  for (let p = 0; p < parts.length; p++) {
    if (p === parts.length - 1) {
      const obj = cur as Record<string, string>;
      if (obj[locale] !== value) {
        obj[locale] = value;
        return true;
      }
      return false;
    }
    const part = parts[p]!;
    if (/^\d+$/.test(part)) {
      cur = (cur as unknown[])[Number(part)];
    } else {
      cur = (cur as Record<string, unknown>)[part];
    }
  }
  return false;
}

/* ── Main ── */

async function main() {
  console.log("═══ DeepSeek Bulk i18n Translation ═══\n");

  const { slots, sourceEnBySlot, localeBySlot } = collectSlots();
  console.log(`Schemas:    ${fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json")).length}`);
  console.log(`Total slots needing translation: ${slots.length}`);
  console.log(`  (slots = field x locale combinations)\n`);

  if (slots.length === 0) {
    console.log("✅ All translations complete. Nothing to do.");
    return;
  }

  let totalApplied = 0;
  let filesChanged = new Set<string>();
  let apiCalls = 0;

  for (const locale of TARGET_LOCALES) {
    // Collect unique English source strings for this locale
    const localeSlots = slots.filter((_, i) => localeBySlot.get(`${_.filePath}::${_.jsonPath}::${locale}`) === locale);
    const uniqueSources = [...new Set(localeSlots.map((slot) => sourceEnBySlot.get(`${slot.filePath}::${slot.jsonPath}::${locale}`) ?? ""))].filter(Boolean);
    console.log(`\n── [${locale}] ${LOCALE_NAMES[locale]} — ${localeSlots.length} slots, ${uniqueSources.length} unique strings ──`);

    // Batch unique strings
    for (let i = 0; i < uniqueSources.length; i += BATCH_SIZE) {
      const batch = uniqueSources.slice(i, i + BATCH_SIZE);

      try {
        const translationMap = await translateStrings(batch, locale);
        apiCalls++;

        // Apply to matching slots
        let batchApplied = 0;
        for (const slot of localeSlots) {
          const key = `${slot.filePath}::${slot.jsonPath}::${locale}`;
          const src = sourceEnBySlot.get(key);
          if (!src) continue;
          const translated = translationMap.get(src);
          if (!translated || translated === src) continue;

          if (applyToSchema(slot.filePath, slot.jsonPath, locale, translated)) {
            batchApplied++;
            filesChanged.add(slot.filePath);
          }
        }

        totalApplied += batchApplied;

        const pct = Math.round(((i + batch.length) / uniqueSources.length) * 100);
        console.log(`  [${locale}] ${pct}% | batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueSources.length / BATCH_SIZE)} | +${batchApplied} fields`);

        await new Promise((r) => setTimeout(r, 1200));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  ERROR batch ${Math.floor(i / BATCH_SIZE) + 1}: ${msg.slice(0, 150)}`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }

  // Write changed files
  for (const filePath of filesChanged) {
    // Already written inline, no need to re-read/write
  }

  console.log(`\n\n═══ SUMMARY ═══`);
  console.log(`  API calls:       ${apiCalls}`);
  console.log(`  Fields applied:  ${totalApplied}`);
  console.log(`  Files modified:  ${filesChanged.size}`);

  if (totalApplied === 0) {
    console.log("\n⚠️  No translations were applied. Check API key and connectivity.");
    process.exit(1);
  }

  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error("FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
