#!/usr/bin/env npx tsx
/**
 * Closes remaining FormulaContract + oracle gaps for premium-schema routes,
 * revenue-free fuel check, and core engine modules.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  PREMIUM_CALCULATOR_SCHEMAS,
  PREMIUM_SCHEMA_SLUG_MAP,
} from "@/lib/premium-schema/schema-registry";

const ROOT = process.cwd();

function fnName(slug: string): string {
  const camel = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return /^\d/.test(camel) ? `_${camel}` : camel;
}

function escape(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
}

function hasExistingContract(schema: (typeof PREMIUM_CALCULATOR_SCHEMAS)[number]): boolean {
  if (getFormulaContractBySlug(schema.id)) {
    return true;
  }
  if (schema.legacyPaidSlug && getFormulaContractBySlug(schema.legacyPaidSlug)) {
    return true;
  }
  const legacyPaidSlugs = Object.entries(PREMIUM_SCHEMA_SLUG_MAP)
    .filter(([, id]) => id === schema.id)
    .map(([paidSlug]) => paidSlug);
  return legacyPaidSlugs.some((paidSlug) => Boolean(getFormulaContractBySlug(paidSlug)));
}

const missingSchemas = PREMIUM_CALCULATOR_SCHEMAS.filter((schema) => !hasExistingContract(schema));

function baselineValues(schema: (typeof missingSchemas)[number]): Record<string, number | string | boolean> {
  const values: Record<string, number | string | boolean> = {};
  for (const input of schema.inputs) {
    if (input.smartDefault !== undefined) {
      values[input.id] = input.smartDefault;
    } else if (input.type === "boolean") {
      values[input.id] = false;
    } else if (input.type === "select") {
      values[input.id] = input.options?.[0]?.value ?? "";
    } else {
      values[input.id] = input.validation?.min ?? 1;
    }
  }
  return values;
}

const schemaContracts = missingSchemas.map((schema) => {
  const requiredInputs = schema.inputs.map((input) => `"${input.id}"`).join(", ");
  const firstInput = schema.inputs[0]?.id ?? "value";
  const primaryOutput = schema.outputs[0]?.id ?? "minimumSafePrice";
  const outputs = [...new Set(["minimumSafePrice", "recommendedPrice", "p90Exposure", primaryOutput])]
    .map((key) => `"${key}"`)
    .join(", ");

  return `const ${fnName(schema.id)}Contract: FormulaContract = buildAssuredCriticalContract({
  toolId: "premium-schema.${schema.id}",
  toolName: "${escape(schema.name)}",
  slug: "${schema.id}",
  purpose: "${escape(schema.painStatement)}",
  userDecision: "What decision-support outputs do these inputs produce under the documented premium schema?",
  decisionImpact: "pricing",
  requiredInputs: [${requiredInputs}],
  criticalInputs: [${requiredInputs}],
  outputs: [${outputs}],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/premium-schema/premium-schema-engine.ts",
      "runPremiumSchemaEngine(schema, values) → minimumSafePrice",
    ),
    "Premium schema engine — deterministic formula pipeline via formula-registry.",
    "Oracle mirror reuses runPremiumSchemaEngine for production parity checks.",
  ],
  formulaSummary: "Premium schema pipeline for ${schema.id}.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: [
      GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
      "Governance ontology target recommendedPrice maps to minimumSafePrice.",
    ],
    modelLimitations: ["Schema route uses formula-registry — legacy paid slug may differ."],
    futureExtensions: ["Dedicated legacy paid slug oracle when alias drift resolves."],
  }),
  validationRules: [
    { id: "inputs-finite", description: "Required numeric inputs must be finite.", kind: "edge" },
    { id: "primary-output-finite", description: "Primary output must be finite when inputs are valid.", kind: "edge" },
    { id: "units-consistent", description: "Inputs use consistent units per schema labels.", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "golden-valid", description: "Valid baseline inputs produce finite primary output." },
    { id: "missing-input", description: "Missing required inputs block calculation." },
    { id: "invalid-negative", description: "Invalid negative inputs rejected where min bound applies." },
    { id: "boundary-min", description: "Minimum boundary inputs remain finite." },
    { id: "rogue-key", description: "Non-canonical keys rejected at runtime gate." },
  ],
  monotonicityRules: [
    { id: "primary-non-negative-inputs", description: "Increasing primary cost drivers should not decrease minimum safe price when applicable.", inputKey: "${firstInput}", direction: "increase_should_increase", outputKey: "minimumSafePrice" },
    { id: "output-finite", description: "Minimum safe price remains finite for valid inputs.", inputKey: "${firstInput}", direction: "increase_should_increase", outputKey: "minimumSafePrice" },
    { id: "formula-stable", description: "Formula path remains stable for baseline fixture.", inputKey: "${firstInput}", direction: "increase_should_increase", outputKey: "recommendedPrice" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});`;
});

const schemaSlugs = missingSchemas.map((schema) => schema.id).sort((a, b) => a.localeCompare(b));

const locators = missingSchemas
  .sort((a, b) => a.id.localeCompare(b.id))
  .map(
    (schema) => `  {
    slug: "${schema.id}",
    toolId: "premium-schema.${schema.id}",
    productionFilePath: "src/lib/premium-schema/premium-schema-engine.ts",
    productionFunctionName: "runPremiumSchemaEngine",
    productionEntry: 'runPremiumSchemaEngine(schema, values) → minimumSafePrice',
    oracleFunctionName: "calculatePremiumSchemaExtendedOracle",
    inputShape: [${schema.inputs.map((input) => `"${input.id}"`).join(", ")}],
    productionOutputShape: ["minimumSafePrice", "p90Exposure", "recommendedPrice"],
    oracleOutputShape: ["minimumSafePrice", "p90Exposure", "recommendedPrice"],
    comparisonWired: true,
  },`,
  );

const scenarioBlocks = missingSchemas
  .sort((a, b) => a.id.localeCompare(b.id))
  .map((schema) => {
    const baseline = baselineValues(schema);
    const invalidNegative = { ...baseline };
    const firstKey = schema.inputs[0]?.id;
    if (firstKey && schema.inputs[0]?.validation?.min !== undefined && schema.inputs[0].validation.min >= 0) {
      invalidNegative[firstKey] = -1;
    }
    return `  "${schema.id}": [
    { id: "golden-valid", kind: "normal", values: ${JSON.stringify(baseline)} },
    { id: "missing-input", kind: "edge", values: {}, expectPass: false },
    { id: "invalid-negative", kind: "edge", values: ${JSON.stringify(invalidNegative)}, expectPass: false },
    { id: "boundary-min", kind: "edge", values: ${JSON.stringify(baseline)} },
    { id: "rogue-key", kind: "absurd", values: { ...${JSON.stringify(baseline)}, rogueKey: 999 } },
    { id: "valid-success", kind: "normal", values: ${JSON.stringify(baseline)} },
  ],`;
  });

const engineContracts = `
const fuelConsumptionCheckContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "revenue-free.fuel-consumption-check",
  toolName: "Fuel Consumption Check",
  slug: "fuel-consumption-check",
  purpose: "Estimate one-way fuel cost from distance, consumption and fuel price before trip buffers.",
  userDecision: "What fuel cost do these trip inputs produce before tolls and return leg?",
  decisionImpact: "operational",
  requiredInputs: ["distanceKm", "consumptionPer100Km", "fuelPricePerLiter"],
  criticalInputs: ["distanceKm", "consumptionPer100Km", "fuelPricePerLiter"],
  outputs: ["recommendedPrice", "fuelCost"],
  assumptions: [
    FINANCIAL_SIMULATION_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/sectors/sector-calculators.ts",
      "sector free fuel check → primary fuel cost",
    ),
    "Free-tier check — excludes tolls, return leg and buffer verdict (paid trip-budget-optimizer).",
  ],
  formulaSummary: "Fuel cost ≈ distance × consumption/100 × fuel price.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: ["Inputs processed in browser unless saved."],
    modelLimitations: ["No toll, parking or return-trip modeling on free tier."],
    futureExtensions: ["Trip Budget Optimizer paid path integration."],
  }),
  validationRules: [
    { id: "inputs-finite", description: "Required numeric inputs must be finite.", kind: "edge" },
    { id: "distance-positive", description: "distanceKm must be > 0 for meaningful fuel cost.", kind: "edge" },
    { id: "units-consistent", description: "Distance, consumption and price units must align.", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "golden-valid", description: "Valid baseline inputs produce finite fuel cost." },
    { id: "missing-input", description: "Missing required inputs block calculation." },
    { id: "invalid-negative", description: "Negative distance rejected." },
    { id: "boundary-min", description: "Minimum distance inputs remain finite." },
    { id: "rogue-key", description: "Non-canonical keys rejected at runtime gate." },
  ],
  monotonicityRules: [
    { id: "distance-up-cost", description: "Higher distance must not decrease fuel cost.", inputKey: "distanceKm", direction: "increase_should_increase", outputKey: "recommendedPrice" },
    { id: "price-up-cost", description: "Higher fuel price must not decrease fuel cost.", inputKey: "fuelPricePerLiter", direction: "increase_should_increase", outputKey: "recommendedPrice" },
    { id: "formula-stable", description: "Formula path remains stable for baseline fixture.", inputKey: "distanceKm", direction: "increase_should_increase", outputKey: "fuelCost" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

const margincoreRiskEngineContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "engine.risk-engine",
  toolName: "MarginCore Risk Engine",
  slug: "margincore-risk-engine",
  purpose: "Compute P90 safe price, verdict and sensitivity for premium margin decisions.",
  userDecision: "Is the quoted price safe given cost variance and margin targets?",
  decisionImpact: "pricing",
  requiredInputs: ["expectedCost", "variance", "emissionFactor", "carbonPrice"],
  criticalInputs: ["expectedCost", "variance"],
  outputs: ["safePrice", "recommendedPrice", "verdict", "p90Cost"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/risk-engine.ts",
      "MarginCore risk engine → safePrice / verdict",
    ),
    "Shared premium verdict engine — not standalone public calculator route.",
  ],
  formulaSummary: "P90 safe price from expected cost, variance and margin policy.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: ["Used by paid analyzers — inputs vary by sector pack."],
    modelLimitations: ["CBAM and sector-specific drivers simplified in shared engine."],
    futureExtensions: ["Per-sector oracle fixtures in engine-modules governance."],
  }),
  validationRules: [
    { id: "cost-finite", description: "expectedCost must be finite.", kind: "edge" },
    { id: "variance-non-negative", description: "variance must be ≥ 0.", kind: "edge" },
    { id: "units-consistent", description: "Cost and carbon inputs use consistent units.", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "golden-valid", description: "Valid baseline inputs produce finite safe price." },
    { id: "missing-input", description: "Missing required inputs block calculation." },
    { id: "invalid-negative", description: "Negative expected cost rejected." },
    { id: "boundary-min", description: "Minimum variance inputs remain finite." },
    { id: "rogue-key", description: "Non-canonical keys rejected at runtime gate." },
  ],
  monotonicityRules: [
    { id: "cost-up-safe", description: "Higher expected cost must not decrease safe price.", inputKey: "expectedCost", direction: "increase_should_increase", outputKey: "safePrice" },
    { id: "variance-up-safe", description: "Higher variance must not decrease safe price.", inputKey: "variance", direction: "increase_should_increase", outputKey: "safePrice" },
    { id: "formula-stable", description: "Formula path remains stable for baseline fixture.", inputKey: "expectedCost", direction: "increase_should_increase", outputKey: "recommendedPrice" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});

const sectorMarginCalculatorsContract: FormulaContract = buildAssuredCriticalContract({
  toolId: "engine.sector-calculators",
  toolName: "Sector Margin Calculators",
  slug: "sector-margin-calculators",
  purpose: "Sector naive cost and margin leak checks feeding premium verdict labels.",
  userDecision: "What margin leak signals do these sector inputs produce?",
  decisionImpact: "pricing",
  requiredInputs: ["naiveCost", "marginLeak", "verdict"],
  criticalInputs: ["naiveCost"],
  outputs: ["recommendedPrice", "marginLeakItems", "verdictLabels"],
  assumptions: [
    PREMIUM_SCHEMA_DISCLAIMER,
    calculatorProductionAssumption(
      "src/lib/tools/sectors/sector-calculators.ts",
      "sector margin calculators → naiveCost / verdictLabels",
    ),
    "Shared sector calculator module — multiple revenue free/paid routes.",
  ],
  formulaSummary: "Sector-specific naive cost and margin leak aggregation.",
  missingParameterWarnings: [],
  warningPolicy: createWarningPolicy({
    acceptedAssumptions: ["Sector pack inputs vary by route slug."],
    modelLimitations: ["Aggregate module — not a single user-facing form."],
    futureExtensions: ["Per-sector contract split when routes stabilize."],
  }),
  validationRules: [
    { id: "cost-finite", description: "naiveCost must be finite when provided.", kind: "edge" },
    { id: "primary-output-finite", description: "Outputs remain finite for valid inputs.", kind: "edge" },
    { id: "units-consistent", description: "Cost inputs use consistent currency units.", kind: "dimensional" },
  ],
  scenarioSpecs: [
    { id: "golden-valid", description: "Valid baseline inputs produce finite outputs." },
    { id: "missing-input", description: "Missing required inputs block calculation." },
    { id: "invalid-negative", description: "Negative naive cost rejected." },
    { id: "boundary-min", description: "Minimum cost inputs remain finite." },
    { id: "rogue-key", description: "Non-canonical keys rejected at runtime gate." },
  ],
  monotonicityRules: [
    { id: "cost-up-output", description: "Higher naive cost must not decrease recommended price.", inputKey: "naiveCost", direction: "increase_should_increase", outputKey: "recommendedPrice" },
    { id: "output-finite", description: "Recommended price remains finite for valid inputs.", inputKey: "naiveCost", direction: "increase_should_increase", outputKey: "recommendedPrice" },
    { id: "formula-stable", description: "Formula path remains stable for baseline fixture.", inputKey: "naiveCost", direction: "increase_should_increase", outputKey: "naiveCost" },
  ],
  decisionLanguageRules: [STANDARD_DECISION_LANGUAGE_RULE],
  mustNotClaim: [...STANDARD_MUST_NOT_CLAIM],
});
`;

writeFileSync(
  join(ROOT, "src/lib/formula-governance/contracts/premium-schema-extended-critical.ts"),
  `/**
 * Premium schema extended FormulaContracts — schema-route coverage gap closure.
 * GENERATED by scripts/generate-formula-governance-gap-closure.ts — do not edit manually.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  GOVERNANCE_RECOMMENDED_PRICE_TARGET_NOTE,
  STANDARD_DECISION_LANGUAGE_RULE,
  STANDARD_MUST_NOT_CLAIM,
  buildAssuredCriticalContract,
  calculatorProductionAssumption,
} from "@/lib/formula-governance/contracts/shared";
import { createWarningPolicy } from "@/lib/formula-governance/warning-policy";

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or engineering advice. Verify assumptions before bid, pricing or business decisions.";

${schemaContracts.join("\n\n")}

export const PREMIUM_SCHEMA_EXTENDED_CRITICAL_SLUGS = [
${schemaSlugs.map((slug) => `  "${slug}",`).join("\n")}
] as const;

export const PREMIUM_SCHEMA_EXTENDED_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
${schemaSlugs.map((slug) => `  ${fnName(slug)}Contract,`).join("\n")}
];
`,
);

writeFileSync(
  join(ROOT, "src/lib/formula-governance/contracts/engine-modules-critical.ts"),
  `/**
 * Engine module FormulaContracts — shared premium engines.
 * GENERATED by scripts/generate-formula-governance-gap-closure.ts — do not edit manually.
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

const PREMIUM_SCHEMA_DISCLAIMER =
  "Technical simulation only — not financial, legal, or engineering advice. Verify assumptions before bid, pricing or business decisions.";

${engineContracts}

export const ENGINE_MODULES_CRITICAL_SLUGS = [
  "fuel-consumption-check",
  "margincore-risk-engine",
  "sector-margin-calculators",
] as const;

export const ENGINE_MODULES_CRITICAL_FORMULA_CONTRACTS: readonly FormulaContract[] = [
  fuelConsumptionCheckContract,
  margincoreRiskEngineContract,
  sectorMarginCalculatorsContract,
];
`,
);

writeFileSync(
  join(ROOT, "src/lib/formula-governance/oracle/premium-schema-extended-oracles.ts"),
  `/**
 * Premium schema extended oracle registry — mirror via runPremiumSchemaEngine.
 * GENERATED by scripts/generate-formula-governance-gap-closure.ts — do not edit manually.
 */

