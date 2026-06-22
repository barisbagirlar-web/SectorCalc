#!/usr/bin/env npx tsx
/**
 * DeepSeek bulk i18n translation — schema JSON files.
 *
 * Phase 1: Scan all schemas, collect untranslated slots
 * Phase 2: For each locale, batch unique strings → DeepSeek API → translate
 * Phase 3: Apply translations back to schema files
 *
 * USAGE:  npx tsx scripts/deepseek/bulk-translate-i18n.ts
 * ENV:    DEEPSEEK_API_KEY in .env.local
 */

import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT, loadEnv } from "./load-env";

loadEnv();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) { console.error("FATAL: DEEPSEEK_API_KEY not found"); process.exit(1); }

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const BATCH_SIZE = 50;
const TARGET_LOCALES = ["de", "fr", "es", "ar"] as const;
type TargetLocale = (typeof TARGET_LOCALES)[number];
const LOCALE_NAMES: Record<TargetLocale, string> = { de: "German", fr: "French", es: "Spanish", ar: "Arabic" };

/* ── Collect slots needing translation ── */
type Slot = { filePath: string; jsonPath: string };

function collectSlots(): { slots: Slot[]; srcByKey: Map<string, string>; localeByKey: Map<string, TargetLocale> } {
  const slots: Slot[] = [];
  const srcByKey = new Map<string, string>();
  const localeByKey = new Map<string, TargetLocale>();

  function add(slot: Slot, i18n: Record<string, string> | undefined, loc: TargetLocale) {
    if (!i18n) return;
    const en = i18n.en ?? "";
    if (en.length <= 2) return;
    if (i18n[loc] === en) {
      const key = `${slot.filePath}||${slot.jsonPath}||${loc}`;
      slots.push(slot);
      srcByKey.set(key, en);
      localeByKey.set(key, loc);
    }
  }

  for (const file of fs.readdirSync(SCHEMAS_DIR).filter((n) => n.endsWith("-schema.json")).sort()) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;

    // title_i18n
    for (const loc of TARGET_LOCALES) add({ filePath, jsonPath: "title_i18n" }, raw.title_i18n as Record<string, string> | undefined, loc);

    // about.description.*_i18n
    const desc = (raw.about as Record<string, unknown> | undefined)?.description as Record<string, unknown> | undefined;
    for (const p of ["short_i18n", "long_i18n"] as const) {
      for (const loc of TARGET_LOCALES) add({ filePath, jsonPath: `about.description.${p}` }, desc?.[p] as Record<string, string> | undefined, loc);
    }

    // inputs[].*_i18n
    const inputs = raw.inputs as Array<Record<string, unknown>> | undefined;
    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        for (const f of ["label_i18n", "businessContext_i18n"] as const) {
          for (const loc of TARGET_LOCALES) add({ filePath, jsonPath: `inputs.${i}.${f}` }, inputs[i]![f] as Record<string, string> | undefined, loc);
        }
      }
    }

    // outputs.breakdown_i18n
    const bd = (raw.outputs as Record<string, unknown> | undefined)?.breakdown_i18n as Record<string, Record<string, string>> | undefined;
    if (bd) {
      for (const key of Object.keys(bd)) {
        for (const loc of TARGET_LOCALES) add({ filePath, jsonPath: `outputs.breakdown_i18n.${key}` }, bd[key]!, loc);
      }
    }
  }

  return { slots, srcByKey, localeByKey };
}

/* ── Set a value deep in a parsed JSON tree ── */
function setDeep(raw: Record<string, unknown>, jsonPath: string, locale: string, value: string): boolean {
  const parts = jsonPath.split(".");
  let cur: unknown = raw;
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      cur = (cur as unknown[])[Number(part)];
    } else {
      cur = (cur as Record<string, unknown>)[part];
    }
  }
  const target = cur as Record<string, string>;
  if (target[locale] === value) return false;
  target[locale] = value;
  return true;
}

/* ── Apply translations per file ── */
function applyChanges(changes: Map<string, Map<string, string>>): number {
  // changes: filePath → { jsonPath||locale → value }
  let total = 0;
  for (const [filePath, entries] of changes) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
    let fileChanged = false;
    for (const [compoundKey, value] of entries) {
      const [jsonPath, locale] = compoundKey.split("||") as [string, string];
      if (setDeep(raw, jsonPath, locale, value)) {
        total++;
        fileChanged = true;
      }
    }
    if (fileChanged) {
      fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
    }
  }
  return total;
}

