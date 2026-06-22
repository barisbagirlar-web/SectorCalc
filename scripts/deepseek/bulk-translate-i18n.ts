#!/usr/bin/env npx tsx
/**
 * DeepSeek bulk i18n translation — schema JSON files.
 *
 * 1. Scan all schema files for fields where DE/FR/ES/AR === EN
 * 2. Collect unique English strings per locale
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
const BATCH_SIZE = 50;
const TARGET_LOCALES = ["de", "fr", "es", "ar"] as const;
type TargetLocale = (typeof TARGET_LOCALES)[number];

const LOCALE_NAMES: Record<TargetLocale, string> = {
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};

/* ── Collect all i18n fields needing translation ── */

type Slot = {
  filePath: string;
  jsonPath: string;
};

type Collection = {
  slots: Slot[];
  sourceEnBySlot: Map<string, string>;
  localeBySlot: Map<string, TargetLocale>;
};

function collectSlots(): Collection {
  const slots: Slot[] = [];
  const sourceEnBySlot = new Map<string, string>();
  const localeBySlot = new Map<string, TargetLocale>();

  const files = fs.readdirSync(SCHEMAS_DIR).filter((n) => n.endsWith("-schema.json")).sort();

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;

    function check(slot: Slot, i18n: Record<string, string> | undefined, loc: TargetLocale) {
      if (!i18n) return;
      const en = i18n.en ?? "";
      if (en.length <= 2) return;
      if (i18n[loc] === en) {
        const key = `${slot.filePath}::${slot.jsonPath}::${loc}`;
        slots.push(slot);
        sourceEnBySlot.set(key, en);
        localeBySlot.set(key, loc);
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

/* ── DeepSeek API call ── */

async function translateBatch(strings: string[], locale: TargetLocale): Promise<Map<string, string>> {
  const sysMsg = `You are an industrial/engineering translator. Translate from English to ${LOCALE_NAMES[locale]} (${locale}). Return ONLY valid JSON. No markdown. No explanations. No greetings.`;

  const userMsg = `Translate each of the following English strings to ${LOCALE_NAMES[locale]} (${locale}).

CRITICAL RULES:
- Translate ALL text. Do NOT leave any English untranslated.
- Units in parentheses MUST stay EXACTLY as-is and untranslated (examples: (kg), (USD), (N.m), (%), (mm), (m²), (m³), (Rad), (s), (hours), (days), (years)).
- Variable names, placeholders like {value}, and proper nouns stay untranslated.
- Use correct industrial/engineering/mathematical terminology.
- For titles/slugs with hyphens: translate the readable parts only.
- Return ONLY a flat JSON object mapping numeric index to translated string.
- Every input string MUST have a corresponding output entry. No skips.

INPUT (${strings.length} strings):
${strings.map((s, i) => `  "${i}": ${JSON.stringify(s)}`).join("\n")}

OUTPUT (JSON with numeric keys):`;

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
      const src = strings[idx]!;
      // Only apply if translation is different from source
      if (v !== src) {
        result.set(src, v);
      }
    }
  }

  return result;
}

/* ── Apply translations and write file ── */

function applyAndWrite(
  changes: Map<string, Map<TargetLocale, string>>, // filePath -> (jsonPath::locale -> value)
): number {
  const fileGroups = new Map<string, Map<string, Map<TargetLocale, string>>>();

  // Group by filePath
  for (const [key, localeMap] of changes) {
    const [filePath, remainder] = key.split("::") as [string, string];
    const [jsonPath, locale] = remainder.split("::") as [string, TargetLocale];
    if (!filePath || !jsonPath || !locale) continue;
    let fileMap = fileGroups.get(filePath);
    if (!fileMap) {
      fileMap = new Map();
      fileGroups.set(filePath, fileMap);
    }
    let jsonMap = fileMap.get(jsonPath);
    if (!jsonMap) {
      jsonMap = new Map() as Map<TargetLocale, string>;
      fileMap.set(jsonPath, jsonMap);
    }
    jsonMap.set(locale, localeMap.get(locale)!);
  }

  let total = 0;
  for (const [filePath, jsonMapEntries] of fileGroups) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
    let fileChanged = false;

    for (const [jsonPath, localeMap] of jsonMapEntries) {
      const parts = jsonPath.split(".");
      let cur: unknown = raw;
      let found = true;

      for (let p = 0; p < parts.length; p++) {
        const part = parts[p]!;
        if (/^\d+$/.test(part)) {
          const arr = cur as unknown[];
          if (Number(part) >= arr.length) { found = false; break; }
          cur = arr[Number(part)]!;
        } else {
          const obj = cur as Record<string, unknown>;
          if (!(part in obj)) { found = false; break; }
          cur = obj[part]!;
        }
      }
      if (!found) continue;

      // cur now points to the i18n parent object (e.g., title_i18n, inputs[0].label_i18n)
      const target = cur as Record<string, string>;
      for (const [locale, value] of localeMap) {
        if (target[locale] !== value) {
          target[locale] = value;
          total++;
          fileChanged = true;
        }
      }
    }

    if (fileChanged) {
      fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
    }
  }

  return total;
}

