import Big from "big.js";
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { executeCertifiedFreeCalculation } from "@/sectorcalc/formulas/free-v531/certified-free-calculation-kernel";
import {
  CERTIFIED_DECIMAL_FREE_TOOL_SLUGS,
  CERTIFIED_FREE_TOOL_SLUGS,
  CERTIFIED_INTERVAL_FREE_TOOL_SLUGS,
  FREE_DECIMAL_ARITHMETIC_MODE,
  FREE_INTERVAL_ARITHMETIC_MODE,
  getFreeFormulaCertification,
} from "@/sectorcalc/formulas/free-v531/free-formula-verification-manifest";
import { getFreeIntervalModelContract } from "@/sectorcalc/formulas/free-v531/free-interval-model-contract";
import { ACTIVE_FREE_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import { getFreeToolManifest, verifyManifestConsistency } from "@/sectorcalc/free-tools/free-tools-manifest";
import { getCalculationProductionReadiness } from "@/sectorcalc/runtime/calculation-production-readiness";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { getCertifiedFreeOutputIds } from "@/sectorcalc/runtime/free-calculation-contract-overrides";

const validInputs: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "downtime-cost": {
    downtime_hours: "4", planned_units_per_hour: "12.5", contribution_margin_per_unit: "8.4",
    idle_labor_cost_per_hour: "25", repair_cost: "300", delivery_penalty_cost: "75",
  },
  "energy-cost-per-part": {
    average_machine_power_kw: "18.5", cycle_seconds_per_part: "42", auxiliary_kwh_per_part: "0.03",
    electricity_rate: "0.21", parts_per_batch: "25", batch_idle_kwh: "1.75",
  },
  "quote-margin-markup": {
    direct_cost: "100", overhead_cost: "20", risk_allowance: "5", selling_price: "180",
    commission_percent: "4", minimum_margin_percent: "15",
  },
  "concrete-volume-order-quantity": {
    length_m: "12.5", width_m: "4.2", depth_m: "0.18", waste_percent: "7.5",
    truck_capacity_m3: "8", concrete_cost_per_m3: "125",
  },
  "pallet-container-load-cbm": {
    item_length_m: "1.2", item_width_m: "0.8", item_height_m: "0.65", item_quantity: "20",
    container_capacity_cbm: "33.2", void_allowance_percent: "8",
  },
  "scrap-cost": {
    produced_quantity: "1000", scrap_quantity: "20", material_cost_per_unit: "4",
    conversion_cost_per_unit: "3", reinspection_cost_per_scrap: "1", salvage_value_per_unit: "0.5",
  },
  "setup-time-cost": {
    setup_minutes: "45", machine_hourly_rate: "80", labor_hourly_rate: "25", batch_quantity: "100",
    changeovers_per_month: "12", target_setup_cost_per_part: "1",
  },
  "line-balancing-efficiency": {
    total_task_time_seconds: "180", number_of_stations: "4", line_cycle_time_seconds: "60",
    labor_cost_per_hour_per_station: "20", shift_hours: "8",
  },
  "electric-motor-running-cost": {
    motor_power_kw: "30", load_factor_percent: "75", motor_efficiency_percent: "90",
    operating_hours: "4000", electricity_rate: "0.2",
  },
  "inventory-carrying-cost": {
    average_inventory_value: "100000", capital_cost_percent: "12", annual_storage_cost: "5000",
    insurance_tax_percent: "2", shrinkage_percent: "1", obsolescence_percent: "3",
  },
  "freight-cost-per-km-trip": {
    distance_km: "300", rate_per_km: "1.5", fixed_trip_cost: "100", waiting_cost: "50",
    fuel_surcharge_percent: "8", units_shipped: "1000", economic_minimum_units: "500",
  },
  "true-employee-cost": {
    gross_salary: "3000", employer_tax_percent: "20", monthly_benefits_cost: "300",
    monthly_insurance_cost: "100", monthly_severance_accrual: "150", monthly_overtime_cost: "200",
    monthly_productive_hours: "160",
  },
  "break-even-point": {
    monthly_fixed_cost: "10000", selling_price_per_unit: "50", variable_cost_per_unit: "30",
    target_monthly_profit: "5000", expected_sales_units: "800",
  },
  "customer-profitability": {
    customer_revenue: "100000", product_cost: "60000", service_cost: "5000", return_rework_cost: "2000",
    logistics_cost: "4000", payment_delay_cost: "1000", sales_support_cost: "3000",
  },
  "machining-cost-per-part": {
    machine_hourly_rate: "80", labor_hourly_rate: "25", setup_minutes: "45", cycle_seconds: "90",
    batch_quantity: "100", material_cost_per_blank: "12", tooling_cost_per_edge: "20", edge_life_parts: "200",
    overhead_percent: "15", scrap_percent: "3", target_margin_percent: "25",
  },
  "cnc-shop-hourly-rate": {
    annual_fixed_cost: "10000", annual_depreciation: "15000", annual_maintenance_cost: "5000",
    annual_floor_cost: "4000", annual_admin_allocation: "6000", annual_operator_cost: "30000",
    annual_available_machine_hours: "4000", utilization_percent: "70", average_power_kw: "12",
    electricity_rate: "0.2", consumables_per_hour: "3", current_shop_rate: "35",
  },
  "material-removal-rate": {
    width_of_cut_mm: "10", depth_of_cut_mm: "2", feed_rate_mm_min: "500",
    material_density_kg_m3: "7850", machine_hourly_rate: "80",
  },
  "compressed-air-leak-cost": {
    estimated_leak_flow_cfm: "25", compressor_specific_power_kw_per_cfm: "0.18",
    annual_operating_hours: "6000", electricity_rate: "0.2", estimated_repair_cost: "1000",
  },
  "carbon-price-exposure": {
    exposed_emissions_tco2e: "1000", low_carbon_price: "40", base_carbon_price: "70",
    high_carbon_price: "100", customer_pass_through_percent: "20",
  },
  "payment-term-cost": {
    invoice_amount: "10000", payment_term_days: "60", annual_finance_rate_percent: "12",
    default_risk_percent: "1.5", cash_discount_percent: "2",
  },
  "machine-investment-payback": {
    machine_capex: "180000", installation_cost: "12000", annual_labor_savings: "50000",
    annual_scrap_savings: "10000", annual_extra_margin: "15000", annual_incremental_maintenance: "5000",
    residual_value: "20000", maximum_payback_months: "36",
  },
  "currency-adjusted-pricing": {
    base_cost_local_currency: "100", current_fx_rate: "32", quote_fx_rate: "34",
    fx_buffer_percent: "3", target_margin_percent: "25", freight_cost_local_currency: "8",
  },
  "eoq": {
    annual_demand_units: "10000", ordering_cost_per_order: "75", unit_cost: "12",
    annual_carrying_rate_percent: "20",
  },
  "safety-stock-reorder-point": {
    average_daily_demand: "200", lead_time_days: "14", daily_demand_std_dev: "25",
    lead_time_std_dev_days: "2", service_level_z_score: "1.645",
  },
  "recipe-cost-menu-price": {
    ingredient_cost_per_batch: "45", batch_yield_portions: "20", kitchen_waste_percent: "5",
    labor_cost_per_portion: "1.25", overhead_cost_per_portion: "0.75", target_food_cost_percent: "30",
  },
  "fabric-consumption-gsm": {
    garment_area_m2: "1.5", fabric_gsm: "180", marker_efficiency_percent: "85",
    fabric_cost_per_kg: "8", shrinkage_percent: "4",
  },
  "oee": {
    planned_production_minutes: "480", downtime_minutes: "60", ideal_cycle_seconds: "50",
    total_count: "400", good_count: "380", contribution_margin_per_good_unit: "12",
  },
  "takt-time-cycle-time": {
    available_production_minutes: "420", customer_demand_units: "500", actual_cycle_seconds: "45",
    expected_uptime_percent: "90",
  },
  "rework-vs-scrap-decision": {
    rework_labor_cost: "40", rework_material_cost: "20", reinspection_cost: "10",
    rework_success_probability_percent: "85", scrap_replacement_cost: "300",
    delivery_penalty_cost: "50", scrap_salvage_credit: "25",
  },
  "welding-cost-per-meter": {
    travel_speed_mm_min: "300", arc_on_ratio_percent: "35", labor_hourly_rate: "30",
    machine_hourly_rate: "20", consumable_kg_per_meter: "0.45", consumable_cost_per_kg: "8",
    shielding_gas_cost_per_meter: "1.2", energy_cost_per_meter: "0.8",
  },
  "welding-heat-input": {
    arc_voltage_v: "24", welding_current_a: "200", travel_speed_mm_min: "300",
    process_efficiency_percent: "80", user_verified_max_heat_input_kj_mm: "1.5",
  },
  "electricity-co2-emissions": {
    electricity_kwh: "10000", user_verified_grid_factor_kgco2e_kwh: "0.4",
    renewable_share_percent: "20", evidence_confidence_percent: "90",
  },
  "diesel-fuel-co2-emissions": {
    fuel_volume_liters: "1000", user_verified_emission_factor_kgco2e_liter: "2.68",
    bio_blend_reduction_percent: "5", payload_ton_km: "50000",
  },
  "product-carbon-footprint-basic": {
    scope1_emissions_kgco2e: "1000", scope2_emissions_kgco2e: "2000",
    allocated_process_emissions_kgco2e: "500", production_units: "1000", scrap_rate_percent: "5",
  },
  "rebar-weight-count": {
    bar_diameter_mm: "16", bar_length_m: "12", bar_count: "40", lap_waste_percent: "8", rebar_cost_per_kg: "1.2",
  },
  "steel-weight": {
    length_m: "6", cross_section_area_mm2: "2500", density_kg_m3: "7850", waste_percent: "5", material_cost_per_kg: "1.1",
  },
  "weld-metal-weight-consumable": {
    weld_length_m: "20", weld_cross_section_area_mm2: "35", deposit_density_kg_m3: "7850",
    deposition_efficiency_percent: "85", consumable_cost_per_kg: "6",
  },
  "bolt-torque": {
    nut_factor_k: "0.18", desired_preload_kn: "60", nominal_diameter_mm: "16", torque_scatter_percent: "25",
  },
  "bolt-preload-clamp-force": {
    user_verified_proof_load_kn: "100", target_preload_percent: "70",
    joint_settlement_loss_percent: "10", external_tension_kn: "20",
  },
  "beam-load-deflection-quick-check": {
    span_m: "4", uniform_load_kn_m: "2", elastic_modulus_gpa: "210", second_moment_area_cm4: "1200",
    section_modulus_cm3: "120", user_verified_yield_stress_mpa: "355", deflection_limit_ratio: "250",
  },
  "surface-roughness-converter": { ra_um: "1.6", rz_to_ra_ratio: "6.3", rms_to_ra_ratio: "1.11" },
  "tap-drill-size": {
    major_diameter_mm: "10", thread_pitch_mm: "1.5", material_allowance_mm: "0.1", plating_allowance_mm: "0.05",
  },
  "thread-dimensions-reference": {
    major_diameter_mm: "10", pitch_mm: "1.5", allowance_mm: "-0.05", engagement_length_mm: "12",
  },
  "iso-286-tolerance-fit": {
    nominal_diameter_mm: "50", hole_lower_deviation_um: "0", hole_upper_deviation_um: "25",
    shaft_lower_deviation_um: "-25", shaft_upper_deviation_um: "-9",
  },
  "cbam-cost-quick-estimator": {
    export_product_mass_ton: "100", embedded_emission_tco2e_per_ton: "1.8",
    free_allocation_factor_percent: "20", carbon_price_per_tco2e: "75.36", evidence_confidence_percent: "85",
  },
  "cutting-speed-feed-rpm": {
    cutting_speed_m_min: "180", tool_diameter_mm: "10", number_of_teeth: "4",
    feed_per_tooth_mm: "0.08", max_chip_load_mm: "0.12",
  },
  "fillet-weld-size-strength": {
    fillet_leg_size_mm: "6", effective_weld_length_mm: "120",
    user_verified_allowable_stress_mpa: "100", applied_load_kn: "35", load_angle_factor: "1.2",
  },
  "knurling-drill-point-depth": {
    drill_diameter_mm: "12", drill_point_angle_deg: "118", knurl_pitch_mm: "1", workpiece_diameter_mm: "30",
  },
  "sheet-metal-bend-allowance": {
    bend_angle_deg: "90", inside_radius_mm: "2", material_thickness_mm: "1.5",
    k_factor: "0.33", flange_a_mm: "30", flange_b_mm: "40",
  },
  "tool-life-tool-cost-per-part": {
    taylor_c: "300", taylor_n: "0.25", cutting_speed_m_min: "150", edge_cost: "20",
    cutting_time_seconds_per_part: "60", tool_change_minutes: "5", machine_hourly_rate: "90",
  },
};

