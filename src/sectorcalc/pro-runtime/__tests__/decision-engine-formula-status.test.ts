import { describe, expect, it } from "vitest";
import { computeDecision } from "../decision-engine";

const baseInput = {
  warnings: [],
  violations: [],
  riskLevel: "LOW" as const,
  moneyAtRisk: null,
  currency: null,
  mainCostDriver: null,
};

describe("formula decision output precedence", () => {
  it("maps decision code 0 to OK", () => {
    const result = computeDecision({
      ...baseInput,
      outputs: [{ id: "out_final_decision_state", name: "Decision", value: 0 }],
    });

    expect(result.status).toBe("OK");
  });

  it("maps decision code 1 to REVIEW", () => {
    const result = computeDecision({
      ...baseInput,
      outputs: [{ id: "out_final_decision_state", name: "Decision", value: 1 }],
    });

    expect(result.status).toBe("REVIEW");
    expect(result.primary_reason).toContain("requires review");
  });

  it("maps decision code 2 to BLOCKED", () => {
    const result = computeDecision({
      ...baseInput,
      outputs: [{ id: "out_final_decision_state", name: "Decision", value: 2 }],
    });

    expect(result.status).toBe("BLOCKED");
    expect(result.primary_reason).toContain("blocked this case");
  });

  it("does not allow formula GO to override a hard blocker", () => {
    const result = computeDecision({
      ...baseInput,
      outputs: [{ id: "out_final_decision_state", name: "Decision", value: 0 }],
      warnings: [{ severity: "BLOCKED" as const, message: "Hard blocker" }],
    });

    expect(result.status).toBe("BLOCKED");
  });
});
