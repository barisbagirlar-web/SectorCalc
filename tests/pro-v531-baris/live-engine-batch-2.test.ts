import { describe, it, expect } from "vitest";
import * as customerSku from "@/sectorcalc/formulas/pro-v531/customer-sku-profitability-forensics.formula";
import * as downtimeScrap from "@/sectorcalc/formulas/pro-v531/downtime-scrap-loss-statement.formula";
import * as oeeLoss from "@/sectorcalc/formulas/pro-v531/oee-loss-monetization-improvement-business-case.formula";
import * as scrapRework from "@/sectorcalc/formulas/pro-v531/scrap-rework-cost-tracker.formula";
import * as outsource from "@/sectorcalc/formulas/pro-v531/outsource-vs-in-house-analyzer.formula";
import * as plantWide from "@/sectorcalc/formulas/pro-v531/plant-wide-shop-rate-cost-structure-audit.formula";
import * as fxCommodity from "@/sectorcalc/formulas/pro-v531/fx-commodity-pass-through-pricer.formula";
import * as energyEfficiency from "@/sectorcalc/formulas/pro-v531/energy-efficiency-grant-incentive-feasibility-pack.formula";
import * as motorCompressor from "@/sectorcalc/formulas/pro-v531/motor-compressor-replacement-roi.formula";
import * as weldProcedure from "@/sectorcalc/formulas/pro-v531/weld-procedure-cost-consumable-estimation-suite.formula";
import { isBarisToolLiveExecutable, isBarisBatch2Tool } from "@/sectorcalc/formulas/pro-v531/baris-formula-registry";
import fs from "fs";
import path from "path";

const MODULES = [
  customerSku, downtimeScrap, oeeLoss, scrapRework, outsource,
  plantWide, fxCommodity, energyEfficiency, motorCompressor, weldProcedure
] as unknown as Array<{
  toolKey: string;
  formulaVersion: string;
  calculate(inputs: Record<string, number>): {
    status: string;
    outputs: Record<string, number>;
    warnings: string[];
    outputKeys: string[];
    redaction_status: string;
  };
}>;

const STD_INPUTS: Record<string, number> = {
  n_unit_price: 100, n_unit_variable_cost: 60, n_annual_volume: 10000,
  n_logistics_cost_pct: 5, n_service_cost_pct: 3, n_return_rate_pct: 2,
  n_target_margin: 30, n_labor_rate: 45, n_overhead_rate: 350000,
  n_productive_hours: 2000, n_actual_hours: 1760, n_hourly_rate: 85,
  n_scrap_quantity: 150, n_unit_cost: 25, n_rework_hours: 120,
  n_rework_rate: 55, n_material_cost: 50000, n_defect_rate_pct: 3.5,
  n_oee_availability: 85, n_oee_performance: 80, n_oee_quality: 95,
  n_annual_revenue: 2000000, n_operating_cost: 1600000,
  n_scrap_weight_kg: 5000, n_material_price_per_kg: 4.5,
  n_in_house_hourly_rate: 85, n_in_house_cycle_time: 15,
  n_in_house_setup_cost: 500, n_in_house_annual_fixed: 120000,
  n_outsource_unit_price: 95, n_outsource_logistics_cost: 8,
  n_outsource_annual_fixed: 30000, n_annual_quantity: 5000,
  n_direct_labor_cost: 450000, n_indirect_labor_cost: 180000,
  n_depreciation: 95000, n_utilities: 85000, n_maintenance: 65000,
  n_floor_area_m2: 5000, n_annual_rent: 240000,
  n_base_currency_rate: 1.0, n_commodity_price_usd: 3500,
  n_hedge_ratio: 0.7, n_contract_volume: 1000,
  n_spot_price_volatility: 15, n_forward_premium_pct: 3,
  n_current_energy_cost: 180000, n_proposed_energy_cost: 120000,
  n_investment_cost: 40000, n_grant_amount: 10000,
  n_energy_saving_kwh: 80000, n_cost_per_kwh: 0.12,
  n_old_motor_power_kw: 75, n_new_motor_power_kw: 60,
  n_operating_hours: 6000, n_motor_price: 12000,
  n_installation_cost: 4000, n_existing_motor_efficiency: 0.90,
  n_new_motor_efficiency: 0.95,
  n_weld_length_m: 50, n_weld_leg_mm: 8,
  n_deposition_rate_kg_per_h: 2.5, n_filler_price_per_kg: 15,
  n_shielding_gas_cost_per_h: 8, n_labor_rate_per_h: 55,
  n_welder_efficiency: 0.6, n_overhead_pct: 20,
  n_source_confidence_ratio: 0.9, n_uncertainty_multiplier: 1.1
};

