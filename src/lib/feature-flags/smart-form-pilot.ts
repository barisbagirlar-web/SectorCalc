/**
 * Smart form pilot feature flag — Phase 5H-G-D/G (multi-pilot; single env flag).
 */

import {
  AUTO_SHOP_PILOT_FREE_ROUTE_SLUG,
  resolvePilotGovernanceSlugFromRoute,
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
} from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

/** @deprecated Use THREE_D_PRINT_PILOT_GOVERNANCE_SLUG — kept for backward-compatible imports. */
export const SMART_FORM_PILOT_SLUG = THREE_D_PRINT_PILOT_GOVERNANCE_SLUG;

export const SMART_FORM_PILOT_FREE_ROUTE_SLUGS = [
  THREE_D_PRINT_PILOT_GOVERNANCE_SLUG,
  AUTO_SHOP_PILOT_FREE_ROUTE_SLUG,
] as const;

export function isSmartFormPilotEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_SMART_FORM_PILOT?.trim().toLowerCase();
  return raw === "true" || raw === "1";
}

export function isSmartFormPilotSlug(slug: string): boolean {
  return resolvePilotGovernanceSlugFromRoute(slug) !== null;
}

export function shouldUseSmartFormPilot(routeSlug: string): boolean {
  return isSmartFormPilotEnabled() && isSmartFormPilotSlug(routeSlug);
}

export function resolveSmartFormPilotGovernanceSlug(routeSlug: string): string | null {
  if (!isSmartFormPilotEnabled()) {
    return null;
  }
  return resolvePilotGovernanceSlugFromRoute(routeSlug);
}
