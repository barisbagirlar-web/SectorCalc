/**
 * Premium tool full-loop runtime bridge — Mind 2 → canonical calc → Mind 1 validation.
 */

import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  runContractCalculationIntelligenceLoop,
  type ContractCalculationIntelligenceLoopResult,
  type ContractLoopStatus,
} from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";
import {
  isFullLoopRuntimeSlug,
  resolveFullLoopContractSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import type { KnownInputs } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";
import { calculatePremiumDecisionReport } from "@/lib/tools/premium-decision-engine";
import type { PremiumInputValues } from "@/lib/tools/premium-decision-engine";
import type { PremiumDecisionReport } from "@/lib/tools/premium-tool-contract";
import { mapDecisionReportToPremiumToolResult } from "@/lib/tools/premium-decision-bridge";
import type { PremiumToolResult } from "@/lib/tools/premium-tool-results";

const OPTIONAL_QUOTED_PRICE_KEYS = [
  "quotedPrice",
  "quotedMonthlyPrice",
  "quotedBudget",
  "plannedBudget",
  "chargedPrice",
] as const;

export type RuntimeTrustTraceView = {
  readonly slug: string;
  readonly loopStatus: ContractLoopStatus;
  readonly canonicalInputs: readonly string[];
  readonly rejectedKeys: readonly string[];
  readonly requirementStatus: string;
  readonly requiredMissingInputs: readonly string[];
  readonly defaultedInputs: readonly string[];
  readonly acceptedAssumptions: readonly string[];
  readonly validationPassed: boolean;
  readonly validationErrors: readonly string[];
  readonly validationWarnings: readonly string[];
  readonly validationSources: readonly string[];
  readonly limitations: readonly string[];
  readonly formulaPath: readonly string[];
  readonly blockers: readonly string[];
};

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

function normalizeInputNumber(value: number | string | undefined): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

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

function buildTrustTraceView(input: {
  readonly slug: string;
  readonly loop: ContractCalculationIntelligenceLoopResult;
  readonly canonicalInputs: readonly string[];
  readonly rejectedKeys: readonly string[];
}): RuntimeTrustTraceView {
  const contract = getFormulaContractBySlug(input.slug);
  const validation = input.loop.validationResult;

  return {
    slug: input.slug,
    loopStatus: input.loop.status,
    canonicalInputs: input.canonicalInputs,
    rejectedKeys: input.rejectedKeys,
    requirementStatus: input.loop.requirementStatus,
    requiredMissingInputs: input.loop.requiredMissingInputs,
    defaultedInputs: input.loop.defaultedInputs,
    acceptedAssumptions: input.loop.acceptedAssumptions,
    validationPassed: validation?.isValid ?? false,
    validationErrors: validation?.errors ?? [],
    validationWarnings: validation?.warnings ?? [],
    validationSources: [
      "requirement_engine:solveRequiredInputs",
      "runtime_validation:validateCalculationInputsAndResult",
      "invariant_engine:formula_node",
      "boundary_checker:ontology_variables",
    ],
    limitations: contract?.warningPolicy?.modelLimitations ?? [],
    formulaPath: input.loop.derivedResolutionPlan.map((step) => step.variableId),
    blockers: input.loop.blockers,
  };
}

function validateContractEdgeRules(slug: string, knownInputs: KnownInputs): readonly string[] {
  const contract = getFormulaContractBySlug(resolveFullLoopContractSlug(slug));
  if (!contract) {
    return [`Formula contract not found for "${slug}".`];
  }

  const errors: string[] = [];

  for (const rule of contract.validationRules) {
    if (rule.id === "labor-positive") {
      const laborHours = knownInputs.laborHours;
      if (laborHours === undefined || laborHours <= 0) {
        errors.push("Labor hours must be greater than 0.");
      }
    }
    if (rule.id === "rework-percent") {
      const rework = knownInputs.reworkRiskPercent;
      if (rework !== undefined && (rework < 0 || rework > 100)) {
        errors.push("Rework risk must be between 0% and 100%.");
      }
    }
    if (rule.id === "scrap-percent") {
      const scrap = knownInputs.scrapRatePercent;
      if (scrap !== undefined && (scrap < 0 || scrap > 100)) {
        errors.push("Scrap rate must be between 0% and 100%.");
      }
    }
    if (rule.id === "callback-percent") {
      const callback = knownInputs.callbackRiskPercent;
      if (callback !== undefined && (callback < 0 || callback > 100)) {
        errors.push("Callback risk must be between 0% and 100%.");
      }
    }
    if (rule.id === "inspection-percent") {
      const inspection = knownInputs.inspectionRiskPercent;
      if (inspection !== undefined && (inspection < 0 || inspection > 100)) {
        errors.push("Inspection risk must be between 0% and 100%.");
      }
    }
    if (rule.id === "reprint-percent") {
      const reprint = knownInputs.reprintRiskPercent;
      if (reprint !== undefined && (reprint < 0 || reprint > 100)) {
        errors.push("Reprint risk must be between 0% and 100%.");
      }
    }
    if (rule.id === "visits-positive") {
      const visits = knownInputs.visitsPerMonth;
      if (visits !== undefined && visits < 1) {
        errors.push("Visits per month must be at least 1.");
      }
    }
    if (rule.id === "rate-positive") {
      const laborRate = knownInputs.laborRate;
      const machineRate = knownInputs.machineRate;
      if (laborRate !== undefined && laborRate <= 0) {
        errors.push("Labor rate must be greater than 0.");
      }
      if (machineRate !== undefined && machineRate <= 0) {
        errors.push("Machine rate must be greater than 0.");
      }
    }
    if (rule.id === "labor-rate-positive") {
      const laborRate = knownInputs.laborRate;
      if (laborRate !== undefined && laborRate <= 0) {
        errors.push("Labor rate must be greater than 0.");
      }
    }
    if (rule.id === "quantity-min") {
      const quantity = knownInputs.quantity;
      if (quantity !== undefined && quantity < 1) {
        errors.push("Quantity must be at least 1.");
      }
    }
    if (rule.id === "budget-positive") {
      const budget = knownInputs.originalBudget;
      if (budget !== undefined && budget <= 0) {
        errors.push("Original budget must be greater than 0.");
      }
    }
    if (rule.id === "frequency-positive") {
      const frequency = knownInputs.visitFrequency;
      if (frequency !== undefined && frequency < 1) {
        errors.push("Visit frequency must be at least 1.");
      }
    }
    if (rule.id === "menu-price-positive" || rule.id === "price-positive") {
      const menuPrice = knownInputs.menuPrice;
      const productPrice = knownInputs.productPrice;
      if (menuPrice !== undefined && menuPrice <= 0) {
        errors.push("Menu price must be greater than 0.");
      }
      if (productPrice !== undefined && productPrice <= 0) {
        errors.push("Product price must be greater than 0.");
      }
    }
    if (rule.id === "area-positive") {
      const areaSize = knownInputs.areaSize;
      if (areaSize !== undefined && areaSize <= 0) {
        errors.push("Area size must be greater than 0.");
      }
    }
    if (rule.id === "weather-percent") {
      const weather = knownInputs.weatherDelayRiskPercent;
      if (weather !== undefined && (weather < 0 || weather > 100)) {
        errors.push("Weather delay risk must be between 0% and 100%.");
      }
    }
    if (rule.id === "touchup-percent") {
      const touchUp = knownInputs.touchUpRiskPercent;
      if (touchUp !== undefined && (touchUp < 0 || touchUp > 100)) {
        errors.push("Touch-up risk must be between 0% and 100%.");
      }
    }
    if (rule.id === "waste-percent") {
      const waste = knownInputs.wasteRate;
      if (waste !== undefined && (waste < 0 || waste > 100)) {
        errors.push("Waste rate must be between 0% and 100%.");
      }
    }
    if (rule.id === "commission-percent") {
      const commission = knownInputs.deliveryCommission;
      if (commission !== undefined && (commission < 0 || commission > 100)) {
        errors.push("Delivery commission must be between 0% and 100%.");
      }
    }
    if (rule.id === "return-percent") {
      const returnRate = knownInputs.returnRate;
      if (returnRate !== undefined && (returnRate < 0 || returnRate > 100)) {
        errors.push("Return rate must be between 0% and 100%.");
      }
    }
    if (rule.id === "margin-percent") {
      const margin =
        knownInputs.targetMargin ?? knownInputs.marginTarget ?? knownInputs.riskMargin;
      if (margin !== undefined && (margin < 0 || margin > 100)) {
        errors.push("Target margin must be between 0% and 100%.");
      }
    }
  }

  for (const key of contract.requiredInputs) {
    const value = knownInputs[key];
    if (value === undefined) {
      errors.push(`Missing required input: ${key}.`);
    } else if (value < 0) {
      errors.push(`${key} must be non-negative.`);
    }
  }

  return errors;
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
    trustTrace: buildTrustTraceView({
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
  if (!isFullLoopRuntimeSlug(slug)) {
    throw new Error(`Slug "${slug}" is not registered for full-loop runtime enforcement.`);
  }

  const contractSlug = resolveFullLoopContractSlug(slug);
  const contract = getFormulaContractBySlug(contractSlug);
  if (!contract) {
    throw new Error(`Formula contract not found for "${contractSlug}".`);
  }

  const { canonical, rejectedKeys, allowedKeys } = sanitizeCanonicalInputs(slug, rawValues);
  const canonicalKeys = Object.keys(canonical).sort((left, right) => left.localeCompare(right));

  const edgeBlockers = validateContractEdgeRules(slug, canonical);
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
    trustTrace: buildTrustTraceView({
      slug,
      loop: postLoop,
      canonicalInputs: canonicalKeys,
      rejectedKeys,
    }),
    loop: postLoop,
  };
}

export function isPremiumFullLoopRuntimeSlug(slug: string): boolean {
  return isFullLoopRuntimeSlug(slug);
}
