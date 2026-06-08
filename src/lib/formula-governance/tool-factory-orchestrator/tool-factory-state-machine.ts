/**
 * Tool factory state machine — Phase 5I-A deterministic skeleton.
 */

import {
  TOOL_FACTORY_GATES,
  type ToolFactoryArtifactPresence,
  type ToolFactoryPlan,
  type ToolFactoryPlanStatus,
  type ToolFactoryPipelineStage,
  type ToolFactoryStateMachineEvent,
} from "@/lib/formula-governance/tool-factory-orchestrator/tool-factory-types";

const STAGE_ORDER: readonly ToolFactoryPipelineStage[] = [
  "ToolIdea",
  "CalculationOntology",
  "RequirementEngine",
  "InputDesign",
  "FormulaContract",
  "OraclePlan",
  "ScenarioPlan",
  "PropertyPlan",
  "SmartFormPlan",
  "TrustTracePlan",
  "ReportPlan",
  "AuditGate",
  "PatchPlan",
  "HumanApproval",
  "DeployReady",
];

type MutableArtifacts = {
  calculationOntology: boolean;
  requirementEngine: boolean;
  inputDesign: boolean;
  formulaContract: boolean;
  oraclePlan: boolean;
  scenarioPlan: boolean;
  propertyPlan: boolean;
  smartFormPlan: boolean;
  trustTracePlan: boolean;
  reportPlan: boolean;
  auditGatePassed: boolean;
  patchPlan: boolean;
  humanApproval: boolean;
};

function cloneArtifacts(artifacts: ToolFactoryArtifactPresence): MutableArtifacts {
  return { ...artifacts };
}

function resolveStatus(
  artifacts: MutableArtifacts,
  blockers: readonly string[],
): ToolFactoryPlanStatus {
  if (blockers.length > 0) {
    return "blocked";
  }
  if (artifacts.humanApproval && artifacts.patchPlan && artifacts.auditGatePassed) {
    return "deploy_ready";
  }
  if (artifacts.patchPlan && artifacts.auditGatePassed) {
    return "waiting_human_approval";
  }
  if (artifacts.auditGatePassed) {
    return "ready_for_patch_plan";
  }
  if (!artifacts.calculationOntology) {
    return "needs_fixture";
  }
  if (!artifacts.formulaContract) {
    return "needs_metadata";
  }
  return "draft";
}

function stageIndex(stage: ToolFactoryPipelineStage): number {
  return STAGE_ORDER.indexOf(stage);
}

export function nextState(
  plan: ToolFactoryPlan,
  event: ToolFactoryStateMachineEvent,
): ToolFactoryPlan {
  const artifacts = cloneArtifacts(plan.requiredArtifacts);
  const blockers = [...plan.blockers];
  let currentStage = plan.currentStage;

  const requireStage = (expected: ToolFactoryPipelineStage, message: string): boolean => {
    if (stageIndex(currentStage) < stageIndex(expected)) {
      blockers.push(message);
      return false;
    }
    return true;
  };

  switch (event) {
    case "register_ontology":
      if (currentStage !== "ToolIdea") {
        blockers.push("Illegal transition: register_ontology only valid from ToolIdea.");
        break;
      }
      artifacts.calculationOntology = true;
      currentStage = "CalculationOntology";
      break;
    case "complete_requirement_engine":
      if (!requireStage("CalculationOntology", "Ontology required before RequirementEngine.")) {
        break;
      }
      artifacts.requirementEngine = true;
      currentStage = "RequirementEngine";
      break;
    case "complete_input_design":
      if (!requireStage("RequirementEngine", "RequirementEngine required before InputDesign.")) {
        break;
      }
      artifacts.inputDesign = true;
      currentStage = "InputDesign";
      break;
    case "register_formula_contract":
      if (!requireStage("InputDesign", "InputDesign required before FormulaContract.")) {
        break;
      }
      artifacts.formulaContract = true;
      currentStage = "FormulaContract";
      break;
    case "complete_oracle_plan":
      if (!requireStage("FormulaContract", "FormulaContract required before OraclePlan.")) {
        break;
      }
      artifacts.oraclePlan = true;
      currentStage = "OraclePlan";
      break;
    case "complete_scenario_plan":
      if (!requireStage("OraclePlan", "OraclePlan required before ScenarioPlan.")) {
        break;
      }
      artifacts.scenarioPlan = true;
      currentStage = "ScenarioPlan";
      break;
    case "complete_property_plan":
      if (!requireStage("ScenarioPlan", "ScenarioPlan required before PropertyPlan.")) {
        break;
      }
      artifacts.propertyPlan = true;
      currentStage = "PropertyPlan";
      break;
    case "complete_smart_form_plan":
      if (!requireStage("PropertyPlan", "PropertyPlan required before SmartFormPlan.")) {
        break;
      }
      artifacts.smartFormPlan = true;
      currentStage = "SmartFormPlan";
      break;
    case "complete_trust_trace_plan":
      if (!requireStage("SmartFormPlan", "SmartFormPlan required before TrustTracePlan.")) {
        break;
      }
      artifacts.trustTracePlan = true;
      currentStage = "TrustTracePlan";
      break;
    case "complete_report_plan":
      if (!requireStage("TrustTracePlan", "TrustTracePlan required before ReportPlan.")) {
        break;
      }
      artifacts.reportPlan = true;
      currentStage = "ReportPlan";
      break;
    case "pass_audit_gate":
      if (
        !artifacts.oraclePlan ||
        !artifacts.scenarioPlan ||
        !artifacts.propertyPlan
      ) {
        blockers.push("Oracle/scenario/property plans required before AuditGate.");
        break;
      }
      artifacts.auditGatePassed = true;
      currentStage = "AuditGate";
      break;
    case "complete_patch_plan":
      if (!requireStage("AuditGate", "AuditGate required before PatchPlan.")) {
        break;
      }
      artifacts.patchPlan = true;
      currentStage = "PatchPlan";
      break;
    case "approve_human":
      if (!requireStage("PatchPlan", "PatchPlan required before HumanApproval.")) {
        break;
      }
      artifacts.humanApproval = true;
      currentStage = "HumanApproval";
      break;
    case "request_deploy":
      if (!artifacts.humanApproval) {
        blockers.push("Human approval required before DeployReady.");
        break;
      }
      blockers.push("Auto deploy disabled — request_deploy records intent only.");
      currentStage = "DeployReady";
      break;
    default:
      break;
  }

  return {
    ...plan,
    requiredArtifacts: artifacts,
    currentStage,
    blockers: [...new Set(blockers)],
    status: resolveStatus(artifacts, blockers),
    gates: [...TOOL_FACTORY_GATES],
  };
}
