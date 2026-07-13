import { describe, expect, it } from "vitest";
import { computeDecision } from "@/sectorcalc/pro-runtime/decision-engine";

describe("schema hash warning decision isolation", () => {
  it("keeps formula OK when the only warning is non-critical schema drift", () => {
    const result = computeDecision({
      outputs: [],
      warnings: [
        {
          severity: "WARNING",
          message: "Client schema hash does not match server schema hash.",
        },
      ],
      violations: [],
      riskLevel: "LOW",
      moneyAtRisk: null,
      currency: null,
      mainCostDriver: null,
      formulaStatus: "OK",
    });

    expect(result.status).toBe("OK");
  });
});
