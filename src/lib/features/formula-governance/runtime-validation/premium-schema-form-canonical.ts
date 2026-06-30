/**
 * Canonical input mapping for premium-schema full-loop slugs (yes/no + select fields).
 */

import { isBatchPremiumSchemaOracleSlug } from "@/lib/features/formula-governance/oracle/batch-premium-schema-oracles";
import { normalizeInputNumber } from "@/lib/features/formula-governance/runtime-validation/full-loop-bridge-shared";
import type { PremiumInputValues } from "@/lib/features/tools/premium-decision-engine";

export const PREMIUM_SCHEMA_STRING_PASS_THROUGH_KEYS = [
  "returnEmpty",
  "hasTolls",
  "overweightRisk",
  "energySource",
  "includesTransport",
  "materialQuality",
  "season",
  "cityTier",
  "includeLabor",
  "returnTrip",
] as const;

export type PremiumSchemaStringPassThroughKey =
  (typeof PREMIUM_SCHEMA_STRING_PASS_THROUGH_KEYS)[number];

const YES_NO_NUMERIC_DERIVATIONS: Readonly<
  Partial<Record<string, Readonly<Partial<Record<PremiumSchemaStringPassThroughKey, string>>>>>
> = {
  "route-optimization-analyzer": {
    returnEmpty: "returnEmptyFlag",
    hasTolls: "hasTollsFlag",
    overweightRisk: "overweightRiskFlag",
  },
  "trip-budget-optimizer": {
    returnTrip: "returnTripFlag",
  },
  "cbam-compliance-verdict": {
    includesTransport: "includesTransportFlag",
  },
  "renovation-budget-optimizer": {
    includeLabor: "includeLaborFlag",
  },
};

export function isPremiumSchemaFormSlug(slug: string): boolean {
  return isBatchPremiumSchemaOracleSlug(slug);
}

export function mapYesNoToNumericFlag(value: number | string | undefined): number | undefined {
  if (value === "yes") {
    return 1;
  }
  if (value === "no") {
    return 0;
  }
  return normalizeInputNumber(value);
}

export function mapPremiumSchemaRawToContractInputs(
  slug: string,
  rawValues: PremiumInputValues,
): PremiumInputValues {
  if (!isPremiumSchemaFormSlug(slug)) {
    return rawValues;
  }

  const mapped: PremiumInputValues = { ...rawValues };
  const derivations = YES_NO_NUMERIC_DERIVATIONS[slug];
  if (derivations) {
    for (const [sourceKey, targetKey] of Object.entries(derivations)) {
      const flag = mapYesNoToNumericFlag(mapped[sourceKey]);
      if (flag !== undefined && targetKey) {
        mapped[targetKey] = flag;
      }
    }
  }

  if (slug === "energy-efficiency-report" && mapped.targetMargin === undefined) {
    const savings = normalizeInputNumber(mapped.targetSavings);
    if (savings !== undefined) {
      mapped.targetMargin = savings;
    }
  }

  if (slug === "meal-planning-verdict" && mapped.targetMargin === undefined) {
    const savings = normalizeInputNumber(mapped.targetSavings);
    if (savings !== undefined) {
      mapped.targetMargin = savings;
    }
  }

  return mapped;
}

export function sanitizePremiumSchemaCanonicalInputs(
  slug: string,
  rawValues: PremiumInputValues,
  contractKeys: readonly string[],
): {
  readonly canonical: Record<string, number>;
  readonly calcValues: PremiumInputValues;
  readonly rejectedKeys: readonly string[];
} {
  const mapped = mapPremiumSchemaRawToContractInputs(slug, rawValues);
  const contractKeySet = new Set(contractKeys);
  const passThroughSet = new Set<string>(PREMIUM_SCHEMA_STRING_PASS_THROUGH_KEYS);
  const canonical: Record<string, number> = {};
  const calcValues: PremiumInputValues = {};
  const rejectedKeys: string[] = [];

  for (const [key, value] of Object.entries(mapped)) {
    if (passThroughSet.has(key)) {
      if (typeof value === "string") {
        calcValues[key] = value;
      }
      continue;
    }

    if (contractKeySet.has(key)) {
      const numeric = normalizeInputNumber(value);
      if (numeric !== undefined) {
        canonical[key] = numeric;
        calcValues[key] = numeric;
      } else if (typeof value === "string" && value.length > 0) {
        calcValues[key] = value;
      }
      continue;
    }

    if (key.endsWith("Flag")) {
      const numeric = normalizeInputNumber(value);
      if (numeric !== undefined) {
        canonical[key] = numeric;
      }
      continue;
    }

    if (typeof value === "string" && passThroughSet.has(key as PremiumSchemaStringPassThroughKey)) {
      calcValues[key] = value;
      continue;
    }

    const numeric = normalizeInputNumber(value);
    if (numeric !== undefined && contractKeySet.has(key)) {
      canonical[key] = numeric;
      calcValues[key] = numeric;
    } else if (!contractKeySet.has(key) && !key.endsWith("Flag")) {
      rejectedKeys.push(key);
    }
  }

  for (const key of PREMIUM_SCHEMA_STRING_PASS_THROUGH_KEYS) {
    const raw = mapped[key];
    if (typeof raw === "string") {
      calcValues[key] = raw;
    }
  }

  return {
    canonical,
    calcValues,
    rejectedKeys: rejectedKeys.sort((left, right) => left.localeCompare(right)),
  };
}