/* ── Main ── */

async function main() {
  console.log("═══ DeepSeek Bulk i18n Translation ═══\n");

  const { slots, sourceEnBySlot, localeBySlot } = collectSlots();
  const schemaCount = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json")).length;
  console.log(`Schemas: ${schemaCount} | Slots needing translation: ${slots.length}\n`);

  if (slots.length === 0) {
    console.log("✅ All translations complete. Nothing to do.");
    return;
  }

  let totalApplied = 0;
  let apiCalls = 0;

  for (const locale of TARGET_LOCALES) {
    const localeSlots = slots.filter((_, i) => localeBySlot.get(`${_.filePath}::${_.jsonPath}::${locale}`) === locale);
    const uniqueSources = [...new Set(localeSlots.map((s) => sourceEnBySlot.get(`${s.filePath}::${s.jsonPath}::${locale}`) ?? ""))].filter(Boolean);

    console.log(`── [${locale}] ${LOCALE_NAMES[locale]} — ${localeSlots.length} slots, ${uniqueSources.length} unique strings ──`);

    for (let i = 0; i < uniqueSources.length; i += BATCH_SIZE) {
      const batch = uniqueSources.slice(i, i + BATCH_SIZE);

      try {
        const translationMap = await translateBatch(batch, locale);
        apiCalls++;

        // Build changes map
        const changes = new Map<string, Map<TargetLocale, string>>();

        for (const slot of localeSlots) {
          const key = `${slot.filePath}::${slot.jsonPath}::${locale}`;
          const src = sourceEnBySlot.get(key);
          if (!src) continue;
          const translated = translationMap.get(src);
          if (!translated || translated === src) continue;

          const changeKey = `${slot.filePath}::${slot.jsonPath}::${locale}`;
          let locMap = changes.get(changeKey);
          if (!locMap) {
            locMap = new Map();
            changes.set(changeKey, locMap);
          }
          locMap.set(locale, translated);
        }

        // Apply and write
        const applied = applyAndWrite(changes);
        totalApplied += applied;

        const pct = Math.round(((i + batch.length) / uniqueSources.length) * 100);
        console.log(`  ${pct}% | batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueSources.length / BATCH_SIZE)} | +${applied} fields (API #${apiCalls})`);

        await new Promise((r) => setTimeout(r, 1000));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        console.error(`  ERROR batch ${batchNum}: ${msg.slice(0, 150)}`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }

  /* ── Report ── */
  console.log(`\n\n═══ SUMMARY ═══`);
  console.log(`  API calls:       ${apiCalls}`);
  console.log(`  Fields applied:  ${totalApplied}`);
  console.log(`  Slots remaining: ${slots.length - totalApplied}`);

  if (totalApplied === 0) {
    console.log("\n⚠️  No translations applied. Check API key/connectivity.");
    process.exit(1);
  }

  // Show sample changed files
  const changedSet = new Set(slots.map((s) => s.filePath));
  console.log(`\nSample files modified:`);
  for (const fp of [...changedSet].sort().slice(0, 5)) {
    console.log(`  ${path.relative(PROJECT_ROOT, fp)}`);
  }
  if (changedSet.size > 5) console.log(`  ... +${changedSet.size - 5} more`);

  console.log("\n✅ Done. Run 'npm run audit:schema-field-i18n' to verify.");
}

main().catch((err) => {
  console.error("FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
