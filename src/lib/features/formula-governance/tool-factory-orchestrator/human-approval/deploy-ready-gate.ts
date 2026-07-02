/**
 * Deploy ready gate - Phase 5I-G state only; deploy command always disabled.
 */

import { resolveEffectiveApprovalStatus, validateHumanApprovalRecord } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-gate";
import type { HumanApprovalRecord } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-types";
import type { ToolFactoryDeployReadyGate } from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-types";
import type { ControlledPatchDraft } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";
import type { PatchPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";
import type { ReportRendererContract } from "@/lib/features/formula-governance/report-renderer-contract/report-renderer-types";
import type { TrustTraceReport } from "@/lib/features/formula-governance/trust-trace-report/trust-trace-types";

export type EvaluateDeployReadyGateInput = {
  readonly toolSlug: string;
  readonly patchPlan?: PatchPlan;
  readonly controlledPatch?: ControlledPatchDraft;
  readonly trustTrace?: TrustTraceReport;
  readonly reportRenderer?: ReportRendererContract;
  readonly fullAuditPassed?: boolean;
  readonly buildGatePassed?: boolean;
  readonly secretGatePassed?: boolean;
  readonly humanApproval: HumanApprovalRecord;
};

export function evaluateDeployReadyGate(input: EvaluateDeployReadyGateInput): ToolFactoryDeployReadyGate {
  const blockers: string[] = [];
  const warnings: string[] = [];

  const patchPlanReady = input.patchPlan?.status === "patch_plan_ready";
  const controlledPatchDryRunReady = input.controlledPatch?.status === "dry_run_ready";
  const trustTraceReady = input.trustTrace?.status === "trust_trace_ready";
  const reportRendererReady = input.reportRenderer?.status === "renderer_contract_ready";
  const fullAuditPassed = input.fullAuditPassed ?? true;
  const buildGatePassed = input.buildGatePassed ?? true;
  const secretGatePassed = input.secretGatePassed ?? true;

  if (!patchPlanReady) {
    blockers.push(`${input.toolSlug}: patch plan not ready.`);
  }
  if (!controlledPatchDryRunReady) {
    blockers.push(`${input.toolSlug}: controlled patch dry-run not ready.`);
  }
  if (!trustTraceReady) {
    blockers.push(`${input.toolSlug}: trust trace not ready.`);
  }
  if (!reportRendererReady) {
    blockers.push(`${input.toolSlug}: report renderer contract not ready.`);
  }
  if (!fullAuditPassed) {
    blockers.push(`${input.toolSlug}: full audit gate failed.`);
  }
  if (!buildGatePassed) {
    blockers.push(`${input.toolSlug}: build gate failed.`);
  }
  if (!secretGatePassed) {
    blockers.push(`${input.toolSlug}: secret gate failed.`);
  }

  blockers.push(...validateHumanApprovalRecord(input.humanApproval, "patch_plan"));

  const humanApprovalStatus = resolveEffectiveApprovalStatus(input.humanApproval);

  const allGatesPassed =
    patchPlanReady &&
    controlledPatchDryRunReady &&
    trustTraceReady &&
    reportRendererReady &&
    fullAuditPassed &&
    buildGatePassed &&
    secretGatePassed &&
    blockers.length === 0;

  let status: ToolFactoryDeployReadyGate["status"] = "blocked";
  let deployReady = false;

  if (allGatesPassed && humanApprovalStatus === "approved") {
    status = "deploy_ready";
    deployReady = true;
  } else if (allGatesPassed && humanApprovalStatus === "pending") {
    status = "waiting_human_approval";
  } else if (humanApprovalStatus === "expired" || humanApprovalStatus === "rejected") {
    status = "blocked";
    blockers.push(`${input.toolSlug}: human approval ${humanApprovalStatus}.`);
  }

  return {
    toolSlug: input.toolSlug,
    patchPlanReady: patchPlanReady ?? false,
    controlledPatchDryRunReady: controlledPatchDryRunReady ?? false,
    trustTraceReady: trustTraceReady ?? false,
    reportRendererReady: reportRendererReady ?? false,
    fullAuditPassed,
    buildGatePassed,
    secretGatePassed,
    humanApprovalStatus,
    deployCommandAllowed: false,
    deployReady,
    blockers,
    warnings,
    status,
  };
}
