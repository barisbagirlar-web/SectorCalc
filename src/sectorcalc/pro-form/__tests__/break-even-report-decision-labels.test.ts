import { describe, expect, it } from "vitest";
import { getProReportContractOverride } from "@/sectorcalc/pro-report/pro-report-contract-overrides";

describe("break-even semantic decision labels", () => {
  it("maps decision and runway codes to operator-readable labels", () => {
    const contract = getProReportContractOverride(
      "break-even-survival-cash-calculator",
    );
    const entries =
      contract?.sections.flatMap((section) => section.entries) ?? [];
    const decision = entries.find((entry) => entry.sourceOutputId === "out_decision_code");
    const runway = entries.find(
      (entry) => entry.sourceOutputId === "out_target_runway_breached",
    );

    expect(decision?.valueLabels).toEqual({
      "0": "GO",
      "1": "REVIEW",
      "2": "BLOCK",
    });
    expect(runway?.valueLabels).toEqual({
      "0": "WITHIN TARGET",
      "1": "BREACHED",
    });
  });
});
