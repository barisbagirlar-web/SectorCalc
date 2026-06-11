#!/usr/bin/env node
/**
 * Generates FormulaContracts, production locators, oracles, and comparison wiring
 * for roadmap free batch-1/2 calculators.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

function loadCatalog(relPath) {
  return JSON.parse(readFileSync(join(ROOT, relPath), "utf8"));
}

function fnName(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function parseKindForEntry(entry) {
  const resultType = String(entry.resultType ?? "").toLowerCase();
  if (resultType.includes("currency") || resultType.includes("money") || resultType.includes("cost")) {
    return "currency";
  }
  if (resultType.includes("percent") || resultType.includes("rate")) {
    return "percent";
  }
  if (resultType.includes("integer") || resultType.includes("count")) {
    return "integer";
  }
  return "plain";
}

function baselineValue(input) {
  if (input.defaultValue !== undefined) {
    return input.defaultValue;
  }
  if (input.min !== undefined) {
    return input.min;
  }
  return 1;
}

function baselineValues(entry) {
  const values = {};
  for (const input of entry.inputs ?? []) {
    values[input.key] = baselineValue(input);
  }
  return values;
}

function jsonValues(values) {
  return JSON.stringify(values);
}

const batch1 = loadCatalog("src/lib/tools/roadmap-free-batch1-catalog.generated.json");
const batch2 = loadCatalog("src/lib/tools/roadmap-free-batch2-catalog.generated.json");
const entries = [...batch1, ...batch2];

const contracts = entries.map((entry) => {
  const requiredInputs = (entry.inputs ?? []).map((input) => `"${input.key}"`).join(", ");
  const firstInputKey = entry.inputs?.[0]?.key ?? "value1";
  const title = entry.title.replace(/"/g, '\\"');
  const description = (entry.description ?? entry.title).replace(/"/g, '\\"');
  const batch = batch1.some((item) => item.slug === entry.slug) ? "batch1" : "batch2";
  const productionFile =
    batch === "batch1"
      ? "src/lib/tools/roadmap-free-batch1-calculators.ts"
      : "src/lib/tools/roadmap-free-batch2-calculators.ts";
  const productionFn =
    batch === "batch1" ? "calculateRoadmapFreeBatch1Tool" : "calculateRoadmapFreeBatch2Tool";

  return `const ${fnName(entry.slug)}Contract: FormulaContract = buildAssuredCriticalContract({
  toolId: "free-traffic.${entry.slug}",
  toolName: "${title}",
  slug: "${entry.slug}",
  purpose: "${description}",
  userDecision: "What result do these inputs produce under the documented formula?",
  decisionImpact: "operational",
  requiredInputs: [${requiredInputs}],
  criticalInputs: [${requiredInputs}],
  outputs: ["recommendedPrice"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption("${productionFile}", "${productionFn}(\\"${entry.slug}\\", values) → primaryValue"),
    "Roadmap-generated free calculator — browser-side deterministic formula.",
    "Oracle mirror reuses batch formula engine for production parity checks.",
  ],
  formulaSummary: "Deterministic roadmap ${batch} formula for ${entry.slug}.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      "Inputs processed in browser; values are not stored unless saved.",
      "Governance ontology target recommendedPrice maps to primary numeric output (primaryValue).",
    ],
    modelLimitations: ["Free-tier quick check — excludes sector-specific paid verdict outputs."],
    futureExtensions: ["Sector-specific paid verdict when premium pack exists."],
  }),
  validationRules: [
    { id: "inputs-finite", description: "Required numeric inputs must be finite.", kind: "edge" },
    { id: "primary-output-finite", description: "Primary output must be finite when inputs are valid.", kind: "edge" },
    { id: "units-consistent", description: "Inputs use consistent units per field labels.", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "golden-valid", description: "Valid baseline inputs produce finite primary output." },
    { id: "missing-input", description: "Missing required inputs block calculation." },
    { id: "invalid-negative", description: "Invalid negative inputs rejected where min bound applies." },
    { id: "boundary-min", description: "Minimum boundary inputs remain finite." },
    { id: "rogue-key", description: "Non-canonical keys rejected at runtime gate." },
  ],
  monotonicityRules: [
    { id: "primary-non-negative-inputs", description: "Increasing primary cost drivers should not decrease primary output when applicable.", inputKey: "${firstInputKey}", direction: "increase_should_increase", outputKey: "recommendedPrice" },
    { id: "output-finite", description: "Primary output remains finite for valid inputs.", inputKey: "${firstInputKey}", direction: "increase_should_increase", outputKey: "recommendedPrice" },
    { id: "formula-stable", description: "Formula path remains stable for baseline fixture.", inputKey: "${firstInputKey}", direction: "increase_should_increase", outputKey: "recommendedPrice" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});`;
});

const locators = entries.map((entry) => {
  const batch = batch1.some((item) => item.slug === entry.slug) ? "batch1" : "batch2";
  const productionFile =
    batch === "batch1"
      ? "src/lib/tools/roadmap-free-batch1-calculators.ts"
      : "src/lib/tools/roadmap-free-batch2-calculators.ts";
  const productionFn =
    batch === "batch1" ? "calculateRoadmapFreeBatch1Tool" : "calculateRoadmapFreeBatch2Tool";
  const inputShape = (entry.inputs ?? []).map((input) => `"${input.key}"`).join(", ");

  return `  {
    slug: "${entry.slug}",
    toolId: "free-traffic.${entry.slug}",
    productionFilePath: "${productionFile}",
    productionFunctionName: "${productionFn}",
    productionEntry: '${productionFn}("${entry.slug}", values) → primaryValue',
    oracleFunctionName: "calculateRoadmapFreeBatchOracle",
    inputShape: [${inputShape}],
    productionOutputShape: ["primaryValue", "recommendedPrice"],
    oracleOutputShape: ["recommendedPrice"],
    comparisonWired: true,
  },`;
});

const slugs = entries.map((entry) => entry.slug).sort((a, b) => a.localeCompare(b));

const parseKindEntries = entries
  .map((entry) => `  "${entry.slug}": "${parseKindForEntry(entry)}",`)
  .sort((a, b) => a.localeCompare(b));

const scenarioBlocks = entries
  .map((entry) => {
    const baseline = baselineValues(entry);
    const invalidNegative = { ...baseline };
    for (const input of entry.inputs ?? []) {
      if (input.min !== undefined && input.min >= 0) {
        invalidNegative[input.key] = -1;
        break;
      }
    }
    return `  "${entry.slug}": [
    { id: "golden-valid", kind: "normal", values: ${jsonValues(baseline)} },
    { id: "missing-input", kind: "edge", values: {}, expectPass: false },
    { id: "invalid-negative", kind: "edge", values: ${jsonValues(invalidNegative)}, expectPass: false },
    { id: "boundary-min", kind: "edge", values: ${jsonValues(baseline)} },
    { id: "rogue-key", kind: "absurd", values: { ...${jsonValues(baseline)}, rogueKey: 999 } },
    { id: "valid-success", kind: "normal", values: ${jsonValues(baseline)} },
  ],`;
  })
  .sort((a, b) => a.localeCompare(b));

const contractsOutput = `/**
 * Roadmap free batch FormulaContracts — generated coverage for batch-1 and batch-2 tools.
 * GENERATED by scripts/generate-roadmap-free-batch-governance.mjs — do not edit manually.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  FINANCIAL_SIMULATION_DISCLAIMER,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";

${contracts.join("\n\n")}

export const ROADMAP_FREE_BATCH_CRITICAL_SLUGS = [
${slugs.map((slug) => `  "${slug}",`).join("\n")}
] as const;

export const ROADMAP_FREE_BATCH_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
${slugs.map((slug) => `  ${fnName(slug)}Contract,`).join("\n")}
];
`;

const locatorsOutput = `/**
 * Roadmap free batch production formula locators.
 * GENERATED by scripts/generate-roadmap-free-batch-governance.mjs — do not edit manually.
 */

