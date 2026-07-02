/**
 * Smart form rollout expansion eligibility - Phase 5I-H category resolver.
 */

import { ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS } from "@/lib/features/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import {
  isPilotCalculationBridgeEnabled,
  PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS,
} from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import {
  ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS,
  ROLLOUT_BATCH_H_TOOL_DEFINITIONS,
} from "@/components/tools/smart-form/rollout-batch-h-catalog";
import type { SmartFormRolloutCategory } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-types";

const PREMIUM_ONLY_SLUGS = [
  "millwork-bid-risk-analyzer",
  "panel-shop-margin-verdict",
  "signage-bid-safe-price-tool",
  "landscaping-contract-profit-tool",
] as const;

export function resolveRolloutCategory(governanceSlug: string): SmartFormRolloutCategory {
  if ((ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS as readonly string[]).includes(governanceSlug)) {
    return "live_already";
  }

  const definition = ROLLOUT_BATCH_H_TOOL_DEFINITIONS.find(
    (tool) => tool.governanceSlug === governanceSlug,
  );

  if (!definition) {
    return "blocked";
  }

  if (definition.eligibilityStatus === "excluded") {
    if ((PREMIUM_ONLY_SLUGS as readonly string[]).includes(governanceSlug)) {
      return "premium_only_requires_later_gate";
    }
    return "blocked";
  }

  if (isPilotCalculationBridgeEnabled(governanceSlug)) {
    return "eligible_for_calculation_bridge";
  }

  if (definition.submitKeys.length > 0) {
    return "eligible_for_render_only";
  }

  return "blocked";
}

export function getCompletedPatchToolSlugs(): readonly string[] {
  return ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS;
}

export function getCalculationBridgeEligibleSlugs(): readonly string[] {
  return PILOT_CALCULATION_BRIDGE_GOVERNANCE_SLUGS.filter(
    (slug) => !(ROLLOUT_BATCH_H_LIVE_GOVERNANCE_SLUGS as readonly string[]).includes(slug),
  );
}
