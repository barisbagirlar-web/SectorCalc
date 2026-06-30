import { describe, expect, test } from "vitest";
import { runGlobalAudit } from "@/lib/os/core/audit-engine";

describe("U-Engine Industrial Precision", () => {
  test("Calculates critical drift accurately", () => {
    const result = runGlobalAudit(
      { target: 100, actual: 120, cost: 50, tolerance: 0.05 },
      "en-US",
    );

    expect(result.status).toBe("CRITICAL");
    expect(result.variancePct).toBe("20.00");
    expect(result.financialLoss).toContain("$1,000.00");
  });

  test("Maintains optimality within tolerance", () => {
    const result = runGlobalAudit(
      { target: 100, actual: 102, cost: 50, tolerance: 0.05 },
      "en-US",
    );

    expect(result.status).toBe("OPTIMAL");
  });
});
