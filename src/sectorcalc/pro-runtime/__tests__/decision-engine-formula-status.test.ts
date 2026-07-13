import { describe, expect, it } from "vitest";
import { computeDecision } from "../decision-engine";

const baseInput = {
  outputs: [],
  warnings: [],
  violations: [],
  riskLevel: "LOW" as const,
  moneyAtRisk: null,
  currency: null,
  mainCostDriver: null,
};

describe("authoritative formula decision status", () => {
  it("preserves formula OK", () => {
    const result = computeDecision({
      ...baseInput,
      formulaStatus: "OK",
    });

    expect(result.status).toBe("OK");
  });

  it("maps formula REVIEW to the public decision", () => {
    const result = computeDecision({
      ...baseInput,
      formulaStatus: "REVIEW",
    });

    expect(result.status).toBe("REVIEW");
    expect(result.primary_reason).toContain("requires review");
  });

  it("maps formula BLOCKED to the public decision", () => {
    const result = computeDecision({
      ...baseInput,
      formulaStatus: "BLOCKED",
    });

    expect(result.status).toBe("BLOCKED");
    expect(result.primary_reason).toContain("blocked this case");
  });

  it("does not infer status from another tool's encoded output id", () => {
    const result = computeDecision({
      ...baseInput,
      outputs: [
        {
          id: "out_final_decision_state",
          name: "Legacy Decision",
          value: 2,
        },
      ],
      formulaStatus: "OK",
    });

    expect(result.status).toBe("OK");
  });

  it("does not allow formula GO to override a hard blocker", () => {
    const result = computeDecision({
      ...baseInput,
      formulaStatus: "OK",
      warnings: [{ severity: "BLOCKED" as const, message: "Hard blocker" }],
    });

    expect(result.status).toBe("BLOCKED");
  });
});
