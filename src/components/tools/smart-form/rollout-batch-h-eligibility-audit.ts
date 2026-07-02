/**
 * Smart form rollout batch H eligibility audit - Phase 5H-H.
 */

import { buildPilotUiBridgeManifestForSlug } from "@/lib/features/formula-governance/smart-form-ui-bridge/pilot-ui-bridge-manifest";
import {
  getRolloutBatchHActiveRouteMappings,
  getRolloutBatchHEligibleToolDefinitions,
  getRolloutBatchHExcludedToolDefinitions,
  ROLLOUT_BATCH_H_TOOL_DEFINITIONS,
} from "@/components/tools/smart-form/rollout-batch-h-catalog";

export type RolloutBatchHEligibilityAuditResult = {
  readonly eligibleTools: readonly string[];
  readonly excludedTools: readonly { readonly slug: string; readonly reason: string }[];
  readonly routeMappings: Readonly<Record<string, string>>;
  readonly manifestReadyCount: number;
  readonly fallbackReadyCount: number;
  readonly analyticsReadyCount: number;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export function runRolloutBatchHEligibilityAudit(): RolloutBatchHEligibilityAuditResult {
  const eligible = getRolloutBatchHEligibleToolDefinitions();
  const excluded = getRolloutBatchHExcludedToolDefinitions();
  const routeMappings = getRolloutBatchHActiveRouteMappings();
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (ROLLOUT_BATCH_H_TOOL_DEFINITIONS.length !== 15) {
    blockers.push(`Expected 15 input-design patch tools, found ${ROLLOUT_BATCH_H_TOOL_DEFINITIONS.length}`);
  }

  let manifestReadyCount = 0;
  for (const tool of eligible) {
    const manifest = buildPilotUiBridgeManifestForSlug(tool.governanceSlug);
    if (manifest?.status === "ui_bridge_ready") {
      manifestReadyCount += 1;
    } else {
      blockers.push(`${tool.governanceSlug}: UI bridge manifest is not ready`);
    }

    if (tool.submitKeys.length === 0) {
      blockers.push(`${tool.governanceSlug}: submit keys are missing`);
    }
  }

  const uniqueRoutes = new Set(Object.keys(routeMappings));
  if (uniqueRoutes.size !== eligible.length) {
    blockers.push("Route mapping must be unique per eligible governance slug");
  }

  if (excluded.length !== 5) {
    warnings.push(`Expected 5 excluded tools, found ${excluded.length}`);
  }

  return {
    eligibleTools: eligible.map((tool) => tool.governanceSlug),
    excludedTools: excluded.map((tool) => ({
      slug: tool.governanceSlug,
      reason: tool.exclusionReason ?? "Excluded",
    })),
    routeMappings,
    manifestReadyCount,
    fallbackReadyCount: eligible.length,
    analyticsReadyCount: eligible.length,
    blockers,
    warnings,
  };
}

export function formatRolloutBatchHEligibilityReport(result: RolloutBatchHEligibilityAuditResult): string {
  const lines = [
    "Smart Form Rollout Batch H Eligibility",
    `Eligible tools: ${result.eligibleTools.length}`,
    `Excluded tools: ${result.excludedTools.length}`,
    `Manifest ready: ${result.manifestReadyCount}`,
    `Fallback ready: ${result.fallbackReadyCount}`,
    `Analytics ready: ${result.analyticsReadyCount}`,
    `Blockers: ${result.blockers.length}`,
    "",
    "Eligible tools:",
    ...result.eligibleTools.map((slug) => `- ${slug}`),
    "",
    "Route mappings:",
    ...Object.entries(result.routeMappings).map(([route, governance]) => `- ${route} → ${governance}`),
  ];

  if (result.excludedTools.length > 0) {
    lines.push("", "Excluded tools:");
    for (const excluded of result.excludedTools) {
      lines.push(`- ${excluded.slug}: ${excluded.reason}`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push("", "Warnings:");
    for (const warning of result.warnings) {
      lines.push(`- ${warning}`);
    }
  }

  if (result.blockers.length > 0) {
    lines.push("", "Blockers:");
    for (const blocker of result.blockers) {
      lines.push(`- ${blocker}`);
    }
  }

  return lines.join("\n");
}
