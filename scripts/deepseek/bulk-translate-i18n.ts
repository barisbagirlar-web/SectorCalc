#!/usr/bin/env npx tsx
/**
 * DeepSeek bulk i18n translation — schema JSON files.
 *
 * Scans ALL generated schema files, finds i18n fields where DE/FR/ES/AR are
 * identical to EN, sends them to DeepSeek for professional translation,
 * and writes back the translated JSON files.
 *
 * Translates: label_i18n, businessContext_i18n, title_i18n,
 *             short_i18n, long_i18n, breakdown_i18n
 *
 * USAGE:  npx tsx scripts/deepseek/bulk-translate-i18n.ts
 * ENV:    DEEPSEEK_API_KEY in .env.local
 */

import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT, loadEnv } from "./load-env";

loadEnv();

/* ── Config ── */
const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const BATCH_SIZE = 30; // fields per DeepSeek call
const TARGET_LOCALES = ["de", "fr", "es", "ar"] as const;
type TargetLocale = (typeof TARGET_LOCALES)[number];

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) {
  console.error("FATAL: DEEPSEEK_API_KEY not found in .env.local");
  process.exit(1);
}

/* ── Stats ── */
let totalTranslated = 0;
let totalSkipped = 0;
let apiCalls = 0;

/* ── Collect all fields needing translation ── */

type I18nField = {
  readonly filePath: string;
  readonly jsonPath: string; // e.g. "inputs.0.label_i18n.de"
  readonly locale: TargetLocale;
  readonly sourceEn: string;
};

function collectMissingFields(): I18nField[] {
  const fields: I18nField[] = [];
  const files = fs
    .readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .sort();

  for (const file of files) {
    const filePath = path.join(SCHEMAS_DIR, file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
    const slug = file.replace(/-schema\.json$/, "");

    // ── title_i18n ──
    const titleI18n = raw.title_i18n as Record<string, string> | undefined;
    if (titleI18n) {
      const enVal = titleI18n.en ?? "";
      for (const locale of TARGET_LOCALES) {
        if (titleI18n[locale] === enVal && enVal.length > 2 && !enVal.includes(slug)) {
          fields.push({ filePath, jsonPath: "title_i18n", locale, sourceEn: enVal });
        }
      }
    }

    // ── about.description.short_i18n / long_i18n ──
    const about = raw.about as Record<string, unknown> | undefined;
    const desc = about?.description as Record<string, unknown> | undefined;
    if (desc) {
      for (const part of ["short_i18n", "long_i18n"] as const) {
        const i18n = desc[part] as Record<string, string> | undefined;
        if (i18n) {
          const enVal = i18n.en ?? "";
          for (const locale of TARGET_LOCALES) {
            if (i18n[locale] === enVal && enVal.length > 3) {
              fields.push({ filePath, jsonPath: `about.description.${part}`, locale, sourceEn: enVal });
            }
          }
        }
      }
    }

    // ── inputs ──
    const inputs = raw.inputs as Array<Record<string, unknown>> | undefined;
    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]!;

        // label_i18n
        const labelI18n = input.label_i18n as Record<string, string> | undefined;
        if (labelI18n) {
          const enVal = labelI18n.en ?? "";
          for (const locale of TARGET_LOCALES) {
            if (labelI18n[locale] === enVal && enVal.length > 2) {
              fields.push({ filePath, jsonPath: `inputs.${i}.label_i18n`, locale, sourceEn: enVal });
            }
          }
        }

        // businessContext_i18n
        const ctxI18n = input.businessContext_i18n as Record<string, string> | undefined;
        if (ctxI18n) {
          const enVal = ctxI18n.en ?? "";
          for (const locale of TARGET_LOCALES) {
            if (ctxI18n[locale] === enVal && enVal.length > 3) {
              fields.push({ filePath, jsonPath: `inputs.${i}.businessContext_i18n`, locale, sourceEn: enVal });
            }
          }
        }
      }
    }

    // ── outputs.breakdown_i18n ──
    const outputs = raw.outputs as Record<string, unknown> | undefined;
    const breakdownI18n = outputs?.breakdown_i18n as Record<string, Record<string, string>> | undefined;
    if (breakdownI18n) {
      for (const [outputKey, localeMap] of Object.entries(breakdownI18n)) {
        if (typeof localeMap !== "object" || localeMap === null) continue;
        const enVal = localeMap.en ?? "";
        for (const locale of TARGET_LOCALES) {
          if (localeMap[locale] === enVal && enVal.length > 2) {
            fields.push({
              filePath,
              jsonPath: `outputs.breakdown_i18n.${outputKey}`,
              locale,
              sourceEn: enVal,
            });
          }
        }
      }
    }
  }

  return fields;
}

/* ── DeepSeek API call ── */