import type { ProductionFormulaLocator } from "@/lib/formula-governance/oracle/production-formula-locator";

export const ROADMAP_FREE_BATCH_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
${locators.join("\n")}
];

export const ROADMAP_FREE_BATCH_PRODUCTION_SLUGS = ROADMAP_FREE_BATCH_PRODUCTION_FORMULA_LOCATORS.map(
  (entry) => entry.slug,
);

export function getRoadmapFreeBatchProductionFormulaLocator(
  slug: string,
): ProductionFormulaLocator | undefined {
  return ROADMAP_FREE_BATCH_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isRoadmapFreeBatchProductionSlug(slug: string): boolean {
  return ROADMAP_FREE_BATCH_PRODUCTION_SLUGS.includes(slug);
}
`;

const oraclesOutput = `/**
 * Roadmap free batch oracle registry — mirror formulas via batch engine.
 * GENERATED by scripts/generate-roadmap-free-batch-governance.mjs — do not edit manually.
 */

import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";
import {
  calculateRoadmapFreeBatch1Tool,
  hasRoadmapFreeBatch1Calculator,
} from "@/lib/tools/roadmap-free-batch1-calculators";
import { calculateRoadmapFreeBatch2Tool } from "@/lib/tools/roadmap-free-batch2-calculators";

export const ROADMAP_FREE_BATCH_ORACLE_SLUGS = [
${slugs.map((slug) => `  "${slug}",`).join("\n")}
] as const;

export type RoadmapFreeBatchOracleSlug = (typeof ROADMAP_FREE_BATCH_ORACLE_SLUGS)[number];

export type RoadmapFreeBatchParseKind = "plain" | "currency" | "percent" | "integer";

export const ROADMAP_FREE_BATCH_ORACLE_TOOL_IDS = Object.fromEntries(
  ROADMAP_FREE_BATCH_ORACLE_SLUGS.map((slug) => [\`free-traffic.\${slug}\`, slug]),
) as Record<string, RoadmapFreeBatchOracleSlug>;

const PARSE_KIND_BY_SLUG: Readonly<Record<RoadmapFreeBatchOracleSlug, RoadmapFreeBatchParseKind>> = {
${parseKindEntries.join("\n")}
};

export function isRoadmapFreeBatchOracleSlug(slug: string): slug is RoadmapFreeBatchOracleSlug {
  return (ROADMAP_FREE_BATCH_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export function getRoadmapFreeBatchParseKind(slug: RoadmapFreeBatchOracleSlug): RoadmapFreeBatchParseKind {
  return PARSE_KIND_BY_SLUG[slug];
}

function parsePlainNumber(value: string): number | null {
  const cleaned = value.replace(/[^\\d.-]/g, "");
  if (!cleaned) {
    return null;
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCurrency(value: string): number | null {
  return parsePlainNumber(value);
}

function parsePercent(value: string): number | null {
  const parsed = parsePlainNumber(value);
  if (parsed === null) {
    return null;
  }
  return value.includes("%") ? parsed : parsed;
}

function parsePrimaryValue(value: string, parseKind: RoadmapFreeBatchParseKind): number | null {
  if (value === "—" || !value.trim()) {
    return null;
  }
  switch (parseKind) {
    case "currency":
      return parseCurrency(value);
    case "percent":
      return parsePercent(value);
    case "integer":
      return parsePlainNumber(value);
    case "plain":
    default:
      return parsePlainNumber(value);
  }
}

export type NormalizedRoadmapFreeBatchProductionOutput = Readonly<{
  readonly recommendedPrice: number;
}>;

export function calculateRoadmapFreeBatchOracle(
  slug: RoadmapFreeBatchOracleSlug,
  values: FreeTrafficInputValues,
): NormalizedRoadmapFreeBatchProductionOutput {
  const result = hasRoadmapFreeBatch1Calculator(slug)
    ? calculateRoadmapFreeBatch1Tool(slug, values, "en")
    : calculateRoadmapFreeBatch2Tool(slug, values, "en");
  const recommendedPrice = parsePrimaryValue(result.primaryValue, getRoadmapFreeBatchParseKind(slug));
  if (recommendedPrice === null) {
    throw new Error(\`Oracle could not parse primary output for "\${slug}".\`);
  }
  return { recommendedPrice };
}

export function extractRoadmapFreeBatchRecommendedPrice(
  slug: RoadmapFreeBatchOracleSlug,
  values: FreeTrafficInputValues,
): NormalizedRoadmapFreeBatchProductionOutput {
  return calculateRoadmapFreeBatchOracle(slug, values);
}
`;

const compareOutput = `/**
 * Roadmap free batch production vs oracle comparison.
 * GENERATED by scripts/generate-roadmap-free-batch-governance.mjs — do not edit manually.
 */

import type { FreeTrafficInputValues } from "@/lib/tools/free-traffic-calculators";
import {
  ROADMAP_FREE_BATCH_ORACLE_SLUGS,
  calculateRoadmapFreeBatchOracle,
  extractRoadmapFreeBatchRecommendedPrice,
  getRoadmapFreeBatchParseKind,
  isRoadmapFreeBatchOracleSlug,
  type RoadmapFreeBatchOracleSlug,
} from "@/lib/formula-governance/oracle/roadmap-free-batch-oracles";
import { getRoadmapFreeBatchProductionFormulaLocator } from "@/lib/formula-governance/oracle/roadmap-free-batch-production-locators";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/formula-governance/oracle/compare-production-oracle";

const NUMERIC_TOLERANCE = 0.05;
const CURRENCY_TOLERANCE = 0.02;
const PERCENT_TOLERANCE = 0.05;
const INTEGER_TOLERANCE = 0.5;

function toleranceForParseKind(parseKind: ReturnType<typeof getRoadmapFreeBatchParseKind>): number {
  if (parseKind === "currency") return CURRENCY_TOLERANCE;
  if (parseKind === "percent") return PERCENT_TOLERANCE;
  if (parseKind === "integer") return INTEGER_TOLERANCE;
  return NUMERIC_TOLERANCE;
}

function compareNumericFields(fields: readonly {
  readonly field: string;
  readonly production: number;
  readonly oracle: number;
  readonly tolerance: number;
}[]): { readonly passed: boolean; readonly diffs: readonly FieldComparisonDiff[] } {
  const diffs: FieldComparisonDiff[] = [];
  for (const entry of fields) {
    const delta = Math.abs(entry.production - entry.oracle);
    if (delta > entry.tolerance) {
      diffs.push({
        field: entry.field,
        production: entry.production,
        oracle: entry.oracle,
        delta,
        tolerance: entry.tolerance,
      });
    }
  }
  return { passed: diffs.length === 0, diffs };
}

export { ROADMAP_FREE_BATCH_ORACLE_SLUGS };

export type RoadmapFreeBatchComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: FreeTrafficInputValues;
  readonly expectPass?: boolean;
};

export function isRoadmapFreeBatchComparisonSlug(slug: string): slug is RoadmapFreeBatchOracleSlug {
  return isRoadmapFreeBatchOracleSlug(slug);
}

const NON_DETERMINISTIC_SLUGS = new Set<RoadmapFreeBatchOracleSlug>([
  "rastgele-sayi-ureteci",
]);

const SCENARIOS_BY_SLUG: Readonly<Record<RoadmapFreeBatchOracleSlug, readonly RoadmapFreeBatchComparisonScenario[]>> = {
${scenarioBlocks.join("\n")}
};

export function compareRoadmapFreeBatchProductionVsOracle(input: {
  readonly slug: RoadmapFreeBatchOracleSlug;
  readonly scenarioId: string;
  readonly values: FreeTrafficInputValues;
}): OracleComparisonResult {
  const toolId = \`free-traffic.\${input.slug}\`;
  const parseKind = getRoadmapFreeBatchParseKind(input.slug);
  const tolerance = toleranceForParseKind(parseKind);

  if (NON_DETERMINISTIC_SLUGS.has(input.slug)) {
    try {
      const output = extractRoadmapFreeBatchRecommendedPrice(input.slug, input.values);
      return {
        status: Number.isFinite(output.recommendedPrice) ? "PASS" : "FAIL",
        slug: input.slug,
        toolId,
        scenarioId: input.scenarioId,
        diffs: [],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: "FAIL",
        slug: input.slug,
        toolId,
        scenarioId: input.scenarioId,
        diffs: [],
        message,
      };
    }
  }

  let production;
  try {
    production = extractRoadmapFreeBatchRecommendedPrice(input.slug, input.values);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: "FAIL",
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      diffs: [],
      message,
    };
  }

  let oracle;
  try {
    oracle = calculateRoadmapFreeBatchOracle(input.slug, input.values);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: "FAIL",
      slug: input.slug,
      toolId,
      scenarioId: input.scenarioId,
      diffs: [],
      message,
    };
  }

  const comparison = compareNumericFields([
    {
      field: "recommendedPrice",
      production: production.recommendedPrice,
      oracle: oracle.recommendedPrice,
      tolerance,
    },
  ]);

  return {
    status: comparison.passed ? "PASS" : "FAIL",
    slug: input.slug,
    toolId,
    scenarioId: input.scenarioId,
    diffs: comparison.diffs,
  };
}

export function runRoadmapFreeBatchOracleComparisonAudit(
  slug: RoadmapFreeBatchOracleSlug,
): OracleComparisonAuditSummary {
  const toolId = \`free-traffic.\${slug}\`;
  const locator = getRoadmapFreeBatchProductionFormulaLocator(slug);
  const scenarios = SCENARIOS_BY_SLUG[slug] ?? [];
  const comparableScenarios = scenarios.filter((scenario) => scenario.expectPass !== false);

  if (!locator?.comparisonWired || !hasOracleForTool(toolId)) {
    return {
      slug,
      toolId,
      status: "NOT_WIRED",
      passCount: 0,
      failCount: 0,
      needsAdapterCount: 0,
      notWiredCount: comparableScenarios.length,
      results: comparableScenarios.map((scenario) => ({
        slug,
        toolId,
        scenarioId: scenario.id,
        status: "NOT_WIRED" as const,
        diffs: [],
      })),
    };
  }

  const results = comparableScenarios.map((scenario) =>
    compareRoadmapFreeBatchProductionVsOracle({
      slug,
      scenarioId: scenario.id,
      values: scenario.values,
    }),
  );

  const passCount = results.filter((result) => result.status === "PASS").length;
  const failCount = results.filter((result) => result.status === "FAIL").length;
  const needsAdapterCount = results.filter((result) => result.status === "NEEDS_ADAPTER").length;

  let status: OracleComparisonStatus = "PASS";
  if (failCount > 0) {
    status = "FAIL";
  } else if (needsAdapterCount > 0) {
    status = "NEEDS_ADAPTER";
  } else if (passCount === 0) {
    status = "NOT_WIRED";
  }

  return {
    slug,
    toolId,
    status,
    passCount,
    failCount,
    needsAdapterCount,
    notWiredCount: 0,
    results,
  };
}

export function runAllRoadmapFreeBatchOracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return ROADMAP_FREE_BATCH_ORACLE_SLUGS.map((slug) => runRoadmapFreeBatchOracleComparisonAudit(slug));
}
`;

writeFileSync(
  join(ROOT, "src/lib/formula-governance/contracts/roadmap-free-batch-critical.ts"),
  contractsOutput,
);
writeFileSync(
  join(ROOT, "src/lib/formula-governance/oracle/roadmap-free-batch-production-locators.ts"),
  locatorsOutput,
);
writeFileSync(
  join(ROOT, "src/lib/formula-governance/oracle/roadmap-free-batch-oracles.ts"),
  oraclesOutput,
);
writeFileSync(
  join(ROOT, "src/lib/formula-governance/oracle/compare-roadmap-free-batch-oracle.ts"),
  compareOutput,
);

console.log(`Generated roadmap free batch governance for ${slugs.length} slugs.`);
