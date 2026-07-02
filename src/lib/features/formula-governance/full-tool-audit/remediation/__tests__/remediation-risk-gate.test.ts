/**
 * Remediation risk gate tests - Phase 5I-D.
 */

import { describe, expect, test } from "vitest";
import type { FullToolAuditItem } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import { isEligibleForRemediationBatch1 } from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-risk-gate";
import { buildPatchPlanFromFullToolAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-generator";

function buildItem(action: FullToolAuditItem["recommendedAction"]): FullToolAuditItem {
  return {
    slug: "gate-tool",
    title: "Gate Tool",
    tier: "free",
    category: "test",
    hasFormulaContract: true,
    hasProductionLocator: true,
    oracleStatus: "PASS",
    scenarioStatus: "pass",
    propertyStatus: "pass",
    inputDesignStatus: "usable",
    smartFormStatus: "not_eligible",
    trustTraceStatus: "needs_review",
    migrationStatus: "none",
    routeStatus: "production_locator_registered",
    reportStatus: "export_ready",
    blockers: [],
    warnings: [],
    score: 80,
    readiness: {
      productionSafe: true,
      smartFormReady: false,
      reportReady: true,
      factoryReady: true,
    },
    recommendedAction: action,
  };
}

describe("remediation risk gate - Phase 5I-D", () => {
  test("no_action is not eligible", () => {
    const item = buildItem("no_action");
    const result = isEligibleForRemediationBatch1(item, buildPatchPlanFromFullToolAudit(item));
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe("no_action");
  });

  test("live pilot is not eligible", () => {
    const item = { ...buildItem("trust_trace_patch"), smartFormStatus: "live_pilot" };
    const result = isEligibleForRemediationBatch1(item, buildPatchPlanFromFullToolAudit(item));
    expect(result.eligible).toBe(false);
  });

  test("missing patch plan is not eligible", () => {
    const item = buildItem("trust_trace_patch");
    const result = isEligibleForRemediationBatch1(item, undefined);
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe("missing_patch_plan");
  });

  test("low risk trust trace patch is eligible", () => {
    const item = buildItem("trust_trace_patch");
    const plan = buildPatchPlanFromFullToolAudit(item);
    const result = isEligibleForRemediationBatch1(item, plan);
    expect(result.eligible).toBe(true);
  });
});
