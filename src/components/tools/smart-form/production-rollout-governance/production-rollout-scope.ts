/**
 * Smart form production rollout scope — Phase 5I-L live pilot protection.
 */

import { ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS, ROLLOUT_BATCH_H_TOOL_DEFINITIONS } from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { resolveRolloutCategory } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-eligibility";
import type { ProductionRolloutToolEntry, ProductionRolloutToolStatus } from "@/components/tools/smart-form/production-rollout-governance/production-rollout-types";

function resolveProductionStatus(governanceSlug: string): ProductionRolloutToolStatus {
  if ((ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS as readonly string[]).includes(governanceSlug)) {
    return "live_pilot";
  }

  const category = resolveRolloutCategory(governanceSlug);
  if (category === "eligible_for_calculation_bridge") {
    return "staging_only";
  }
  if (category === "eligible_for_render_only") {
    return "preview_only";
  }
  return "blocked";
}

export function buildProductionRolloutScope(): readonly ProductionRolloutToolEntry[] {
  return ROLLOUT_BATCH_H_TOOL_DEFINITIONS.map((tool) => ({
    governanceSlug: tool.governanceSlug,
    routeSlug: tool.routeSlug,
    status: resolveProductionStatus(tool.governanceSlug),
    humanApprovalRequired: true as const,
    deployRequired: false as const,
  }));
}
