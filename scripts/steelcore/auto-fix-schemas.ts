#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "../deepseek/load-env";
import { deepseekClient } from "../deepseek/deepseek-client";
import {
  applyRuleBasedSchemaFix,
  autoFixSchemas,
  listSchemaFiles,
  SCHEMAS_DIR,
  validateSchemaRecord,
} from "@/lib/steelcore";
import { mergeAiSchemaRepair, normalizeSchemaMechanically, parseAiSchemaJson } from "@/lib/steelcore/schema-normalizer";

loadEnvLocal();

const AI_CONCURRENCY = Number(process.env.STEELCORE_AI_CONCURRENCY ?? "3");
const schemasDir = path.join(process.cwd(), SCHEMAS_DIR);

async function fixSchemaWithAi(
  schema: Record<string, unknown>,
  slug: string,
  errors: readonly string[],
): Promise<Record<string, unknown>> {
  const prompt = `Fix this calculator schema JSON. Output only valid JSON.\n\nSchema:\n${JSON.stringify(schema, null, 2)}\n\nErrors:\n${errors.join("\n")}\n\nRules:\n- toolName stays "${slug}"\n- inputs: 3-8 with id, label, type, unit, default, businessContext\n- formulas compile with input ids\n- outputs.primary references formulas key\n- include validation, premiumFeatures, premiumRequired`;
  const parsed = parseAiSchemaJson(await deepseekClient(prompt));
  const merged = mergeAiSchemaRepair(schema, parsed);

  // Save AI-generated formulas before normalization (which may delete them)
  const aiFormulas =
    parsed.formulas && typeof parsed.formulas === "object" && !Array.isArray(parsed.formulas)
      ? (parsed.formulas as Record<string, string>)
      : null;

  normalizeSchemaMechanically(merged);
  applyRuleBasedSchemaFix(merged, slug);

  // Restore AI-generated formulas that normalization may have deleted
  if (aiFormulas) {
    const currentFormulas =
      merged.formulas && typeof merged.formulas === "object" && !Array.isArray(merged.formulas)
        ? (merged.formulas as Record<string, unknown>)
        : {};
    for (const [key, value] of Object.entries(aiFormulas)) {
      if (!(key in currentFormulas) || currentFormulas[key] === undefined) {
        (currentFormulas as Record<string, string>)[key] = value;
      }
    }
    merged.formulas = currentFormulas;

    // Ensure outputs.primary still references a valid formula key
    const formulaKeys = Object.keys(currentFormulas).filter(
      (k) => typeof currentFormulas[k] === "string",
    );
    const outputs =
      merged.outputs && typeof merged.outputs === "object"
        ? (merged.outputs as Record<string, unknown>)
        : {};
    if (
      typeof outputs.primary !== "string" ||
      !formulaKeys.includes(outputs.primary)
    ) {
      outputs.primary = formulaKeys[formulaKeys.length - 1] ?? "result";
    }
    if (
      typeof outputs.dataConfidenceAdjusted !== "string" ||
      !formulaKeys.includes(outputs.dataConfidenceAdjusted)
    ) {
      outputs.dataConfidenceAdjusted = formulaKeys[formulaKeys.length - 1] ?? "result";
    }
    merged.outputs = outputs;
  }

  return merged;
}

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function run(): Promise<void> {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
  return results;
}

async function main(): Promise<void> {
  const useAi = process.argv.includes("--ai");
  const ruleReport = autoFixSchemas({ onlyInvalid: true });
  console.log(`SteelCore rule-based fix: ${ruleReport.fixed} fixed, ${ruleReport.skipped} skipped`);
  if (!useAi) return;
  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    console.error("DEEPSEEK_API_KEY missing");
    process.exit(1);
  }

  const targets = listSchemaFiles(schemasDir)
    .map((file) => {
      const filePath = path.join(schemasDir, file);
      const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
      const validation = validateSchemaRecord(schema, file);
      if (validation.valid) return null;
      return {
        file,
        filePath,
        slug: validation.slug,
        errors: validation.issues.map((issue) => `[${issue.layer}] ${issue.message}`),
        beforeStatus: validation.trustStatus,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  console.log(`AI repair queue: ${targets.length} schemas`);
  let aiFixed = 0;
  let aiFailed = 0;

  await mapWithConcurrency(targets, AI_CONCURRENCY, async (target) => {
    try {
      const original = JSON.parse(fs.readFileSync(target.filePath, "utf8")) as Record<string, unknown>;
      const repaired = await fixSchemaWithAi(original, target.slug, target.errors);
      fs.writeFileSync(target.filePath, `${JSON.stringify(repaired, null, 2)}\n`);
      const after = validateSchemaRecord(repaired, target.file);
      if (after.valid) {
        aiFixed += 1;
        console.log(`AI fixed: ${target.slug}`);
      } else {
        aiFailed += 1;
        console.warn(`AI fix incomplete: ${target.slug}`);
      }
    } catch (error) {
      aiFailed += 1;
      console.warn(`AI fix failed for ${target.slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  console.log(`SteelCore AI fix complete: ${aiFixed} repaired, ${aiFailed} failed.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
