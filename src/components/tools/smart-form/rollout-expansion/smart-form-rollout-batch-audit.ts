/**
 * Smart form rollout expansion batch audit - Phase 5I-H read-only.
 */

import { ROLLOUT_BATCH_H_TOOL_DEFINITIONS } from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { getCompletedPatchToolSlugs, resolveRolloutCategory } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-eligibility";
import { buildRolloutExpansionRouteMappings } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-route-map";
import { buildRolloutPayloadPlan } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-payload-plan";
import type {
  SmartFormRolloutExpansionAuditResult,
  SmartFormRolloutToolEntry,
} from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-types";

function buildEntry(tool: (typeof ROLLOUT_BATCH_H_TOOL_DEFINITIONS)[number]): SmartFormRolloutToolEntry {
  const category = resolveRolloutCategory(tool.governanceSlug);
  return {
    governanceSlug: tool.governanceSlug,
    routeSlug: tool.routeSlug,
    category,
    submitKeys: tool.submitKeys,
    exclusionReason: tool.exclusionReason,
    rollbackSafe: category !== "blocked",
  };
}

export function runSmartFormRolloutExpansionAudit(): SmartFormRolloutExpansionAuditResult {
  const slugs = getCompletedPatchToolSlugs();
  const entries = ROLLOUT_BATCH_H_TOOL_DEFINITIONS.map(buildEntry);
  const routeMappings = buildRolloutExpansionRouteMappings();

  const addedPayloadBridges = entries
    .filter((entry) => entry.category === "eligible_for_calculation_bridge")
    .map((entry) => entry.governanceSlug)
    .sort((left, right) => left.localeCompare(right));

  const excludedWithReason = entries
    .filter((entry) => entry.category === "blocked" || entry.category === "premium_only_requires_later_gate")
    .map((entry) => ({
      slug: entry.governanceSlug,
      reason: entry.exclusionReason ?? entry.category,
    }));

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (slugs.length !== 15) {
    blockers.push(`Expected 15 completed patch tools; found ${slugs.length}.`);
  }

  for (const slug of addedPayloadBridges) {
    const plan = buildRolloutPayloadPlan(slug, false);
    if (plan.allowedSubmitKeys.length === 0) {
      warnings.push(`${slug}: calculation bridge has no allowed submit keys.`);
    }
  }

  const liveAlready = entries.filter((e) => e.category === "live_already").length;
  const eligibleBridge = entries.filter((e) => e.category === "eligible_for_calculation_bridge").length;
  const eligibleRender = entries.filter((e) => e.category === "eligible_for_render_only").length;
  const premiumOnly = entries.filter((e) => e.category === "premium_only_requires_later_gate").length;
  const blocked = entries.filter((e) => e.category === "blocked").length;

  return {
    totalCompletedPatchTools: slugs.length,
    liveAlready,
    eligibleForCalculationBridge: eligibleBridge,
    eligibleForRenderOnly: eligibleRender,
    premiumOnlyRequiresLaterGate: premiumOnly,
    blocked,
    addedRouteMappings: routeMappings,
    addedPayloadBridges,
    excludedWithReason,
    rollbackSafe: liveAlready === 3,
    entries,
    blockers,
    warnings,
  };
}

export function formatSmartFormRolloutExpansionReport(
  result: SmartFormRolloutExpansionAuditResult,
): string {
  return [
    "Smart Form Rollout Expansion Audit",
    `Total completed patch tools: ${result.totalCompletedPatchTools}`,
    `Live already: ${result.liveAlready}`,
    `Eligible for calculation bridge: ${result.eligibleForCalculationBridge}`,
    `Eligible for render only: ${result.eligibleForRenderOnly}`,
    `Premium only (later gate): ${result.premiumOnlyRequiresLaterGate}`,
    `Blocked: ${result.blocked}`,
    `Added payload bridges: ${result.addedPayloadBridges.length}`,
    `Rollback safe: ${result.rollbackSafe}`,
    "",
    "Calculation bridge candidates:",
    ...result.addedPayloadBridges.map((slug) => `- ${slug}`),
    "",
    "Excluded:",
    ...result.excludedWithReason.map((entry) => `- ${entry.slug}: ${entry.reason}`),
  ].join("\n");
}
