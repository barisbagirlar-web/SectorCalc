import { getFormulaContractBySlug } from "@/lib/features/formula-governance/contracts";
import { getFormulaSourceAuditStatus } from "@/lib/features/formula-governance/formula-source-audit-registry";
import { getAnyProductionFormulaLocator } from "@/lib/features/formula-governance/oracle/production-formula-locator";
import {
  getPremiumSchemaExtendedProductionFormulaLocator,
  isPremiumSchemaExtendedProductionSlug,
} from "@/lib/features/formula-governance/oracle/premium-schema-extended-production-locators";
import {
  isFreeFullLoopRuntimeSlug,
  isFullLoopRuntimeSlug,
  isPremiumFullLoopRuntimeSlug,
  resolveFullLoopContractSlug,
} from "@/lib/features/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  getPremiumCalculatorSchema,
  getPremiumSchemaForPaidSlug,
} from "@/lib/features/premium-schema/schema-registry";
import { getToolGuideSpec } from "@/lib/features/tool-guides/premium-input-guide-specs";
import { hasDedicatedTrafficCalculator } from "@/lib/features/tools/free-traffic-calculators";
import {
  getRevenueToolByFreeSlug,
  getRevenueToolByPaidSlug,
  getRevenueToolByPremiumRouteSlug,
} from "@/lib/features/tools/revenue-tools";
import { ERT_PROBLEM_SLUG } from "@/lib/features/tools/runtime-trust-engine";
import { getP24VerdictForSlug } from "@/lib/features/tools/runtime-readiness-p24-verdicts";

/** P8 — permanently blocked from calculation bridge activation. */
export const P8_SAFETY_BLOCKED_SLUGS: ReadonlySet<string> = new Set([
  "feed-efficiency-analyzer",
]);

export type ToolBackingCheck = {
  readonly slug: string;
  readonly calculatorExists: boolean;
  readonly validationExists: boolean;
  readonly contractExists: boolean;
  readonly guideExists: boolean;
  readonly oracleExists: boolean;
  readonly isManualExpert: boolean;
  readonly isBlockedSafety: boolean;
  readonly isProblemLocked: boolean;
  readonly isComplete: boolean;
};

function hasFormulaContract(slug: string): boolean {
  if (getFormulaContractBySlug(slug)) {
    return true;
  }
  const aliasSlug = resolveFullLoopContractSlug(slug);
  return aliasSlug !== slug && Boolean(getFormulaContractBySlug(aliasSlug));
}

function resolvePremiumSchema(slug: string) {
  return getPremiumSchemaForPaidSlug(slug) ?? getPremiumCalculatorSchema(slug);
}

function calculatorExists(slug: string): boolean {
  if (resolvePremiumSchema(slug)) {
    return true;
  }
  if (hasDedicatedTrafficCalculator(slug)) {
    return true;
  }
  if (getRevenueToolByPaidSlug(slug) || getRevenueToolByFreeSlug(slug)) {
    return true;
  }
  if (getAnyProductionFormulaLocator(slug)) {
    return true;
  }
  if (isPremiumSchemaExtendedProductionSlug(slug)) {
    return Boolean(getPremiumSchemaExtendedProductionFormulaLocator(slug));
  }
  return false;
}

function validationExists(slug: string): boolean {
  const audit = getFormulaSourceAuditStatus(slug);
  if (audit?.checks.hasValidation) {
    return true;
  }
  if (isFullLoopRuntimeSlug(slug)) {
    return true;
  }
  if (isPremiumSchemaExtendedProductionSlug(slug) && hasFormulaContract(slug)) {
    return true;
  }
  if (!hasFormulaContract(slug)) {
    return false;
  }
  if (resolvePremiumSchema(slug) || hasDedicatedTrafficCalculator(slug)) {
    return true;
  }
  if (getRevenueToolByPaidSlug(slug) || getRevenueToolByFreeSlug(slug)) {
    return true;
  }
  return false;
}

function oracleExists(slug: string): boolean {
  const locator = getAnyProductionFormulaLocator(slug);
  if (locator?.comparisonWired) {
    return true;
  }
  if (isPremiumSchemaExtendedProductionSlug(slug)) {
    const extended = getPremiumSchemaExtendedProductionFormulaLocator(slug);
    if (extended?.comparisonWired) {
      return true;
    }
  }
  const audit = getFormulaSourceAuditStatus(slug);
  if (audit?.checks.hasTests) {
    return true;
  }
  const contract =
    getFormulaContractBySlug(slug) ?? getFormulaContractBySlug(resolveFullLoopContractSlug(slug));
  if (contract?.propertyTestsRegistered || (contract?.scenarioTests?.length ?? 0) > 0) {
    return true;
  }
  return false;
}

function guideExists(slug: string): boolean {
  return getToolGuideSpec(slug) !== null;
}

function isManualExpert(slug: string): boolean {
  return getP24VerdictForSlug(slug) === "QUARANTINE";
}

function isBlockedSafety(slug: string): boolean {
  return P8_SAFETY_BLOCKED_SLUGS.has(slug.trim());
}

function isProblemLocked(slug: string): boolean {
  return slug.trim() === ERT_PROBLEM_SLUG;
}

/** Resolve premium-schema tier inputs from backing when native registry misses slug id. */
export function resolvePremiumSchemaFromBacking(slug: string) {
  return resolvePremiumSchema(slug);
}

export function checkToolBacking(slug: string): ToolBackingCheck {
  const normalized = slug.trim();
  const calculator = calculatorExists(normalized);
  const validation = validationExists(normalized);
  const contract = hasFormulaContract(normalized);
  const guide = guideExists(normalized);
  const oracle = oracleExists(normalized);
  const expert = isManualExpert(normalized);
  const safety = isBlockedSafety(normalized);
  const locked = isProblemLocked(normalized);

  const complete =
    calculator &&
    validation &&
    contract &&
    guide &&
    oracle &&
    !expert &&
    !safety &&
    !locked;

  return {
    slug: normalized,
    calculatorExists: calculator,
    validationExists: validation,
    contractExists: contract,
    guideExists: guide,
    oracleExists: oracle,
    isManualExpert: expert,
    isBlockedSafety: safety,
    isProblemLocked: locked,
    isComplete: complete,
  };
}

export function isToolBackingActivationEligible(slug: string): boolean {
  return checkToolBacking(slug).isComplete;
}

export function resolveRuntimeTierFromBacking(
  slug: string,
  currentTier: "free" | "premium" | "premium-schema" | "legacy" | "unknown",
): "free" | "premium" | "premium-schema" | "legacy" | "unknown" {
  if (currentTier !== "unknown") {
    return currentTier;
  }
  if (resolvePremiumSchema(slug)) {
    return "premium-schema";
  }
  if (getRevenueToolByPaidSlug(slug) || getRevenueToolByPremiumRouteSlug(slug)) {
    return "premium";
  }
  if (getRevenueToolByFreeSlug(slug) || hasDedicatedTrafficCalculator(slug)) {
    return "free";
  }
  if (isPremiumFullLoopRuntimeSlug(slug) || isFreeFullLoopRuntimeSlug(slug)) {
    return resolvePremiumSchema(slug) ? "premium-schema" : "premium";
  }
  return currentTier;
}
