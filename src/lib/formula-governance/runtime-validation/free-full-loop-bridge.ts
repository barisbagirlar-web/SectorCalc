/**
 * Free tool full-loop runtime bridge — Mind 2 → canonical calc → Mind 1 validation.
 */

import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import type { ContractCalculationIntelligenceLoopResult, ContractLoopStatus } from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";
import {
  blockedFullLoopResult,
  buildRuntimeTrustTraceView,
  normalizeInputNumber,
  runContractCalculationIntelligenceLoop,
  validateContractEdgeRules,
  type RuntimeTrustTraceView,
} from "@/lib/formula-governance/runtime-validation/full-loop-bridge-shared";
import {
  isFreeFullLoopRuntimeSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import type { KnownInputs } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";
import type { CalculationValues } from "@/lib/formula-governance/runtime-validation/invariant-types";
import {
  adaptProductionBatchFreeBatch2Output,
  adaptProductionBatchFreeOutput,
  adaptProductionBatchTrafficCatalogOutput,
  adaptProductionBusinessOperationsOutput,
  adaptProductionFinanceOutput,
  adaptProductionRentVsBuyOutput,
  type ProductionAdapterResult,
} from "@/lib/formula-governance/oracle/production-adapters";
import { isBatchFreeBatch2OracleSlug } from "@/lib/formula-governance/oracle/batch-free-batch2-oracles";
import { isBatchTrafficCatalogOracleSlug } from "@/lib/formula-governance/oracle/batch-traffic-catalog-oracles";
import { isBatchFreeOracleSlug } from "@/lib/formula-governance/oracle/batch-free-oracles";
import { isRevenueDriftFreeOracleSlug } from "@/lib/formula-governance/oracle/revenue-drift-free-oracles";
import { sanitizeRevenueDriftCanonicalInputs } from "@/lib/formula-governance/runtime-validation/revenue-drift-form-canonical";
import { isFinanceOracleSlug } from "@/lib/formula-governance/oracle/finance-oracles";
import { isBusinessOperationsOracleSlug } from "@/lib/formula-governance/oracle/production-formula-locator";
import {
  calculateFreeTrafficTool,
  type FreeTrafficInputValues,
  type FreeTrafficResult,
} from "@/lib/tools/free-traffic-calculators";
import {
  calculateFreeToolResult,
  type FreeToolInputValues,
  type FreeToolResult,
} from "@/lib/tools/free-tool-results";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";

export type { RuntimeTrustTraceView };

export type FreeRawInputValues = Record<string, number | string>;

export type FreeFullLoopBlockedResult = {
  readonly status: "blocked";
  readonly loopStatus: ContractLoopStatus;
  readonly blockers: readonly string[];
  readonly missingInputs: readonly string[];
  readonly rejectedKeys: readonly string[];
  readonly trustTrace: RuntimeTrustTraceView;
  readonly loop: ContractCalculationIntelligenceLoopResult;
};

export type FreeFullLoopSuccessResult = {
  readonly status: "success";
  readonly trafficResult?: FreeTrafficResult;
  readonly revenueResult?: FreeToolResult;
  readonly trustTrace: RuntimeTrustTraceView;
  readonly loop: ContractCalculationIntelligenceLoopResult;
};

export type FreeFullLoopResult = FreeFullLoopBlockedResult | FreeFullLoopSuccessResult;

export type SanitizeFreeCanonicalInputsResult = {
  readonly canonical: KnownInputs;
  readonly rejectedKeys: readonly string[];
  readonly allowedKeys: readonly string[];
};

/** Form field keys mapped to FormulaContract requiredInputs (alias-only; no formula change). */
const FREE_FORM_TO_CONTRACT_ALIASES: Readonly<
  Partial<Record<string, Readonly<Partial<Record<string, string>>>>>
> = {};

const REVENUE_FREE_FULL_LOOP_SLUGS = new Set<string>([
  "repair-time-vs-price-check",
  "hvac-tonnage-rule-check",
  "roofing-square-cost-check",
  "project-cost-calculator",
  "cleaning-cost-calculator",
  "product-margin-calculator",
]);

function resolveFreeContractSlug(slug: string): string {
  return slug;
}

export function resolveFreeCanonicalInputKeys(slug: string): readonly string[] {
  const contract = getFormulaContractBySlug(resolveFreeContractSlug(slug));
  if (!contract) {
    return [];
  }
  const keys = new Set<string>([...contract.requiredInputs, ...contract.criticalInputs]);
  return [...keys].sort((left, right) => left.localeCompare(right));
}

function applyFormToContractAliases(
  slug: string,
  rawValues: FreeRawInputValues,
): FreeRawInputValues {
  const aliases = FREE_FORM_TO_CONTRACT_ALIASES[slug];
  if (!aliases) {
    return rawValues;
  }
  const mapped: FreeRawInputValues = { ...rawValues };
  for (const [formKey, contractKey] of Object.entries(aliases)) {
    if (!contractKey) {
      continue;
    }
    if (mapped[contractKey] === undefined && mapped[formKey] !== undefined) {
      mapped[contractKey] = mapped[formKey];
    }
  }
  return mapped;
}

export function sanitizeFreeCanonicalInputs(
  slug: string,
  rawValues: FreeRawInputValues,
): SanitizeFreeCanonicalInputsResult {
  const allowedKeys = resolveFreeCanonicalInputKeys(slug);

  if (isRevenueDriftFreeOracleSlug(slug)) {
    const drift = sanitizeRevenueDriftCanonicalInputs(slug, rawValues, allowedKeys);
    return {
      canonical: drift.canonical,
      rejectedKeys: drift.rejectedKeys,
      allowedKeys,
    };
  }

  const aliased = applyFormToContractAliases(slug, rawValues);
  const allowedSet = new Set(allowedKeys);
  const canonical: Record<string, number> = {};
  const rejectedKeys: string[] = [];

  for (const [key, value] of Object.entries(aliased)) {
    if (!allowedSet.has(key)) {
      rejectedKeys.push(key);
      continue;
    }
    const numeric = normalizeInputNumber(value);
    if (numeric === undefined) {
      continue;
    }
    canonical[key] = numeric;
  }

  return {
    canonical,
    rejectedKeys: rejectedKeys.sort((left, right) => left.localeCompare(right)),
    allowedKeys,
  };
}

function isRevenueFreeSlug(slug: string): boolean {
  return REVENUE_FREE_FULL_LOOP_SLUGS.has(slug) && getRevenueToolByFreeSlug(slug) !== null;
}

function toFreeTrafficValues(canonical: KnownInputs): FreeTrafficInputValues {
  const values: FreeTrafficInputValues = {};
  for (const [key, value] of Object.entries(canonical)) {
    values[key] = value;
  }
  return values;
}

function toFreeToolValues(canonical: KnownInputs): FreeToolInputValues {
  const values: FreeToolInputValues = {};
  for (const [key, value] of Object.entries(canonical)) {
    values[key] = value;
  }
  return values;
}

function runFreeDisplayCalculation(
  slug: string,
  values: FreeRawInputValues,
  locale: string,
): FreeTrafficResult | FreeToolResult {
  if (isRevenueFreeSlug(slug)) {
    const tool = getRevenueToolByFreeSlug(slug);
    if (!tool) {
      throw new Error(`Revenue free tool not found for "${slug}".`);
    }
    const displayValues: FreeToolInputValues = {};
    for (const [key, value] of Object.entries(values)) {
      displayValues[key] = value;
    }
    return calculateFreeToolResult(tool, displayValues);
  }
  const canonical: Record<string, number> = {};
  for (const [key, value] of Object.entries(values)) {
    const numeric = normalizeInputNumber(value);
    if (numeric !== undefined) {
      canonical[key] = numeric;
    }
  }
  return calculateFreeTrafficTool(slug, toFreeTrafficValues(canonical), locale);
}

function adaptFreeProductionOutput(slug: string, values: KnownInputs): ProductionAdapterResult {
  const trafficValues = toFreeTrafficValues(values);

  if (slug === "rent-vs-buy-calculator") {
    return adaptProductionRentVsBuyOutput(trafficValues);
  }
  if (isFinanceOracleSlug(slug)) {
    return adaptProductionFinanceOutput(slug, trafficValues);
  }
  if (isBusinessOperationsOracleSlug(slug)) {
    return adaptProductionBusinessOperationsOutput(slug, trafficValues);
  }
  if (isBatchFreeOracleSlug(slug)) {
    return adaptProductionBatchFreeOutput(slug, values);
  }
  if (isBatchFreeBatch2OracleSlug(slug)) {
    return adaptProductionBatchFreeBatch2Output(slug, values);
  }
  if (isBatchTrafficCatalogOracleSlug(slug)) {
    return adaptProductionBatchTrafficCatalogOutput(slug, toFreeTrafficValues(values));
  }
  return { status: "needs_adapter", reason: `No production adapter registered for "${slug}".` };
}

const GOVERNANCE_TARGET_ALIASES: Readonly<Partial<Record<string, string>>> = {
  recommendedPrice: "estimatedProjectCost",
  recommendedPriceDifference: "netDifference",
  minimumSafeBid: "breakEvenUnits",
};

function inputsForFreeMind2Loop(slug: string, canonical: KnownInputs): Record<string, number> {
  const next: Record<string, number> = { ...canonical };
  if (
    slug === "project-cost-calculator" &&
    next.deadlinePressureWastePercent !== undefined &&
    next.deadlinePressure === undefined
  ) {
    next.deadlinePressure = next.deadlinePressureWastePercent;
  }
  if (
    slug === "product-margin-calculator" &&
    next.returnRate === undefined
  ) {
    next.returnRate = 0;
  }
  return next;
}

function inputsForFreeValidationLoop(slug: string, canonical: KnownInputs): Record<string, number> {
  const next = inputsForFreeMind2Loop(slug, canonical);
  if (!Number.isFinite(next.targetMargin)) {
    next.targetMargin = 25;
  }
  return next;
}

function buildFreeCalculatedResult(
  contractSlug: string,
  adapterOutput: Record<string, number>,
): CalculationValues {
  const contract = getFormulaContractBySlug(contractSlug);
  const result: Record<string, number> = { ...adapterOutput };

  if (!contract) {
    return result;
  }

  for (const outputKey of contract.outputs) {
    if (result[outputKey] !== undefined) {
      continue;
    }
    const aliasSource = GOVERNANCE_TARGET_ALIASES[outputKey];
    if (aliasSource && result[aliasSource] !== undefined) {
      result[outputKey] = result[aliasSource];
      continue;
    }
    if (outputKey === "recommendedPrice" || outputKey === "recommendedPriceDifference") {
      const numericOutputs = contract.outputs.filter(
        (key) =>
          key !== "recommendedPrice" &&
          key !== "recommendedPriceDifference" &&
          key !== "riskLevel" &&
          key !== "quoteVerdict" &&
          key !== "strongerScenario",
      );
      for (const candidate of numericOutputs) {
        if (result[candidate] !== undefined) {
          result[outputKey] = result[candidate];
          break;
        }
      }
    }
  }

  const governanceTarget =
    result.recommendedPrice ??
    result.recommendedPriceDifference ??
    result.minimumSafeBid;
  if (governanceTarget !== undefined && result.baseCost === undefined) {
    result.baseCost = governanceTarget;
  }

  return result;
}

function blockedResult(input: {
  readonly slug: string;
  readonly loop: ContractCalculationIntelligenceLoopResult;
  readonly canonicalKeys: readonly string[];
  readonly rejectedKeys: readonly string[];
  readonly extraBlockers?: readonly string[];
  readonly missingInputs?: readonly string[];
}): FreeFullLoopBlockedResult {
  const blockers = [...input.extraBlockers ?? [], ...input.loop.blockers];
  const missingInputs = input.missingInputs ?? input.loop.requiredMissingInputs;

  return {
    status: "blocked",
    loopStatus: input.loop.status,
    blockers,
    missingInputs,
    rejectedKeys: input.rejectedKeys,
    trustTrace: buildRuntimeTrustTraceView({
      slug: input.slug,
      loop: input.loop,
      canonicalInputs: input.canonicalKeys,
      rejectedKeys: input.rejectedKeys,
    }),
    loop: input.loop,
  };
}

export function runFreeFullLoopCalculation(
  slug: string,
  rawValues: FreeRawInputValues,
  locale = "en",
): FreeFullLoopResult {
  if (!isFreeFullLoopRuntimeSlug(slug)) {
    throw new Error(`Slug "${slug}" is not registered for free full-loop runtime enforcement.`);
  }

  const contractSlug = resolveFreeContractSlug(slug);
  const contract = getFormulaContractBySlug(contractSlug);
  if (!contract) {
    throw new Error(`Formula contract not found for "${contractSlug}".`);
  }

  const { canonical, rejectedKeys } = sanitizeFreeCanonicalInputs(slug, rawValues);
  const canonicalKeys = Object.keys(canonical).sort((left, right) => left.localeCompare(right));

  const mind2Inputs = inputsForFreeMind2Loop(slug, canonical);

  const edgeBlockers = validateContractEdgeRules(slug, canonical, resolveFreeContractSlug);
  if (edgeBlockers.length > 0) {
    const preLoop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: mind2Inputs,
    });
    return blockedResult({
      slug,
      loop: preLoop,
      canonicalKeys,
      rejectedKeys,
      extraBlockers: edgeBlockers,
      missingInputs: preLoop.requiredMissingInputs,
    });
  }

  const preLoop = runContractCalculationIntelligenceLoop({
    contract,
    knownInputs: mind2Inputs,
  });

  if (preLoop.status === "NEED_DATA" || preLoop.status === "BLOCKED") {
    return blockedResult({
      slug,
      loop: preLoop,
      canonicalKeys,
      rejectedKeys,
    });
  }

  if (preLoop.status !== "READY_TO_CALCULATE") {
    return blockedResult({
      slug,
      loop: preLoop,
      canonicalKeys,
      rejectedKeys,
      extraBlockers: [`Unexpected pre-calculation loop status: ${preLoop.status}.`],
    });
  }

  const displayValues = isRevenueFreeSlug(slug) ? rawValues : canonical;
  const displayResult = runFreeDisplayCalculation(slug, displayValues, locale);
  const adapterResult = adaptFreeProductionOutput(slug, canonical);

  if (adapterResult.status !== "ok") {
    const postLoop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: canonical,
    });
    return blockedResult({
      slug,
      loop: postLoop,
      canonicalKeys,
      rejectedKeys,
      extraBlockers: [
        adapterResult.status === "error"
          ? adapterResult.reason
          : adapterResult.reason,
      ],
    });
  }

  const calculatedResult = buildFreeCalculatedResult(
    contractSlug,
    adapterResult.output as Record<string, number>,
  );

  const postLoop = runContractCalculationIntelligenceLoop({
    contract,
    knownInputs: inputsForFreeValidationLoop(slug, canonical),
    calculatedResult,
  });

  if (postLoop.status !== "SUCCESS" || !postLoop.validationResult?.isValid) {
    return blockedResult({
      slug,
      loop: postLoop,
      canonicalKeys,
      rejectedKeys,
      extraBlockers: postLoop.validationResult?.errors ?? [
        "Validation did not pass — result blocked.",
      ],
    });
  }

  const trustTrace = buildRuntimeTrustTraceView({
    slug,
    loop: postLoop,
    canonicalInputs: canonicalKeys,
    rejectedKeys,
  });

  if (isRevenueFreeSlug(slug)) {
    return {
      status: "success",
      revenueResult: displayResult as FreeToolResult,
      trustTrace,
      loop: postLoop,
    };
  }

  return {
    status: "success",
    trafficResult: displayResult as FreeTrafficResult,
    trustTrace,
    loop: postLoop,
  };
}

export function isFreeFullLoopRuntimeSlugRegistered(slug: string): boolean {
  return isFreeFullLoopRuntimeSlug(slug);
}
