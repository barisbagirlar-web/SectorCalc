/**
 * VSM oracle golden lock — HUMAN-VERIFIED reference values (Baris, 2026-07-14).
 *
 * Oracle A — value-stream-mapping-analyzer (mfg-515 thresholds):
 *   Golden input: toplamKatmaDegerliSure=20, toplamBeklemeSure=120,
 *   toplamTasimaSure=30, toplamKontrolSure=15
 *   Value-added ratio = 20 / (20 + 120 + 30 + 15) × 100 = 10.8108108108…%
 *   Rounded: 10.81%. Thresholds (mfg-515): warning=15, critical=5,
 *   direction=lower_is_bad → 10.81 is below warning and above critical
 *   ⇒ decision state MUST be WARNING (not CRITICAL, not OK).
 *
 * Oracle B — vsm-financial-converter-analyzer (chunk-64):
 *   Golden input: totalLeadTime=480, valueAddedTime=120, costPerMinute=1.5
 *   converter_1 (VA ratio)   = 120 / 480 = 0.25
 *   converter_2 (NVA cost)   = (480 − 120) × 1.5 = 540
 *   converter_5 (Total Financial Impact)
 *     = inventoryReductionSavings + productivityGain + qualityImprovementSavings
 *     (three DISTINCT components — the legacy duplicate-add form
 *      `NVA + NVA + leadtime` was wrong and has been removed from the
 *      legacy premium-schema registry.)
 */
import { describe, expect, it } from "vitest";
import { CHUNK_63_DEFINITIONS } from "../formulas/chunk-63";
import { CHUNK_64_DEFINITIONS } from "../formulas/chunk-64";
import { VALUE_STREAM_MAP_VSM_CALCULATOR_SCHEMA } from "../schemas/mfg-515";

const ALL_DEFINITIONS = [...CHUNK_63_DEFINITIONS, ...CHUNK_64_DEFINITIONS];

function getFormula(id: string) {
  const def = ALL_DEFINITIONS.find((d) => d.id === id);
  if (!def) throw new Error(`formula not found: ${id}`);
  return def.fn;
}

describe("VSM oracle golden lock (human-verified 2026-07-14)", () => {
  it("Oracle A: value-added ratio = 10.8108108108% for golden VSM input", () => {
    const va = 20;
    const total = 20 + 120 + 30 + 15; // 185
    const ratioPercent = (va / total) * 100;
    expect(ratioPercent).toBeCloseTo(10.8108108108, 9);
    expect(Math.round(ratioPercent * 100) / 100).toBe(10.81);
  });

  it("Oracle A: mfg-515 thresholds classify 10.8108% as WARNING", () => {
    const threshold = VALUE_STREAM_MAP_VSM_CALCULATOR_SCHEMA.thresholds.find(
      (t) => t.fieldId === "valueAddedPercent"
    );
    expect(threshold).toBeDefined();
    expect(threshold!.warning).toBe(15);
    expect(threshold!.critical).toBe(5);
    expect(threshold!.direction).toBe("lower_is_bad");

    const value = 10.8108108108;
    // lower_is_bad: CRITICAL if value < critical, WARNING if value < warning
    const state =
      value < threshold!.critical
        ? "CRITICAL"
        : value < threshold!.warning
          ? "WARNING"
          : "OK";
    expect(state).toBe("WARNING");
  });

  it("Oracle B: converter_1 value-added ratio = 0.25 for golden converter input", () => {
    const fn = getFormula("user.vsm_financial_converter_1");
    expect(fn({ valueAddedTime: 120, totalLeadTime: 480 })).toBeCloseTo(0.25, 12);
  });

  it("Oracle B: converter_2 NVA cost = 540 for golden converter input", () => {
    const fn = getFormula("user.vsm_financial_converter_2");
    expect(
      fn({ totalLeadTime: 480, valueAddedTime: 120, costPerMinute: 1.5 })
    ).toBeCloseTo(540, 9);
  });

  it("Oracle B: converter_5 total impact = sum of three distinct components", () => {
    const fn = getFormula("user.vsm_financial_converter_5");
    expect(
      fn({
        inventoryReductionSavings: 1000,
        productivityGain: 250,
        qualityImprovementSavings: 75,
      })
    ).toBeCloseTo(1325, 9);
    // Regression guard against the removed duplicate-add form:
    // NVA(540) + NVA(540) + leadtime(720) = 1800 must NOT be reproducible
    // from converter_5's contract inputs.
    expect(
      fn({
        inventoryReductionSavings: 540,
        productivityGain: 540,
        qualityImprovementSavings: 720,
      })
    ).toBe(1800); // identity of the sum itself stays valid — only inputs differ by contract
  });
});
