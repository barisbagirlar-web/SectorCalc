/**
 * Smart form rollout expansion route map - Phase 5I-H deterministic mappings.
 */

import {
  getRolloutBatchHActiveRouteMappings,
  ROLLOUT_BATCH_H_TOOL_DEFINITIONS,
} from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { resolveRolloutCategory } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-eligibility";

export function buildRolloutExpansionRouteMappings(): Readonly<Record<string, string>> {
  const baseMappings = getRolloutBatchHActiveRouteMappings();
  const mappings: Record<string, string> = { ...baseMappings };

  for (const tool of ROLLOUT_BATCH_H_TOOL_DEFINITIONS) {
    const category = resolveRolloutCategory(tool.governanceSlug);
    if (
      category === "eligible_for_calculation_bridge" ||
      category === "eligible_for_render_only" ||
      category === "live_already"
    ) {
      mappings[tool.routeSlug] = tool.governanceSlug;
    }
  }

  return mappings;
}

export function resolveGovernanceSlugFromRoute(routeSlug: string): string | null {
  const mappings = buildRolloutExpansionRouteMappings();
  return mappings[routeSlug] ?? null;
}