function exact(toolKey: string, inputs: Readonly<Record<string, unknown>>, outputId: string): string {
  const result = executeCertifiedFreeCalculation(toolKey, inputs);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  const output = result.value.outputs.find((candidate) => candidate.id === outputId);
  if (!output) throw new Error(`Missing output ${outputId}`);
  return output.exactValue;
}

const positiveDecimal = fc.integer({ min: 1, max: 1_000_000 }).map(String);
const nonNegativeDecimal = fc.integer({ min: 0, max: 1_000_000 }).map(String);
const OracleDecimal = Big();
OracleDecimal.DP = 50;
OracleDecimal.RM = 2;
OracleDecimal.STRICT = true;

function withinRelativeEnvelope(left: string, right: string, tolerance = "1e-45"): boolean {
  const a = OracleDecimal(left);
  const b = OracleDecimal(right);
  return a.minus(b).abs().div(a.abs().plus(b.abs()).plus("1")).lte(tolerance);
}

describe("certified free calculation properties", () => {
  it("derives the public allowlist only from certification records", () => {
    expect(ACTIVE_FREE_TOOL_SLUGS).toEqual(CERTIFIED_FREE_TOOL_SLUGS);
    expect(CERTIFIED_FREE_TOOL_SLUGS).toHaveLength(50);
    expect(CERTIFIED_DECIMAL_FREE_TOOL_SLUGS).toHaveLength(45);
    expect(CERTIFIED_INTERVAL_FREE_TOOL_SLUGS).toHaveLength(5);
    expect(verifyManifestConsistency()).toEqual({ pass: true, errors: [] });
    expect(getFreeToolManifest().filter((entry) => entry.status === "QUARANTINED")).toHaveLength(0);
    expect(getCalculationProductionReadiness()).toMatchObject({
      releasePolicy: "CERTIFICATION_REQUIRED_FAIL_CLOSED",
      free: { candidates: 50, certifiedLive: 50, quarantined: 0 },
      proInstant: { candidates: 20, certifiedLive: 20, quarantined: 0 },
    });
  });

  it("partitions certified tools into disjoint Decimal and verified interval kernels", () => {
    expect(CERTIFIED_INTERVAL_FREE_TOOL_SLUGS).toEqual([
      "cutting-speed-feed-rpm",
      "fillet-weld-size-strength",
      "knurling-drill-point-depth",
      "sheet-metal-bend-allowance",
      "tool-life-tool-cost-per-part",
    ]);
    expect(new Set([...CERTIFIED_DECIMAL_FREE_TOOL_SLUGS, ...CERTIFIED_INTERVAL_FREE_TOOL_SLUGS]).size).toBe(50);
    for (const toolKey of CERTIFIED_DECIMAL_FREE_TOOL_SLUGS) {
      expect(getFreeFormulaCertification(toolKey)?.arithmeticMode).toBe(FREE_DECIMAL_ARITHMETIC_MODE);
    }
    for (const toolKey of CERTIFIED_INTERVAL_FREE_TOOL_SLUGS) {
      expect(getFreeFormulaCertification(toolKey)?.arithmeticMode).toBe(FREE_INTERVAL_ARITHMETIC_MODE);
      expect(getFreeIntervalModelContract(toolKey)).not.toBeNull();
    }
  });

  it("retains auditable primary-source references for externally governed models", () => {
    for (const toolKey of [
      "bolt-torque", "bolt-preload-clamp-force", "beam-load-deflection-quick-check",
      "iso-286-tolerance-fit", "cbam-cost-quick-estimator",
    ]) {
      const certification = getFreeFormulaCertification(toolKey);
      expect(certification?.sourceRefs.length).toBeGreaterThan(0);
      expect(certification?.sourceRefs.every((source) => source.startsWith("https://"))).toBe(true);
    }
  });

  it("binds every certified evaluator output exactly to its public schema", () => {
    const drift: string[] = [];
    for (const toolKey of CERTIFIED_FREE_TOOL_SLUGS) {
      const schema = resolveApprovedToolSchema(toolKey);
      if (!schema.ok) {
        drift.push(`${toolKey}: resolver=${schema.reason}:${schema.errors.join("|")}`);
        continue;
      }
      const schemaIds = schema.schema.outputs.map((output) => output.id).sort();
      const decimalCalculation = CERTIFIED_DECIMAL_FREE_TOOL_SLUGS.includes(toolKey)
        ? executeCertifiedFreeCalculation(toolKey, validInputs[toolKey])
        : null;
      if (decimalCalculation && !decimalCalculation.ok) {
        drift.push(`${toolKey}: evaluator=${decimalCalculation.error.code}:${decimalCalculation.error.message}`);
        continue;
      }
      const evaluatorIds = decimalCalculation?.ok
        ? decimalCalculation.value.outputs.map((output) => output.id).sort()
        : [...(getCertifiedFreeOutputIds(toolKey) ?? [])].sort();
      if (JSON.stringify(schemaIds) !== JSON.stringify(evaluatorIds)) {
        drift.push(`${toolKey}: schema=${schemaIds.join(",")} evaluator=${evaluatorIds.join(",")}`);
      }
      const schemaInputIds = schema.schema.inputs.filter((input) => input.required).map((input) => input.id).sort();
      const fixtureInputIds = Object.keys(validInputs[toolKey]).sort();
      if (JSON.stringify(schemaInputIds) !== JSON.stringify(fixtureInputIds)) {
        drift.push(`${toolKey}: schema-inputs=${schemaInputIds.join(",")} fixture-inputs=${fixtureInputIds.join(",")}`);
      }
    }
    expect(drift).toEqual([]);
  });

  it("is deterministic at the exact-decimal boundary", () => {
    fc.assert(fc.property(fc.constantFrom(...CERTIFIED_DECIMAL_FREE_TOOL_SLUGS), (toolKey) => {
      const first = executeCertifiedFreeCalculation(toolKey, validInputs[toolKey]);
      const second = executeCertifiedFreeCalculation(toolKey, validInputs[toolKey]);
      expect(first).toEqual(second);
    }), { numRuns: 500, seed: 531_801 });
  });

  it("downtime variable losses are linear in downtime duration", () => {
    fc.assert(fc.property(positiveDecimal, positiveDecimal, positiveDecimal, positiveDecimal, (hours, rate, contribution, factor) => {
      const base = {
        downtime_hours: hours, planned_units_per_hour: rate, contribution_margin_per_unit: contribution,
        idle_labor_cost_per_hour: "0", repair_cost: "0", delivery_penalty_cost: "0",
      };
      const scaled = { ...base, downtime_hours: Big(hours).times(factor).toString() };
      const baseLoss = Big(exact("downtime-cost", base, "downtime_loss"));
      const scaledLoss = Big(exact("downtime-cost", scaled, "downtime_loss"));
      expect(scaledLoss.eq(baseLoss.times(factor))).toBe(true);
    }), { numRuns: 300, seed: 531_802 });
  });

  it("energy cost is linear in the entered electricity tariff", () => {
    fc.assert(fc.property(positiveDecimal, positiveDecimal, (rate, factor) => {
      const base = { ...validInputs["energy-cost-per-part"], electricity_rate: rate };
      const scaled = { ...base, electricity_rate: Big(rate).times(factor).toString() };
      const baseCost = Big(exact("energy-cost-per-part", base, "energy_cost_per_part"));
      const scaledCost = Big(exact("energy-cost-per-part", scaled, "energy_cost_per_part"));
      expect(scaledCost.eq(baseCost.times(factor))).toBe(true);
    }), { numRuns: 300, seed: 531_803 });
  });

  it("quote margin and markup are invariant under currency-unit scaling", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const base = validInputs["quote-margin-markup"];
      const scaled = {
        ...base,
        direct_cost: Big(base.direct_cost).times(factor).toString(),
        overhead_cost: Big(base.overhead_cost).times(factor).toString(),
        risk_allowance: Big(base.risk_allowance).times(factor).toString(),
        selling_price: Big(base.selling_price).times(factor).toString(),
      };
      expect(exact("quote-margin-markup", scaled, "quote_margin_percent")).toBe(exact("quote-margin-markup", base, "quote_margin_percent"));
      expect(exact("quote-margin-markup", scaled, "quote_markup_percent")).toBe(exact("quote-margin-markup", base, "quote_markup_percent"));
    }), { numRuns: 300, seed: 531_804 });
  });

  it("rectangular concrete volume is invariant under dimension permutation", () => {
    fc.assert(fc.property(positiveDecimal, positiveDecimal, positiveDecimal, (length, width, depth) => {
      const base = { ...validInputs["concrete-volume-order-quantity"], length_m: length, width_m: width, depth_m: depth };
      const permuted = { ...base, length_m: depth, width_m: length, depth_m: width };
      expect(exact("concrete-volume-order-quantity", base, "net_concrete_volume_m3")).toBe(
        exact("concrete-volume-order-quantity", permuted, "net_concrete_volume_m3"),
      );
    }), { numRuns: 300, seed: 531_805 });
  });

  it("volumetric load is invariant under item-dimension permutation", () => {
    fc.assert(fc.property(positiveDecimal, positiveDecimal, positiveDecimal, (length, width, height) => {
      const base = { ...validInputs["pallet-container-load-cbm"], item_length_m: length, item_width_m: width, item_height_m: height };
      const permuted = { ...base, item_length_m: height, item_width_m: length, item_height_m: width };
      expect(exact("pallet-container-load-cbm", base, "gross_load_cbm")).toBe(
        exact("pallet-container-load-cbm", permuted, "gross_load_cbm"),
      );
    }), { numRuns: 300, seed: 531_806 });
  });

  it("rejects missing, negative, NaN and infinite values instead of substituting defaults", () => {
    const invalidValues: unknown[] = [undefined, "", "-1", Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
    const requiredField: Readonly<Record<string, string>> = {
      "downtime-cost": "downtime_hours",
      "energy-cost-per-part": "parts_per_batch",
      "quote-margin-markup": "selling_price",
      "concrete-volume-order-quantity": "truck_capacity_m3",
      "pallet-container-load-cbm": "container_capacity_cbm",
      "scrap-cost": "produced_quantity",
      "setup-time-cost": "batch_quantity",
      "line-balancing-efficiency": "number_of_stations",
      "electric-motor-running-cost": "motor_efficiency_percent",
      "inventory-carrying-cost": "average_inventory_value",
      "freight-cost-per-km-trip": "units_shipped",
      "true-employee-cost": "monthly_productive_hours",
      "break-even-point": "selling_price_per_unit",
      "customer-profitability": "customer_revenue",
      "machining-cost-per-part": "batch_quantity",
      "cnc-shop-hourly-rate": "utilization_percent",
      "material-removal-rate": "material_density_kg_m3",
      "compressed-air-leak-cost": "electricity_rate",
      "carbon-price-exposure": "base_carbon_price",
      "payment-term-cost": "invoice_amount",
      "machine-investment-payback": "machine_capex",
      "currency-adjusted-pricing": "current_fx_rate",
      "eoq": "annual_demand_units",
      "safety-stock-reorder-point": "average_daily_demand",
      "recipe-cost-menu-price": "batch_yield_portions",
      "fabric-consumption-gsm": "garment_area_m2",
      "oee": "planned_production_minutes",
      "takt-time-cycle-time": "expected_uptime_percent",
      "rework-vs-scrap-decision": "rework_labor_cost",
      "welding-cost-per-meter": "arc_on_ratio_percent",
      "welding-heat-input": "travel_speed_mm_min",
      "electricity-co2-emissions": "electricity_kwh",
      "diesel-fuel-co2-emissions": "payload_ton_km",
      "product-carbon-footprint-basic": "production_units",
      "rebar-weight-count": "bar_count",
      "steel-weight": "density_kg_m3",
      "weld-metal-weight-consumable": "deposition_efficiency_percent",
      "bolt-torque": "desired_preload_kn",
      "bolt-preload-clamp-force": "user_verified_proof_load_kn",
      "beam-load-deflection-quick-check": "span_m",
      "surface-roughness-converter": "ra_um",
      "tap-drill-size": "thread_pitch_mm",
      "thread-dimensions-reference": "major_diameter_mm",
      "iso-286-tolerance-fit": "nominal_diameter_mm",
      "cbam-cost-quick-estimator": "export_product_mass_ton",
    };
    fc.assert(fc.property(
      fc.constantFrom(...CERTIFIED_DECIMAL_FREE_TOOL_SLUGS),
      fc.constantFrom(...invalidValues),
      (toolKey, invalid) => {
        const mutated = { ...validInputs[toolKey], [requiredField[toolKey]]: invalid };
        expect(executeCertifiedFreeCalculation(toolKey, mutated).ok).toBe(false);
      },
    ), { numRuns: 500, seed: 531_807 });
  });

  it("accepts exact zero only for explicitly non-negative cost and loss fields", () => {
    fc.assert(fc.property(nonNegativeDecimal, (repairCost) => {
      const result = executeCertifiedFreeCalculation("downtime-cost", {
        ...validInputs["downtime-cost"],
        repair_cost: repairCost,
        delivery_penalty_cost: "0",
      });
      expect(result.ok).toBe(true);
    }), { numRuns: 200, seed: 531_808 });
  });

  it("preserves batch-one currency and ratio invariants under unit scaling", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const k = Big(factor);

      const scrap = validInputs["scrap-cost"];
      const scaledScrap = {
        ...scrap,
        material_cost_per_unit: Big(scrap.material_cost_per_unit).times(k).toString(),
        conversion_cost_per_unit: Big(scrap.conversion_cost_per_unit).times(k).toString(),
        reinspection_cost_per_scrap: Big(scrap.reinspection_cost_per_scrap).times(k).toString(),
        salvage_value_per_unit: Big(scrap.salvage_value_per_unit).times(k).toString(),
      };
      expect(exact("scrap-cost", scaledScrap, "scrap_rate")).toBe(exact("scrap-cost", scrap, "scrap_rate"));
      expect(Big(exact("scrap-cost", scaledScrap, "scrap_loss")).eq(Big(exact("scrap-cost", scrap, "scrap_loss")).times(k))).toBe(true);

      const inventory = validInputs["inventory-carrying-cost"];
      const scaledInventory = {
        ...inventory,
        average_inventory_value: Big(inventory.average_inventory_value).times(k).toString(),
        annual_storage_cost: Big(inventory.annual_storage_cost).times(k).toString(),
      };
      expect(exact("inventory-carrying-cost", scaledInventory, "carrying_rate_percent")).toBe(
        exact("inventory-carrying-cost", inventory, "carrying_rate_percent"),
      );

      const customer = validInputs["customer-profitability"];
      const scaledCustomer = Object.fromEntries(Object.entries(customer).map(([key, value]) => [key, Big(value).times(k).toString()]));
      expect(exact("customer-profitability", scaledCustomer, "customer_profit_margin_percent")).toBe(
        exact("customer-profitability", customer, "customer_profit_margin_percent"),
      );

      const breakEven = validInputs["break-even-point"];
      const scaledBreakEven = {
        ...breakEven,
        monthly_fixed_cost: Big(breakEven.monthly_fixed_cost).times(k).toString(),
        selling_price_per_unit: Big(breakEven.selling_price_per_unit).times(k).toString(),
        variable_cost_per_unit: Big(breakEven.variable_cost_per_unit).times(k).toString(),
        target_monthly_profit: Big(breakEven.target_monthly_profit).times(k).toString(),
      };
      expect(exact("break-even-point", scaledBreakEven, "break_even_units")).toBe(
        exact("break-even-point", breakEven, "break_even_units"),
      );
    }), { numRuns: 300, seed: 531_809 });
  });

  it("preserves financial model homogeneity under currency scaling", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const k = Big(factor);
      const payment = validInputs["payment-term-cost"];
      const scaledPayment = { ...payment, invoice_amount: Big(payment.invoice_amount).times(k).toString() };
      expect(withinRelativeEnvelope(
        exact("payment-term-cost", scaledPayment, "payment_term_cost"),
        Big(exact("payment-term-cost", payment, "payment_term_cost")).times(k).toString(),
      )).toBe(true);

      const machine = validInputs["machine-investment-payback"];
      const scaledMachine = Object.fromEntries(Object.entries(machine).map(([key, value]) => [
        key,
        key === "maximum_payback_months" ? value : Big(value).times(k).toString(),
      ]));
      expect(exact("machine-investment-payback", scaledMachine, "payback_months")).toBe(exact("machine-investment-payback", machine, "payback_months"));

      const fx = validInputs["currency-adjusted-pricing"];
      const scaledFx = {
        ...fx,
        base_cost_local_currency: Big(fx.base_cost_local_currency).times(k).toString(),
        freight_cost_local_currency: Big(fx.freight_cost_local_currency).times(k).toString(),
      };
      expect(withinRelativeEnvelope(
        exact("currency-adjusted-pricing", scaledFx, "currency_adjusted_price"),
        Big(exact("currency-adjusted-pricing", fx, "currency_adjusted_price")).times(k).toString(),
      )).toBe(true);
    }), { numRuns: 300, seed: 531_810 });
  });

  it("satisfies EOQ optimum balance within the Decimal precision envelope", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 1_000_000 }),
      fc.integer({ min: 1, max: 100_000 }),
      fc.integer({ min: 1, max: 100_000 }),
      fc.integer({ min: 1, max: 100 }),
      (demand, orderCost, unitCost, carryingRate) => {
        const inputs = {
          annual_demand_units: String(demand), ordering_cost_per_order: String(orderCost),
          unit_cost: String(unitCost), annual_carrying_rate_percent: String(carryingRate),
        };
        const ordering = OracleDecimal(exact("eoq", inputs, "annual_ordering_cost"));
        const holding = OracleDecimal(exact("eoq", inputs, "annual_holding_cost"));
        const relativeResidual = ordering.minus(holding).abs().div(ordering.abs().plus(holding.abs()).plus("1"));
        expect(relativeResidual.lt("1e-45")).toBe(true);
      },
    ), { numRuns: 500, seed: 531_811 });
  });

  it("keeps reorder point above lead-time demand and monotonic in service z-score", () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 100_000 }), fc.integer({ min: 1, max: 365 }),
      fc.integer({ min: 0, max: 10_000 }), fc.integer({ min: 0, max: 100 }),
      fc.integer({ min: 0, max: 500 }),
      (demand, leadDays, demandDeviation, leadDeviation, zBasisPoints) => {
        const base = {
          average_daily_demand: String(demand), lead_time_days: String(leadDays),
          daily_demand_std_dev: String(demandDeviation), lead_time_std_dev_days: String(leadDeviation),
          service_level_z_score: Big(zBasisPoints).div("100").toString(),
        };
        const higher = { ...base, service_level_z_score: Big(base.service_level_z_score).plus("0.01").toString() };
        const leadTimeDemand = Big(demand).times(leadDays);
        const basePoint = Big(exact("safety-stock-reorder-point", base, "reorder_point_units"));
        const higherPoint = Big(exact("safety-stock-reorder-point", higher, "reorder_point_units"));
        expect(basePoint.gte(leadTimeDemand)).toBe(true);
        expect(higherPoint.gte(basePoint)).toBe(true);
      },
    ), { numRuns: 500, seed: 531_812 });
  });

  it("preserves recipe target and fabric area scaling invariants", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const recipe = validInputs["recipe-cost-menu-price"];
      const foodCost = OracleDecimal(exact("recipe-cost-menu-price", recipe, "food_cost_per_portion"));
      const menuPrice = OracleDecimal(exact("recipe-cost-menu-price", recipe, "menu_price"));
      const reconstructedFoodCost = menuPrice.times(recipe.target_food_cost_percent).div("100");
      expect(reconstructedFoodCost.minus(foodCost).abs().lt("1e-45")).toBe(true);

      const fabric = validInputs["fabric-consumption-gsm"];
      const scaled = { ...fabric, garment_area_m2: Big(fabric.garment_area_m2).times(factor).toString() };
      expect(withinRelativeEnvelope(
        exact("fabric-consumption-gsm", scaled, "fabric_consumption_kg"),
        Big(exact("fabric-consumption-gsm", fabric, "fabric_consumption_kg")).times(factor).toString(),
      )).toBe(true);
    }), { numRuns: 300, seed: 531_813 });
  });

  it("blocks semantic singularities instead of applying denominator floors", () => {
    expect(executeCertifiedFreeCalculation("eoq", { ...validInputs.eoq, annual_carrying_rate_percent: "0" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("currency-adjusted-pricing", { ...validInputs["currency-adjusted-pricing"], target_margin_percent: "100" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("recipe-cost-menu-price", { ...validInputs["recipe-cost-menu-price"], kitchen_waste_percent: "100" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("fabric-consumption-gsm", { ...validInputs["fabric-consumption-gsm"], marker_efficiency_percent: "0" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("machine-investment-payback", { ...validInputs["machine-investment-payback"], annual_incremental_maintenance: "1000000" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("oee", { ...validInputs.oee, downtime_minutes: "480" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("takt-time-cycle-time", { ...validInputs["takt-time-cycle-time"], expected_uptime_percent: "0" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("welding-cost-per-meter", { ...validInputs["welding-cost-per-meter"], arc_on_ratio_percent: "0" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("welding-heat-input", { ...validInputs["welding-heat-input"], process_efficiency_percent: "0" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("diesel-fuel-co2-emissions", { ...validInputs["diesel-fuel-co2-emissions"], payload_ton_km: "0" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("product-carbon-footprint-basic", { ...validInputs["product-carbon-footprint-basic"], scrap_rate_percent: "100" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("weld-metal-weight-consumable", { ...validInputs["weld-metal-weight-consumable"], deposition_efficiency_percent: "0" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("bolt-preload-clamp-force", { ...validInputs["bolt-preload-clamp-force"], target_preload_percent: "0" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("tap-drill-size", { ...validInputs["tap-drill-size"], material_allowance_mm: "2" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("thread-dimensions-reference", { ...validInputs["thread-dimensions-reference"], allowance_mm: "5" }).ok).toBe(false);
    expect(executeCertifiedFreeCalculation("iso-286-tolerance-fit", { ...validInputs["iso-286-tolerance-fit"], hole_lower_deviation_um: "30" }).ok).toBe(false);
  });

  it("proves OEE component bounds and multiplicative identity", () => {
    fc.assert(fc.property(
      fc.integer({ min: 60, max: 1_440 }), fc.integer({ min: 1, max: 50 }),
      fc.integer({ min: 1, max: 100 }), fc.integer({ min: 0, max: 100 }),
      (planned, idealCycle, totalBasis, goodPercent) => {
        const maximumCount = Math.max(1, Math.floor(planned * 60 / idealCycle));
        const total = Math.max(1, Math.floor(maximumCount * totalBasis / 100));
        const good = Math.floor(total * goodPercent / 100);
        const inputs = {
          planned_production_minutes: String(planned), downtime_minutes: "0", ideal_cycle_seconds: String(idealCycle),
          total_count: String(total), good_count: String(good), contribution_margin_per_good_unit: "1",
        };
        const availability = OracleDecimal(exact("oee", inputs, "availability"));
        const performance = OracleDecimal(exact("oee", inputs, "performance"));
        const quality = OracleDecimal(exact("oee", inputs, "quality"));
        const oeePercent = exact("oee", inputs, "oee_percent");
        expect(availability.gte("0") && availability.lte("1")).toBe(true);
        expect(performance.gte("0") && performance.lte("1")).toBe(true);
        expect(quality.gte("0") && quality.lte("1")).toBe(true);
        expect(withinRelativeEnvelope(oeePercent, availability.times(performance).times(quality).times("100").toString())).toBe(true);
      },
    ), { numRuns: 500, seed: 531_814 });
  });

  it("proves takt capacity and rework decision identities", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      const takt = validInputs["takt-time-cycle-time"];
      const effectiveCycle = OracleDecimal(exact("takt-time-cycle-time", takt, "effective_cycle_seconds"));
      const capacity = OracleDecimal(exact("takt-time-cycle-time", takt, "capacity_units"));
      expect(withinRelativeEnvelope(
        effectiveCycle.times(capacity).toString(),
        OracleDecimal(takt.available_production_minutes).times("60").toString(),
      )).toBe(true);

      const rework = validInputs["rework-vs-scrap-decision"];
      const scaled = Object.fromEntries(Object.entries(rework).map(([key, value]) => [
        key,
        key === "rework_success_probability_percent" ? value : Big(value).times(factor).toString(),
      ]));
      expect(withinRelativeEnvelope(
        exact("rework-vs-scrap-decision", scaled, "decision_delta"),
        Big(exact("rework-vs-scrap-decision", rework, "decision_delta")).times(factor).toString(),
      )).toBe(true);
    }), { numRuns: 300, seed: 531_815 });
  });

  it("preserves welding physical and cost scaling invariants", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 1_000 }), (factor) => {
      const cost = validInputs["welding-cost-per-meter"];
      const scaledCost = {
        ...cost,
        labor_hourly_rate: Big(cost.labor_hourly_rate).times(factor).toString(),
        machine_hourly_rate: Big(cost.machine_hourly_rate).times(factor).toString(),
        consumable_cost_per_kg: Big(cost.consumable_cost_per_kg).times(factor).toString(),
        shielding_gas_cost_per_meter: Big(cost.shielding_gas_cost_per_meter).times(factor).toString(),
        energy_cost_per_meter: Big(cost.energy_cost_per_meter).times(factor).toString(),
      };
      expect(withinRelativeEnvelope(
        exact("welding-cost-per-meter", scaledCost, "welding_cost_per_meter"),
        Big(exact("welding-cost-per-meter", cost, "welding_cost_per_meter")).times(factor).toString(),
      )).toBe(true);
      const heat = validInputs["welding-heat-input"];
      const scaledHeat = { ...heat, arc_voltage_v: Big(heat.arc_voltage_v).times(factor).toString() };
      expect(withinRelativeEnvelope(
        exact("welding-heat-input", scaledHeat, "heat_input_kj_mm"),
        Big(exact("welding-heat-input", heat, "heat_input_kj_mm")).times(factor).toString(),
      )).toBe(true);
    }), { numRuns: 300, seed: 531_816 });
  });

  it("preserves user-factor emissions homogeneity", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 10_000 }), (factor) => {
      for (const [toolKey, inputId, outputId] of [
        ["electricity-co2-emissions", "electricity_kwh", "electricity_emissions_kgco2e"],
        ["diesel-fuel-co2-emissions", "fuel_volume_liters", "fuel_emissions_kgco2e"],
      ] as const) {
        const base = validInputs[toolKey];
        const scaled = { ...base, [inputId]: Big(base[inputId]).times(factor).toString() };
        expect(withinRelativeEnvelope(exact(toolKey, scaled, outputId), Big(exact(toolKey, base, outputId)).times(factor).toString())).toBe(true);
      }
      const product = validInputs["product-carbon-footprint-basic"];
      const scaledProduct = {
        ...product,
        scope1_emissions_kgco2e: Big(product.scope1_emissions_kgco2e).times(factor).toString(),
        scope2_emissions_kgco2e: Big(product.scope2_emissions_kgco2e).times(factor).toString(),
        allocated_process_emissions_kgco2e: Big(product.allocated_process_emissions_kgco2e).times(factor).toString(),
      };
      expect(withinRelativeEnvelope(
        exact("product-carbon-footprint-basic", scaledProduct, "product_footprint_kgco2e"),
        Big(exact("product-carbon-footprint-basic", product, "product_footprint_kgco2e")).times(factor).toString(),
      )).toBe(true);
    }), { numRuns: 300, seed: 531_817 });
  });

  it("preserves mass and consumable dimensional homogeneity", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 1_000 }), (factor) => {
      for (const [toolKey, lengthInput, massOutput] of [
        ["rebar-weight-count", "bar_length_m", "rebar_weight_kg"],
        ["steel-weight", "length_m", "gross_steel_weight_with_waste_kg"],
        ["weld-metal-weight-consumable", "weld_length_m", "purchased_consumable_kg"],
      ] as const) {
        const base = validInputs[toolKey];
        const scaled = { ...base, [lengthInput]: Big(base[lengthInput]).times(factor).toString() };
        expect(withinRelativeEnvelope(
          exact(toolKey, scaled, massOutput),
          Big(exact(toolKey, base, massOutput)).times(factor).toString(),
        )).toBe(true);
      }
    }), { numRuns: 300, seed: 531_818 });
  });

  it("proves bolt torque scaling and conservative separation identity", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 1_000 }), (factor) => {
      const torque = validInputs["bolt-torque"];
      const scaledTorque = { ...torque, desired_preload_kn: Big(torque.desired_preload_kn).times(factor).toString() };
      expect(withinRelativeEnvelope(
        exact("bolt-torque", scaledTorque, "tightening_torque_nm"),
        Big(exact("bolt-torque", torque, "tightening_torque_nm")).times(factor).toString(),
      )).toBe(true);

      const clamp = validInputs["bolt-preload-clamp-force"];
      const initial = OracleDecimal(exact("bolt-preload-clamp-force", clamp, "initial_preload_kn"));
      const expectedMargin = initial.times(
        OracleDecimal("1").minus(OracleDecimal(clamp.joint_settlement_loss_percent).div("100")),
      ).minus(clamp.external_tension_kn);
      expect(withinRelativeEnvelope(
        exact("bolt-preload-clamp-force", clamp, "joint_separation_margin_kn"),
        expectedMargin.toString(),
      )).toBe(true);
    }), { numRuns: 300, seed: 531_819 });
  });

  it("proves beam linearity and geometry-reference ordering", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 100 }), (factor) => {
      const beam = validInputs["beam-load-deflection-quick-check"];
      const scaledBeam = { ...beam, uniform_load_kn_m: Big(beam.uniform_load_kn_m).times(factor).toString() };
      for (const outputId of ["bending_stress_utilization", "deflection_m", "deflection_utilization"] as const) {
        expect(withinRelativeEnvelope(
          exact("beam-load-deflection-quick-check", scaledBeam, outputId),
          Big(exact("beam-load-deflection-quick-check", beam, outputId)).times(factor).toString(),
        )).toBe(true);
      }
      const thread = validInputs["thread-dimensions-reference"];
      const major = OracleDecimal(thread.major_diameter_mm);
      const pitch = OracleDecimal(exact("thread-dimensions-reference", thread, "pitch_diameter_approx_mm"));
      const minor = OracleDecimal(exact("thread-dimensions-reference", thread, "minor_diameter_approx_mm"));
      expect(minor.gt("0") && minor.lt(pitch) && pitch.lt(major)).toBe(true);
    }), { numRuns: 300, seed: 531_820 });
  });

  it("proves user-ratio, limit-fit and scenario arithmetic identities", () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 1_000 }), (factor) => {
      const roughness = validInputs["surface-roughness-converter"];
      expect(withinRelativeEnvelope(
        exact("surface-roughness-converter", roughness, "roughness_rz_um"),
        Big(roughness.ra_um).times(roughness.rz_to_ra_ratio).toString(),
      )).toBe(true);

      const fit = validInputs["iso-286-tolerance-fit"];
      const expectedMinimum = OracleDecimal(fit.hole_lower_deviation_um).minus(fit.shaft_upper_deviation_um).div("1000");
      expect(withinRelativeEnvelope(exact("iso-286-tolerance-fit", fit, "minimum_clearance_mm"), expectedMinimum.toString())).toBe(true);

      const cbam = validInputs["cbam-cost-quick-estimator"];
      const scaled = { ...cbam, export_product_mass_ton: Big(cbam.export_product_mass_ton).times(factor).toString() };
      expect(withinRelativeEnvelope(
        exact("cbam-cost-quick-estimator", scaled, "cbam_exposure_cost"),
        Big(exact("cbam-cost-quick-estimator", cbam, "cbam_exposure_cost")).times(factor).toString(),
      )).toBe(true);
    }), { numRuns: 300, seed: 531_821 });
  });
});
