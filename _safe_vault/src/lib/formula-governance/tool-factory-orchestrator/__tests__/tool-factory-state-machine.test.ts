/**
 * Tool factory state machine tests — Phase 5I-A.
 */

import { describe, expect, test } from "vitest";
import { buildDraftToolFactoryPlan } from "@/lib/formula-governance/tool-factory-orchestrator/tool-factory-fixtures";
import { nextState } from "@/lib/formula-governance/tool-factory-orchestrator/tool-factory-state-machine";

describe("tool factory state machine — Phase 5I-A", () => {
  test("ToolIdea creates draft state", () => {
    const plan = buildDraftToolFactoryPlan();
    expect(plan.status).toBe("needs_fixture");
    expect(plan.currentStage).toBe("ToolIdea");
  });

  test("ontology missing blocks RequirementEngine progression", () => {
    const plan = buildDraftToolFactoryPlan();
    const advanced = nextState(plan, "complete_requirement_engine");
    expect(advanced.blockers.some((blocker) => blocker.includes("Ontology"))).toBe(true);
  });

  test("illegal transition is blocked", () => {
    const plan = buildDraftToolFactoryPlan();
    const invalid = nextState(plan, "approve_human");
    expect(invalid.blockers.length).toBeGreaterThan(0);
  });

  test("human approval required before deploy ready", () => {
    let plan = buildDraftToolFactoryPlan();
    plan = nextState(plan, "register_ontology");
    plan = nextState(plan, "complete_requirement_engine");
    plan = nextState(plan, "complete_input_design");
    plan = nextState(plan, "register_formula_contract");
    plan = nextState(plan, "complete_oracle_plan");
    plan = nextState(plan, "complete_scenario_plan");
    plan = nextState(plan, "complete_property_plan");
    plan = nextState(plan, "complete_smart_form_plan");
    plan = nextState(plan, "complete_trust_trace_plan");
    plan = nextState(plan, "complete_report_plan");
    plan = nextState(plan, "pass_audit_gate");
    plan = nextState(plan, "complete_patch_plan");

    expect(plan.requiredArtifacts.humanApproval).toBe(false);
    expect(plan.status).not.toBe("deploy_ready");
  });

  test("request_deploy never enables auto deploy", () => {
    let plan = buildDraftToolFactoryPlan();
    const events = [
      "register_ontology",
      "complete_requirement_engine",
      "complete_input_design",
      "register_formula_contract",
      "complete_oracle_plan",
      "complete_scenario_plan",
      "complete_property_plan",
      "complete_smart_form_plan",
      "complete_trust_trace_plan",
      "complete_report_plan",
      "pass_audit_gate",
      "complete_patch_plan",
      "approve_human",
      "request_deploy",
    ] as const;

    for (const event of events) {
      plan = nextState(plan, event);
    }

    expect(plan.blockers.some((blocker) => blocker.includes("Auto deploy disabled"))).toBe(true);
  });
});
