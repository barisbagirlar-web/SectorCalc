/**
 * Premium report access gate — pure helpers for preview vs full export payloads.
 */

import {
  buildPremiumCheckoutHref,
  isPremiumExportAllowed,
  limitPreviewThresholdCount,
  type PremiumEntitlement,
} from "@/lib/entitlements/premium-entitlements";
import type { PremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";

export function gatePremiumReportExportPayload(
  payload: PremiumReportExportPayload,
  entitlement: PremiumEntitlement
): PremiumReportExportPayload {
  if (entitlement.canViewFullReport) {
    return payload;
  }

  return {
    ...payload,
    hiddenDrivers: [],
    suggestedActions: [],
    assumptions: [],
    thresholds: limitPreviewThresholdCount(payload.thresholds, 2),
  };
}

export function isPremiumReportExportEnabled(entitlement: PremiumEntitlement): boolean {
  return isPremiumExportAllowed(entitlement);
}

export function resolvePremiumCheckoutHref(
  schemaSlug: string,
  checkoutHref?: string
): string {
  return buildPremiumCheckoutHref(schemaSlug, checkoutHref);
}
