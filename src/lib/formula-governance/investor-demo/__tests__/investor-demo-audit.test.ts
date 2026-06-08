/**
 * Investor demo audit tests — Phase 5I-O.
 */

import { describe, expect, test } from "vitest";
import { runInvestorDemoAudit } from "@/lib/formula-governance/investor-demo/investor-demo-audit";

describe("investor demo audit — Phase 5I-O", () => {
  test("produces data contract without marketing copy", () => {
    const result = runInvestorDemoAudit();
    expect(result.demoScriptDataContract.marketingCopyExcluded).toBe(true);
    expect(result.liveSystemProofPoints.length).toBeGreaterThan(0);
  });

  test("moat signals present", () => {
    const result = runInvestorDemoAudit();
    expect(result.moatSignals.length).toBeGreaterThan(0);
  });

  test("audit is deterministic", () => {
    const first = runInvestorDemoAudit();
    const second = runInvestorDemoAudit();
    expect(first.investorDemoReady).toBe(second.investorDemoReady);
    expect(first.remainingDebtCount).toBe(second.remainingDebtCount);
  });
});
