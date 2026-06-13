/**
 * Shared helpers for premium and free full-loop runtime bridges.
 */

import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import {
  runContractCalculationIntelligenceLoop,
  type ContractCalculationIntelligenceLoopResult,
  type ContractLoopStatus,
} from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";
import type { KnownInputs } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";

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

export function normalizeInputNumber(value: number | string | undefined): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const parsed = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function buildRuntimeTrustTraceView(input: {
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

export function validateContractEdgeRules(
  slug: string,
  knownInputs: KnownInputs,
  resolveContractSlug: (slug: string) => string,
): readonly string[] {
  const contract = getFormulaContractBySlug(resolveContractSlug(slug));
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
      const waste =
        knownInputs.wasteRate ??
        knownInputs.wasteRatePercent ??
        knownInputs.deadlinePressureWastePercent;
      if (waste !== undefined && (waste < 0 || waste > 100)) {
        errors.push("Waste rate must be between 0% and 100%.");
      }
    }
    if (rule.id === "change-non-negative") {
      const changeEstimate = knownInputs.changeEstimate;
      if (changeEstimate !== undefined && changeEstimate < 0) {
        errors.push("Change estimate must be non-negative.");
      }
    }
    if (rule.id === "staff-positive") {
      const staffCount = knownInputs.staffCount;
      if (staffCount !== undefined && staffCount <= 0) {
        errors.push("Staff count must be greater than 0.");
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
        errors.push("Return rate must be between 0% and 100.");
      }
    }
    if (rule.id === "margin-percent") {
      const margin =
        knownInputs.targetMargin ?? knownInputs.marginTarget ?? knownInputs.riskMargin;
      if (margin !== undefined && (margin < 0 || margin > 100)) {
        errors.push("Target margin must be between 0% and 100%.");
      }
    }
    if (rule.id === "percent-bounds") {
      const overheadRate = knownInputs.overheadRate;
      const contingencyRate = knownInputs.contingencyRate;
      if (overheadRate !== undefined && (overheadRate < 0 || overheadRate > 100)) {
        errors.push("Overhead rate must be between 0% and 100%.");
      }
      if (contingencyRate !== undefined && (contingencyRate < 0 || contingencyRate > 100)) {
        errors.push("Contingency rate must be between 0% and 100%.");
      }
    }
    if (rule.id === "platform-fee-percent" || rule.id === "payment-fee-percent") {
      const platformFeeRate = knownInputs.platformFeeRate;
      const paymentFeeRate = knownInputs.paymentFeeRate;
      if (platformFeeRate !== undefined && (platformFeeRate < 0 || platformFeeRate > 100)) {
        errors.push("Platform fee rate must be between 0% and 100%.");
      }
      if (paymentFeeRate !== undefined && (paymentFeeRate < 0 || paymentFeeRate > 100)) {
        errors.push("Payment fee rate must be between 0% and 100%.");
      }
    }
    if (rule.id === "denominator-guard") {
      const coveragePerUnit = knownInputs.coveragePerUnit;
      if (coveragePerUnit !== undefined && coveragePerUnit <= 0) {
        errors.push("Coverage per unit must be greater than 0.");
      }
      const coats = knownInputs.coats;
      if (coats !== undefined && coats <= 0) {
        errors.push("Coats must be greater than 0.");
      }
      const days = knownInputs.days;
      if (days !== undefined && days <= 0) {
        errors.push("Days must be greater than 0.");
      }
      const fixtureCount = knownInputs.fixtureCount;
      if (fixtureCount !== undefined && fixtureCount <= 0) {
        errors.push("Fixture count must be greater than 0.");
      }
      const areaM2 = knownInputs.areaM2;
      if (areaM2 !== undefined && areaM2 <= 0) {
        errors.push("Area (m²) must be greater than 0.");
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

export function blockedFullLoopResult<TBlocked extends { status: "blocked" }>(input: {
  readonly slug: string;
  readonly loop: ContractCalculationIntelligenceLoopResult;
  readonly canonicalKeys: readonly string[];
  readonly rejectedKeys: readonly string[];
  readonly extraBlockers?: readonly string[];
  readonly missingInputs?: readonly string[];
  readonly build: (trustTrace: RuntimeTrustTraceView) => TBlocked;
}): TBlocked {
  const blockers = [...input.extraBlockers ?? [], ...input.loop.blockers];
  const missingInputs = input.missingInputs ?? input.loop.requiredMissingInputs;

  return input.build(
    buildRuntimeTrustTraceView({
      slug: input.slug,
      loop: input.loop,
      canonicalInputs: input.canonicalKeys,
      rejectedKeys: input.rejectedKeys,
    }),
  );
}

export { runContractCalculationIntelligenceLoop };
