import {
  getBillingPlanById,
  isBillingPlanId,
  resolveSafeReturnPath,
  type BillingPlanId,
} from "@/lib/features/billing/billing-config";
import type { EntitlementPlan } from "@/lib/features/entitlements/entitlement-types";
import { listPremiumSchemaSlugs } from "@/lib/features/premium-schema/schemas/index";

const KNOWN_PREMIUM_SLUGS = new Set(listPremiumSchemaSlugs());

export type CheckoutMetadataInput = {
  readonly planId?: string;
  readonly premiumSlug?: string;
  readonly returnPath?: string;
  readonly userId?: string;
};

export type ValidatedCheckoutMetadata = {
  readonly planId: BillingPlanId;
  readonly entitlementLevel: EntitlementPlan;
  readonly premiumSlug?: string;
  readonly returnPath: string;
  readonly userId?: string;
  readonly createdBy: "sectorcalc";
};

export function isValidReturnPath(returnPath: string | undefined): boolean {
  const resolved = resolveSafeReturnPath(returnPath);
  const trimmed = returnPath?.trim() ?? "";
  return trimmed.length > 0 && resolved === trimmed;
}

export function isKnownPremiumSlug(slug: string | undefined): boolean {
  if (!slug) {
    return false;
  }
  const trimmed = slug.trim();
  return trimmed.length >= 2 && KNOWN_PREMIUM_SLUGS.has(trimmed);
}

export function sanitizePremiumSlug(slug: string | undefined): string | undefined {
  if (!slug) {
    return undefined;
  }
  const trimmed = slug.trim();
  if (!isKnownPremiumSlug(trimmed)) {
    return undefined;
  }
  return trimmed;
}

export function validateCheckoutMetadata(
  input: CheckoutMetadataInput
): ValidatedCheckoutMetadata | null {
  const planIdRaw = input.planId?.trim();
  if (!planIdRaw || !isBillingPlanId(planIdRaw)) {
    return null;
  }

  if (!isValidReturnPath(input.returnPath)) {
    return null;
  }

  const userId = input.userId?.trim();
  if (userId !== undefined && userId.length === 0) {
    return null;
  }

  const plan = getBillingPlanById(planIdRaw);
  const premiumSlug = sanitizePremiumSlug(input.premiumSlug);

  return {
    planId: planIdRaw,
    entitlementLevel: plan.entitlementLevel,
    premiumSlug,
    returnPath: resolveSafeReturnPath(input.returnPath),
    userId,
    createdBy: "sectorcalc",
  };
}

export function mapLegacyCheckoutPlanToPlanId(plan: string): BillingPlanId | null {
  switch (plan) {
    case "single_report":
      return "single_report";
    case "team":
      return "team_monthly";
    case "pro":
    case "pro_annual":
      return "pro_monthly";
    default:
      return null;
  }
}

export function mapLegacyCheckoutPlanToEntitlementPlan(plan: string): EntitlementPlan | null {
  switch (plan) {
    case "single_report":
      return "single_report";
    case "team":
      return "team";
    case "pro":
    case "pro_annual":
      return "pro";
    default:
      return null;
  }
}