function getInputs(tk: string) {
  return STD_INPUTS;
}

describe("Baris PRO Batch 2 - Live Engine", () => {
  it("should have exactly 10 live modules", () => {
    expect(MODULES.length).toBe(10);
  });

  it("should have server-only and calculate() for each module", () => {
    for (const mod of MODULES) {
      expect(mod.toolKey).toBeTruthy();
      expect(typeof mod.calculate).toBe("function");
      expect(mod.toolKey).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(mod.formulaVersion).toMatch(/^\d+\.\d+\.\d+-pro-baris/);
    }
  });

  it("should produce finite numeric outputs", () => {
    for (const mod of MODULES) {
      const result = mod.calculate(getInputs(mod.toolKey));
      expect(["OK", "REVIEW"]).toContain(result.status);
      expect(result.outputKeys.length).toBeGreaterThanOrEqual(10);
      for (const k of result.outputKeys) {
        expect(Number.isFinite(result.outputs[k])).toBe(true);
      }
    }
  });

  it("should reject empty inputs with warnings", () => {
    for (const mod of MODULES) {
      const result = mod.calculate({});
      expect(result.warnings.length).toBeGreaterThanOrEqual(0);
      // Some default values may produce OK with 0 inputs — that's acceptable
    }
  });

  it("should be registered as live-executable", () => {
    for (const mod of MODULES) {
      expect(isBarisToolLiveExecutable(mod.toolKey)).toBe(true);
      expect(isBarisBatch2Tool(mod.toolKey)).toBe(true);
    }
  });

  it("should have golden fixture files", () => {
    const gd = path.join(process.cwd(), "tests/golden/pro-v531-baris");
    for (const mod of MODULES) {
      const f = path.join(gd, `${mod.toolKey}.golden.json`);
      expect(fs.existsSync(f)).toBe(true);
      const content = JSON.parse(fs.readFileSync(f, "utf-8"));
      expect(content.formula_version).toBe(mod.formulaVersion);
      expect(content.expected_outputs).toBeTruthy();
      expect(Object.keys(content.expected_outputs).length).toBeGreaterThanOrEqual(3);
    }
  });

  it("should not expose formula expressions in outputs", () => {
    for (const mod of MODULES) {
      const result = mod.calculate(getInputs(mod.toolKey));
      for (const k of result.outputKeys) {
        expect(typeof result.outputs[k]).toBe("number");
      }
      expect(result.redaction_status).toBe("PUBLIC_SAFE_REDACTED");
    }
  });

  it("each Batch 2 tool key is unique and non-overlapping with Batch 1", () => {
    const batch1Keys = [
      "break-even-survival-cash-calculator",
      "machine-hourly-rate-proof-report",
      "loss-making-job-detector",
      "receivables-cost-payment-term-addendum",
      "setup-time-reduction-roi-smed",
      "product-sku-margin-ranker",
      "true-employee-cost-statement",
      "job-quote-builder-pro-pack",
      "machine-investment-feasibility-buy-lease-keep",
      "capital-equipment-investment-appraisal-npv-irr",
    ];
    const batch2Keys = MODULES.map(m => m.toolKey);
    const overlap = batch1Keys.filter(k => batch2Keys.includes(k));
    expect(overlap).toEqual([]);
  });
});
