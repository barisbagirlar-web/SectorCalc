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
import { isFullLoopRuntimeSlug } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";

const WELDING_SLUG = "welding-bid-risk-analyzer";
const SHEET_METAL_SLUG = "sheet-metal-quote-risk-tool";
const HVAC_SLUG = "hvac-project-margin-guard";

describe("dual-intelligence runtime coverage audit", () => {
  test("classifies all formula contracts", () => {
    const result = runDualIntelligenceRuntimeCoverageAudit();
    expect(result.totalContracts).toBe(FORMULA_CONTRACTS.length);
    expect(result.entries).toHaveLength(FORMULA_CONTRACTS.length);
  });

  test("welding, sheet-metal, and hvac are full_loop_runtime", () => {
    const result = runDualIntelligenceRuntimeCoverageAudit();
    const welding = result.entries.find((item) => item.slug === WELDING_SLUG);
    const sheetMetal = result.entries.find((item) => item.slug === SHEET_METAL_SLUG);
    const hvac = result.entries.find((item) => item.slug === HVAC_SLUG);

    expect(isFullLoopRuntimeSlug(WELDING_SLUG)).toBe(true);
    expect(isFullLoopRuntimeSlug(SHEET_METAL_SLUG)).toBe(true);
    expect(isFullLoopRuntimeSlug(HVAC_SLUG)).toBe(true);
    expect(welding?.tier).toBe("full_loop_runtime");
    expect(sheetMetal?.tier).toBe("full_loop_runtime");
    expect(hvac?.tier).toBe("full_loop_runtime");
    expect(welding?.fullLoopRuntime).toBe(true);
    expect(sheetMetal?.fullLoopRuntime).toBe(true);
    expect(hvac?.fullLoopRuntime).toBe(true);
    expect(welding?.mind1Runtime).toBe(true);
    expect(sheetMetal?.mind1Runtime).toBe(true);
    expect(hvac?.mind1Runtime).toBe(true);
    expect(result.fullLoopRuntimeCount).toBe(3);
    expect(result.stagedCalculationBridge).toBe(4);
  });

  test("only live pilots have partial Mind 1/2 runtime without full loop", () => {
    const result = runDualIntelligenceRuntimeCoverageAudit();

    expect(result.liveSmartFormPilot).toBe(PRODUCTION_DEPLOYED_PILOT_GOVERNANCE_SLUGS.length);
    expect(result.fullLoopRuntimeCount).toBe(3);
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
    expect(report).toContain(WELDING_SLUG);
    expect(report).toContain(SHEET_METAL_SLUG);
    expect(report).toContain(HVAC_SLUG);
  });

  test("is deterministic", () => {
    const first = runDualIntelligenceRuntimeCoverageAudit();
    const second = runDualIntelligenceRuntimeCoverageAudit();
    expect(first).toEqual(second);
  });
});
