/**
 * Smart form pilot feature flag - disabled during regeneration baseline.
 */

import { resolvePilotGovernanceSlugFromRoute } from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";

export const SMART_FORM_PILOT_SLUG = "3d-print-cost-check";
export const SMART_FORM_PILOT_FREE_ROUTE_SLUGS: readonly string[] = [];

export function isSmartFormPilotEnabled(): boolean {
  return false;
}

export function isSmartFormPilotSlug(_slug: string): boolean {
  return false;
}

export function shouldUseSmartFormPilot(_routeSlug: string): boolean {
  return false;
}

export function resolveSmartFormPilotGovernanceSlug(_routeSlug: string): string | null {
  return resolvePilotGovernanceSlugFromRoute(_routeSlug);
}
