/**
 * Tool factory gate validators - Phase 5I-A skeleton (read-only).
 */

import {
  LLM_FORBIDDEN_ACTIONS,
  type ToolFactoryGate,
  type ToolFactoryPlan,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-types";

export type GateValidationResult = {
  readonly passed: boolean;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

function hasForbiddenLlmAction(plan: ToolFactoryPlan): string[] {
  const blockers: string[] = [];
  for (const action of plan.llmActions) {
    if ((LLM_FORBIDDEN_ACTIONS as readonly string[]).includes(action)) {
      blockers.push(`LLM forbidden action requested: ${action}`);
    }
  }
  return blockers;
}

export function validateGate(plan: ToolFactoryPlan, gate: ToolFactoryGate): GateValidationResult {
  const blockers: string[] = [];
  const warnings: string[] = [];
  const artifacts = plan.requiredArtifacts;

  blockers.push(...hasForbiddenLlmAction(plan));

  switch (gate) {
    case "input_intelligence_gate":
      if (!artifacts.calculationOntology) {
        blockers.push("Calculation ontology required before input intelligence gate.");
      }
      if (!artifacts.requirementEngine) {
        blockers.push("Requirement engine artifact required before input intelligence gate.");
      }
      break;
    case "formula_contract_gate":
      if (!artifacts.formulaContract) {
        blockers.push("Formula contract required before formula contract gate.");
      }
      break;
    case "oracle_gate":
      if (!artifacts.formulaContract) {
        blockers.push("Formula contract required before oracle gate.");
      }
      if (!artifacts.oraclePlan) {
        blockers.push("Oracle plan required before oracle gate.");
      }
      break;
    case "scenario_gate":
      if (!artifacts.oraclePlan) {
        blockers.push("Oracle plan required before scenario gate.");
      }
      if (!artifacts.scenarioPlan) {
        blockers.push("Scenario plan required before scenario gate.");
      }
      break;
    case "property_gate":
      if (!artifacts.scenarioPlan) {
        blockers.push("Scenario plan required before property gate.");
      }
      if (!artifacts.propertyPlan) {
        blockers.push("Property plan required before property gate.");
      }
      break;
    case "ui_form_gate":
      if (!artifacts.inputDesign) {
        blockers.push("Input design required before UI form gate.");
      }
      if (!artifacts.smartFormPlan) {
        blockers.push("Smart form plan required before UI form gate.");
      }
      break;
    case "trust_trace_gate":
      if (!artifacts.trustTracePlan) {
        blockers.push("Trust trace plan required before trust trace gate.");
      }
      break;
    case "report_gate":
      if (!artifacts.trustTracePlan) {
        blockers.push("Trust trace plan required before report gate.");
      }
      if (!artifacts.reportPlan) {
        blockers.push("Report plan required before report gate.");
      }
      break;
    case "build_gate":
      if (!artifacts.auditGatePassed) {
        blockers.push("Audit gate must pass before build gate.");
      }
      break;
    case "secret_gate":
      warnings.push("Secret gate requires manual check:secrets before deploy.");
      break;
    case "human_approval_gate":
      if (!artifacts.humanApproval) {
        blockers.push("Human approval required before deploy readiness.");
      }
      break;
    case "deploy_gate":
      blockers.push("Auto deploy disabled - deploy gate never executes commands.");
      break;
    default:
      break;
  }

  return {
    passed: blockers.length === 0,
    blockers,
    warnings,
  };
}

export function validateAllGates(plan: ToolFactoryPlan): GateValidationResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  for (const gate of plan.gates) {
    const result = validateGate(plan, gate);
    blockers.push(...result.blockers);
    warnings.push(...result.warnings);
  }

  return {
    passed: blockers.length === 0,
    blockers: [...new Set(blockers)],
    warnings: [...new Set(warnings)],
  };
}
