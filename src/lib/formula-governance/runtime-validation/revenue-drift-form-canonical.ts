/**
 * Maps live revenue free form keys to FormulaContract canonical numeric inputs.
 */

import {
  isRevenueDriftFreeOracleSlug,
  mapDeadlinePressureToWastePercent,
} from "@/lib/formula-governance/oracle/revenue-drift-free-oracles";
import { normalizeInputNumber } from "@/lib/formula-governance/runtime-validation/full-loop-bridge-shared";

type RevenueDriftRawInputValues = Record<string, number | string>;

const REVENUE_DRIFT_FORM_KEYS: Readonly<Record<string, readonly string[]>> = {
  "project-cost-calculator": ["originalBudget", "changeEstimate", "deadlinePressure"],
  "cleaning-cost-calculator": ["areaSize", "staffCount", "visitFrequency"],
  "product-margin-calculator": ["productPrice", "productCost", "returnRate"],
};

export function resolveRevenueDriftFormKeys(slug: string): readonly string[] {
  return REVENUE_DRIFT_FORM_KEYS[slug] ?? [];
}

export function mapRevenueDriftRawToContractInputs(
  slug: string,
  rawValues: RevenueDriftRawInputValues,
): RevenueDriftRawInputValues {
  if (!isRevenueDriftFreeOracleSlug(slug)) {
    return rawValues;
  }

  const mapped: RevenueDriftRawInputValues = { ...rawValues };

  if (slug === "project-cost-calculator") {
    const wastePercent = mapDeadlinePressureToWastePercent(rawValues.deadlinePressure);
    if (wastePercent !== undefined) {
      mapped.deadlinePressureWastePercent = wastePercent;
    }
    delete mapped.deadlinePressure;
  }

  if (slug === "product-margin-calculator" && mapped.returnRate === undefined) {
    mapped.returnRate = 0;
  }

  return mapped;
}

export function sanitizeRevenueDriftCanonicalInputs(
  slug: string,
  rawValues: RevenueDriftRawInputValues,
  contractKeys: readonly string[],
): {
  readonly canonical: Record<string, number>;
  readonly rejectedKeys: readonly string[];
} {
  const mapped = mapRevenueDriftRawToContractInputs(slug, rawValues);
  const allowedFormKeys = new Set(resolveRevenueDriftFormKeys(slug));
  const contractKeySet = new Set(contractKeys);
  const canonical: Record<string, number> = {};
  const rejectedKeys: string[] = [];

  for (const [key, value] of Object.entries(mapped)) {
    if (contractKeySet.has(key)) {
      const numeric = normalizeInputNumber(value);
      if (numeric !== undefined) {
        canonical[key] = numeric;
      }
      continue;
    }
    if (!allowedFormKeys.has(key)) {
      rejectedKeys.push(key);
    }
  }

  return {
    canonical,
    rejectedKeys: rejectedKeys.sort((left, right) => left.localeCompare(right)),
  };
}
