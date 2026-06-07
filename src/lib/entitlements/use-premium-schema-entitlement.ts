"use client";

import { useMemo } from "react";
import { useAdminAuth } from "@/lib/admin/use-admin-auth";
import { useUserPurchases } from "@/lib/billing/use-user-purchases";
import { useUserSubscription } from "@/lib/billing/use-user-subscription";
import {
  buildPremiumCheckoutHref,
  getPremiumEntitlementFromBillingState,
  type PremiumEntitlement,
} from "@/lib/entitlements/premium-entitlements";
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export interface UsePremiumSchemaEntitlementState {
  entitlement: PremiumEntitlement;
  checkoutHref: string;
  loading: boolean;
}

export function usePremiumSchemaEntitlement(
  schema: PremiumCalculatorSchema
): UsePremiumSchemaEntitlementState {
  return usePremiumSchemaEntitlementBySlug(schema.id, schema.legacyPaidSlug);
}

export function usePremiumSchemaEntitlementBySlug(
  schemaSlug: string,
  legacyPaidSlug?: string
): UsePremiumSchemaEntitlementState {
  const { user, subscription, loading: subscriptionLoading } = useUserSubscription();
  const { loading: purchasesLoading, hasSingleReportForTool } = useUserPurchases();
  const { isAdmin, loading: adminLoading } = useAdminAuth();

  const loading = subscriptionLoading || purchasesLoading || adminLoading;

  const hasSingleReportForSchema = useMemo(() => {
    if (hasSingleReportForTool(schemaSlug)) {
      return true;
    }
    if (legacyPaidSlug && hasSingleReportForTool(legacyPaidSlug)) {
      return true;
    }
    return false;
  }, [schemaSlug, legacyPaidSlug, hasSingleReportForTool]);

  const entitlement = useMemo(
    () =>
      getPremiumEntitlementFromBillingState({
        isAdmin,
        subscription,
        userEmail: user?.email ?? null,
        hasSingleReportForSchema,
      }),
    [isAdmin, subscription, user?.email, hasSingleReportForSchema]
  );

  const checkoutHref = useMemo(
    () => buildPremiumCheckoutHref(schemaSlug),
    [schemaSlug]
  );

  return { entitlement, checkoutHref, loading };
}