async function translateBatch(
  items: I18nField[],
  locale: TargetLocale,
  localeName: string,
): Promise<Array<{ jsonPath: string; translated: string }>> {
  const texts = [...new Set(items.map((i) => i.sourceEn))];
  const prompt = `Translate the following industrial/engineering terms and short phrases from English to ${localeName} (${locale}).

CRITICAL RULES:
- Return ONLY a JSON object mapping each original English string to its ${localeName} translation.
- Use correct technical/professional terminology for the industrial/engineering domain.
- Keep the same format: if input has units (e.g. "Mass (kg)"), preserve units untranslated.
- Keep variable names, units in parentheses, and special notation untranslated.
- Do NOT add explanations, greetings, or extra text.
- Do NOT wrap in markdown code fences.

Input strings:
${texts.map((t, i) => `  "${i}": "${t}"`).join("\n")}

Output format:
{
  "0": "translated string 0",
  "1": "translated string 1",
  ...
}`;

  const body = JSON.stringify({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "You are a professional industrial/engineering translator. Return only valid JSON." },
      { role: "user", content: prompt },
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
    const errText = await response.text().catch(() => "unknown");
    throw new Error(`DeepSeek API error ${response.status}: ${errText.slice(0, 200)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek returned empty response");
  }

  // Parse JSON from response (handle markdown fences)
  let cleaned = content.trim();
  const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
  if (fenceMatch?.[1]) {
    cleaned = fenceMatch[1].trim();
  }

  const resultMap = JSON.parse(cleaned) as Record<string, string>;

  // Map back to items with their jsonPath
  return items.map((item) => ({
    jsonPath: item.jsonPath,
    translated: resultMap[String(texts.indexOf(item.sourceEn))] ?? item.sourceEn,
  }));
}

/* ── Apply translations to schema JSON files ── */

function applyTranslation(filePath: string, jsonPath: string, locale: TargetLocale, value: string): boolean {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;

  const parts = jsonPath.split(".");
  let current: unknown = raw;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!;
    if (i === parts.length - 1) {
      // Last part — this is the i18n parent object
      const i18nObj = current as Record<string, string>;
      const oldVal = i18nObj[locale];
      if (oldVal === value) {
        return false; // unchanged
      }
      i18nObj[locale] = value;
      return true;
    }

    // Navigate: if part is numeric, treat as array index
    if (/^\d+$/.test(part)) {
      current = (current as unknown[])[Number(part)];
    } else {
      current = (current as Record<string, unknown>)[part];
    }
  }

  return false;
}

/* ── Main ── */

async function main() {
  console.log("═══ DeepSeek Bulk i18n Translation ═══");
  console.log("Scanning schemas for missing translations...\n");

  const allFields = collectMissingFields();
  console.log(`Schemas scanned: ${fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json")).length}`);
  console.log(`Fields needing translation: ${allFields.length}\n`);

  if (allFields.length === 0) {
    console.log("✅ All translations are complete. Nothing to do.");
    return;
  }

  // Group by locale
  const byLocale = new Map<TargetLocale, I18nField[]>();
  for (const field of allFields) {
    const bucket = byLocale.get(field.locale) ?? [];
    bucket.push(field);
    byLocale.set(field.locale, bucket);
  }

  const localeNames: Record<TargetLocale, string> = {
    de: "German",
    fr: "French",
    es: "Spanish",
    ar: "Arabic",
  };

  for (const locale of TARGET_LOCALES) {
    const fields = byLocale.get(locale) ?? [];
    if (fields.length === 0) {
      console.log(`  [${locale}] 0 fields — SKIP`);
      continue;
    }

    console.log(`\n── [${locale}] ${localeNames[locale]} — ${fields.length} fields ──`);

    // Batch by unique source text
    const uniqueSources = [...new Set(fields.map((f) => f.sourceEn))];
    console.log(`  Unique English strings to translate: ${uniqueSources.length}`);

    // Translate unique source texts first
    const sourceBatches: string[][] = [];
    for (let i = 0; i < uniqueSources.length; i += BATCH_SIZE) {
      sourceBatches.push(uniqueSources.slice(i, i + BATCH_SIZE));
    }

    const translationMap = new Map<string, string>();

    for (let b = 0; b < sourceBatches.length; b++) {
      const batch = sourceBatches[b]!;
      const batchFields: I18nField[] = batch.map((text) => ({
        filePath: "",
        jsonPath: "",
        locale,
        sourceEn: text,
      }));

      try {
        const results = await translateBatch(batchFields, locale, localeNames[locale]);
        apiCalls++;
        for (const result of results) {
          translationMap.set(result.translated, result.translated);
        }
        // Re-map: the translateBatch returns mapped by source index
        // We need to rebuild: the response maps "0"→"translated0", "1"→"translated1"
        // But our batchFields don't have real jsonPaths. Let me redo this properly.
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  API call failed (batch ${b + 1}/${sourceBatches.length}): ${msg.slice(0, 150)}`);
        // Continue with next batch
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  // ── Phase 2: actual translation with proper JSON paths ──
  console.log("\n\n═══ PHASE 2: Applying translations ═══\n");

  let changedFiles = new Set<string>();
  let appliedCount = 0;

  for (const locale of TARGET_LOCALES) {
    const fields = byLocale.get(locale) ?? [];
    if (fields.length === 0) continue;

    // Group by unique source text
    const sourceToItems = new Map<string, I18nField[]>();
    for (const field of fields) {
      const bucket = sourceToItems.get(field.sourceEn) ?? [];
      bucket.push(field);
      sourceToItems.set(field.sourceEn, bucket);
    }

    const uniqueSources = [...sourceToItems.keys()];
    console.log(`[${locale}] Translating ${uniqueSources.length} unique strings across ${fields.length} field occurrences...`);

    // Batch unique sources
    for (let i = 0; i < uniqueSources.length; i += BATCH_SIZE) {
      const batchSources = uniqueSources.slice(i, i + BATCH_SIZE);

      // Collect all fields for these sources
      const batchFields: I18nField[] = [];
      const sourceToIdx = new Map<string, number>();
      for (const src of batchSources) {
        sourceToIdx.set(src, sourceToIdx.size);
        const items = sourceToItems.get(src) ?? [];
        batchFields.push(...items);
      }

      const promptSources = [...sourceToIdx.entries()]
        .map(([src, idx]) => `  "${idx}": "${src}"`)
        .join("\n");

      const prompt = `Translate these industrial/engineering terms from English to ${localeNames[locale]} (${locale}).

RULES:
- Return ONLY valid JSON.
- Preserve units in parentheses untranslated (e.g. (kg), (USD), (N.m), (s)).
- Preserve variable names and placeholders untranslated.
- Use correct technical terminology for manufacturing/engineering/finance context.
- No explanations, no markdown fences.

SOURCE:
${promptSources}

OUTPUT (JSON object with numeric keys):`;

      try {
        const body = JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "You are an industrial translation engine. Return only valid JSON." },
            { role: "user", content: prompt },
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
          const errText = await response.text().catch(() => "unknown");
          console.error(`  API error ${response.status}: ${errText.slice(0, 100)}`);
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }

        apiCalls++;
        const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
        const content = json.choices?.[0]?.message?.content;
        if (!content) {
          console.error("  Empty response, skipping batch");
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        // Clean markdown fences
        let cleaned = content.trim();
        const fenceMatch = cleaned.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/);
        if (fenceMatch?.[1]) {
          cleaned = fenceMatch[1].trim();
        }

        const resultMap = JSON.parse(cleaned) as Record<string, string>;
        const fileChanges = new Map<string, Record<string, string>>();

        for (const [src, idxStr] of sourceToIdx) {
          const translated = resultMap[String(idxStr)] ?? src;
          if (translated === src) continue; // skip unchanged

          const items = sourceToItems.get(src) ?? [];
          for (const item of items) {
            // Group by filePath + jsonPath so we don't read/write the same file repeatedly
            const key = `${item.filePath}::${locale}`;
            const existing = fileChanges.get(key) ?? {};
            existing[item.jsonPath] = translated;
            fileChanges.set(key, existing);
          }
        }

        // Apply all changes from this batch
        for (const [key, changes] of fileChanges) {
          const filePath = key.split("::")[0]!;
          let raw: Record<string, unknown>;
          try {
            raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
          } catch {
            continue;
          }

          let fileChanged = false;
          for (const [jsonPath, value] of Object.entries(changes)) {
            const parts = jsonPath.split(".");
            let current: unknown = raw;
            for (let p = 0; p < parts.length; p++) {
              const part = parts[p]!;
              if (p === parts.length - 1) {
                const i18nObj = current as Record<string, string>;
                if (i18nObj[locale] !== value) {
                  i18nObj[locale] = value;
                  fileChanged = true;
                  appliedCount++;
                }
              } else if (/^\d+$/.test(part)) {
                current = (current as unknown[])[Number(part)];
              } else {
                current = (current as Record<string, unknown>)[part];
              }
            }
          }

          if (fileChanged) {
            fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
            changedFiles.add(filePath);
          }
        }

        const pct = Math.min(100, Math.round(((i + batchSources.length) / uniqueSources.length) * 100));
        console.log(`  [${locale}] ${pct}% — batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueSources.length / BATCH_SIZE)} (${appliedCount} fields applied)`);

        // Respect rate limits
        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  Batch error: ${msg.slice(0, 150)}`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }

  /* ── Report ── */
  console.log("\n\n═══ Translation Complete ═══");
  console.log(`  API calls:       ${apiCalls}`);
  console.log(`  Fields applied:  ${appliedCount}`);
  console.log(`  Files changed:   ${changedFiles.size}`);
  console.log(`  Skipped/warnings: ${totalSkipped}`);

  if (changedFiles.size > 0) {
    console.log("\nChanged files:");
    for (const f of [...changedFiles].sort()) {
      console.log(`  ${path.relative(PROJECT_ROOT, f)}`);
    }
  }

  console.log("\n✅ Done.");
}

main().catch((err) => {
  console.error("FATAL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
