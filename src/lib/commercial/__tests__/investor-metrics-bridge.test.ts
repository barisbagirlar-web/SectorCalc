/**
 * Investor metrics bridge tests — Phase 6A.
 */

import { describe, expect, test } from "vitest";
import { loadInvestorPageMetrics } from "@/lib/commercial/investor-metrics-bridge";

describe("investor metrics bridge — Phase 6A", () => {
  test("loads live pilot count without fake metrics", () => {
    const metrics = loadInvestorPageMetrics();
    expect(metrics.livePilotCount).toBe(3);
    expect(metrics.formulaContracts).toBeGreaterThan(0);
    expect(metrics.trustTraceReady).toBeGreaterThan(0);
    expect(metrics.toolFactoryStatus).toBe("skeleton_ready");
  });
});
