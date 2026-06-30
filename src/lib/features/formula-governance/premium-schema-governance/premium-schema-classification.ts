/**
 * Premium-schema 27 classification — ADIM 1 inventory groups A–F.
 */

import { PREMIUM_CALCULATOR_SCHEMAS } from "@/lib/features/premium-schema/schema-registry";
import { PREMIUM_SCHEMA_SLUG_MAP } from "@/lib/features/premium-schema/schema-registry";
import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { hasOracleForTool } from "@/lib/features/formula-governance/oracle/registry";
import {
  isPremiumFullLoopRuntimeSlug,
  PREMIUM_FULL_LOOP_RUNTIME_SLUGS,
} from "@/lib/features/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS,
  isBatchPremiumSchemaCriticalSlug,
  type BatchPremiumSchemaCriticalSlug,
} from "@/lib/features/formula-governance/premium-schema-governance/premium-schema-critical-slugs";

export type PremiumSchemaClassificationGroup =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F";

export type PremiumSchemaClassificationEntry = {
  readonly schemaSlug: string;
  readonly legacyPaidSlugs: readonly string[];
  readonly group: PremiumSchemaClassificationGroup;
  readonly rationale: string;
};

const GROUP_A_SCHEMAS = new Set([
  "logistics-route-loss",
  "energy-peak-cost",
  "food-waste-margin-loss",
  "logistics-fuel-route-drift",
  "energy-compressor-leak-cost",
  "carbon-footprint-compliance-risk",
  "agriculture-irrigation-yield-loss",
  "dairy-feed-efficiency-loss",
  "retail-inventory-turnover-risk",
  "calibration-drift-risk",
  "legal-interest-fee-calculator-pro",
]);

const GROUP_B_SCHEMAS = new Set(["auto-repair-comeback-cost"]);

const GROUP_D_SCHEMAS = new Set([
  "dairy-feed-efficiency-loss",
  "retail-inventory-turnover-risk",
  "energy-compressor-leak-cost",
  "carbon-footprint-compliance-risk",
]);

const GROUP_E_SCHEMAS = new Set(["calibration-drift-risk"]);

function legacySlugsForSchema(schemaSlug: string): readonly string[] {
  const slugs = Object.entries(PREMIUM_SCHEMA_SLUG_MAP)
    .filter(([, schemaId]) => schemaId === schemaSlug)
    .map(([paidSlug]) => paidSlug);
  return slugs.sort((left, right) => left.localeCompare(right));
}

function classifySchema(schemaSlug: string): PremiumSchemaClassificationEntry {
  const legacyPaidSlugs = legacySlugsForSchema(schemaSlug);

  if (GROUP_A_SCHEMAS.has(schemaSlug)) {
    return {
      schemaSlug,
      legacyPaidSlugs,
      group: "A",
      rationale: "Ready for FormulaContract — legacy paid slug lacks governed contract.",
    };
  }

  if (GROUP_B_SCHEMAS.has(schemaSlug)) {
    return {
      schemaSlug,
      legacyPaidSlugs,
      group: "B",
      rationale: "Ready for full-loop — contract and oracle exist; not yet in PREMIUM_FULL_LOOP_RUNTIME_SLUGS.",
    };
  }

  if (GROUP_E_SCHEMAS.has(schemaSlug)) {
    return {
      schemaSlug,
      legacyPaidSlugs,
      group: "E",
      rationale: "Alias/funnel mapping — paid slug differs from free 3d-print-cost-check contract.",
    };
  }

  if (GROUP_D_SCHEMAS.has(schemaSlug)) {
    return {
      schemaSlug,
      legacyPaidSlugs,
      group: "D",
      rationale: "Revenue/paid semantic drift — schema title differs from legacy paid slug domain.",
    };
  }

  const legacyFullLoop = legacyPaidSlugs.some((slug) => isPremiumFullLoopRuntimeSlug(slug));
  if (legacyFullLoop) {
    return {
      schemaSlug,
      legacyPaidSlugs,
      group: "C",
      rationale: "Schema bridge needed — legacy full-loop exists; schema route uses formula-registry engine.",
    };
  }

  return {
    schemaSlug,
    legacyPaidSlugs,
    group: "F",
    rationale: "Deferred — insufficient governance signal or blocked by alias drift.",
  };
}

export const PREMIUM_SCHEMA_CLASSIFICATION: readonly PremiumSchemaClassificationEntry[] =
  PREMIUM_CALCULATOR_SCHEMAS.map((schema) => classifySchema(schema.id));

export function getPremiumSchemaClassification(
  schemaSlug: string,
): PremiumSchemaClassificationEntry | undefined {
  return PREMIUM_SCHEMA_CLASSIFICATION.find((entry) => entry.schemaSlug === schemaSlug);
}

export function listPremiumSchemaClassificationByGroup(
  group: PremiumSchemaClassificationGroup,
): readonly PremiumSchemaClassificationEntry[] {
  return PREMIUM_SCHEMA_CLASSIFICATION.filter((entry) => entry.group === group);
}

export function summarizePremiumSchemaClassification(): {
  readonly totalSchemas: number;
  readonly groupCounts: Record<PremiumSchemaClassificationGroup, number>;
  readonly legacyWithContract: number;
  readonly legacyWithOracle: number;
  readonly legacyFullLoop: number;
} {
  const groupCounts: Record<PremiumSchemaClassificationGroup, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  };

  for (const entry of PREMIUM_SCHEMA_CLASSIFICATION) {
    groupCounts[entry.group] += 1;
  }

  const legacySlugs = new Set(
    PREMIUM_SCHEMA_CLASSIFICATION.flatMap((entry) => entry.legacyPaidSlugs),
  );

  let legacyWithContract = 0;
  let legacyWithOracle = 0;
  let legacyFullLoop = 0;

  for (const slug of legacySlugs) {
    if (getFormulaContractBySlug(slug)) {
      legacyWithContract += 1;
    }
    if (hasOracleForTool(`revenue-premium.${slug}`)) {
      legacyWithOracle += 1;
    }
    if ((PREMIUM_FULL_LOOP_RUNTIME_SLUGS as readonly string[]).includes(slug)) {
      legacyFullLoop += 1;
    }
  }

  return {
    totalSchemas: PREMIUM_SCHEMA_CLASSIFICATION.length,
    groupCounts,
    legacyWithContract,
    legacyWithOracle,
    legacyFullLoop,
  };
}

export {
  BATCH_PREMIUM_SCHEMA_CRITICAL_SLUGS,
  isBatchPremiumSchemaCriticalSlug,
  type BatchPremiumSchemaCriticalSlug,
};
