/**
 * Tool factory deterministic fixtures — Phase 5I-A tests only.
 */

import { buildToolFactoryPlan } from "@/lib/formula-governance/tool-factory-orchestrator/tool-factory-plan-builder";
import type { ToolFactoryIdea, ToolFactoryPlan } from "@/lib/formula-governance/tool-factory-orchestrator/tool-factory-types";

export const SAMPLE_TOOL_FACTORY_IDEA: ToolFactoryIdea = {
  title: "HVAC margin guard quick check",
  sector: "hvac",
  targetUser: "contractor",
  calculationGoal: "Estimate safe bid margin before submitting HVAC quote.",
  notes: "Fixture only — no production generation.",
};

export function buildDraftToolFactoryPlan(): ToolFactoryPlan {
  return buildToolFactoryPlan({ idea: SAMPLE_TOOL_FACTORY_IDEA });
}

export function buildDeployReadyToolFactoryFixture(): ToolFactoryPlan {
  const plan = buildToolFactoryPlan({
    idea: SAMPLE_TOOL_FACTORY_IDEA,
    artifacts: {
      calculationOntology: true,
      requirementEngine: true,
      inputDesign: true,
      formulaContract: true,
      oraclePlan: true,
      scenarioPlan: true,
      propertyPlan: true,
      smartFormPlan: true,
      trustTracePlan: true,
      reportPlan: true,
      auditGatePassed: true,
      patchPlan: true,
      humanApproval: true,
    },
  });

  return {
    ...plan,
    status: "waiting_human_approval",
    currentStage: "HumanApproval",
  };
}
