// SectorCalc PRO Engine Governance — Canonical Sample Inputs
// Each LIVE PRO tool has a deterministic sample input set used for:
//   - Golden test execution
//   - Build-time validation
//   - Health check endpoint
// Keys match the actual `get(inputs, "n_...")` calls in each .formula.ts module.
// Server-side only.

import "server-only";

export const PRO_SAMPLE_INPUTS: Record<string, Record<string, number>> = {
  "break-even-survival-cash-calculator": {
    n_monthly_fixed_cash_cost: 120000,
    n_monthly_debt_service: 25000,
    n_contribution_margin_ratio: 0.42,
    n_current_monthly_revenue: 420000,
    n_unrestricted_cash_balance: 750000,
    n_target_survival_months: 6,
    n_downside_revenue_factor: 0.7,
    n_minimum_cash_buffer: 100000,
    n_source_confidence_ratio: 0.9,
    n_uncertainty_multiplier: 1.15,
  },
  "machine-hourly-rate-proof-report": {
    // NOTE (2026-07-15 audit): old n_overhead_rate=350000 ($/h) was never sanity-checked.
    // Added n_defect_or_loss_cost / n_uncertainty_multiplier (previously dead inputs, now wired).
    n_machine_rate: 85,
    n_cycle_time: 90,
    n_setup_time: 1800,
    n_batch_quantity: 500,
    n_material_cost: 25,
    n_target_margin: 0.3,
    n_annual_volume: 100000 / 31536000,
    n_labor_rate: 45,
    n_overhead_rate: 20,
    n_defect_or_loss_cost: 1.2,
    n_uncertainty_multiplier: 1.3,
    n_source_confidence_ratio: 0.9,
  },
  "loss-making-job-detector": {
    // NOTE (2026-07-15 audit): this fixture was rewritten alongside the calculate() rewrite.
    // n_cycle_time / n_setup_time are now load-bearing (previously dead inputs).
    // n_annual_volume must be expressed in the schema's base_unit (unit_per_s), matching
    // what the live execute route actually passes after normalizeInputs() — the old value
    // (5000) was a raw yearly count, inconsistent with the runtime unit contract.
    // n_quoted_job_price is new and required: the tool cannot detect a loss without it.
    n_machine_rate: 80,
    n_cycle_time: 600,
    n_setup_time: 3600,
    n_material_cost: 12,
    n_labor_rate: 35,
    n_overhead_rate: 20,
    n_defect_or_loss_cost: 1.5,
    n_target_margin: 0.25,
    n_batch_quantity: 100,
    n_annual_volume: 5000 / 31536000,
    n_source_confidence_ratio: 0.9,
    n_uncertainty_multiplier: 1.5,
    n_quoted_job_price: 5200,
  },
  "receivables-cost-payment-term-addendum": {
    // NOTE (2026-07-15 audit): schema+formula rebuilt entirely — old fixture used
    // manufacturing job-costing keys (machine_rate, cycle_time, material_cost) that never
    // matched this tool's actual domain (receivables financing cost).
    n_average_receivable_balance: 300000,
    n_annual_interest_rate: 0.08,
    n_average_collection_days: 30 * 86400,
    n_invoice_volume: 2000000,
    n_source_confidence_ratio: 0.9,
    n_uncertainty_multiplier: 1.3,
  },
  "setup-time-reduction-roi-smed": {
    // NOTE (2026-07-15 audit): old fixture had n_overhead_rate: 350000 (an "hourly rate" of
    // $350,000/h) and no investment-cost/reduction-target inputs — never sanity-checked
    // against the formula, which used to fabricate investment cost as oh*0.3 anyway.
    // cycle_time/defect_or_loss_cost/material_cost/overhead_rate/target_margin removed from
    // the schema entirely (dead inputs — this tool is pure setup-time ROI, not job costing).
    n_machine_rate: 85,
    n_setup_time: 3600,
    n_batch_quantity: 500,
    n_labor_rate: 45,
    n_annual_volume: 100000 / 31536000,
    n_source_confidence_ratio: 0.9,
    n_uncertainty_multiplier: 1.4,
    n_smed_investment_cost: 45000,
    n_setup_time_reduction_target_pct: 0.6,
  },
  "product-sku-margin-ranker": {
    // NOTE (2026-07-15 audit): old fixture had n_defect_or_loss_cost: 12000 (per unit!) and
    // n_overhead_rate: 350000 ($/h) — not realistic, and price used to be fabricated as
    // material_cost*1.4 rather than taken from a real input.
    n_machine_rate: 80,
    n_cycle_time: 120,
    n_setup_time: 600,
    n_batch_quantity: 200,
    n_material_cost: 5,
    n_target_margin: 0.3,
    n_annual_volume: 20000 / 31536000,
    n_labor_rate: 30,
    n_overhead_rate: 15,
    n_defect_or_loss_cost: 0.3,
    n_source_confidence_ratio: 0.85,
    n_uncertainty_multiplier: 1.4,
    n_unit_selling_price: 15,
  },
  "true-employee-cost-statement": {
    // NOTE (2026-07-15 audit): schema+formula fully rebuilt -- old fixture had only
    // labor_rate/overhead_rate from the wrong (manufacturing) domain template; the formula
    // ignored them almost entirely and fabricated every other dollar figure as a hardcoded
    // constant. Real HR-domain inputs below.
    n_annual_base_salary: 95000,
    n_payroll_tax_rate: 0.0765,
    n_annual_benefits_cost: 9500,
    n_annual_insurance_cost: 7200,
    n_annual_training_cost: 2000,
    n_annual_equipment_it_cost: 3000,
    n_annual_workspace_facility_cost: 6000,
    n_target_billable_utilization_ratio: 0.8,
    n_source_confidence_ratio: 0.9,
    n_uncertainty_multiplier: 1.2,
  },
  "job-quote-builder-pro-pack": {
    n_machine_rate: 85,
    n_cycle_time: 12,
    n_setup_time: 8,
    n_batch_quantity: 500,
    n_material_cost: 25,
    n_target_margin: 0.3,
    n_annual_volume: 100000 / 31536000,
    n_labor_rate: 45,
    n_overhead_rate: 350000,
    n_defect_or_loss_cost: 12000,
    n_source_confidence_ratio: 0.9,
    n_uncertainty_multiplier: 1.1,
  },
  "machine-investment-feasibility-buy-lease-keep": {
    n_initial_investment: 500000,
    n_annual_net_cash_flow: 150000,
    n_discount_rate: 0.10,
    n_analysis_years: 5,
    n_residual_value: 50000,
    n_stress_downside_factor: 0.8,
    n_annual_volume: 10000 / 31536000,
    n_labor_rate: 80000,
    n_overhead_rate: 120000,
    n_defect_or_loss_cost: 15000,
    n_source_confidence_ratio: 0.95,
    n_uncertainty_multiplier: 1.2,
  },
  "capital-equipment-investment-appraisal-npv-irr": {
    n_initial_investment: 500000,
    n_annual_net_cash_flow: 150000,
    n_discount_rate: 0.10,
    n_analysis_years: 5,
    n_residual_value: 50000,
    n_stress_downside_factor: 0.8,
    n_annual_volume: 10000 / 31536000,
    n_labor_rate: 80000,
    n_overhead_rate: 120000,
    n_defect_or_loss_cost: 15000,
    n_source_confidence_ratio: 0.95,
    n_uncertainty_multiplier: 1.2,
  },
  "customer-sku-profitability-forensics": {
    // NOTE (2026-07-15 audit): old values (5, 3, 2, 30 for ratio-family fields) only worked
    // by coincidence with the old formula's now-removed double "/100" — they never matched
    // the real runtime normalization contract (ratio 0..1) and would have been 100x wrong
    // for any live user request going through normalizeInputs().
    n_unit_price: 100,
    n_unit_variable_cost: 60,
    n_annual_volume: 10000 / 31536000,
    n_logistics_cost_pct: 0.05,
    n_service_cost_pct: 0.03,
    n_return_rate_pct: 0.02,
    n_target_margin: 0.30,
    n_labor_rate: 45,
    n_overhead_rate: 30,
    n_source_confidence_ratio: 0.9,
  },
  "downtime-scrap-loss-statement": {
    n_productive_hours: 2000,
    n_actual_hours: 1760,
    n_hourly_rate: 85,
    n_scrap_quantity: 150,
    n_unit_cost: 25,
    n_rework_hours: 120,
    n_rework_rate: 55,
    n_material_cost: 50000,
    n_defect_rate_pct: 3.5,
    n_source_confidence_ratio: 0.9,
  },
  "oee-loss-monetization-improvement-business-case": {
    n_planned_production_time: 480,
    n_operating_time: 420,
    n_net_operating_time: 380,
    n_valuable_operating_time: 350,
    n_total_parts: 1000,
    n_good_parts: 950,
    n_ideal_cycle_time: 0.5,
    n_hourly_contribution: 100,
    n_improvement_cost: 50000,
    n_source_confidence_ratio: 0.9,
  },
  "scrap-rework-cost-tracker": {
    n_monthly_volume: 10000,
    n_scrap_quantity: 150,
    n_rework_quantity: 80,
    n_unit_material_cost: 25,
    n_unit_labor_cost: 15,
    n_rework_time_per_unit: 0.5,
    n_rework_labor_rate: 45,
    n_defect_rate_target_pct: 2.0,
    n_total_produced: 10000,
    n_source_confidence_ratio: 0.9,
  },
  "outsource-vs-in-house-analyzer": {
    // NOTE (2026-07-15 audit): old values (75, 5 for ratio-family fields; 5000 raw for
    // annual_volume) only worked by coincidence with the formula's now-removed "/100" and
    // raw-count usage — never matched the real runtime normalization contract.
    n_in_house_labor_cost: 85,
    n_in_house_material_cost: 30,
    n_in_house_setup_cost: 500,
    n_in_house_overhead: 75,
    n_outsource_unit_price: 95,
    n_outsource_logistics_cost: 8,
    n_annual_volume: 5000 / 31536000,
    n_capacity_utilization_pct: 0.75,
    n_quality_risk_premium_pct: 0.05,
    n_source_confidence_ratio: 0.9,
  },
  "plant-wide-shop-rate-cost-structure-audit": {
    // NOTE (2026-07-15 audit): old values (25, 80) only worked by coincidence with the
    // formula's now-removed "/100" -- never matched the real ratio (0..1) contract.
    n_total_annual_cost: 2000000,
    n_total_productive_hours: 40000,
    n_machine_group_cost: 500000,
    n_machine_group_hours: 15000,
    n_overhead_pool: 600000,
    n_overhead_allocation_base: 40000,
    n_current_shop_rate: 85,
    n_target_margin_pct: 0.25,
    n_utilization_pct: 0.80,
    n_source_confidence_ratio: 0.9,
  },
  "fx-commodity-pass-through-pricer": {
    n_base_price: 100,
    n_fx_rate_spot: 1.10,
    n_fx_rate_budget: 1.05,
    n_commodity_index_current: 180,
    n_commodity_index_budget: 160,
    n_material_cost_pct: 40,
    n_fx_hedge_pct: 60,
    n_commodity_hedge_pct: 50,
    n_annual_volume: 10000 / 31536000,
    n_source_confidence_ratio: 0.9,
  },
  "energy-efficiency-grant-incentive-feasibility-pack": {
    n_current_kwh_per_year: 500000,
    n_target_kwh_per_year: 350000,
    n_avg_kwh_rate: 0.12,
    n_implementation_cost: 80000,
    n_grant_coverage_pct: 0.3,
    n_maintenance_cost_saving: 5000,
    n_emission_factor_kgco2_per_kwh: 0.45,
    n_equipment_life_years: 10,
    n_discount_rate: 0.08,
    n_source_confidence_ratio: 0.9,
  },
  "motor-compressor-replacement-roi": {
    n_motor_power_kw: 75,
    n_annual_operating_hours: 6000,
    n_current_efficiency_pct: 90,
    n_new_efficiency_pct: 95,
    n_avg_kwh_rate: 0.12,
    n_replacement_cost: 12000,
    n_installation_cost: 4000,
    n_maintenance_saving_per_year: 2000,
    n_equipment_life_years: 10,
    n_discount_rate: 0.08,
    n_source_confidence_ratio: 0.9,
  },
  "weld-procedure-cost-consumable-estimation-suite": {
    n_weld_length_m: 50,
    n_weld_throat_mm: 8,
    n_weld_density_g_per_cm3: 7.85,
    n_weld_time_min: 120,
    n_arc_time_min: 90,
    n_wire_cost_per_kg: 15,
    n_deposition_efficiency_pct: 85,
    n_gas_cost_per_min: 0.15,
    n_labor_rate: 55,
    n_overhead_rate: 350000,
    n_source_confidence_ratio: 0.9,
  },
};
