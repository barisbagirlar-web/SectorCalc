/**
 * Dual-intelligence runtime coverage audit tests.
 */

import { describe, expect, test } from "vitest";
import {
  formatDualIntelligenceRuntimeCoverageReport,
  runDualIntelligenceRuntimeCoverageAudit,
} from "@/lib/formula-governance/dual-intelligence-runtime-coverage/dual-intelligence-runtime-coverage-audit";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import {
  PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS,
} from "@/lib/formula-governance/smart-form-ui-bridge/pilot-calculation-bridge-registry";
import {
  FULL_LOOP_RUNTIME_SLUGS,
  isFullLoopRuntimeSlug,
} from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

describe("dual-intelligence runtime coverage audit", () => {
  test("classifies all formula contracts", () => {
    const result = runDualIntelligenceRuntimeCoverageAudit();
    expect(result.totalContracts).toBe(FORMULA_CONTRACTS.length);
    expect(result.entries).toHaveLength(FORMULA_CONTRACTS.length);
  });

  test("all staged batch tools are full_loop_runtime with zero staged bridge", () => {
    const result = runDualIntelligenceRuntimeCoverageAudit();

    for (const slug of FULL_LOOP_RUNTIME_SLUGS) {
      expect(isFullLoopRuntimeSlug(slug)).toBe(true);
      const entry = result.entries.find((item) => item.slug === slug);
      expect(entry?.tier).toBe("full_loop_runtime");
      expect(entry?.fullLoopRuntime).toBe(true);
      expect(entry?.mind1Runtime).toBe(true);
      expect(entry?.mind2Runtime).toBe(true);
    }

    expect(result.fullLoopRuntimeCount).toBe(35);
    expect(result.stagedCalculationBridge).toBe(0);
    expect(result.governedBuildtimeOnly).toBe(0);
    expect(result.auditPipelineOnly).toBe(3);
  });

  test("only live pilots have partial Mind 1/2 runtime without full loop", () => {
    const result = runDualIntelligenceRuntimeCoverageAudit();

    expect(result.liveSmartFormPilot).toBe(PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS.length);
    expect(result.fullLoopRuntimeCount).toBe(35);
    expect(result.mind1RuntimeCount).toBe(result.liveSmartFormPilot + result.fullLoopRuntimeCount);
    expect(result.mind2RuntimeCount).toBe(result.liveSmartFormPilot + result.fullLoopRuntimeCount);

    for (const slug of PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS) {
      const entry = result.entries.find((item) => item.slug === slug);
      expect(entry?.tier).toBe("live_smart_form_pilot");
      expect(entry?.mind1Runtime).toBe(true);
      expect(entry?.mind2Runtime).toBe(true);
    }
  });

  test("report includes tier breakdown", () => {
    const result = runDualIntelligenceRuntimeCoverageAudit();
    const report = formatDualIntelligenceRuntimeCoverageReport(result);

    expect(report).toContain("Dual-Intelligence Runtime Coverage");
    expect(report).toContain("live_smart_form_pilot");
    expect(report).toContain("full_loop_runtime");
    for (const slug of FULL_LOOP_RUNTIME_SLUGS) {
      expect(report).toContain(slug);
    }
  });

  test("is deterministic", () => {
    const first = runDualIntelligenceRuntimeCoverageAudit();
    const second = runDualIntelligenceRuntimeCoverageAudit();
    expect(first).toEqual(second);
  });
});
