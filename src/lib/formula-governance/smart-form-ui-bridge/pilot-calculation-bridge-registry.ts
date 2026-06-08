/**
 * Smart form pilot calculation bridge registry — Phase 5H-G-G.
 */

import {
  AUTO_SHOP_PILOT_SUBMIT_KEYS,
  THREE_D_PRINT_PILOT_SUBMIT_KEYS,
} from "@/components/tools/smart-form/pilot-calculation-bridge-keys";

export const THREE_D_PRINT_PILOT_GOVERNANCE_SLUG = "3d-print-cost-check" as const;
export const AUTO_SHOP_PILOT_GOVERNANCE_SLUG = "auto-shop-margin-leak-detector" as const;
export const AUTO_SHOP_PILOT_FREE_ROUTE_SLUG = "repair-time-vs-price-check" as const;

export const PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS = [
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
  AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
] as const;

export type PilotCalculationBridgeGovernanceSlug =
  (typeof PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS)[number];

const FREE_ROUTE_TO_GOVERNANCE_SLUG: Readonly<Record<string, PilotCalculationBridgeGovernanceSlug>> =
  {
    [THREE_D_PRINT_PILOT_GOVERNANCE_SLUG]: THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
    [AUTO_SHOP_PILOT_FREE_ROUTE_SLUG]: AUTO_SHOP_PILOT_GOVERNANCE_SLUG,
  };

export function resolvePilotGovernanceSlugFromRoute(routeSlug: string): string | null {
  if (routeSlug in FREE_ROUTE_TO_GOVERNANCE_SLUG) {
    return FREE_ROUTE_TO_GOVERNANCE_SLUG[routeSlug];
  }
  if (
    PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS.includes(
      routeSlug as PilotCalculationBridgeGovernanceSlug,
    )
  ) {
    return routeSlug;
  }
  return null;
}

export function getPilotMappedSubmitKeys(governanceSlug: string): readonly string[] {
  switch (governanceSlug) {
    case THREE_D_PRINT_PILOT_GOVERNANCE_SLUG:
      return THREE_D_PRINT_PILOT_SUBMIT_KEYS;
    case AUTO_SHOP_PILOT_GOVERNANCE_SLUG:
      return AUTO_SHOP_PILOT_SUBMIT_KEYS;
    default:
      return [];
  }
}

export function isPilotCalculationBridgeEnabled(governanceSlug: string): boolean {
  return PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS.includes(
    governanceSlug as PilotCalculationBridgeGovernanceSlug,
  );
}

export function getPilotCalculationBridgeMappedInputCount(governanceSlug: string): number {
  return getPilotMappedSubmitKeys(governanceSlug).length;
}
