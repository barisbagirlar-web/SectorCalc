/**
 * Production rollout governance tests - Phase 5I-L.
 */

import { describe, expect, test } from "vitest";
import { runProductionRolloutGovernanceAudit } from "@/components/tools/smart-form/production-rollout-governance/production-rollout-audit";

describe("production rollout governance - Phase 5I-L", () => {
  test("live pilot count is 3", () => {
    const result = runProductionRolloutGovernanceAudit();
    expect(result.livePilotCount).toBe(3);
  });

  test("production rollout not approved by default", () => {
    const result = runProductionRolloutGovernanceAudit();
    expect(result.productionRolloutApproved).toBe(false);
    expect(result.deployRequired).toBe(false);
  });

  test("new rollout tools default staging or preview", () => {
    const result = runProductionRolloutGovernanceAudit();
    const nonLive = result.entries.filter((e) => e.status !== "live_pilot" && e.status !== "blocked");
    expect(nonLive.every((e) => e.status === "staging_only" || e.status === "preview_only")).toBe(true);
  });
});
