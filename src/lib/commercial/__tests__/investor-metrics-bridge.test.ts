/**
 * Investor metrics bridge tests — Phase 6A.
 */

import { chdir, cwd } from "node:process";
import { describe, expect, test } from "vitest";
import { collectInvestorDemoMetrics } from "@/lib/formula-governance/investor-demo/investor-demo-metrics";
import { loadInvestorPageMetrics } from "@/lib/commercial/investor-metrics-bridge";
import { INVESTOR_PAGE_TRUST_TRACE_READY } from "@/lib/commercial/investor-page-metrics-snapshot";

describe("investor metrics bridge — Phase 6A", () => {
  test("loads live pilot count without fake metrics", () => {
    const metrics = loadInvestorPageMetrics();
    expect(metrics.livePilotCount).toBe(3);
    expect(metrics.formulaContracts).toBeGreaterThan(0);
    expect(metrics.trustTraceReady).toBe(INVESTOR_PAGE_TRUST_TRACE_READY);
    expect(metrics.toolFactoryStatus).toBe("skeleton_ready");
  });

  test("SSR-safe when cwd lacks src tree (Cloud Run hosting)", () => {
    const originalCwd = cwd();
    try {
      chdir("/tmp");
      expect(() => loadInvestorPageMetrics()).not.toThrow();
      const metrics = loadInvestorPageMetrics();
      expect(metrics.livePilotCount).toBe(3);
      expect(metrics.formulaContracts).toBeGreaterThan(0);
    } finally {
      chdir(originalCwd);
    }
  });

  test("calculation summary snapshot matches dev audit from repo root", () => {
    const auditMetrics = collectInvestorDemoMetrics();
    expect(INVESTOR_PAGE_TRUST_TRACE_READY).toBe(auditMetrics.trustTraceCoverage);
  });
});
