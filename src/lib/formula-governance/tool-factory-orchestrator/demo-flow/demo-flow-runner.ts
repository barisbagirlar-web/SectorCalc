/**
 * Tool factory demo flow runner — Phase 5I-N ToolIdea → DeployReady pipeline.
 */

import { DEMO_TOOL_IDEA } from "@/lib/formula-governance/tool-factory-orchestrator/demo-flow/demo-flow-fixture";
import type {
  DemoFlowStageResult,
  ToolFactoryDemoFlowResult,
} from "@/lib/formula-governance/tool-factory-orchestrator/demo-flow/demo-flow-types";
import { TOOL_FACTORY_PIPELINE_STAGES } from "@/lib/formula-governance/tool-factory-orchestrator/tool-factory-types";

const DEMO_STAGE_COMPLETION: Readonly<Record<string, boolean>> = {
  ToolIdea: true,
  CalculationOntology: true,
  RequirementEngine: true,
  InputDesign: true,
  FormulaContract: true,
  OraclePlan: true,
  ScenarioPlan: true,
  PropertyPlan: true,
  SmartFormPlan: true,
  TrustTracePlan: true,
  ReportPlan: true,
  AuditGate: true,
  PatchPlan: true,
  HumanApproval: false,
  DeployReady: false,
};

export function runToolFactoryDemoFlow(): ToolFactoryDemoFlowResult {
  const stages: DemoFlowStageResult[] = TOOL_FACTORY_PIPELINE_STAGES.map((stage) => ({
    stage,
    completed: DEMO_STAGE_COMPLETION[stage] ?? false,
    blockers:
      stage === "HumanApproval"
        ? ["Human approval pending — demo fixture stops before deploy."]
        : stage === "DeployReady"
          ? ["Deploy command disabled in Phase 5I-N."]
          : [],
  }));

  const completedStages = stages.filter((s) => s.completed).length;
  const blockedStages = stages.filter((s) => !s.completed).map((s) => s.stage);
  const blockers = stages.flatMap((s) => s.blockers);

  return {
    demoFlowReady: completedStages >= 12,
    completedStages,
    blockedStages,
    humanApprovalRequired: true,
    deployCommandDisabled: true,
    stages,
    blockers: [...new Set(blockers)],
    warnings: [`Demo idea: ${DEMO_TOOL_IDEA.title} (${DEMO_TOOL_IDEA.sector})`],
  };
}
