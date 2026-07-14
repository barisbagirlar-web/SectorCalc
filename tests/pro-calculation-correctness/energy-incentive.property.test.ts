import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { ENERGY_INCENTIVE_FORMULA_VERSION, ENERGY_INCENTIVE_MODEL_ID, ENERGY_INCENTIVE_SCHEMA_VERSION, evaluateEnergyIncentive } from "@/sectorcalc/formulas/pro-v531/energy-incentive-core";
import { calculate, sampleInputs } from "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
const Decimal = Big(); Decimal.DP = 50; Decimal.RM = 2; Decimal.STRICT = true;
function close(a: Big, b: Big): boolean { return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte("1e-44"); }
function evaluate(overrides: Record<string, string> = {}) {
  const result = evaluateEnergyIncentive({ currentEnergyKwhPerYear: "500000", targetEnergyKwhPerYear: "350000", energyRatePerKwh: "0.12",
    implementationCost: "80000", grantCoverageRatio: "0.3", annualMaintenanceSaving: "5000", emissionFactorKgCo2ePerKwh: "0.45",
    equipmentLifeYears: "10", discountRate: "0.08", sourceConfidenceRatio: "0.9", ...overrides });
  expect(result.ok).toBe(true); if (!result.ok) throw new Error(result.error.message); return result.value;
}
describe("energy incentive Decimal properties", () => {
  it("proves energy, grant, discounted savings, NPV, and physical lifetime identities", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 50 }), fc.integer({ min: 1, max: 499999 }), fc.integer({ min: 0, max: 1000 }),
      (years, saving, grantBp) => {
        const target = Decimal("500000").minus(String(saving)); const grant = Decimal(String(grantBp)).div("1000");
        const r = evaluate({ equipmentLifeYears: String(years), targetEnergyKwhPerYear: target.toString(), grantCoverageRatio: grant.toString(), discountRate: "0" });
        expect(r.annualEnergySavingKwh.eq(String(saving))).toBe(true); expect(r.annuityPresentValueFactor.eq(String(years))).toBe(true);
        expect(r.grantAmount.eq(Decimal("80000").times(grant))).toBe(true);
        expect(r.discountedLifetimeSavings.eq(r.annualTotalCashSaving.times(String(years)))).toBe(true);
        expect(r.grantAdjustedNetPresentValue.eq(r.discountedLifetimeSavings.minus(r.netInvestmentCost))).toBe(true);
        expect(r.lifetimeEnergySavingKwh.eq(r.annualEnergySavingKwh.times(String(years)))).toBe(true);
      }), { numRuns: 500, seed: 538_001 });
  });
  it("is homogeneous in monetary cost and benefit inputs", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10000 }), (factor) => {
      const s = Decimal(String(factor)); const base = evaluate(); const scaled = evaluate({ energyRatePerKwh: Decimal("0.12").times(s).toString(),
        implementationCost: Decimal("80000").times(s).toString(), annualMaintenanceSaving: Decimal("5000").times(s).toString() });
      expect(close(scaled.annualTotalCashSaving, base.annualTotalCashSaving.times(s))).toBe(true);
      expect(close(scaled.grantAdjustedNetPresentValue, base.grantAdjustedNetPresentValue.times(s))).toBe(true);
      expect(scaled.grossInvestmentBenefitCostRatio.eq(base.grossInvestmentBenefitCostRatio)).toBe(true);
      expect(scaled.simplePaybackYears.eq(base.simplePaybackYears)).toBe(true); expect(scaled.decisionState).toBe(base.decisionState);
    }), { numRuns: 500, seed: 538_002 });
  });
  it("improves benefits monotonically with energy saving and grant coverage", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 499998 }), fc.integer({ min: 0, max: 999 }), (saving, grantBp) => {
      const low = evaluate({ targetEnergyKwhPerYear: Decimal("500000").minus(String(saving)).toString() });
      const high = evaluate({ targetEnergyKwhPerYear: Decimal("499999").minus(String(saving)).toString() });
      expect(high.annualEnergyCostSaving.gt(low.annualEnergyCostSaving)).toBe(true); expect(high.grantAdjustedNetPresentValue.gt(low.grantAdjustedNetPresentValue)).toBe(true);
      const g = Decimal(String(grantBp)).div("1000"); const grantLow = evaluate({ grantCoverageRatio: g.toString() }); const grantHigh = evaluate({ grantCoverageRatio: g.plus("0.001").toString() });
      expect(grantHigh.netInvestmentCost.lt(grantLow.netInvestmentCost)).toBe(true); expect(grantHigh.grantAdjustedNetPresentValue.gt(grantLow.grantAdjustedNetPresentValue)).toBe(true);
    }), { numRuns: 500, seed: 538_003 });
  });
  it("encloses NPV and narrows with confidence", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (bp) => { const c = Decimal(String(bp)).div("1000"); const low = evaluate({ sourceConfidenceRatio: c.toString() }); const high = evaluate({ sourceConfidenceRatio: c.plus("0.001").toString() });
      expect(low.npvLowerBound.lte(low.grantAdjustedNetPresentValue)).toBe(true); expect(low.npvUpperBound.gte(low.grantAdjustedNetPresentValue)).toBe(true);
      expect(high.npvUncertainty.lte(low.npvUncertainty)).toBe(true); expect(high.npvLowerBound.gte(low.npvLowerBound)).toBe(true);
    }), { numRuns: 500, seed: 538_004 });
  });
  it("fails closed for zero/reversed energy, no cash saving, invalid life/ratios, negatives, NaN, and infinity", () => {
    const b = { currentEnergyKwhPerYear: "500000", targetEnergyKwhPerYear: "350000", energyRatePerKwh: "0.12", implementationCost: "80000", grantCoverageRatio: "0.3", annualMaintenanceSaving: "5000", emissionFactorKgCo2ePerKwh: "0.45", equipmentLifeYears: "10", discountRate: "0.08", sourceConfidenceRatio: "0.9" };
    expect(evaluateEnergyIncentive({ ...b, currentEnergyKwhPerYear: "0" }).ok).toBe(false); expect(evaluateEnergyIncentive({ ...b, targetEnergyKwhPerYear: "500000" }).ok).toBe(false);
    expect(evaluateEnergyIncentive({ ...b, energyRatePerKwh: "0", annualMaintenanceSaving: "0" }).ok).toBe(false); expect(evaluateEnergyIncentive({ ...b, implementationCost: "0" }).ok).toBe(false);
    expect(evaluateEnergyIncentive({ ...b, equipmentLifeYears: "1.5" }).ok).toBe(false); expect(evaluateEnergyIncentive({ ...b, grantCoverageRatio: "1.1" }).ok).toBe(false);
    expect(evaluateEnergyIncentive({ ...b, energyRatePerKwh: Number.NaN }).ok).toBe(false); expect(evaluateEnergyIncentive({ ...b, emissionFactorKgCo2ePerKwh: Number.POSITIVE_INFINITY }).ok).toBe(false);
  });
  it("binds canonical energy units, discounted timing, semantic outputs, and exact audit values", () => {
    const schema = resolveApprovedToolSchema("energy-efficiency-grant-incentive-feasibility-pack"); if (!schema.ok) throw new Error(`${schema.reason}:${schema.errors.join("|")}`);
    expect(schema.schema.metadata.formula_version).toBe(ENERGY_INCENTIVE_FORMULA_VERSION); expect(schema.schema.metadata.schema_version).toBe(ENERGY_INCENTIVE_SCHEMA_VERSION);
    expect(schema.schema.calculation_basis.model_id).toBe(ENERGY_INCENTIVE_MODEL_ID); expect(schema.schema.inputs.find((i) => i.id === "current_kwh_per_year")).toMatchObject({ base_unit: "kWh/year" });
    expect(schema.schema.inputs.find((i) => i.id === "grant_coverage_pct")).toMatchObject({ base_unit: "ratio" });
    const formula = calculate(sampleInputs); expect(formula.status).not.toBe("BLOCKED"); expect(Object.keys(formula.outputs).sort()).toEqual(schema.schema.outputs.map((i) => i.id).sort());
    for (const [id, exact] of Object.entries(formula.decimalOutputs ?? {})) expect(Number(exact)).toBe(formula.outputs[id]);
  });
});
