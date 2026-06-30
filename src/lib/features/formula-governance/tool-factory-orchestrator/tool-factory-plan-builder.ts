/**
 * Tool factory plan builder — Phase 5I-A skeleton.
 */

import {
  TOOL_FACTORY_GATES,
  type ToolFactoryArtifactPresence,
  type ToolFactoryIdea,
  type ToolFactoryPlan,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-types";

export type BuildToolFactoryPlanInput = {
  readonly idea: ToolFactoryIdea;
  readonly artifacts?: Partial<ToolFactoryArtifactPresence>;
  readonly llmActions?: readonly string[];
  readonly warnings?: readonly string[];
  readonly blockers?: readonly string[];
};

const EMPTY_ARTIFACTS: ToolFactoryArtifactPresence = {
  calculationOntology: false,
  requirementEngine: false,
  inputDesign: false,
  formulaContract: false,
  oraclePlan: false,
  scenarioPlan: false,
  propertyPlan: false,
  smartFormPlan: false,
  trustTracePlan: false,
  reportPlan: false,
  auditGatePassed: false,
  patchPlan: false,
  humanApproval: false,
};

export function buildToolFactoryPlan(input: BuildToolFactoryPlanInput): ToolFactoryPlan {
  const artifacts: ToolFactoryArtifactPresence = {
    ...EMPTY_ARTIFACTS,
    ...input.artifacts,
  };

  const blockers = [...(input.blockers ?? [])];
  const warnings = [...(input.warnings ?? [])];

  let status: ToolFactoryPlan["status"] = "draft";
  if (blockers.length > 0) {
    status = "blocked";
  } else if (artifacts.humanApproval) {
    status = "waiting_human_approval";
  } else if (!artifacts.calculationOntology) {
    status = "needs_fixture";
  } else if (!artifacts.formulaContract) {
    status = "needs_metadata";
  }

  return {
    idea: input.idea,
    sector: input.idea.sector,
    targetUser: input.idea.targetUser,
    calculationGoal: input.idea.calculationGoal,
    requiredArtifacts: artifacts,
    gates: [...TOOL_FACTORY_GATES],
    blockers,
    warnings,
    status,
    currentStage: "ToolIdea",
    llmActions: [...(input.llmActions ?? [])],
  };
}
