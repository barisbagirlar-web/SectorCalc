#!/usr/bin/env node
// Test all 20 PRO tools with CORRECT schema input IDs
const API = "https://sectorcalc.com/api/pro-calculator/execute";
const HEADERS = { "Content-Type": "application/json", "x-user-email": "barisbagirlar@gmail.com" };

const BODY = {
  schema_version: "5.3.1",
  usageSessionId: "bypass-unlimited",
  user_profile_mode: "engineering",
  selected_units: {},
};

const TOOLS = {
  "break-even-survival-cash-calculator": {
    initial_investment: 500000, annual_net_cash_flow: 150000, discount_rate: 0.10,
    analysis_years: 5, residual_value: 50000, stress_downside_factor: 0.8,
    annual_volume: 10000, labor_rate: 80000, overhead_rate: 120000,
    defect_or_loss_cost: 15000, source_confidence_ratio: 0.95, uncertainty_multiplier: 2.0
  },
  "true-employee-cost-statement": {
    labor_rate: 45, overhead_rate: 350000, source_confidence_ratio: 0.9, uncertainty_multiplier: 1.1
  },
  "machine-hourly-rate-proof-report": {
    machine_rate: 150, cycle_time: 300, setup_time: 1800, batch_quantity: 500,
    material_cost: 50, target_margin: 0.2, annual_volume: 10000,
    labor_rate: 55, overhead_rate: 350000, defect_or_loss_cost: 500,
    source_confidence_ratio: 0.9, uncertainty_multiplier: 1.2
  },
  "loss-making-job-detector": {
    machine_rate: 150, cycle_time: 300, setup_time: 1800, batch_quantity: 500,
    material_cost: 50, target_margin: 0.2, annual_volume: 10000,
    labor_rate: 55, overhead_rate: 350000, defect_or_loss_cost: 500,
    source_confidence_ratio: 0.9, uncertainty_multiplier: 1.1
  },
  "receivables-cost-payment-term-addendum": {
    machine_rate: 150, cycle_time: 300, setup_time: 1800, batch_quantity: 500,
    material_cost: 50, target_margin: 0.2, annual_volume: 10000,
    labor_rate: 55, overhead_rate: 350000, defect_or_loss_cost: 500,
    source_confidence_ratio: 0.9, uncertainty_multiplier: 1.2
  },
  "setup-time-reduction-roi-smed": {
    machine_rate: 150, cycle_time: 300, setup_time: 1800, batch_quantity: 500,
    material_cost: 50, target_margin: 0.2, annual_volume: 10000,
    labor_rate: 55, overhead_rate: 350000, defect_or_loss_cost: 500,
    source_confidence_ratio: 0.9, uncertainty_multiplier: 1.2
  },
  "product-sku-margin-ranker": {
    machine_rate: 150, cycle_time: 300, setup_time: 1800, batch_quantity: 500,
    material_cost: 50, target_margin: 0.2, annual_volume: 10000,
    labor_rate: 55, overhead_rate: 350000, defect_or_loss_cost: 500,
    source_confidence_ratio: 0.9, uncertainty_multiplier: 1.1
  },
  "job-quote-builder-pro-pack": {
    machine_rate: 150, cycle_time: 300, setup_time: 1800, batch_quantity: 500,
    material_cost: 50, target_margin: 0.2, annual_volume: 10000,
    defect_or_loss_cost: 500, labor_rate: 55, overhead_rate: 350000,
    source_confidence_ratio: 0.9, uncertainty_multiplier: 1.1
  },
  "machine-investment-feasibility-buy-lease-keep": {
    initial_investment: 500000, annual_net_cash_flow: 150000, discount_rate: 0.10,
    analysis_years: 5, residual_value: 50000, stress_downside_factor: 0.8,
    annual_volume: 10000, labor_rate: 80000, overhead_rate: 120000,
    defect_or_loss_cost: 15000, source_confidence_ratio: 0.95, uncertainty_multiplier: 1.2
  },
  "capital-equipment-investment-appraisal-npv-irr": {
    initial_investment: 500000, annual_net_cash_flow: 150000, discount_rate: 0.10,
    analysis_years: 5, residual_value: 50000, stress_downside_factor: 0.8,
    annual_volume: 10000, labor_rate: 80000, overhead_rate: 120000,
    defect_or_loss_cost: 15000, source_confidence_ratio: 0.9, uncertainty_multiplier: 1.2
  },
  "customer-sku-profitability-forensics": {
    unit_price: 100, unit_variable_cost: 65, annual_volume: 10000,
    logistics_cost_pct: 0.05, service_cost_pct: 0.03, return_rate_pct: 0.02,
    target_margin: 0.2, labor_rate: 55, overhead_rate: 350000, source_confidence: 0.9
  },
  "downtime-scrap-loss-statement": {
    productive_hours: 2000, actual_hours: 1800, hourly_rate: 150,
    scrap_quantity: 100, unit_cost: 50, rework_hours: 50,
    rework_rate: 75, material_cost: 100000, defect_rate_pct: 5, source_confidence: 0.9
  },
  "oee-loss-monetization-improvement-business-case": {
    planned_production_time: 480, operating_time: 420, net_operating_time: 400,
    valuable_operating_time: 380, ideal_cycle_time: 1.5, total_parts: 300,
    good_parts: 280, hourly_contribution: 200, improvement_cost: 50000, source_confidence: 0.9
  },
  "scrap-rework-cost-tracker": {
    total_produced: 10000, scrap_quantity: 500, rework_quantity: 300,
    unit_material_cost: 25, unit_labor_cost: 15, rework_labor_rate: 45,
    rework_time_per_unit: 0.5, defect_rate_target: 0.03, monthly_volume: 1000, source_confidence: 0.9
  },
  "outsource-vs-in-house-analyzer": {
    in_house_material_cost: 40, in_house_labor_cost: 25, in_house_overhead: 15,
    in_house_setup_cost: 500, outsource_unit_price: 85, outsource_logistics: 5,
    annual_volume: 10000, quality_risk_premium: 0.02, capacity_utilization: 0.8, source_confidence: 0.9
  },
  "plant-wide-shop-rate-cost-structure-audit": {
    total_annual_cost: 2000000, total_productive_hours: 10000,
    machine_group_cost: 500000, machine_group_hours: 4000,
    overhead_pool: 800000, overhead_allocation_base: 10000,
    current_shop_rate: 200, target_margin_pct: 0.15, utilization_pct: 0.8, source_confidence: 0.9
  },
  "fx-commodity-pass-through-pricer": {
    base_price: 100, fx_rate_spot: 1.10, fx_rate_budget: 1.05,
    commodity_index_current: 120, commodity_index_budget: 100,
    material_cost_pct: 0.4, fx_hedge_pct: 0.3, commodity_hedge_pct: 0.2,
    annual_volume: 10000, source_confidence: 0.9
  },
  "energy-efficiency-grant-incentive-feasibility-pack": {
    current_kwh_per_year: 1000000, target_kwh_per_year: 700000,
    avg_kwh_rate: 0.12, implementation_cost: 200000, grant_coverage_pct: 0.4,
    maintenance_saving: 10000, emission_factor: 0.5, equipment_life_years: 10,
    discount_rate: 0.08, source_confidence: 0.9
  },
  "motor-compressor-replacement-roi": {
    motor_power_kw: 100, annual_operating_hours: 4000,
    current_efficiency_pct: 0.85, new_efficiency_pct: 0.95,
    avg_kwh_rate: 0.12, replacement_cost: 50000, installation_cost: 10000,
    maintenance_saving_yr: 5000, equipment_life_years: 10, discount_rate: 0.08, source_confidence: 0.9
  },
  "weld-procedure-cost-consumable-estimation-suite": {
    weld_length_m: 50, weld_throat_mm: 8, weld_density: 7.85,
    weld_time_min: 120, arc_time_min: 90, wire_cost_per_kg: 15,
    deposition_efficiency: 85, gas_cost_per_min: 0.15, labor_rate: 55,
    overhead_rate: 350000, source_confidence: 0.9
  },
};