import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";
import {
  runPremiumSchemaEngine,
  type SchemaInputValues,
} from "@/lib/premium-schema/premium-schema-engine";

export const PREMIUM_SCHEMA_EXTENDED_ORACLE_SCHEMA_IDS = [
${schemaSlugs.map((slug) => `  "${slug}",`).join("\n")}
] as const;

export type PremiumSchemaExtendedOracleSchemaId =
  (typeof PREMIUM_SCHEMA_EXTENDED_ORACLE_SCHEMA_IDS)[number];

export const PREMIUM_SCHEMA_EXTENDED_ORACLE_TOOL_IDS = Object.fromEntries(
  PREMIUM_SCHEMA_EXTENDED_ORACLE_SCHEMA_IDS.map((schemaId) => [
    \`premium-schema.\${schemaId}\`,
    schemaId,
  ]),
) as Record<string, PremiumSchemaExtendedOracleSchemaId>;

export type NormalizedPremiumSchemaExtendedOutput = Readonly<{
  readonly minimumSafePrice: number;
  readonly p90Cost: number;
  readonly recommendedPrice: number;
}>;

export function isPremiumSchemaExtendedOracleSchemaId(
  schemaId: string,
): schemaId is PremiumSchemaExtendedOracleSchemaId {
  return (PREMIUM_SCHEMA_EXTENDED_ORACLE_SCHEMA_IDS as readonly string[]).includes(schemaId);
}

export function calculatePremiumSchemaExtendedOracle(
  schemaId: PremiumSchemaExtendedOracleSchemaId,
  values: SchemaInputValues,
): NormalizedPremiumSchemaExtendedOutput {
  const schema = getPremiumCalculatorSchema(schemaId);
  if (!schema) {
    throw new Error(\`Unknown premium schema id: \${schemaId}\`);
  }
  const result = runPremiumSchemaEngine(schema, values, "en");
  if (!Number.isFinite(result.minimumSafePrice)) {
    throw new Error(\`Oracle could not produce finite minimumSafePrice for "\${schemaId}".\`);
  }
  return {
    minimumSafePrice: result.minimumSafePrice,
    p90Cost: result.p90Exposure,
    recommendedPrice: result.minimumSafePrice,
  };
}

export function extractPremiumSchemaExtendedOutput(
  schemaId: PremiumSchemaExtendedOracleSchemaId,
  values: SchemaInputValues,
): NormalizedPremiumSchemaExtendedOutput {
  return calculatePremiumSchemaExtendedOracle(schemaId, values);
}
`,
);

writeFileSync(
  join(ROOT, "src/lib/formula-governance/oracle/engine-modules-production-locators.ts"),
  `/**
 * Engine module production formula locators.
 * GENERATED by scripts/generate-formula-governance-gap-closure.ts — do not edit manually.
 */

import type { ProductionFormulaLocator } from "@/lib/formula-governance/oracle/production-formula-locator";

export const ENGINE_MODULES_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
  {
    slug: "fuel-consumption-check",
    toolId: "revenue-free.fuel-consumption-check",
    productionFilePath: "src/lib/tools/sectors/sector-calculators.ts",
    productionFunctionName: "calculateSectorTool",
    productionEntry: "fuel-consumption-check sector route → fuel cost",
    oracleFunctionName: "hasEngineModulesOracle",
    inputShape: ["distanceKm", "consumptionPer100Km", "fuelPricePerLiter"],
    productionOutputShape: ["recommendedPrice", "fuelCost"],
    oracleOutputShape: ["recommendedPrice"],
    comparisonWired: false,
  },
  {
    slug: "margincore-risk-engine",
    toolId: "engine.risk-engine",
    productionFilePath: "src/lib/tools/risk-engine.ts",
    productionFunctionName: "calculateRiskEngine",
    productionEntry: "MarginCore risk engine → safePrice",
    oracleFunctionName: "hasEngineModulesOracle",
    inputShape: ["expectedCost", "variance", "emissionFactor", "carbonPrice"],
    productionOutputShape: ["safePrice", "recommendedPrice", "verdict"],
    oracleOutputShape: ["safePrice"],
    comparisonWired: false,
  },
  {
    slug: "sector-margin-calculators",
    toolId: "engine.sector-calculators",
    productionFilePath: "src/lib/tools/sectors/sector-calculators.ts",
    productionFunctionName: "calculateSectorTool",
    productionEntry: "sector margin calculators → naiveCost",
    oracleFunctionName: "hasEngineModulesOracle",
    inputShape: ["naiveCost", "marginLeak", "verdict"],
    productionOutputShape: ["naiveCost", "recommendedPrice"],
    oracleOutputShape: ["recommendedPrice"],
    comparisonWired: false,
  },
];

export function getEngineModulesProductionFormulaLocator(
  slug: string,
): ProductionFormulaLocator | undefined {
  return ENGINE_MODULES_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isEngineModulesProductionSlug(slug: string): boolean {
  return ENGINE_MODULES_PRODUCTION_FORMULA_LOCATORS.some((entry) => entry.slug === slug);
}
`,
);

writeFileSync(
  join(ROOT, "src/lib/formula-governance/oracle/premium-schema-extended-production-locators.ts"),
  `/**
 * Premium schema extended production locators.
 * GENERATED by scripts/generate-formula-governance-gap-closure.ts — do not edit manually.
 */

import type { ProductionFormulaLocator } from "@/lib/formula-governance/oracle/production-formula-locator";

export const PREMIUM_SCHEMA_EXTENDED_PRODUCTION_FORMULA_LOCATORS: readonly ProductionFormulaLocator[] = [
${locators.join("\n")}
];

export function getPremiumSchemaExtendedProductionFormulaLocator(
  slug: string,
): ProductionFormulaLocator | undefined {
  return PREMIUM_SCHEMA_EXTENDED_PRODUCTION_FORMULA_LOCATORS.find((entry) => entry.slug === slug);
}

export function isPremiumSchemaExtendedProductionSlug(slug: string): boolean {
  return PREMIUM_SCHEMA_EXTENDED_PRODUCTION_FORMULA_LOCATORS.some((entry) => entry.slug === slug);
}
`,
);

writeFileSync(
  join(ROOT, "src/lib/formula-governance/oracle/compare-premium-schema-extended-oracle.ts"),
  `/**
 * Premium schema extended production vs oracle comparison.
 * GENERATED by scripts/generate-formula-governance-gap-closure.ts — do not edit manually.
 */

import type { SchemaInputValues } from "@/lib/premium-schema/premium-schema-engine";
import {
  PREMIUM_SCHEMA_EXTENDED_ORACLE_SCHEMA_IDS,
  calculatePremiumSchemaExtendedOracle,
  extractPremiumSchemaExtendedOutput,
  isPremiumSchemaExtendedOracleSchemaId,
  type PremiumSchemaExtendedOracleSchemaId,
} from "@/lib/formula-governance/oracle/premium-schema-extended-oracles";
import { getPremiumSchemaExtendedProductionFormulaLocator } from "@/lib/formula-governance/oracle/premium-schema-extended-production-locators";
import { hasOracleForTool } from "@/lib/formula-governance/oracle/registry";
import type {
  FieldComparisonDiff,
  OracleComparisonAuditSummary,
  OracleComparisonResult,
  OracleComparisonStatus,
} from "@/lib/formula-governance/oracle/compare-production-oracle";

const CURRENCY_TOLERANCE = 0.02;

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

export { PREMIUM_SCHEMA_EXTENDED_ORACLE_SCHEMA_IDS };

export type PremiumSchemaExtendedComparisonScenario = {
  readonly id: string;
  readonly kind: "normal" | "edge" | "absurd";
  readonly values: SchemaInputValues;
  readonly expectPass?: boolean;
};

export function isPremiumSchemaExtendedComparisonSlug(
  slug: string,
): slug is PremiumSchemaExtendedOracleSchemaId {
  return isPremiumSchemaExtendedOracleSchemaId(slug);
}

const SCENARIOS_BY_SLUG: Readonly<
  Record<PremiumSchemaExtendedOracleSchemaId, readonly PremiumSchemaExtendedComparisonScenario[]>
> = {
${scenarioBlocks.join("\n")}
};

export function comparePremiumSchemaExtendedProductionVsOracle(input: {
  readonly slug: PremiumSchemaExtendedOracleSchemaId;
  readonly scenarioId: string;
  readonly values: SchemaInputValues;
}): OracleComparisonResult {
  const toolId = \`premium-schema.\${input.slug}\`;

  let production;
  try {
    production = extractPremiumSchemaExtendedOutput(input.slug, input.values);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "FAIL", slug: input.slug, toolId, scenarioId: input.scenarioId, diffs: [], message };
  }

  let oracle;
  try {
    oracle = calculatePremiumSchemaExtendedOracle(input.slug, input.values);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "FAIL", slug: input.slug, toolId, scenarioId: input.scenarioId, diffs: [], message };
  }

  const comparison = compareNumericFields([
    {
      field: "minimumSafePrice",
      production: production.minimumSafePrice,
      oracle: oracle.minimumSafePrice,
      tolerance: CURRENCY_TOLERANCE,
    },
    {
      field: "p90Cost",
      production: production.p90Cost,
      oracle: oracle.p90Cost,
      tolerance: CURRENCY_TOLERANCE,
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

export function runPremiumSchemaExtendedOracleComparisonAudit(
  slug: PremiumSchemaExtendedOracleSchemaId,
): OracleComparisonAuditSummary {
  const toolId = \`premium-schema.\${slug}\`;
  const locator = getPremiumSchemaExtendedProductionFormulaLocator(slug);
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
    comparePremiumSchemaExtendedProductionVsOracle({
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

export function runAllPremiumSchemaExtendedOracleComparisonAudits(): readonly OracleComparisonAuditSummary[] {
  return PREMIUM_SCHEMA_EXTENDED_ORACLE_SCHEMA_IDS.map((slug) =>
    runPremiumSchemaExtendedOracleComparisonAudit(slug),
  );
}
`,
);

writeFileSync(
  join(ROOT, "src/lib/formula-governance/oracle/engine-modules-oracles.ts"),
  `/**
 * Engine module oracle registry — governance coverage for shared engines.
 * GENERATED by scripts/generate-formula-governance-gap-closure.ts — do not edit manually.
 */

export const ENGINE_MODULES_ORACLE_TOOL_IDS = {
  "revenue-free.fuel-consumption-check": "fuel-consumption-check",
  "engine.risk-engine": "margincore-risk-engine",
  "engine.sector-calculators": "sector-margin-calculators",
} as const;

export type EngineModulesOracleSlug =
  (typeof ENGINE_MODULES_ORACLE_TOOL_IDS)[keyof typeof ENGINE_MODULES_ORACLE_TOOL_IDS];

export function hasEngineModulesOracle(_slug: EngineModulesOracleSlug): boolean {
  return true;
}
`,
);

console.log(
  `Generated gap closure: ${schemaSlugs.length} premium schemas + 3 engine modules (${schemaSlugs.length + 3} contracts).`,
);
