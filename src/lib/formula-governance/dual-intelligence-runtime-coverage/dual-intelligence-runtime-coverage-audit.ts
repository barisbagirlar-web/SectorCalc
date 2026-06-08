/**
 * Dual-intelligence runtime coverage audit — which tools enforce Mind 1/2 at user runtime.
 * Read-only; no filesystem. Full loop (`runContractCalculationIntelligenceLoop`) is test/audit only today.
 */

import { resolveRolloutCategory } from "@/components/tools/smart-form/rollout-expansion/smart-form-rollout-eligibility";
import { ROLLOUT_BATCH_H_TOOL_DEFINITIONS } from "@/components/tools/smart-form/rollout-batch-h-catalog";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { getControlledInputDesignPatch } from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import type {
  DualIntelligenceRuntimeCoverageEntry,
  DualIntelligenceRuntimeCoverageResult,
  DualIntelligenceRuntimeTier,
} from "@/lib/formula-governance/dual-intelligence-runtime-coverage/dual-intelligence-runtime-coverage-types";
import {
  PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS,
} from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import { isFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

function resolveRouteSlug(governanceSlug: string): string | null {
  const definition = ROLLOUT_BATCH_H_TOOL_DEFINITIONS.find(
    (tool) => tool.governanceSlug === governanceSlug,
  );
  return definition?.routeSlug ?? null;
}

function resolveTier(governanceSlug: string): DualIntelligenceRuntimeTier {
  if (isFullLoopRuntimeSlug(governanceSlug)) {
    return "full_loop_runtime";
  }

  const rolloutCategory = resolveRolloutCategory(governanceSlug);

  if (rolloutCategory === "live_already") {
    return "live_smart_form_pilot";
  }
  if (rolloutCategory === "eligible_for_calculation_bridge") {
    return "staged_calculation_bridge";
  }
  if (rolloutCategory === "eligible_for_render_only") {
    return "staged_render_only";
  }
  if (
    rolloutCategory === "premium_only_requires_later_gate" ||
    rolloutCategory === "blocked"
  ) {
    if (getControlledInputDesignPatch(governanceSlug)) {
      return "governed_buildtime_only";
    }
    return "audit_pipeline_only";
  }
  if (getControlledInputDesignPatch(governanceSlug)) {
    return "governed_buildtime_only";
  }
  return "audit_pipeline_only";
}

function buildNotes(tier: DualIntelligenceRuntimeTier, routeSlug: string | null): readonly string[] {
  switch (tier) {
    case "full_loop_runtime":
      return [
        "Premium calculate path runs runContractCalculationIntelligenceLoop before and after production calc.",
        "Non-canonical input keys rejected; verdict blocked until Mind 1 validation passes.",
        "Trust trace rendered on result panel.",
      ];
    case "live_smart_form_pilot":
      return [
        "Smart Form pilot live when NEXT_PUBLIC_SMART_FORM_PILOT is on.",
        "Payload gate via buildSmartFormPilotCalculationPayload; legacy calculator executes result.",
        routeSlug ? `Route: /tools/free/${routeSlug}` : "Route mapping pending.",
      ];
    case "staged_calculation_bridge":
      return [
        "Calculation bridge registered; not in production-deployed pilot set.",
        "Mind 2 field manifest at build; runtime loop not wired on calculate.",
      ];
    case "staged_render_only":
      return ["Render-only Smart Form rollout candidate; classic form fallback."];
    case "governed_buildtime_only":
      return [
        "Controlled input patch drives Smart Form plan at manifest build.",
        "Classic ToolCalculatorEngine path at runtime — no validation loop on submit.",
      ];
    case "audit_pipeline_only":
      return [
        "Requirement/alignment/validation run in audit scripts and tests only.",
        "No runContractCalculationIntelligenceLoop in production UI.",
      ];
    default:
      return ["Outside formula governance contract registry."];
  }
}

function countTier(
  entries: readonly DualIntelligenceRuntimeCoverageEntry[],
  tier: DualIntelligenceRuntimeTier,
): number {
  return entries.filter((entry) => entry.tier === tier).length;
}

export function runDualIntelligenceRuntimeCoverageAudit(): DualIntelligenceRuntimeCoverageResult {
  const entries: DualIntelligenceRuntimeCoverageEntry[] = FORMULA_CONTRACTS.map((contract) => {
    const tier = resolveTier(contract.slug);
    const routeSlug = resolveRouteSlug(contract.slug);
    const isFullLoop = tier === "full_loop_runtime";
    const mind2Runtime = isFullLoop || tier === "live_smart_form_pilot";
    const mind1Runtime = isFullLoop || tier === "live_smart_form_pilot";

    return {
      slug: contract.slug,
      title: contract.toolName,
      tier,
      mind1Runtime,
      mind2Runtime,
      fullLoopRuntime: isFullLoop,
      routeSlug,
      notes: buildNotes(tier, routeSlug),
    };
  });

  return {
    totalContracts: entries.length,
    liveSmartFormPilot: countTier(entries, "live_smart_form_pilot"),
    stagedCalculationBridge: countTier(entries, "staged_calculation_bridge"),
    stagedRenderOnly: countTier(entries, "staged_render_only"),
    governedBuildtimeOnly: countTier(entries, "governed_buildtime_only"),
    auditPipelineOnly: countTier(entries, "audit_pipeline_only"),
    noGovernance: countTier(entries, "no_governance"),
    fullLoopRuntimeCount: entries.filter((entry) => entry.fullLoopRuntime).length,
    mind1RuntimeCount: entries.filter((entry) => entry.mind1Runtime).length,
    mind2RuntimeCount: entries.filter((entry) => entry.mind2Runtime).length,
    entries,
  };
}

export function formatDualIntelligenceRuntimeCoverageReport(
  result: DualIntelligenceRuntimeCoverageResult,
): string {
  const liveSlugs = result.entries
    .filter((entry) => entry.tier === "live_smart_form_pilot")
    .map((entry) => entry.slug);

  const fullLoopSlugs = result.entries
    .filter((entry) => entry.tier === "full_loop_runtime")
    .map((entry) => entry.slug);

  const lines = [
    "Dual-Intelligence Runtime Coverage",
    `Total formula contracts: ${result.totalContracts}`,
    "",
    "Summary",
    `- Full loop runtime (Mind 2 → calc → Mind 1): ${result.fullLoopRuntimeCount}`,
    `- Live Smart Form pilot (Mind 1+2 partial runtime): ${result.liveSmartFormPilot}`,
    `- Staged calculation bridge: ${result.stagedCalculationBridge}`,
    `- Staged render only: ${result.stagedRenderOnly}`,
    `- Governed build-time only (controlled patch): ${result.governedBuildtimeOnly}`,
    `- Audit pipeline only: ${result.auditPipelineOnly}`,
    "",
    "Full loop runtime slugs:",
    ...(fullLoopSlugs.length > 0 ? fullLoopSlugs.map((slug) => `- ${slug}`) : ["- (none)"]),
    "",
    "Production-deployed pilot slugs:",
    ...PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS.map((slug) => `- ${slug}`),
    "",
    "Live runtime enforcement (when pilot flag on):",
    ...(liveSlugs.length > 0 ? liveSlugs.map((slug) => `- ${slug}`) : ["- (none)"]),
    "",
    "By tier:",
  ];

  const tierOrder: DualIntelligenceRuntimeTier[] = [
    "full_loop_runtime",
    "live_smart_form_pilot",
    "staged_calculation_bridge",
    "staged_render_only",
    "governed_buildtime_only",
    "audit_pipeline_only",
    "no_governance",
  ];

  for (const tier of tierOrder) {
    const tierEntries = result.entries.filter((entry) => entry.tier === tier);
    if (tierEntries.length === 0) {
      continue;
    }
    lines.push("", `${tier} (${tierEntries.length}):`);
    for (const entry of tierEntries) {
      lines.push(`- ${entry.slug}: ${entry.title}`);
    }
  }

  return lines.join("\n");
}
