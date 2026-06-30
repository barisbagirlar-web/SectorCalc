import type { PremiumEntitlementLevel } from "@/lib/features/entitlements/premium-entitlements";
import type { PremiumEntitlementRecord } from "@/lib/features/entitlements/entitlement-types";

export function isEntitlementRecordActive(record: PremiumEntitlementRecord): boolean {
  if (record.status !== "active") {
    return false;
  }
  if (record.expiresAt) {
    const expiresAtMs = Date.parse(record.expiresAt);
    if (Number.isFinite(expiresAtMs) && expiresAtMs < Date.now()) {
      return false;
    }
  }
  return true;
}

export function hasSingleReportEntitlementForSlug(
  record: PremiumEntitlementRecord,
  premiumSlug: string
): boolean {
  if (record.plan !== "single_report" || !isEntitlementRecordActive(record)) {
    return false;
  }

  const limit = record.reportLimit ?? 1;
  const used = record.reportsUsed ?? 0;
  if (used >= limit) {
    return false;
  }

  if (record.premiumSlug && record.premiumSlug !== premiumSlug) {
    return false;
  }

  return true;
}

export function resolveEntitlementLevelFromRecords(
  records: readonly PremiumEntitlementRecord[],
  premiumSlug: string
): PremiumEntitlementLevel {
  const activeRecords = records.filter(isEntitlementRecordActive);

  if (activeRecords.some((record) => record.plan === "pro")) {
    return "pro";
  }

  if (activeRecords.some((record) => record.plan === "team")) {
    return "team";
  }

  if (activeRecords.some((record) => hasSingleReportEntitlementForSlug(record, premiumSlug))) {
    return "single_report";
  }

  return "preview";
}

export function getActiveEntitlementsForUser(
  records: readonly PremiumEntitlementRecord[],
  userId: string
): readonly PremiumEntitlementRecord[] {
  return records.filter(
    (record) => record.userId === userId && isEntitlementRecordActive(record)
  );
}

export function getEntitlementForPremiumSlug(
  records: readonly PremiumEntitlementRecord[],
  userId: string,
  premiumSlug: string
): PremiumEntitlementRecord | null {
  const active = getActiveEntitlementsForUser(records, userId);

  const subscriptionMatch = active.find(
    (record) => record.plan === "pro" || record.plan === "team"
  );
  if (subscriptionMatch) {
    return subscriptionMatch;
  }

  return (
    active.find((record) => hasSingleReportEntitlementForSlug(record, premiumSlug)) ?? null
  );
}

export function hasActivePremiumAccess(
  records: readonly PremiumEntitlementRecord[],
  userId: string,
  premiumSlug: string
): boolean {
  const level = resolveEntitlementLevelFromRecords(
    getActiveEntitlementsForUser(records, userId),
    premiumSlug
  );
  return level === "pro" || level === "team" || level === "single_report";
}
