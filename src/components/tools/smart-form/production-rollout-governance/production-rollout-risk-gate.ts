/**
 * Smart form production rollout risk gate — Phase 5I-L.
 */

import type { ProductionRolloutToolEntry } from "@/components/tools/smart-form/production-rollout-governance/production-rollout-types";

export function validateProductionRolloutScope(
  entries: readonly ProductionRolloutToolEntry[],
): { readonly blockers: string[]; readonly warnings: string[] } {
  const blockers: string[] = [];
  const warnings: string[] = [];

  const livePilots = entries.filter((entry) => entry.status === "live_pilot");
  if (livePilots.length !== 3) {
    blockers.push(`Expected 3 live pilots; found ${livePilots.length}.`);
  }

  const nonLiveWithDeploy = entries.filter(
    (entry) => entry.status !== "live_pilot" && entry.deployRequired,
  );
  if (nonLiveWithDeploy.length > 0) {
    blockers.push("Non-live tools must not require deploy in this phase.");
  }

  const stagingCandidates = entries.filter((entry) => entry.status === "staging_only");
  if (stagingCandidates.length > 0) {
    warnings.push(`${stagingCandidates.length} tool(s) staged for future rollout — human approval required.`);
  }

  return { blockers, warnings };
}
