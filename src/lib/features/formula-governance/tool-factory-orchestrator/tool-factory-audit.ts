/**
 * Tool factory orchestrator audit - Phase 5I-A skeleton readiness.
 */

import { validateAllGates } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-gates";
import { buildToolFactoryPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-plan-builder";
import {
  TOOL_FACTORY_GATES,
  TOOL_FACTORY_PIPELINE_STAGES,
  type ToolFactoryAuditResult,
  type ToolFactoryPlan,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-types";

export function auditToolFactoryPlan(plan: ToolFactoryPlan): ToolFactoryAuditResult {
  const gateValidation = validateAllGates(plan);
  const blockers = [...gateValidation.blockers];
  const warnings = [...gateValidation.warnings];

  if (plan.status === "deploy_ready" && !plan.requiredArtifacts.humanApproval) {
    blockers.push("Deploy ready status requires human approval artifact.");
  }

  return buildToolFactoryAuditResult({ blockers, warnings });
}

export function runToolFactoryOrchestratorAudit(): ToolFactoryAuditResult {
  buildToolFactoryPlan({
    idea: {
      title: "Skeleton audit probe",
      sector: "governance",
      targetUser: "internal",
      calculationGoal: "Validate tool factory skeleton gates.",
    },
  });

  return buildToolFactoryAuditResult({ blockers: [], warnings: [] });
}

function buildToolFactoryAuditResult(input: {
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
}): ToolFactoryAuditResult {
  const activeGateCount = TOOL_FACTORY_GATES.filter((gate) => gate !== "deploy_gate").length;
  const structuralBlockers = [...input.blockers];

  if (TOOL_FACTORY_PIPELINE_STAGES.length < 14) {
    structuralBlockers.push("Pipeline stage registry incomplete.");
  }
  if (activeGateCount < 11) {
    structuralBlockers.push("Gate registry incomplete.");
  }

  return {
    pipelineStageCount: TOOL_FACTORY_PIPELINE_STAGES.length - 1,
    gateCount: activeGateCount,
    autoDeployEnabled: false,
    humanApprovalRequired: true,
    status: structuralBlockers.length === 0 ? "skeleton_ready" : "blocked",
    blockers: structuralBlockers,
    warnings: input.warnings,
  };
}

export function formatToolFactoryOrchestratorAuditReport(result: ToolFactoryAuditResult): string {
  return [
    "Tool Factory Orchestrator Audit",
    `Pipeline stages: ${result.pipelineStageCount}`,
    `Gate count: ${result.gateCount}`,
    `Auto deploy: disabled`,
    `Human approval required: true`,
    `Status: ${result.status}`,
    `Blockers: ${result.blockers.length}`,
  ].join("\n");
}