/* ── DeepSeek translation ── */
async function translateBatch(strings: string[], locale: TargetLocale): Promise<Map<string, string>> {
  const sysMsg = `You are an industrial/engineering translator. Translate from English to ${LOCALE_NAMES[locale]} (${locale}). Return ONLY valid JSON. No markdown. No explanations.`;

  const userMsg = `Translate each English string to ${LOCALE_NAMES[locale]} (${locale}).

STRICT RULES:
- Translate ALL text without exception.
- Units in parentheses like (kg), (USD), (N.m), (%), (mm), (m²), (m³), (Rad), (s), (hours), (days) MUST stay EXACTLY as-is.
- Proper nouns, variable names, numbered references stay untranslated.
- Use correct technical/industrial terminology.
- Return ONLY a JSON object: {"0": "translation0", "1": "translation1", ...}

INPUT:
${strings.map((s, i) => `  "${i}": ${JSON.stringify(s)}`).join("\n")}

OUTPUT:`;

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: sysMsg },
        { role: "user", content: userMsg },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "unknown");
    throw new Error(`API ${response.status}: ${err.slice(0, 200)}`);
  }

  const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response");

  let cleaned = content.trim();
  const m = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/s);
  if (m?.[1]) cleaned = m[1].trim();

  const parsed = JSON.parse(cleaned) as Record<string, string>;
  const result = new Map<string, string>();
  for (const [k, v] of Object.entries(parsed)) {
    const idx = Number(k);
    if (!isNaN(idx) && idx < strings.length) {
      if (v !== strings[idx]!) result.set(strings[idx]!, v);
    }
  }
  return result;
}

/* ── Main ── */
async function main() {
  console.log("═══ DeepSeek Bulk i18n Translation ═══\n");

  const { slots, srcByKey, localeByKey } = collectSlots();
  const schemaCount = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json")).length;
  console.log(`Schemas: ${schemaCount} | Slots needing translation: ${slots.length}\n`);

  if (slots.length === 0) { console.log("✅ All translated."); return; }

  let totalApplied = 0;
  let apiCalls = 0;

  for (const locale of TARGET_LOCALES) {
    const localeSlots = slots.filter((s) => localeByKey.has(`${s.filePath}||${s.jsonPath}||${locale}`));
    const uniqueSrc = [...new Set(localeSlots.map((s) => srcByKey.get(`${s.filePath}||${s.jsonPath}||${locale}`) ?? ""))].filter(Boolean);

    console.log(`── [${locale}] ${LOCALE_NAMES[locale]} — ${localeSlots.length} slots, ${uniqueSrc.length} unique strings ──`);

    for (let i = 0; i < uniqueSrc.length; i += BATCH_SIZE) {
      const batch = uniqueSrc.slice(i, i + BATCH_SIZE);

      try {
        const translationMap = await translateBatch(batch, locale);
        apiCalls++;

        // Group changes by file
        const fileChanges = new Map<string, Map<string, string>>(); // filePath → { jsonPath||locale → value }

        for (const slot of localeSlots) {
          const key = `${slot.filePath}||${slot.jsonPath}||${locale}`;
          const src = srcByKey.get(key);
          if (!src) continue;
          const translated = translationMap.get(src);
          if (!translated || translated === src) continue;

          const compoundKey = `${slot.jsonPath}||${locale}`;
          let entry = fileChanges.get(slot.filePath);
          if (!entry) { entry = new Map(); fileChanges.set(slot.filePath, entry); }
          entry.set(compoundKey, translated);
        }

        const applied = applyChanges(fileChanges);
        totalApplied += applied;

        const pct = Math.round(((i + batch.length) / uniqueSrc.length) * 100);
        console.log(`  ${pct}% | batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueSrc.length / BATCH_SIZE)} | +${applied} (API #${apiCalls})`);

        await new Promise((r) => setTimeout(r, 1000));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  ERROR batch ${Math.floor(i / BATCH_SIZE) + 1}: ${msg.slice(0, 150)}`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }

  console.log(`\n\n═══ SUMMARY ═══`);
  console.log(`  API calls:  ${apiCalls}`);
  console.log(`  Applied:    ${totalApplied}`);

  if (totalApplied === 0) { console.log("\n⚠️  No translations applied."); process.exit(1); }

  console.log("\n✅ Done. Run 'npm run audit:schema-field-i18n' to verify.");
}

main().catch((err) => { console.error("FATAL:", err); process.exit(1); });
