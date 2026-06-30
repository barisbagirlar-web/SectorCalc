/**
 * Patch plan generator tests — Phase 5I-B.
 */

import { describe, expect, test } from "vitest";
import type { FullToolAuditItem } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import { buildPatchPlanFromFullToolAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-generator";

function buildAuditItem(
  overrides: Partial<FullToolAuditItem> & Pick<FullToolAuditItem, "slug" | "recommendedAction">,
): FullToolAuditItem {
  return {
    title: overrides.slug,
    tier: "free",
    category: "test",
    hasFormulaContract: true,
    hasProductionLocator: true,
    oracleStatus: "PASS",
    scenarioStatus: "pass",
    propertyStatus: "pass",
    inputDesignStatus: "usable",
    smartFormStatus: "not_eligible",
    trustTraceStatus: "trust_trace_ready",
    migrationStatus: "none",
    routeStatus: "production_locator_registered",
    reportStatus: "export_ready",
    blockers: [],
    warnings: [],
    score: 85,
    readiness: {
      productionSafe: true,
      smartFormReady: false,
      reportReady: true,
      factoryReady: true,
    },
    ...overrides,
  };
}

describe("patch plan generator — Phase 5I-B", () => {
  test("metadata action maps to metadata_only", () => {
    const plan = buildPatchPlanFromFullToolAudit(
      buildAuditItem({ slug: "meta-tool", recommendedAction: "metadata_patch", hasProductionLocator: false }),
    );
    expect(plan.patchType).toBe("metadata_only");
  });

  test("fixture action maps to fixture_ontology", () => {
    const plan = buildPatchPlanFromFullToolAudit(
      buildAuditItem({ slug: "fixture-tool", recommendedAction: "fixture_ontology", migrationStatus: "fixture_ontology" }),
    );
    expect(plan.patchType).toBe("fixture_ontology");
  });

  test("smart form action maps to smart_form_patch", () => {
    const plan = buildPatchPlanFromFullToolAudit(
      buildAuditItem({ slug: "smart-tool", recommendedAction: "smart_form_patch", smartFormStatus: "batch_eligible" }),
    );
    expect(plan.patchType).toBe("smart_form_patch");
  });

  test("trust trace action maps to trust_trace_patch", () => {
    const plan = buildPatchPlanFromFullToolAudit(
      buildAuditItem({ slug: "trace-tool", recommendedAction: "trust_trace_patch", trustTraceStatus: "needs_review" }),
    );
    expect(plan.patchType).toBe("trust_trace_patch");
  });

  test("report action maps to report_export_contract", () => {
    const plan = buildPatchPlanFromFullToolAudit(
      buildAuditItem({ slug: "report-tool", recommendedAction: "report_layer_patch", reportStatus: "needs_review" }),
    );
    expect(plan.patchType).toBe("report_export_contract");
  });

  test("blocked action maps to blocked_manual_review", () => {
    const plan = buildPatchPlanFromFullToolAudit(
      buildAuditItem({
        slug: "blocked-tool",
        recommendedAction: "blocked_manual_review",
        blockers: ["blocked"],
      }),
    );
    expect(plan.patchType).toBe("blocked_manual_review");
  });

  test("forbiddenFiles always includes calculators/**", () => {
    const plan = buildPatchPlanFromFullToolAudit(
      buildAuditItem({ slug: "any-tool", recommendedAction: "metadata_patch" }),
    );
    expect(plan.forbiddenFiles).toContain("src/lib/calculators/**");
  });

  test("canApplyWithoutHumanApproval is false and requiresHumanApproval is true", () => {
    const plan = buildPatchPlanFromFullToolAudit(
      buildAuditItem({ slug: "approval-tool", recommendedAction: "trust_trace_patch" }),
    );
    expect(plan.canApplyWithoutHumanApproval).toBe(false);
    expect(plan.requiresHumanApproval).toBe(true);
  });
});
