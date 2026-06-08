/**
 * Smart form rollout expansion fallback policy — Phase 5I-H flag + route gating.
 */

import { isSmartFormPilotEnabled } from "@/lib/feature-flags/smart-form-pilot";
import { resolveGovernanceSlugFromRoute } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-route-map";
import { resolveRolloutCategory } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-eligibility";

export type SmartFormResolution = "classic_form" | "smart_form";

export function resolveSmartFormForRoute(
  routeSlug: string,
  manifestResolveError = false,
): SmartFormResolution {
  if (!isSmartFormPilotEnabled()) {
    return "classic_form";
  }

  if (manifestResolveError) {
    return "classic_form";
  }

  const governanceSlug = resolveGovernanceSlugFromRoute(routeSlug);
  if (!governanceSlug) {
    return "classic_form";
  }

  const category = resolveRolloutCategory(governanceSlug);
  if (
    category === "live_already" ||
    category === "eligible_for_calculation_bridge" ||
    category === "eligible_for_render_only"
  ) {
    return "smart_form";
  }

  return "classic_form";
}

export function shouldFallbackToClassicForm(routeSlug: string): boolean {
  return resolveSmartFormForRoute(routeSlug) === "classic_form";
}
