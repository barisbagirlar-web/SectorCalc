import {
  getActiveEntitlementsForUser,
  hasActivePremiumAccess,
  resolveEntitlementLevelFromRecords,
} from "@/lib/entitlements/entitlement-mapping";
import { normalizePremiumEntitlementRecord } from "@/lib/entitlements/normalize-entitlement-record";
import type { PremiumEntitlementRecord } from "@/lib/entitlements/entitlement-types";
import {
  getPremiumEntitlement,
  type PremiumEntitlement,
} from "@/lib/entitlements/premium-entitlements";

export function normalizePremiumEntitlementDocuments(
  docs: readonly { readonly id: string; readonly data: Record<string, unknown> }[]
): PremiumEntitlementRecord[] {
  const records: PremiumEntitlementRecord[] = [];
  for (const doc of docs) {
    const normalized = normalizePremiumEntitlementRecord(doc.id, doc.data);
    if (normalized) {
      records.push(normalized);
    }
  }
  return records;
}

export { getActiveEntitlementsForUser, hasActivePremiumAccess };

export function mapEntitlementsToPremiumEntitlement(
  records: readonly PremiumEntitlementRecord[],
  premiumSlug: string,
  userId?: string
): PremiumEntitlement {
  const scopedRecords = userId
    ? getActiveEntitlementsForUser(records, userId)
    : records.filter((record) => record.status === "active");

  const level = resolveEntitlementLevelFromRecords(scopedRecords, premiumSlug);
  return getPremiumEntitlement({ level });
}

export function getEntitlementForPremiumSlug(
  records: readonly PremiumEntitlementRecord[],
  userId: string,
  premiumSlug: string
): PremiumEntitlementRecord | null {
  const active = getActiveEntitlementsForUser(records, userId);
  const subscription = active.find((record) => record.plan === "pro" || record.plan === "team");
  if (subscription) {
    return subscription;
  }
  return (
    active.find(
      (record) =>
        record.plan === "single_report" &&
        (!record.premiumSlug || record.premiumSlug === premiumSlug)
    ) ?? null
  );
}
