/**
 * Deploy ready gate tests — Phase 5I-G.
 */

import { describe, expect, test } from "vitest";
import { evaluateDeployReadyGate } from "@/lib/formula-governance/tool-factory-orchestrator/human-approval/deploy-ready-gate";
import {
  buildApprovedHumanApprovalRecord,
  buildDefaultHumanApprovalRecord,
} from "@/lib/formula-governance/tool-factory-orchestrator/human-approval/human-approval-record";
import type { ControlledPatchDraft } from "@/lib/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";
import type { PatchPlan } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";
import type { ReportRendererContract } from "@/lib/formula-governance/report-renderer-contract/report-renderer-types";
import type { TrustTraceReport } from "@/lib/formula-governance/trust-trace-report/trust-trace-types";

const readyPatchPlan: PatchPlan = {
  planId: "plan-ready",
  slug: "ready-tool",
  sourceAudit: "full_tool_audit",
  targetPhase: "test",
  patchType: "trust_trace_patch",
  allowedFiles: [],
  forbiddenFiles: ["src/lib/calculators/**"],
  expectedDiffContract: {
    noProductionCalculatorChange: true,
    noFormulaOutputChange: true,
    noRouteChange: true,
    noFirebaseChange: true,
    noAuthPricingMailChange: true,
    noDeployConfigChange: true,
    testsRequired: [],
    auditCommandsRequired: [],
  },
  requiredTests: [],
  rollbackPlan: [],
  riskLevel: "low",
  canAutoGeneratePatch: true,
  requiresHumanApproval: true,
  canApplyWithoutHumanApproval: false,
  blockers: [],
  warnings: [],
  status: "patch_plan_ready",
  sourceRecommendedAction: "trust_trace_patch",
};

const readyDraft: ControlledPatchDraft = {
  patchId: "patch-ready",
  sourcePatchPlanId: "plan-ready",
  slug: "ready-tool",
  patchType: "trust_trace_patch",
  mode: "dry_run",
  proposedFiles: [],
  proposedOperations: [],
  allowedFiles: [],
  forbiddenFiles: ["src/lib/calculators/**"],
  expectedDiffSummary: "dry-run",
  requiredTests: [],
  approvalRequired: true,
  approvedToApply: false,
  canApply: false,
  productionImpact: "none",
  calculatorImpact: "none",
  routeImpact: "none",
  deployImpact: "none",
  blockers: [],
  warnings: [],
  status: "dry_run_ready",
};

const readyTrace: TrustTraceReport = {
  slug: "ready-tool",
  title: "Ready Tool",
  tier: "free",
  riskLevel: "medium",
  inputTrace: [],
  requiredInputs: [],
  optionalInputs: [],
  advancedInputs: [],
  defaultedInputs: [],
  acceptedAssumptions: [],
  derivedFields: [],
  validationTrace: ["rule"],
  formulaContractTrace: [],
  ontologyTrace: [],
  requirementEngineTrace: [],
  oracleCoverage: { status: "pass", wired: true, detail: "pass" },
  scenarioCoverage: { status: "pass", wired: true, detail: "1/1" },
  propertyCoverage: { status: "pass", wired: true, detail: "ok" },
  warningTrace: [],
  limitationTrace: ["limitation"],
  reportExportReadiness: { pdfReady: true, excelReady: true, wordReady: true, blockers: [], warnings: [] },
  trustScore: 95,
  status: "trust_trace_ready",
  blockers: [],
  warnings: [],
};

const readyRenderer: ReportRendererContract = {
  slug: "ready-tool",
  title: "Ready Tool",
  sourceTrustTraceExportContract: { slug: "ready-tool", status: "export_contract_ready" },
  supportedFormats: ["pdf", "excel", "word"],
  sections: ["audit_appendix"],
  formatRules: {
    pdf: { pageSize: "A4", maxTableRowsPerPage: 25, disclaimerPosition: "footer" },
    excel: { sheets: ["Summary"], frozenHeader: true, numericColumns: [] },
    word: { headingLevels: [1, 2, 3], tableStyle: "sectorcalc-audit-table", appendixStyle: "sectorcalc-audit-appendix" },
  },
  dataContract: {
    requiredFields: ["slug"],
    optionalFields: [],
    redactedFields: [],
    prohibitedFields: ["secrets", "raw_env", "internal_stack_traces"],
  },
  readiness: { pdfRendererReady: true, excelRendererReady: true, wordRendererReady: true },
  status: "renderer_contract_ready",
  blockers: [],
  warnings: [],
};

describe("deploy ready gate — Phase 5I-G", () => {
  test("all gates pass with pending approval → waiting_human_approval", () => {
    const gate = evaluateDeployReadyGate({
      toolSlug: "ready-tool",
      patchPlan: readyPatchPlan,
      controlledPatch: readyDraft,
      trustTrace: readyTrace,
      reportRenderer: readyRenderer,
      humanApproval: buildDefaultHumanApprovalRecord({
        toolSlug: "ready-tool",
        linkedPlanId: "plan-ready",
        linkedPatchId: "patch-ready",
      }),
    });

    expect(gate.status).toBe("waiting_human_approval");
    expect(gate.deployReady).toBe(false);
    expect(gate.deployCommandAllowed).toBe(false);
  });

  test("all gates pass with approved → deploy_ready", () => {
    const approval = buildApprovedHumanApprovalRecord(
      buildDefaultHumanApprovalRecord({
        toolSlug: "ready-tool",
        linkedPlanId: "plan-ready",
      }),
      {
        approvedBy: "Barış Bağırlar",
        approvedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      },
    );

    const gate = evaluateDeployReadyGate({
      toolSlug: "ready-tool",
      patchPlan: readyPatchPlan,
      controlledPatch: readyDraft,
      trustTrace: readyTrace,
      reportRenderer: readyRenderer,
      humanApproval: approval,
    });

    expect(gate.status).toBe("deploy_ready");
    expect(gate.deployReady).toBe(true);
    expect(gate.deployCommandAllowed).toBe(false);
  });

  test("missing trust trace blocks deploy ready", () => {
    const gate = evaluateDeployReadyGate({
      toolSlug: "ready-tool",
      patchPlan: readyPatchPlan,
      controlledPatch: readyDraft,
      trustTrace: { ...readyTrace, status: "needs_review" },
      reportRenderer: readyRenderer,
      humanApproval: buildDefaultHumanApprovalRecord({
        toolSlug: "ready-tool",
        linkedPlanId: "plan-ready",
      }),
    });

    expect(gate.status).toBe("blocked");
    expect(gate.deployReady).toBe(false);
  });
});
