#!/usr/bin/env npx tsx
/**
 * Deterministic stub schemas for batch list entries (no DeepSeek).
 * Produces working free calculators with 6-locale i18n placeholders.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import {
  defaultListFilePath,
  parseCalculatorListEntries,
  resolveSectionCategory,
  type CalculatorListEntry,
} from "./parse-calculator-list";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"] as const;

type LocaleMap = Record<(typeof LOCALES)[number], string>;

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

function i18nMap(name: string): LocaleMap {
  return { en: name } as LocaleMap;
}

function buildStubSchema(entry: CalculatorListEntry): Record<string, unknown> {
  const category = resolveSectionCategory(entry.section);
  const isConversion = category === "conversion";
  const isHealth = category === "health-body";
  const isFinance = category === "finance-business";

  const inputs = isConversion
    ? [
        {
          id: "value",
          label: "Value",
          label_i18n: i18nMap("Value"),
          type: "number",
          unit: "unit",
          default: 1,
          businessContext: "Amount to convert.",
          businessContext_i18n: i18nMap("Amount to convert."),
        },
      ]
    : [
        {
          id: "primary_value",
          label: "Primary value",
          label_i18n: i18nMap("Primary value"),
          type: "number",
          unit: isFinance ? "USD" : isHealth ? "kg" : "unit",
          default: 100,
          businessContext: `Primary input for ${entry.name}.`,
          businessContext_i18n: i18nMap(`Primary input for ${entry.name}.`),
        },
        {
          id: "secondary_value",
          label: "Secondary value",
          label_i18n: i18nMap("Secondary value"),
          type: "number",
          unit: isFinance ? "%" : "unit",
          default: isFinance ? 5 : 10,
          businessContext: `Secondary input for ${entry.name}.`,
          businessContext_i18n: i18nMap(`Secondary input for ${entry.name}.`),
        },
        {
          id: "tertiary_value",
          label: "Tertiary value",
          label_i18n: i18nMap("Tertiary value"),
          type: "number",
          unit: "unit",
          default: 1,
          businessContext: `Optional modifier for ${entry.name}.`,
          businessContext_i18n: i18nMap(`Optional modifier for ${entry.name}.`),
        },
      ];

  const formulas = isConversion
    ? { result: "value * 1" }
    : {
        result: "primary_value * (1 + secondary_value / 100) / tertiary_value",
        ratio: "secondary_value / tertiary_value",
      };

  return {
    slug: entry.slug,
    toolName: entry.slug,
    catalogCategory: category,
    meta: {
      name: titleCase(entry.name),
      version: "1.0.0",
      description: `Free ${entry.name} estimate. Technical simulation only; verify before decisions.`,
      premiumRequired: false,
      premiumFeatures: [],
    },
    premiumRequired: false,
    premiumFeatures: [],
    inputs,
    formulas,
    validation: { rules: [], thresholds: {} },
    outputs: {
      primary: "result",
      breakdown: Object.fromEntries(Object.keys(formulas).map((k) => [k, k.replace(/_/g, " ")])),
      hiddenLossDrivers: [],
      suggestedActions: ["Verify inputs before business or health decisions."],
      dataConfidenceAdjusted: "result",
    },
  };
}

function parseCliLimit(argv: readonly string[]): number | null {
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--limit") return Number(argv[i + 1]);
    if (argv[i]?.startsWith("--limit=")) return Number(argv[i].slice(8));
  }
  return null;
}

function main(): void {
  loadEnvLocal();
  const argv = process.argv.slice(2);
  const limit = parseCliLimit(argv);
  const force = argv.includes("--force");
  let entries = parseCalculatorListEntries(defaultListFilePath());
  if (limit) entries = entries.slice(0, limit);
  if (!fs.existsSync(SCHEMAS_DIR)) fs.mkdirSync(SCHEMAS_DIR, { recursive: true });

  let written = 0;
  let skip = 0;
  for (const entry of entries) {
    const out = path.join(SCHEMAS_DIR, `${entry.slug}-schema.json`);
    if (!force && fs.existsSync(out)) {
      skip += 1;
      continue;
    }
    fs.writeFileSync(out, `${JSON.stringify(buildStubSchema(entry), null, 2)}\n`);
    written += 1;
  }
  console.log(`stub schemas written=${written} skip=${skip} total=${entries.length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
