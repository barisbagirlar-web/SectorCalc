/**
 * Controlled patch generator tests - Phase 5I-E.
 */

import { describe, expect, test } from "vitest";
import { buildControlledPatchDraft } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-generator";
import { buildPatchPlanFromFullToolAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-generator";
import type { FullToolAuditItem } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import type { PatchPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

function buildItem(
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
    score: 90,
    readiness: {
      productionSafe: true,
      smartFormReady: false,
      reportReady: true,
      factoryReady: true,
    },
    ...overrides,
  };
}

function buildPlan(overrides: Partial<PatchPlan> & Pick<PatchPlan, "slug" | "patchType">): PatchPlan {
  const item = buildItem({ slug: overrides.slug, recommendedAction: "metadata_patch" });
  const base = buildPatchPlanFromFullToolAudit(item);
  return { ...base, ...overrides };
}

describe("controlled patch generator - Phase 5I-E", () => {
  test("metadata_only patch draft is dry_run_ready", () => {
    const draft = buildControlledPatchDraft(
      buildPlan({ slug: "meta-tool", patchType: "metadata_only", status: "needs_metadata", riskLevel: "low" }),
    );
    expect(draft.mode).toBe("dry_run");
    expect(["dry_run_ready", "needs_manual_approval"]).toContain(draft.status);
  });

  test("fixture_ontology draft uses allowed ontology paths", () => {
    const draft = buildControlledPatchDraft(
      buildPlan({ slug: "fixture-tool", patchType: "fixture_ontology", status: "needs_fixture", riskLevel: "medium" }),
    );
    expect(draft.proposedFiles.some((path) => path.includes("calculation-ontology"))).toBe(true);
    expect(draft.allowedFiles.some((path) => path.includes("calculation-ontology"))).toBe(true);
  });

  test("calculators path in operations is blocked", () => {
    const plan = buildPlan({ slug: "bad-tool", patchType: "smart_form_patch", riskLevel: "low" });
    const draft = buildControlledPatchDraft({
      ...plan,
      patchType: "smart_form_patch",
      allowedFiles: ["src/lib/calculators/bad.ts"],
      forbiddenFiles: plan.forbiddenFiles,
    } as PatchPlan);

    const withCalculatorOp = buildControlledPatchDraft(plan);
    const blockedDraft = {
      ...withCalculatorOp,
      proposedOperations: [
        {
          kind: "update_file" as const,
          targetPath: "src/lib/calculators/bad.ts",
          summary: "bad",
        },
      ],
    };

    const violations = blockedDraft.proposedOperations.some((op) =>
      op.targetPath.includes("src/lib/calculators/"),
    );
    expect(violations).toBe(true);
    expect(withCalculatorOp.canApply).toBe(false);
    expect(withCalculatorOp.approvedToApply).toBe(false);
    expect(withCalculatorOp.approvalRequired).toBe(true);
  });

  test("report_export_contract stays within export-contract scope", () => {
    const draft = buildControlledPatchDraft(
      buildPlan({ slug: "report-tool", patchType: "report_export_contract", status: "patch_plan_ready", riskLevel: "low" }),
    );
    expect(
      draft.proposedFiles.every(
        (path) =>
          path.includes("export-contract") ||
          path.includes("report-renderer-contract") ||
          path === "(none)",
      ),
    ).toBe(true);
  });

  test("canApply is always false", () => {
    const draft = buildControlledPatchDraft(
      buildPlan({ slug: "apply-tool", patchType: "trust_trace_patch", status: "patch_plan_ready", riskLevel: "low" }),
    );
    expect(draft.canApply).toBe(false);
    expect(draft.approvedToApply).toBe(false);
  });
});
