import { describe, expect, it } from "vitest";
import { getProReportContractOverride } from "../pro-report-contract-overrides";

const LEGACY_IDS = [
  "out_evidence_completeness",
  "out_threshold_crossing",
  "out_final_decision_state",
  "out_demand_metric",
  "out_capacity_metric",
  "out_fmea_trigger",
];

describe("break-even report contract isolation", () => {
  it("uses only the corrected output namespace", () => {
    const contract = getProReportContractOverride(
      "break-even-survival-cash-calculator",
    );
    expect(contract).not.toBeNull();
    expect(contract?.strict).toBe(true);

    const outputIds =
      contract?.sections.flatMap((section) =>
        section.entries.map((entry) => entry.sourceOutputId),
      ) ?? [];

    expect(outputIds).toContain("out_source_confidence_ratio");
    expect(outputIds).toContain("out_target_runway_breached");
    expect(outputIds).toContain("out_decision_code");
    for (const legacyId of LEGACY_IDS) {
      expect(outputIds).not.toContain(legacyId);
    }
  });
});
