import type {
  EntitlementPlan,
  EntitlementSource,
  EntitlementStatus,
  PremiumEntitlementRecord,
} from "@/lib/features/entitlements/entitlement-types";

const ENTITLEMENT_PLANS: readonly EntitlementPlan[] = ["single_report", "pro", "team"];
const ENTITLEMENT_STATUSES: readonly EntitlementStatus[] = [
  "active",
  "expired",
  "canceled",
  "pending",
];
const ENTITLEMENT_SOURCES: readonly EntitlementSource[] = ["stripe_checkout", "admin_manual"];

function isEntitlementPlan(value: unknown): value is EntitlementPlan {
  return typeof value === "string" && ENTITLEMENT_PLANS.includes(value as EntitlementPlan);
}

function isEntitlementStatus(value: unknown): value is EntitlementStatus {
  return typeof value === "string" && ENTITLEMENT_STATUSES.includes(value as EntitlementStatus);
}

function isEntitlementSource(value: unknown): value is EntitlementSource {
  return typeof value === "string" && ENTITLEMENT_SOURCES.includes(value as EntitlementSource);
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function normalizePremiumEntitlementRecord(
  docId: string,
  data: Record<string, unknown> | undefined | null
): PremiumEntitlementRecord | null {
  if (!data || !isEntitlementPlan(data.plan) || !isEntitlementStatus(data.status)) {
    return null;
  }

  const createdAt = readOptionalString(data.createdAt);
  const updatedAt = readOptionalString(data.updatedAt);
  if (!createdAt || !updatedAt) {
    return null;
  }

  const source = isEntitlementSource(data.source) ? data.source : "stripe_checkout";

  return {
    id: readOptionalString(data.id) ?? docId,
    userId: readOptionalString(data.userId),
    stripeCustomerId: readOptionalString(data.stripeCustomerId),
    stripeSessionId: readOptionalString(data.stripeSessionId),
    stripeSubscriptionId: readOptionalString(data.stripeSubscriptionId),
    stripePaymentIntentId: readOptionalString(data.stripePaymentIntentId),
    plan: data.plan,
    status: data.status,
    premiumSlug: readOptionalString(data.premiumSlug),
    reportLimit: readOptionalNumber(data.reportLimit),
    reportsUsed: readOptionalNumber(data.reportsUsed),
    createdAt,
    updatedAt,
    expiresAt: readOptionalString(data.expiresAt),
    source,
  };
}
