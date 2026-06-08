/**
 * Premium tool full-loop runtime bridge — Mind 2 → canonical calc → Mind 1 validation.
 */

import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import type { ContractCalculationIntelligenceLoopResult, ContractLoopStatus } from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";
import {
  buildRuntimeTrustTraceView,
  normalizeInputNumber,
  runContractCalculationIntelligenceLoop,
  validateContractEdgeRules,
  type RuntimeTrustTraceView,
} from "@/lib/formula-governance/runtime-validation/full-loop-bridge-shared";
import {
  isPremiumFullLoopRuntimeSlug,
  resolveFullLoopContractSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import type { KnownInputs } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";
import { calculatePremiumDecisionReport } from "@/lib/tools/premium-decision-engine";
import type { PremiumInputValues } from "@/lib/tools/premium-decision-engine";
import type { PremiumDecisionReport } from "@/lib/tools/premium-tool-contract";
import { mapDecisionReportToPremiumToolResult } from "@/lib/tools/premium-decision-bridge";
import type { PremiumToolResult } from "@/lib/tools/premium-tool-results";

export type { RuntimeTrustTraceView };

const OPTIONAL_QUOTED_PRICE_KEYS = [
  "quotedPrice",
  "quotedMonthlyPrice",
  "quotedBudget",
  "plannedBudget",
  "chargedPrice",
] as const;

export type PremiumFullLoopBlockedResult = {
  readonly status: "blocked";
  readonly loopStatus: ContractLoopStatus;
  readonly blockers: readonly string[];
  readonly missingInputs: readonly string[];
  readonly rejectedKeys: readonly string[];
  readonly trustTrace: RuntimeTrustTraceView;
  readonly loop: ContractCalculationIntelligenceLoopResult;
};

export type PremiumFullLoopSuccessResult = {
  readonly status: "success";
  readonly report: PremiumDecisionReport;
  readonly toolResult: PremiumToolResult;
  readonly trustTrace: RuntimeTrustTraceView;
  readonly loop: ContractCalculationIntelligenceLoopResult;
};

export type PremiumFullLoopResult = PremiumFullLoopBlockedResult | PremiumFullLoopSuccessResult;

export type SanitizeCanonicalInputsResult = {
  readonly canonical: KnownInputs;
  readonly rejectedKeys: readonly string[];
  readonly allowedKeys: readonly string[];
};

export function resolveCanonicalInputKeys(slug: string): readonly string[] {
  const contract = getFormulaContractBySlug(resolveFullLoopContractSlug(slug));
  if (!contract) {
    return [];
  }
  const keys = new Set<string>([
    ...contract.requiredInputs,
    ...contract.criticalInputs,
    ...OPTIONAL_QUOTED_PRICE_KEYS,
  ]);
  return [...keys].sort((left, right) => left.localeCompare(right));
}

export function sanitizeCanonicalInputs(
  slug: string,
  rawValues: PremiumInputValues,
): SanitizeCanonicalInputsResult {
  const allowedKeys = resolveCanonicalInputKeys(slug);
  const allowedSet = new Set(allowedKeys);
  const canonical: Record<string, number> = {};
  const rejectedKeys: string[] = [];

  for (const [key, value] of Object.entries(rawValues)) {
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

/** Maps marginTarget/riskMargin to targetMargin for Mind 1 invariant checks only. */
function inputsForValidationLoop(canonical: KnownInputs): KnownInputs {
  const next = { ...canonical };
  if (Number.isFinite(next.targetMargin)) {
    return next;
  }
  if (Number.isFinite(next.marginTarget)) {
    next.targetMargin = next.marginTarget;
    return next;
  }
  if (Number.isFinite(next.riskMargin)) {
    next.targetMargin = next.riskMargin;
    return next;
  }
  next.targetMargin = 25;
  return next;
}

function blockedResult(input: {
  readonly slug: string;
  readonly loop: ContractCalculationIntelligenceLoopResult;
  readonly canonicalKeys: readonly string[];
  readonly rejectedKeys: readonly string[];
  readonly extraBlockers?: readonly string[];
  readonly missingInputs?: readonly string[];
}): PremiumFullLoopBlockedResult {
  const blockers = [
    ...input.extraBlockers ?? [],
    ...input.loop.blockers,
  ];
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

export function runPremiumFullLoopCalculation(
  slug: string,
  rawValues: PremiumInputValues,
): PremiumFullLoopResult {
  if (!isPremiumFullLoopRuntimeSlug(slug)) {
    throw new Error(`Slug "${slug}" is not registered for full-loop runtime enforcement.`);
  }

  const contractSlug = resolveFullLoopContractSlug(slug);
  const contract = getFormulaContractBySlug(contractSlug);
  if (!contract) {
    throw new Error(`Formula contract not found for "${contractSlug}".`);
  }

  const { canonical, rejectedKeys } = sanitizeCanonicalInputs(slug, rawValues);
  const canonicalKeys = Object.keys(canonical).sort((left, right) => left.localeCompare(right));

  const edgeBlockers = validateContractEdgeRules(slug, canonical, resolveFullLoopContractSlug);
  if (edgeBlockers.length > 0) {
    const preLoop = runContractCalculationIntelligenceLoop({
      contract,
      knownInputs: canonical,
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
    knownInputs: canonical,
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

  const report = calculatePremiumDecisionReport(contractSlug, canonical);
  const calculatedResult = {
    baseCost: report.baseCost,
    p90Cost: report.p90Cost,
    minimumSafePrice: report.minimumSafePrice,
  };

  const postLoop = runContractCalculationIntelligenceLoop({
    contract,
    knownInputs: inputsForValidationLoop(canonical),
    calculatedResult,
  });

  if (postLoop.status !== "SUCCESS" || !postLoop.validationResult?.isValid) {
    return blockedResult({
      slug,
      loop: postLoop,
      canonicalKeys,
      rejectedKeys,
      extraBlockers: postLoop.validationResult?.errors ?? [
        "Validation did not pass — verdict blocked.",
      ],
    });
  }

  return {
    status: "success",
    report,
    toolResult: mapDecisionReportToPremiumToolResult(report),
    trustTrace: buildRuntimeTrustTraceView({
      slug,
      loop: postLoop,
      canonicalInputs: canonicalKeys,
      rejectedKeys,
    }),
    loop: postLoop,
  };
}

export { isPremiumFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
