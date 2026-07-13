import { describe, expect, it } from "vitest";
import { computeDecision } from "../decision-engine";

const base = {
  outputs: [],
  violations: [],
  riskLevel: "LOW" as const,
  moneyAtRisk: null,
  currency: "USD",
  mainCostDriver: null,
};

describe("decision precedence", () => {
  it("keeps formula REVIEW when warnings are informational only", () => {
    const result = computeDecision({
      ...base,
      formulaStatus: "REVIEW",
      warnings: [{ severity: "INFO" as const, message: "Informational" }],
    });

    expect(result.status).toBe("REVIEW");
  });

  it("elevates a hard violation above formula OK", () => {
    const result = computeDecision({
      ...base,
      formulaStatus: "OK",
      warnings: [],
      violations: [
        {
          inputId: "contribution_margin_ratio",
          severity: "BLOCKED" as const,
          message: "Physical bound blocked",
        },
      ],
    });

    expect(result.status).toBe("BLOCKED");
  });

  it("does not downgrade formula BLOCKED because risk level is low", () => {
    const result = computeDecision({
      ...base,
      formulaStatus: "BLOCKED",
      warnings: [],
    });

    expect(result.status).toBe("BLOCKED");
  });
});