async function testAll() {
  const slugs = Object.keys(TOOLS);
  let pass = 0, fail = 0;
  const results = [];

  console.log("=" .repeat(60));
  console.log("  20 PRO TOOL CALCULATION ENGINE TEST (v2 - correct input IDs)");
  console.log("=" .repeat(60));
  console.log();

  for (const slug of slugs) {
    const payload = { ...BODY, tool_key: slug, raw_inputs: TOOLS[slug] };

    try {
      const res = await fetch(API, { method: "POST", headers: HEADERS, body: JSON.stringify(payload) });
      const data = await res.json();
      const status = data.status || "ERROR";
      const pipeline = data.pipeline_state || "ERROR";
      const firstOut = data.outputs?.[0];
      const val = firstOut?.value;

      if (status === "OK") {
        console.log(`✅ ${slug.padEnd(45)} OK pipeline=${pipeline}  ${firstOut?.id}=${val}`);
        pass++;
        results.push({ slug, status: "PASS" });
      } else {
        const reason = data.warnings?.[0]?.message || pipeline;
        const diag = data.diagnostic;
        const schemaInputs = diag?.schema_input_ids?.slice?.(0,3)?.join(",") || "";
        console.log(`❌ ${slug.padEnd(45)} ${status} pipeline=${pipeline}  ${reason.slice(0,80)}`);
        if (schemaInputs) console.log(`   schema_inputs: ${schemaInputs}...`);
        fail++;
        results.push({ slug, status: "FAIL", reason });
      }
    } catch (err) {
      console.log(`❌ ${slug.padEnd(45)} NETWORK ERROR: ${err.message}`);
      fail++;
    }
  }

  console.log();
  console.log("=" .repeat(60));
  console.log(`  RESULTS: ${pass} PASSED, ${fail} FAILED  (target: 20/20)`);
  console.log("=" .repeat(60));

  if (fail > 0) {
    console.log("\nFAILED:");
    for (const r of results) {
      if (r.status !== "PASS") console.log(`  ❌ ${r.slug}: ${r.reason}`);
    }
  }
}

testAll().catch(console.error);
