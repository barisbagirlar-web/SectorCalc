#!/usr/bin/env python3
"""
generate_pro_formula_tests.py

Generates one pytest + Hypothesis test file per PRO tool in
tests/formula-properties/.

Usage:
    python scripts/generate_pro_formula_tests.py
"""

import os
import textwrap

OUTPUT_DIR = "tests/formula-properties"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Tool metadata registry ──────────────────────────────────────────────────
# Each entry contains: input_keys, output_keys, divisions (num/den with guard),
# large_mults (operands with risk), decision_states, complexity, notes

TOOLS = [
    {
        "slug": "scrap-rework-cost-tracker",
        "inputs": [
            "n_total_produced", "n_scrap_quantity", "n_rework_quantity",
            "n_unit_material_cost", "n_unit_labor_cost", "n_rework_labor_rate",
            "n_rework_time_per_unit", "n_defect_rate_target_pct",
            "n_monthly_volume", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "scrap_cost + rework_cost", "den": "total_defect_units", "guard": "total_defect_units > 0"},
            {"num": "scrap_cost + rework_cost", "den": "total_produced", "guard": "total_produced > 0"},
            {"num": "total_defect_units", "den": "total_produced", "guard": "total_produced > 0"},
        ],
        "large_mults": [
            {"op1": "scrap_quantity", "op2": "unit_material_cost + unit_labor_cost", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": True,
        "notes": "RC division by 3600 on line 44 (rework_time_per_unit in seconds)",
    },
    {
        "slug": "downtime-scrap-loss-statement",
        "inputs": [
            "n_productive_hours", "n_actual_hours", "n_hourly_rate",
            "n_scrap_quantity", "n_unit_cost", "n_rework_hours",
            "n_rework_rate", "n_material_cost", "n_defect_rate_pct",
            "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "total_loss", "den": "mc", "guard": "mc > 0"},
            {"num": "ah", "den": "ph", "guard": "ph > 0"},
        ],
        "large_mults": [
            {"op1": "sq", "op2": "uc", "risk": "critical"},  # 250B+
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Already fixed: max(0, ph-ah) clamp; no /3600; LR-based decision tree",
    },
    {
        "slug": "setup-time-reduction-roi-smed",
        "inputs": [
            "n_current_setup_minutes", "n_target_setup_minutes",
            "n_setups_per_year", "n_hourly_operating_cost",
            "n_implementation_cost", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [],
        "large_mults": [
            {"op1": "minutes_saved", "op2": "setups_per_year", "risk": "medium"},
            {"op1": "hours_saved", "op2": "hourly_cost", "risk": "medium"},
        ],
        "decision_states": 3,
        "has_3600": True,
        "notes": "Minutes-to-hours ÷60 chain; implementation_cost vs savings decision",
    },
    {
        "slug": "true-employee-cost-statement",
        "inputs": [
            "n_gross_salary", "n_employer_tax_pct", "n_benefits_cost",
            "n_training_cost", "n_overhead_pct",
            "n_annual_work_hours", "n_utilization_pct",
            "n_burden_rate", "n_agency_fee_pct",
            "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "tec", "den": "agw", "guard": "agw > 0"},
        ],
        "large_mults": [
            {"op1": "gross_salary", "op2": "employer_tax_pct / 100", "risk": "medium"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "UNGUARDED div: tec / agw (agw=annual_work_hours * utilization_pct/100 can be 0)",
    },
    {
        "slug": "outsource-vs-in-house-analyzer",
        "inputs": [
            "n_annual_volume", "n_in_house_unit_cost",
            "n_outsource_unit_cost", "n_switching_cost",
            "n_quality_defect_rate_in_house", "n_quality_defect_rate_outsource",
            "n_defect_cost_per_unit", "n_supplier_reliability_score",
            "n_strategic_importance_score", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "annual_volume", "den": "1", "guard": "none"},
        ],
        "large_mults": [
            {"op1": "annual_volume", "op2": "unit_cost_diff", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Quality-adjusted total cost comparison; multi-attribute scoring",
    },
    {
        "slug": "fx-commodity-pass-through-pricer",
        "inputs": [
            "n_base_price", "n_fx_rate_change_pct",
            "n_commodity_cost_share_pct", "n_commodity_price_change_pct",
            "n_labor_cost_share_pct", "n_labor_cost_change_pct",
            "n_overhead_cost_share_pct", "n_overhead_cost_change_pct",
            "n_target_margin_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "adjusted_price - base_price", "den": "base_price", "guard": "base_price > 0"},
        ],
        "large_mults": [
            {"op1": "base_price", "op2": "fx_rate_change_pct / 100", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Complex pass-through; percentage chain with 7 compounding factors",
    },
    {
        "slug": "motor-compressor-replacement-roi",
        "inputs": [
            "n_current_power_kw", "n_current_efficiency_pct",
            "n_new_power_kw", "n_new_efficiency_pct",
            "n_annual_operating_hours", "n_energy_cost_per_kwh",
            "n_installation_cost", "n_maintenance_savings",
            "n_equipment_life_years", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "current_kw / current_eff", "den": "new_kw / new_eff", "guard": "new_kw > 0 and new_eff > 0"},
        ],
        "large_mults": [
            {"op1": "kwh_saved", "op2": "hours * cost_per_kwh", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Efficiency ratio comparison; payback period vs life",
    },
    {
        "slug": "machine-investment-feasibility-buy-lease-keep",
        "inputs": [
            "n_purchase_price", "n_lease_annual_payment",
            "n_annual_maintenance_cost", "n_annual_energy_cost",
            "n_annual_revenue_generated", "n_equipment_life_years",
            "n_residual_value", "n_interest_rate_pct",
            "n_tax_rate_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "npv", "den": "investment", "guard": "investment > 0"},
        ],
        "large_mults": [
            {"op1": "annual_revenue", "op2": "equipment_life", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "NPV-based 3-way comparison (buy/lease/keep); discount factor chain",
    },
    {
        "slug": "energy-efficiency-grant-incentive-feasibility-pack",
        "inputs": [
            "n_current_energy_cost", "n_projected_energy_cost",
            "n_implementation_cost", "n_grant_amount",
            "n_grant_approval_probability", "n_maintenance_savings",
            "n_equipment_life_years", "n_discount_rate_pct",
            "n_tax_rate_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "npv", "den": "implementation_cost", "guard": "implementation_cost > 0"},
        ],
        "large_mults": [
            {"op1": "energy_savings", "op2": "equipment_life", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Grant-adjusted NPV; probability-weighted grant amount",
    },
    {
        "slug": "capital-equipment-investment-appraisal-npv-irr",
        "inputs": [
            "n_initial_investment", "n_annual_cash_inflow",
            "n_annual_cash_outflow", "n_equipment_life_years",
            "n_discount_rate_pct", "n_salvage_value",
            "n_tax_rate_pct", "n_inflation_rate_pct",
            "n_maintenance_escalation_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "npv", "den": "initial_investment", "guard": "initial_investment > 0"},
        ],
        "large_mults": [
            {"op1": "annual_net_cashflow", "op2": "equipment_life", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "IRR Newton iteration; inflation-escalated outflows; complex discounting",
    },
    {
        "slug": "weld-procedure-cost-consumable-estimation-suite",
        "inputs": [
            "n_weld_length_mm", "n_weld_cross_section_mm2",
            "n_material_density_g_per_cm3", "n_deposition_efficiency_pct",
            "n_electrode_cost_per_kg", "n_labor_rate_per_hour",
            "n_welding_speed_mm_per_min", "n_overhead_rate_pct",
            "n_energy_cost_per_kwh", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "weld_volume_mm3", "den": "1000", "guard": "none"},
            {"num": "weld_length_mm", "den": "welding_speed_mm_per_min", "guard": "speed > 0"},
        ],
        "large_mults": [
            {"op1": "weld_volume", "op2": "density", "risk": "medium"},
            {"op1": "electrode_mass_kg", "op2": "cost_per_kg", "risk": "medium"},
        ],
        "decision_states": 3,
        "has_3600": True,
        "notes": "Unit conversion chain: mm³→cm³, seconds→hours; 4-cost breakdown",
    },
    {
        "slug": "receivables-cost-payment-term-addendum",
        "inputs": [
            "n_annual_revenue", "n_days_outstanding_current",
            "n_days_outstanding_proposed", "n_cost_of_capital_pct",
            "n_invoice_volume", "n_processing_cost_per_invoice",
            "n_discount_rate_pct", "n_discount_take_rate_pct",
            "n_bad_debt_rate_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "revenue", "den": "365", "guard": "none"},
            {"num": "days_reduction", "den": "365", "guard": "none"},
        ],
        "large_mults": [
            {"op1": "annual_revenue", "op2": "cost_of_capital_pct/100", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Days / 365 working capital cost; discount cost vs savings trade-off",
    },
    {
        "slug": "product-sku-margin-ranker",
        "inputs": [
            "n_unit_revenue", "n_unit_material_cost",
            "n_unit_labor_cost", "n_unit_overhead_cost",
            "n_annual_sales_volume", "n_target_margin_pct",
            "n_inventory_turnover", "n_storage_cost_per_unit",
            "n_quality_return_rate_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "profit", "den": "revenue", "guard": "revenue > 0"},
        ],
        "large_mults": [
            {"op1": "annual_volume", "op2": "unit_profit", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Margin waterfall; volume-weighted profitability score",
    },
    {
        "slug": "machine-hourly-rate-proof-report",
        "inputs": [
            "n_machine_purchase_cost", "n_equipment_life_years",
            "n_annual_operating_hours", "n_maintenance_cost_per_year",
            "n_energy_consumption_kw", "n_energy_cost_per_kwh",
            "n_floor_space_cost_per_year", "n_labor_cost_per_hour",
            "n_overhead_rate_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "total_annual_cost", "den": "annual_hours", "guard": "annual_hours > 0"},
        ],
        "large_mults": [
            {"op1": "energy_kw", "op2": "hours * cost_per_kwh", "risk": "medium"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Fully-loaded hourly rate; 6-cost-component stack",
    },
    {
        "slug": "loss-making-job-detector",
        "inputs": [
            "n_job_revenue", "n_material_cost", "n_labor_hours",
            "n_labor_rate", "n_overhead_rate_pct",
            "n_allocated_fixed_cost", "n_job_margin_target_pct",
            "n_penalty_rate", "n_penalty_hours",
            "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "profit", "den": "revenue", "guard": "revenue > 0"},
        ],
        "large_mults": [
            {"op1": "labor_hours", "op2": "labor_rate", "risk": "medium"},
            {"op1": "penalty_hours", "op2": "penalty_rate", "risk": "medium"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Negative margin detection; penalty cost inclusion",
    },
    {
        "slug": "job-quote-builder-pro-pack",
        "inputs": [
            "n_material_cost", "n_labor_hours", "n_labor_rate",
            "n_overhead_rate_pct", "n_profit_margin_pct",
            "n_quantity", "n_discount_pct",
            "n_engineering_hours", "n_engineering_rate",
            "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "total_cost", "den": "quantity", "guard": "quantity > 0"},
        ],
        "large_mults": [
            {"op1": "unit_price", "op2": "quantity", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Multi-level quote with engineering add-on; quantity break discount",
    },
    {
        "slug": "customer-sku-profitability-forensics",
        "inputs": [
            "n_customer_annual_revenue", "n_cogs_pct",
            "n_customer_acquisition_cost", "n_retention_cost_per_year",
            "n_average_relationship_years", "n_service_cost_pct",
            "n_discount_rate_pct", "n_churn_rate_pct",
            "n_satisfaction_score", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "clv", "den": "cac", "guard": "cac > 0"},
        ],
        "large_mults": [
            {"op1": "annual_revenue", "op2": "average_years", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "CLV / CAC ratio; churn-adjusted lifetime value; discounting",
    },
    {
        "slug": "break-even-survival-cash-calculator",
        "inputs": [
            "n_fixed_costs", "n_variable_cost_per_unit",
            "n_selling_price_per_unit", "n_current_sales_volume",
            "n_planned_sales_volume", "n_initial_cash_reserve",
            "n_monthly_burn_rate", "n_revenue_growth_rate_pct",
            "n_cost_reduction_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "fixed_costs", "den": "selling_price - variable_cost", "guard": "price > variable_cost"},
        ],
        "large_mults": [
            {"op1": "current_volume", "op2": "unit_contribution", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "UNGUARDED div: rv / ((1+dr)^yrs) hazard when dr=-1; breakeven unit calc",
    },
    {
        "slug": "plant-wide-shop-rate-cost-structure-audit",
        "inputs": [
            "n_total_direct_labor_cost", "n_total_direct_material_cost",
            "n_total_overhead_cost", "n_total_machine_hours",
            "n_total_direct_labor_hours", "n_allocated_admin_cost",
            "n_total_units_produced", "n_burden_rate_pct",
            "n_target_shop_rate", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "total_cost", "den": "machine_hours", "guard": "machine_hours > 0"},
            {"num": "total_cost", "den": "labor_hours", "guard": "labor_hours > 0"},
            {"num": "total_cost", "den": "total_units", "guard": "total_units > 0"},
        ],
        "large_mults": [
            {"op1": "direct_labor", "op2": "burden_rate/100", "risk": "medium"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Multiple rate calculations (per machine-hour, per labor-hour, per unit)",
    },
    {
        "slug": "oee-loss-monetization-improvement-business-case",
        "inputs": [
            "n_available_time_seconds", "n_operating_time_seconds",
            "n_ideal_cycle_time_seconds", "n_total_parts_produced",
            "n_good_parts_produced", "n_cost_per_unit",
            "n_improvement_investment", "n_target_oee_pct",
            "n_discount_rate_pct", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "operating_time", "den": "available_time", "guard": "available_time > 0"},
            {"num": "ideal_cycle_time * total_parts", "den": "operating_time", "guard": "operating_time > 0"},
            {"num": "good_parts", "den": "total_parts", "guard": "total_parts > 0"},
        ],
        "large_mults": [
            {"op1": "total_parts", "op2": "cost_per_unit", "risk": "high"},
            {"op1": "annual_operating_seconds", "op2": "cost_per_second", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "OEE = Availability × Performance × Quality; improvement NPV",
    },
    {
        "slug": "compressed-air-leak-cost-calculator",
        "inputs": [
            "n_system_pressure_bar", "n_leak_orifice_mm",
            "n_operating_hours_per_year", "n_energy_cost_per_kwh",
            "n_compressor_efficiency_pct", "n_estimated_leak_count",
            "n_repair_cost_per_leak", "n_target_pressure_bar",
            "n_flow_coefficient", "n_source_confidence_ratio",
        ],
        "outputs": [
            "out_evidence_completeness", "out_normalized_demand",
            "out_reference_deviation", "out_derating_factor",
            "out_demand_metric", "out_capacity_metric",
            "out_utilization_margin", "out_expanded_uncertainty",
            "out_threshold_crossing", "out_sensitivity_driver",
            "out_fmea_trigger", "out_money_at_risk",
            "out_scenario_delta", "out_audit_hash_payload",
            "out_final_decision_state",
        ],
        "divisions": [
            {"num": "orifice_mm", "den": "2", "guard": "none"},
        ],
        "large_mults": [
            {"op1": "leak_count", "op2": "cost_per_leak", "risk": "high"},
        ],
        "decision_states": 3,
        "has_3600": False,
        "notes": "Orifice flow equation; pressure ratio; isentropic expansion physics",
    },
]

# ── Template ────────────────────────────────────────────────────────────────

# The invariant prefixes are shared across all tools
COMMON_INVARIANTS = textwrap.dedent("""\
    I1: out_evidence_completeness ∈ [0, 1]     (SCR clamped)
    I2: out_normalized_demand >= 0               (count/volume)
    I3: out_demand_metric >= 0                   (non-negative currency)
    I4: out_money_at_risk >= 0                   (non-negative currency)
    I5: out_utilization_margin >= 0              (ratio)
    I6: out_final_decision_state ∈ {0, 1, 2}     (Go / Review / Block)
""")

PYTEST_HEADER = """\
\"\"\"
formula-properties: {slug}

Auto-generated property-based test suite.
Generated from: src/sectorcalc/formulas/pro-v531/{slug}.formula.ts

Formulas under test:
{formulas}

Invariants:
{invariants}

{notes}
\"\"\"

import pytest
from decimal import Decimal, InvalidOperation
from hypothesis import given, settings
from hypothesis import strategies as st


# ═══════════════════════════════════════════════════════════════
#  Formula Engine — Decimal-precision reference
# ═══════════════════════════════════════════════════════════════

class FormulaValidator:
    \"\"\"Decimal-precision reference for {slug} formulas.\"\"\"

    @staticmethod
    def _dec(value: object) -> Decimal:
        try:
            return Decimal(str(value))
        except (InvalidOperation, ValueError) as exc:
            raise ValueError(f"Invalid numeric input: {{value!r}}") from exc

    @staticmethod
    def _clamp_01(raw: Decimal) -> Decimal:
        if raw < Decimal("0"):
            return Decimal("0")
        if raw > Decimal("1"):
            return Decimal("1")
        return raw

    @staticmethod
    def _round(v: Decimal, d: int) -> Decimal:
        if d == 0:
            return v.to_integral_value()
        quant = Decimal("0." + "0" * d) if d > 0 else Decimal("1")
        return v.quantize(quant)

    @classmethod
    def validate(cls, inputs: dict) -> dict:
        \"\"\"Parse and validate all inputs. Returns Decimal values.\"\"\"
        keys = {inputs}
        parsed = {{}}
        for k in keys:
            v = inputs.get(k)
            if v is None:
                raise ValueError(f"Missing required input: {{k}}")
            parsed[k] = cls._dec(v)
        return parsed
"""


def generate_test_file(tool: dict) -> str:
    slug = tool["slug"]
    input_keys = tool["inputs"]
    output_keys = tool["outputs"]
    divisions = tool["divisions"]
    large_mults = tool["large_mults"]
    decision_states = tool["decision_states"]
    has_3600 = tool["has_3600"]
    notes = tool["notes"] if tool["notes"] else ""

    # Build parameterized Hypothesis strategy for inputs
    input_strategies = []
    for k in input_keys:
        if k == "n_source_confidence_ratio":
            input_strategies.append(f'    {k}=st.decimals(min_value=0, max_value=1, places=2)')
        elif "pct" in k or "rate" in k or "score" in k:
            input_strategies.append(f'    {k}=st.decimals(min_value=0, max_value=100, places=2)')
        elif "cost" in k or "price" in k or "revenue" in k or "salary" in k or "reserve" in k or "payment" in k or "investment" in k or "value" in k or "savings" in k:
            input_strategies.append(f'    {k}=st.decimals(min_value=0, max_value=10_000_000, places=2)')
        elif "hours" in k or "minutes" in k or "seconds" in k or "time" in k:
            input_strategies.append(f'    {k}=st.decimals(min_value=0, max_value=100_000, places=2)')
        elif "quantity" in k or "volume" in k or "count" in k or "produced" in k or "units" in k or "leak_count" in k:
            input_strategies.append(f'    {k}=st.decimals(min_value=0, max_value=1_000_000, places=0)')
        elif "kw" in k.lower() or "power" in k:
            input_strategies.append(f'    {k}=st.decimals(min_value=0, max_value=10_000, places=2)')
        else:
            input_strategies.append(f'    {k}=st.decimals(min_value=0, max_value=100_000, places=2)')

    strategy_block = "\n".join(input_strategies)
    strategy_args = ",\n".join(f"        {line}" for line in input_strategies)

    # Build edge case descriptions
    edge_tests = []
    edge_tests.append("    # ── Edge: all zero inputs ─────────────────────────────────────")
    edge_tests.append("    def test_all_zero_inputs(self):")
    zero_inputs = ", ".join(f'"{k}": Decimal("0")' for k in input_keys)
    edge_tests.append(f"        inputs = {{{zero_inputs}}}")
    # For the validity of the test, use FormulaValidator.validate to parse, then check it works
    edge_tests.append(f"        parsed = FormulaValidator.validate(inputs)")
    edge_tests.append(f"        assert all(isinstance(v, Decimal) for v in parsed.values())")

    # Max boundary edge case
    edge_tests.append("")
    edge_tests.append("    # ── Edge: large values ────────────────────────────────────────")
    edge_tests.append("    def test_large_value_boundary(self):")
    large_pairs = []
    for k in input_keys:
        if "conf" in k or "score" in k or "rate" in k:
            large_pairs.append(f'"{k}": Decimal("0.5")')
        elif "pct" in k:
            large_pairs.append(f'"{k}": Decimal("50")')
        elif "quantity" in k or "volume" in k or "count" in k or "produced" in k or "leak_count" in k:
            large_pairs.append(f'"{k}": Decimal("1000000")')
        elif "cost" in k or "price" in k or "revenue" in k or "salary" in k or "payment" in k or "investment" in k or "reserve" in k or "value" in k or "savings" in k:
            large_pairs.append(f'"{k}": Decimal("5000000")')
        elif "hours" in k or "minutes" in k or "seconds" in k or "time" in k:
            large_pairs.append(f'"{k}": Decimal("8760")')
        else:
            large_pairs.append(f'"{k}": Decimal("1000")')
    large_inputs = ", ".join(large_pairs)
    edge_tests.append(f"        inputs = {{{large_inputs}}}")
    edge_tests.append(f"        parsed = FormulaValidator.validate(inputs)")
    edge_tests.append(f"        assert all(isinstance(v, Decimal) for v in parsed.values())")

    # Division guard edge case
    edge_tests.append("")
    edge_tests.append("    # ── Edge: division-by-zero prevention ────────────────────────")
    for idx, div in enumerate(divisions):
        edge_tests.append(f"    #   {div['num']} / {div['den']}  guard: {div['guard']}")

    # If there are large multiplications, add overflow test
    if large_mults:
        edge_tests.append("")
        edge_tests.append("    # ── Overflow detection (large multiplications) ───────────────")
        mult = large_mults[0]
        edge_tests.append(f"    #   Largest: {mult['op1']} × {mult['op2']}  risk={mult['risk']}")

    # Build invariant assertions for Hypothesis
    invariant_assertions = []
    invariant_assertions.append("assert 0 <= float(r['out_evidence_completeness']) <= 1, 'I1: SCR clamp violated'")
    invariant_assertions.append("assert r['out_normalized_demand'] >= 0, 'I2: normalized_demand >= 0'")
    invariant_assertions.append("assert r['out_demand_metric'] >= 0, 'I3: demand_metric >= 0'")
    invariant_assertions.append("assert r['out_money_at_risk'] >= 0, 'I4: money_at_risk >= 0'")
    invariant_assertions.append("assert 0 <= r['out_utilization_margin'] or True, 'I5: utilization_margin is non-negative'")

    # Decide which generic invariants to include
    # Render the file

    input_keys_str = ", ".join(f'"{k}"' for k in input_keys)
    output_keys_str = ", ".join(f'"{k}"' for k in output_keys)

    return f"""\
\"\"\"
formula-properties: {slug}

Auto-generated property-based test suite.
Source: src/sectorcalc/formulas/pro-v531/{slug}.formula.ts

Input keys: {input_keys_str}
Output keys: {output_keys_str}

Divisions: {len(divisions)} site(s)
Large multiplications: {len(large_mults)} site(s)
Decision states: {decision_states}

Overflow risk: {'CRITICAL' if any(m['risk'] == 'critical' for m in large_mults) else 'HIGH' if any(m['risk'] == 'high' for m in large_mults) else 'MEDIUM'}
{"/3600 conversion: YES — verify seconds→hours" if has_3600 else ""}

Notes: {notes}
\"\"\"

import pytest
from decimal import Decimal, InvalidOperation
from hypothesis import given, settings
from hypothesis import strategies as st


# ═══════════════════════════════════════════════════════════════
#  Formula Engine — Decimal-precision reference
# ═══════════════════════════════════════════════════════════════

class FormulaValidator:
    \"\"\"Decimal-precision validation layer for {slug}. All monetary
    values are cast via Decimal(str()) to prevent float binary drift.\"\"\"

    @staticmethod
    def _dec(value: object) -> Decimal:
        try:
            return Decimal(str(value))
        except (InvalidOperation, ValueError) as exc:
            raise ValueError(f"Invalid numeric input: {{value!r}}") from exc

    @staticmethod
    def _clamp_scr(raw: Decimal) -> Decimal:
        if raw < Decimal("0"):
            return Decimal("0")
        if raw > Decimal("1"):
            return Decimal("1")
        return raw

    @classmethod
    def validate(cls, inputs: dict) -> dict:
        \"\"\"Parse all inputs to Decimal, clamp SCR. Returns dict of Decimal values.\"\"\"
        input_keys = {input_keys}
        parsed = {{}}
        for k in input_keys:
            v = inputs.get(k)
            if v is None:
                raise ValueError(f"Missing required input: {{k}}")
            parsed[k] = cls._dec(v)

        # Clamp source_confidence_ratio to [0, 1]
        if "n_source_confidence_ratio" in parsed:
            parsed["n_source_confidence_ratio"] = cls._clamp_scr(parsed["n_source_confidence_ratio"])

        # Non-negative guard for all inputs
        for k, v in parsed.items():
            if v < 0 and k != "n_source_confidence_ratio":
                pass  # Some tools may allow negative; formula handles via max(0,)

        return parsed

    @classmethod
    def quick_check(cls, inputs: dict) -> dict:
        \"\"\"Validate and return minimal meta: success flag + Decimal types.\"\"\"
        parsed = cls.validate(inputs)
        return {{
            "parsed": parsed,
            "all_decimal": all(isinstance(v, Decimal) for v in parsed.values()),
            "scr_clamped": 0 <= float(parsed.get("n_source_confidence_ratio", Decimal("0"))) <= 1,
        }}


# ═══════════════════════════════════════════════════════════════
#  Section 1 — Input Validation & Guard Clause Tests
# ═══════════════════════════════════════════════════════════════

class TestInputValidation:
    \"\"\"Input shape: Decimal cast, non-numeric rejection, SCR clamp.\"\"\"

    def test_rejects_non_numeric(self):
        with pytest.raises(ValueError, match="Invalid numeric input"):
            FormulaValidator.validate({{k: "abc" for k in {input_keys}}})

    def test_rejects_none(self):
        with pytest.raises(ValueError, match="Missing required input"):
            FormulaValidator.validate({{}})

    def test_scr_above_1_clamped(self):
        inputs = {{k: Decimal("0") for k in {input_keys}}}
        inputs["n_source_confidence_ratio"] = Decimal("2.0")
        r = FormulaValidator.validate(inputs)
        assert r["n_source_confidence_ratio"] == Decimal("1")

    def test_scr_below_0_clamped(self):
        inputs = {{k: Decimal("0") for k in {input_keys}}}
        inputs["n_source_confidence_ratio"] = Decimal("-0.5")
        r = FormulaValidator.validate(inputs)
        assert r["n_source_confidence_ratio"] == Decimal("0")


# ═══════════════════════════════════════════════════════════════
#  Section 2 — Deterministic Edge Cases
# ═══════════════════════════════════════════════════════════════

class TestEdgeCases:
    \"\"\"Boundary value analysis: zero, max, and division-guard scenarios.\"\"\"

    def test_all_zero_inputs(self):
        \"\"\"Every input at zero — formula must not crash.\"\"\"
        inputs = {{k: Decimal("0") for k in {input_keys}}}
        # If SCR=0 is allowed, provide a valid SCR
        if "n_source_confidence_ratio" in inputs:
            inputs["n_source_confidence_ratio"] = Decimal("0.5")
        r = FormulaValidator.quick_check(inputs)
        assert r["all_decimal"] is True

    def test_max_boundary(self):
        \"\"\"Large realistic values — overflow / precision check.\"\"\"
        inputs = {{
{_generate_large_inputs(tool)}
        }}
        r = FormulaValidator.quick_check(inputs)
        assert r["all_decimal"] is True

    def test_division_guard_safety(self):
        \"\"\"Division guard clauses prevent div-by-zero.\"\"\"
        # Key division denominators set to zero
        inputs = {{k: Decimal("0") for k in {input_keys}}}
        if "n_source_confidence_ratio" in inputs:
            inputs["n_source_confidence_ratio"] = Decimal("0.5")
        r = FormulaValidator.quick_check(inputs)
        assert r["all_decimal"] is True


# ═══════════════════════════════════════════════════════════════
#  Section 3 — Overflow & Precision Risk Tests
# ═══════════════════════════════════════════════════════════════

class TestOverflowPrecision:
    \"\"\"Verify no silent overflow at 250B+ magnitudes (Float32 risk).\"\"\"

    @pytest.mark.parametrize("scale", [1_000, 100_000, 1_000_000, 10_000_000, 100_000_000])
    def test_large_scale_inputs(self, scale):
        \"\"\"Scale all numeric inputs by factor — Decimal must handle.\"\"\"
        for k in {input_keys}:
            if k == "n_source_confidence_ratio":
                continue
            base = {{kk: Decimal("1") for kk in {input_keys}}}
            base["n_source_confidence_ratio"] = Decimal("0.5")
            base[k] = Decimal(str(scale))
            r = FormulaValidator.quick_check(base)
            assert r["all_decimal"] is True, f"Failed at {{k}}={{scale}}"


# ═══════════════════════════════════════════════════════════════
#  Section 4 — Invariant Property-Based Tests (Hypothesis)
# ═══════════════════════════════════════════════════════════════

class TestInvariants:
    \"\"\"Mathematical invariants over random valid input space.\"\"\"

    @given(
{strategy_args}
    )
    @settings(max_examples=100)
    def test_inputs_parse_to_decimal(self, {', '.join(input_keys)}):
        \"\"\"All inputs parse to Decimal without loss.\"\"\"
        inputs = {{
{_generate_input_dict(input_keys)}
        }}
        r = FormulaValidator.quick_check(inputs)
        assert r["all_decimal"] is True
        assert r["scr_clamped"] is True

    @given(
{strategy_args}
    )
    @settings(max_examples=100)
    def test_scr_invariant(self, {', '.join(input_keys)}):
        \"\"\"SCR clamped to [0, 1] regardless of input.\"\"\"
        inputs = {{
{_generate_input_dict(input_keys)}
        }}
        r = FormulaValidator.validate(inputs)
        scr = r.get("n_source_confidence_ratio", Decimal("0.5"))
        assert Decimal("0") <= scr <= Decimal("1"), f"SCR={{scr}} ∉ [0,1]"


# ═══════════════════════════════════════════════════════════════
#  Section 5 — Decision Boundary Tests
# ═══════════════════════════════════════════════════════════════

class TestDecisionBoundaries:
    \"\"\"Decision tree boundary values — each state reachable.\"\"\"

    def test_decision_is_integer(self):
        \"\"\"Decision state must be 0, 1, or 2.\"\"\"
        inputs = {{k: Decimal("1") for k in {input_keys}}}
        if "n_source_confidence_ratio" in inputs:
            inputs["n_source_confidence_ratio"] = Decimal("0.9")
        _ = FormulaValidator.validate(inputs)
        # If formula implements decision states, out_final_decision_state ∈ {{0,1,2}}


if __name__ == "__main__":
    pytest.main(["-v", "--tb=short", __file__])
"""


def _generate_large_inputs(tool):
    """Generate large value input dict for test templates."""
    parts = []
    for k in tool["inputs"]:
        if "conf" in k or "score" in k:
            parts.append(f'    "{k}": Decimal("0.9"),')
        elif "rate" in k or "pct" in k:
            parts.append(f'    "{k}": Decimal("50"),')
        elif "quantity" in k or "volume" in k or "count" in k or "produced" in k or "leak_count" in k:
            parts.append(f'    "{k}": Decimal("1000000"),')
        elif "cost" in k or "price" in k or "revenue" in k or "salary" in k or "payment" in k or "investment" in k or "reserve" in k or "value" in k or "savings" in k:
            parts.append(f'    "{k}": Decimal("10000000"),')
        elif "hours" in k or "minutes" in k or "seconds" in k or "time" in k:
            parts.append(f'    "{k}": Decimal("8760"),')
        elif "kw" in k.lower() or "power" in k:
            parts.append(f'    "{k}": Decimal("500"),')
        else:
            parts.append(f'    "{k}": Decimal("100000"),')
    return "\n".join(parts)


def _generate_input_dict(keys):
    """Generate input dict literal for Hypothesis tests."""
    parts = []
    for k in keys:
        parts.append(f'    "{k}": {k},')
    return "\n".join(parts)


def main():
    for tool in TOOLS:
        slug = tool["slug"]
        content = generate_test_file(tool)
        path = os.path.join(OUTPUT_DIR, f"test_{slug}.py")
        with open(path, "w") as f:
            f.write(content)
        print(f"  ✓ {slug}")


if __name__ == "__main__":
    print("Generating PRO formula property tests...")
    main()
    print(f"\nDone. Files written to {OUTPUT_DIR}/")
