/**
 * Premium schema report entitlement — adapter over billing/subscription state.
 */

import { resolveEntitlementLevelFromRecords } from "@/lib/entitlements/entitlement-mapping";
import type { PremiumEntitlementRecord } from "@/lib/entitlements/entitlement-types";
import {
  hasProAccess,
  isDevelopmentProBypass,
  isProBypassEmail,
  type SubscriptionPlanId,
  type UserSubscription,
} from "@/lib/billing/subscription";

export type PremiumEntitlementLevel =
  | "none"
  | "preview"
  | "single_report"
  | "pro"
  | "team"
  | "admin";

export interface PremiumEntitlement {
  readonly level: PremiumEntitlementLevel;
  readonly canViewFullReport: boolean;
  readonly canExportPdf: boolean;
  readonly canExportCsv: boolean;
  readonly canSaveReport: boolean;
  readonly canViewAdvancedDrivers: boolean;
}

export interface PremiumEntitlementInput {
  readonly level?: PremiumEntitlementLevel;
  readonly isAdmin?: boolean;
  readonly hasProSubscription?: boolean;
  readonly subscriptionPlan?: SubscriptionPlanId;
  readonly hasSingleReportForSchema?: boolean;
  readonly isDevelopmentBypass?: boolean;
  readonly userEmail?: string | null;
}

/**
 * Client-side checkout session_id must never grant full entitlement without server verification.
 */
export function isClientCheckoutSessionTrusted(_sessionId?: string | null): false {
  return false;
}

const FULL_ACCESS_LEVELS: readonly PremiumEntitlementLevel[] = [
  "admin",
  "pro",
  "team",
  "single_report",
];

export const PREVIEW_ENTITLEMENT: PremiumEntitlement = {
  level: "preview",
  canViewFullReport: false,
  canExportPdf: false,
  canExportCsv: false,
  canSaveReport: false,
  canViewAdvancedDrivers: false,
};

export const FULL_ENTITLEMENT: PremiumEntitlement = {
  level: "pro",
  canViewFullReport: true,
  canExportPdf: true,
  canExportCsv: true,
  canSaveReport: true,
  canViewAdvancedDrivers: true,
};

export function resolvePremiumEntitlementLevel(
  input: PremiumEntitlementInput
): PremiumEntitlementLevel {
  if (input.isAdmin) {
    return "admin";
  }

  if (
    input.isDevelopmentBypass ||
    isProBypassEmail(input.userEmail ?? null) ||
    input.hasProSubscription
  ) {
    if (input.subscriptionPlan === "team") {
      return "team";
    }
    return "pro";
  }

  if (input.hasSingleReportForSchema) {
    return "single_report";
  }

  if (input.level === "none") {
    return "none";
  }

  return input.level ?? "preview";
}

function buildEntitlementFlags(level: PremiumEntitlementLevel): PremiumEntitlement {
  const hasFullAccess = FULL_ACCESS_LEVELS.includes(level);

  return {
    level,
    canViewFullReport: hasFullAccess,
    canExportPdf: hasFullAccess,
    canExportCsv: hasFullAccess,
    canSaveReport: hasFullAccess,
    canViewAdvancedDrivers: hasFullAccess,
  };
}

export function getPremiumEntitlement(input: PremiumEntitlementInput = {}): PremiumEntitlement {
  const level = resolvePremiumEntitlementLevel(input);
  return buildEntitlementFlags(level);
}

export function getPremiumEntitlementFromBillingState(options: {
  isAdmin?: boolean;
  subscription?: UserSubscription | null;
  userEmail?: string | null;
  hasSingleReportForSchema?: boolean;
  entitlementRecords?: readonly PremiumEntitlementRecord[];
  premiumSlug?: string;
}): PremiumEntitlement {
  if (options.isAdmin) {
    return getPremiumEntitlement({ isAdmin: true });
  }

  if (isDevelopmentProBypass() || isProBypassEmail(options.userEmail ?? null)) {
    const hasProSubscription = hasProAccess(options.subscription ?? null, options.userEmail);
    const subscriptionPlan =
      hasProSubscription && options.subscription?.plan ? options.subscription.plan : undefined;
    return getPremiumEntitlement({
      hasProSubscription: true,
      subscriptionPlan,
      isDevelopmentBypass: isDevelopmentProBypass(),
      userEmail: options.userEmail,
    });
  }

  if (options.entitlementRecords && options.premiumSlug) {
    const recordLevel = resolveEntitlementLevelFromRecords(
      options.entitlementRecords,
      options.premiumSlug
    );
    if (recordLevel !== "preview") {
      return getPremiumEntitlement({ level: recordLevel });
    }
  }

  const hasProSubscription = hasProAccess(options.subscription ?? null, options.userEmail);
  const subscriptionPlan =
    hasProSubscription && options.subscription?.plan ? options.subscription.plan : undefined;

  return getPremiumEntitlement({
    hasProSubscription,
    subscriptionPlan,
    hasSingleReportForSchema: options.hasSingleReportForSchema,
    isDevelopmentBypass: isDevelopmentProBypass(),
    userEmail: options.userEmail,
  });
}

export function isPremiumExportAllowed(entitlement: PremiumEntitlement): boolean {
  return entitlement.canExportPdf || entitlement.canExportCsv;
}

export function limitPreviewThresholdCount<T>(items: readonly T[], maxItems = 2): readonly T[] {
  if (items.length <= maxItems) {
    return items;
  }
  return items.slice(0, maxItems);
}

export function buildPremiumCheckoutHref(
  schemaSlug: string,
  checkoutHref?: string
): string {
  const trimmed = checkoutHref?.trim();
  if (trimmed) {
    return trimmed;
  }
  return `/pricing?tool=${encodeURIComponent(schemaSlug)}`;
}

export function buildPremiumPricingHref(schemaSlug: string): string {
  return `/pricing?tool=${encodeURIComponent(schemaSlug)}`;
}
