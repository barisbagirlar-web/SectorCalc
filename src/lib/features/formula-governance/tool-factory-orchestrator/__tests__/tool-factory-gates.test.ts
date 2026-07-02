/**
 * Tool factory gate tests - Phase 5I-A.
 */

import { describe, expect, test } from "vitest";
import { buildDraftToolFactoryPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-fixtures";
import { validateGate } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-gates";
import { buildToolFactoryPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/tool-factory-plan-builder";

describe("tool factory gates - Phase 5I-A", () => {
  test("FormulaContract missing blocks oracle gate", () => {
    const plan = buildDraftToolFactoryPlan();
    const result = validateGate(plan, "oracle_gate");
    expect(result.passed).toBe(false);
    expect(result.blockers.some((blocker) => blocker.includes("Formula contract"))).toBe(true);
  });

  test("TrustTrace missing blocks report gate", () => {
    const plan = buildToolFactoryPlan({
      idea: buildDraftToolFactoryPlan().idea,
      artifacts: { reportPlan: true },
    });
    const result = validateGate(plan, "report_gate");
    expect(result.passed).toBe(false);
    expect(result.blockers.some((blocker) => blocker.includes("Trust trace"))).toBe(true);
  });

  test("LLM forbidden action produces blocker", () => {
    const plan = buildToolFactoryPlan({
      idea: buildDraftToolFactoryPlan().idea,
      llmActions: ["calculate_result"],
    });
    const result = validateGate(plan, "input_intelligence_gate");
    expect(result.blockers.some((blocker) => blocker.includes("forbidden"))).toBe(true);
  });

  test("deploy gate never passes", () => {
    const plan = buildToolFactoryPlan({
      idea: buildDraftToolFactoryPlan().idea,
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
    const result = validateGate(plan, "deploy_gate");
    expect(result.passed).toBe(false);
    expect(result.blockers.some((blocker) => blocker.includes("Auto deploy disabled"))).toBe(true);
  });
});
