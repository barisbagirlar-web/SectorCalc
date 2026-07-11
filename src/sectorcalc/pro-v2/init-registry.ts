// SectorCalc PRO V2 — Registry Initialization
// Source of truth for all PRO V2 tool definitions.
// Uses a deterministic exported Record (not a side-effect map).
// Populates the backward-compatible Map via initProV2Registry().

import type { ProV2ToolDefinition } from "./proToolRegistry";
import { registerTool, setStaticDefinitions } from "./proToolRegistry";

// ── Wave 0 — Golden reference ──────────────────────────────────────────
import { WELD_GROUPS } from "./contracts/weld-procedure-cost-consumable-estimation-suite.contract";
import { WELD_PRESETS } from "./presets/weld-procedure-cost-consumable-estimation-suite.presets";
import { weldBuildExecutePayload } from "./adapters/weld-procedure-cost-consumable-estimation-suite.adapter";
import { buildWeldReport } from "./insights/weld-procedure-cost-consumable-estimation-suite.insight";

// ── Wave 1 — Cost and quotation ─────────────────────────────────────────
import { MACHINE_RATE_GROUPS } from "./contracts/machine-hourly-rate-proof-report.contract";
import { MACHINE_RATE_PRESETS } from "./presets/machine-hourly-rate-proof-report.presets";
import { machineRateBuildExecutePayload } from "./adapters/machine-hourly-rate-proof-report.adapter";
import { buildMachineRateReport } from "./insights/machine-hourly-rate-proof-report.insight";

// ── Wave 1 — Tool 2: Job Quote Builder ────────────────────────────────────
import { QUOTE_BUILDER_GROUPS } from "./contracts/job-quote-builder-pro-pack.contract";
import { QUOTE_BUILDER_PRESETS } from "./presets/job-quote-builder-pro-pack.presets";
import { quoteBuilderBuildExecutePayload } from "./adapters/job-quote-builder-pro-pack.adapter";
import { buildQuoteBuilderReport } from "./insights/job-quote-builder-pro-pack.insight";

// ── Wave 1 — Tool 3: Loss Making Job Detector ─────────────────────────────
import { LOSS_DETECTOR_GROUPS } from "./contracts/loss-making-job-detector.contract";
import { LOSS_DETECTOR_PRESETS } from "./presets/loss-making-job-detector.presets";
import { lossDetectorBuildExecutePayload } from "./adapters/loss-making-job-detector.adapter";
import { buildLossDetectorReport } from "./insights/loss-making-job-detector.insight";

// ── Wave 1.5 — Break-Even Survival Cash ────────────────────────────────────
import { BREAK_EVEN_GROUPS } from "./contracts/break-even-survival-cash-calculator.contract";
import { BREAK_EVEN_PRESETS } from "./presets/break-even-survival-cash-calculator.presets";
import { breakEvenBuildExecutePayload } from "./adapters/break-even-survival-cash-calculator.adapter";
import { buildBreakEvenReport } from "./insights/break-even-survival-cash-calculator.insight";

// ── Wave 1.5 — True Employee Cost ───────────────────────────────────────────
import { EMPLOYEE_COST_GROUPS } from "./contracts/true-employee-cost-statement.contract";
import { EMPLOYEE_COST_PRESETS } from "./presets/true-employee-cost-statement.presets";
import { employeeCostBuildExecutePayload } from "./adapters/true-employee-cost-statement.adapter";
import { buildEmployeeCostReport } from "./insights/true-employee-cost-statement.insight";

// ── Wave 2 — Margin & Pricing Analytics ─────────────────────────────────────
import { SKU_MARGIN_RANKER_GROUPS } from "./contracts/product-sku-margin-ranker.contract";
import { SKU_MARGIN_RANKER_PRESETS } from "./presets/product-sku-margin-ranker.presets";
import { skuMarginRankerBuildExecutePayload } from "./adapters/product-sku-margin-ranker.adapter";
import { buildSkuMarginRankerReport } from "./insights/product-sku-margin-ranker.insight";

import { CUSTOMER_SKU_FORENSICS_GROUPS } from "./contracts/customer-sku-profitability-forensics.contract";
import { CUSTOMER_SKU_FORENSICS_PRESETS } from "./presets/customer-sku-profitability-forensics.presets";
import { customerSkuForensicsBuildExecutePayload } from "./adapters/customer-sku-profitability-forensics.adapter";
import { buildCustomerSkuForensicsReport } from "./insights/customer-sku-profitability-forensics.insight";

import { RECEIVABLES_ADDENDUM_GROUPS } from "./contracts/receivables-cost-payment-term-addendum.contract";
import { RECEIVABLES_ADDENDUM_PRESETS } from "./presets/receivables-cost-payment-term-addendum.presets";
import { receivablesAddendumBuildExecutePayload } from "./adapters/receivables-cost-payment-term-addendum.adapter";
import { buildReceivablesAddendumReport } from "./insights/receivables-cost-payment-term-addendum.insight";

import { FX_COMMODITY_PRICER_GROUPS } from "./contracts/fx-commodity-pass-through-pricer.contract";
import { FX_COMMODITY_PRICER_PRESETS } from "./presets/fx-commodity-pass-through-pricer.presets";
import { fxCommodityPricerBuildExecutePayload } from "./adapters/fx-commodity-pass-through-pricer.adapter";
import { buildFxCommodityPricerReport } from "./insights/fx-commodity-pass-through-pricer.insight";

import { PLANT_WIDE_SHOP_RATE_GROUPS } from "./contracts/plant-wide-shop-rate-cost-structure-audit.contract";
import { PLANT_WIDE_SHOP_RATE_PRESETS } from "./presets/plant-wide-shop-rate-cost-structure-audit.presets";
import { plantWideShopRateBuildExecutePayload } from "./adapters/plant-wide-shop-rate-cost-structure-audit.adapter";
import { buildPlantWideShopRateReport } from "./insights/plant-wide-shop-rate-cost-structure-audit.insight";

// ── Wave 3 — Operations & Quality Loss ───────────────────────────────
import { DOWNTIME_SCRAP_GROUPS } from "./contracts/downtime-scrap-loss-statement.contract";
import { DOWNTIME_SCRAP_PRESETS } from "./presets/downtime-scrap-loss-statement.presets";
import { downtimeScrapBuildExecutePayload } from "./adapters/downtime-scrap-loss-statement.adapter";
import { buildDowntimeScrapReport } from "./insights/downtime-scrap-loss-statement.insight";

import { OEE_GROUPS } from "./contracts/oee-loss-monetization-improvement-business-case.contract";
import { OEE_PRESETS } from "./presets/oee-loss-monetization-improvement-business-case.presets";
import { oeeBuildExecutePayload } from "./adapters/oee-loss-monetization-improvement-business-case.adapter";
import { buildOeeReport } from "./insights/oee-loss-monetization-improvement-business-case.insight";

import { SCRAP_REWORK_GROUPS } from "./contracts/scrap-rework-cost-tracker.contract";
import { SCRAP_REWORK_PRESETS } from "./presets/scrap-rework-cost-tracker.presets";
import { scrapReworkBuildExecutePayload } from "./adapters/scrap-rework-cost-tracker.adapter";
import { buildScrapReworkReport } from "./insights/scrap-rework-cost-tracker.insight";

import { SMED_GROUPS } from "./contracts/setup-time-reduction-roi-smed.contract";
import { SMED_PRESETS } from "./presets/setup-time-reduction-roi-smed.presets";
import { smedBuildExecutePayload } from "./adapters/setup-time-reduction-roi-smed.adapter";
import { buildSmedReport } from "./insights/setup-time-reduction-roi-smed.insight";

import { OUTSOURCE_GROUPS } from "./contracts/outsource-vs-in-house-analyzer.contract";
import { OUTSOURCE_PRESETS } from "./presets/outsource-vs-in-house-analyzer.presets";
import { outsourceBuildExecutePayload } from "./adapters/outsource-vs-in-house-analyzer.adapter";
import { buildOutsourceReport } from "./insights/outsource-vs-in-house-analyzer.insight";

// ── Static definitions ──────────────────────────────────────────────────

const WELD_DEFINITION: ProV2ToolDefinition = {
  slug: "weld-procedure-cost-consumable-estimation-suite",
  title: "Weld Procedure Cost & Consumable Estimation Suite",
  category: "Welding & Fabrication",
  fieldContract: WELD_GROUPS,
  presets: WELD_PRESETS,
  serverContract: {
    toolKey: "weld-procedure-cost-consumable-estimation-suite",
    toolId: "PRO_016",
    schemaVersion: "5.3.1-pro-schema.1",
    requiredInputKeys: [
      "n_weld_length","n_weld_throat","n_material",
      "n_wire_cost","n_gas_cost",
      "n_arc_time","n_total_job_time","n_labor_rate","n_shop_overhead_rate",
      "n_deposition_efficiency","n_contingency",
    ],
    optionalInputKeys: ["n_planned_quote"],
    expectedOutputKeys: [
      "out_weld_length_m","out_weld_volume_g","out_wire_mass_g",
      "out_wire_cost","out_gas_cost","out_arc_time_hours",
      "out_total_job_time_hours","out_labor_cost","out_shop_overhead_cost",
      "out_deposition_efficiency","out_total_base_cost","out_cost_per_meter",
      "out_overhead_uncertainty","out_primary_cost_driver","out_fmea_trigger",
      "out_final_decision_state",
    ],
  },
  buildExecutePayload: weldBuildExecutePayload,
  buildReport: buildWeldReport,
  reportCapabilities: {
    primaryKpis:true,decisionState:true,executiveInterpretation:true,
    breakdown:true,scenarioComparison:false,sensitivity:true,
    hiddenLosses:true,missedAssumptions:true,riskWarnings:true,
    checklist:true,recommendations:true,pdfExport:true,
  },
};

const MACHINE_RATE_DEFINITION: ProV2ToolDefinition = {
  slug: "machine-hourly-rate-proof-report",
  title: "Machine Hourly Rate Proof Report",
  category: "Workshop Costing",
  fieldContract: MACHINE_RATE_GROUPS,
  presets: MACHINE_RATE_PRESETS,
  serverContract: {
    toolKey: "machine-hourly-rate-proof-report",
    toolId: "PRO_017",
    schemaVersion: "5.3.1-pro-schema.1",
    requiredInputKeys: [
      "n_planned_operating_hours","n_utilization_percent","n_planned_downtime_percent",
      "n_purchase_price","n_residual_value","n_economic_life_years",
      "n_maintenance_cost","n_insurance_tax_cost",
      "n_facility_allocation","n_machine_power_kw","n_electricity_price",
      "n_consumables_cost_per_hour","n_tooling_cost_per_hour",
      "n_operator_count","n_labor_rate_per_hour",
      "n_current_shop_rate","n_target_margin_percent",
    ],
    optionalInputKeys: [
      "n_financing_cost_percent","n_other_annual_fixed_cost",
      "n_annual_production_volume","n_cycle_time_seconds",
      "n_setup_time_minutes","n_average_batch_quantity",
    ],
    expectedOutputKeys: [
      "out_scheduled_hours_per_year","out_available_hours_per_year","out_productive_hours_per_year",
      "out_annual_depreciation_cost","out_annual_financing_cost","out_annual_fixed_cost",
      "out_depreciation_cost_per_hour","out_maintenance_cost_per_hour",
      "out_insurance_tax_cost_per_hour","out_facility_cost_per_hour",
      "out_financing_cost_per_hour","out_other_fixed_cost_per_hour",
      "out_fixed_cost_per_productive_hour",
      "out_energy_cost_per_hour","out_labor_cost_per_hour",
      "out_consumables_cost_per_hour","out_tooling_cost_per_hour",
      "out_variable_cost_per_hour","out_total_cost_per_hour",
      "out_minimum_sustainable_rate","out_target_sell_rate",
      "out_current_rate_gap","out_annual_under_recovery_or_surplus",
      "out_break_even_contribution_per_hour","out_utilization_breakeven_percent",
      "out_break_even_status","out_primary_cost_driver","out_final_decision_state",
      "out_setup_count_per_year","out_required_machine_hours",
      "out_capacity_requirement_percent","out_cost_per_part",
      "out_target_sell_price_per_part","out_production_scenario_state",
    ],
  },
  buildExecutePayload: machineRateBuildExecutePayload,
  buildReport: buildMachineRateReport,
  reportCapabilities: {
    primaryKpis:true,decisionState:true,executiveInterpretation:true,
    breakdown:true,scenarioComparison:true,sensitivity:true,
    hiddenLosses:true,missedAssumptions:true,riskWarnings:true,
    checklist:true,recommendations:true,pdfExport:true,
  },
};

const JOB_QUOTE_DEFINITION: ProV2ToolDefinition = {
  slug: "job-quote-builder-pro-pack",
  title: "Job Quote Builder Pro Pack",
  category: "Workshop Pricing",
  fieldContract: QUOTE_BUILDER_GROUPS,
  presets: QUOTE_BUILDER_PRESETS,
  serverContract: {
    toolKey: "job-quote-builder-pro-pack",
    toolId: "PRO_024",
    schemaVersion: "5.3.1-pro-schema.1",
    requiredInputKeys: [
      "n_batch_quantity","n_material_cost_per_unit","n_cycle_time_seconds_per_unit",
      "n_setup_time_minutes_per_batch","n_machine_rate_per_hour","n_labor_rate_per_hour",
      "n_operator_count","n_annual_unallocated_overhead","n_annual_volume_units",
      "n_scrap_rework_percent","n_target_revenue_margin_percent",
    ],
    optionalInputKeys: [
      "n_tooling_consumables_cost_per_batch","n_external_processing_cost_per_batch",
      "n_packaging_cost_per_batch","n_freight_cost_per_batch","n_other_job_cost_per_batch",
      "n_contingency_percent","n_current_quote_per_unit",
    ],
    expectedOutputKeys: [
      "out_run_machine_hours","out_setup_hours","out_total_machine_hours",
      "out_labor_hours_per_batch","out_material_cost_before_scrap",
      "out_machine_cost_per_batch","out_labor_cost_per_batch","out_overhead_cost_per_batch",
      "out_tooling_consumables_cost_per_batch","out_external_processing_cost_per_batch",
      "out_packaging_cost_per_batch","out_freight_cost_per_batch","out_other_job_cost_per_batch",
      "out_direct_cost_before_scrap","out_scrap_rework_allowance","out_contingency_allowance",
      "out_total_job_cost_per_batch","out_cost_per_good_unit",
      "out_target_sell_price_per_batch","out_target_sell_price_per_unit",
      "out_profit_per_batch","out_profit_per_unit",
      "out_annual_batches","out_annual_revenue_at_target","out_annual_profit_at_target",
      "out_primary_cost_driver","out_final_decision_state",
      "out_current_quote_per_batch","out_current_profit_per_batch","out_achieved_margin_percent",
      "out_price_gap_per_unit","out_annual_underpricing_risk",
      "out_break_even_batch_quantity","out_break_even_status",
    ],
  },
  buildExecutePayload: quoteBuilderBuildExecutePayload,
  buildReport: buildQuoteBuilderReport,
  reportCapabilities: {
    primaryKpis:true,decisionState:true,executiveInterpretation:true,
    breakdown:true,scenarioComparison:true,sensitivity:true,
    hiddenLosses:true,missedAssumptions:true,riskWarnings:true,
    checklist:true,recommendations:true,pdfExport:true,
  },
};

const LOSS_DETECTOR_DEFINITION: ProV2ToolDefinition = {
  slug: "loss-making-job-detector",
  title: "Loss Making Job Detector",
  category: "Workshop Costing",
  fieldContract: LOSS_DETECTOR_GROUPS,
  presets: LOSS_DETECTOR_PRESETS,
  serverContract: {
    toolKey: "loss-making-job-detector",
    toolId: "PRO_019",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_batch_quantity", "n_selling_price_per_unit", "n_material_cost_per_unit",
      "n_cycle_time_seconds_per_unit", "n_setup_time_minutes_per_batch",
      "n_machine_rate_per_hour", "n_operator_count", "n_labor_rate_per_hour",
      "n_allocated_overhead", "n_scrap_rework_percent",
      "n_target_revenue_margin_percent", "n_annual_volume_units",
    ],
    optionalInputKeys: [
      "n_external_processing_per_batch", "n_packaging_freight_per_batch",
      "n_other_job_cost_per_batch",
    ],
    expectedOutputKeys: [
      "out_job_revenue", "out_direct_material_cost", "out_machine_cost",
      "out_labor_cost", "out_external_processing_cost", "out_packaging_freight_cost",
      "out_other_job_cost", "out_allocated_overhead", "out_scrap_rework_cost",
      "out_fully_loaded_job_cost", "out_contribution_profit", "out_operating_profit",
      "out_revenue_margin_percent", "out_profit_loss_per_unit",
      "out_minimum_sustainable_price", "out_target_price", "out_repricing_gap",
      "out_break_even_quantity", "out_annualized_money_at_risk",
      "out_primary_loss_driver", "out_final_decision_state",
    ],
  },
  buildExecutePayload: lossDetectorBuildExecutePayload,
  buildReport: buildLossDetectorReport,
  reportCapabilities: {
    primaryKpis:true,decisionState:true,executiveInterpretation:true,
    breakdown:true,scenarioComparison:false,sensitivity:true,
    hiddenLosses:true,missedAssumptions:true,riskWarnings:true,
    checklist:true,recommendations:true,pdfExport:true,
  },
};

const BREAK_EVEN_DEFINITION: ProV2ToolDefinition = {
  slug: "break-even-survival-cash-calculator",
  title: "Break-Even Survival Cash Calculator",
  category: "Financial Planning",
  fieldContract: BREAK_EVEN_GROUPS,
  presets: BREAK_EVEN_PRESETS,
  serverContract: {
    toolKey: "break-even-survival-cash-calculator",
    toolId: "PRO_020",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_annual_revenue", "n_variable_cost_percent",
      "n_annual_fixed_costs", "n_available_cash_liquidity",
    ],
    optionalInputKeys: [
      "n_unit_selling_price", "n_unit_variable_cost",
    ],
    expectedOutputKeys: [
      "out_revenue", "out_variable_cost", "out_contribution_margin_amount",
      "out_contribution_margin_ratio", "out_fixed_operating_cost",
      "out_operating_profit_or_loss", "out_break_even_revenue",
      "out_break_even_units", "out_revenue_gap", "out_unit_gap",
      "out_monthly_cash_burn", "out_available_liquidity",
      "out_cash_runway_months", "out_margin_of_safety_amount",
      "out_margin_of_safety_percent", "out_primary_survival_driver",
      "out_final_decision_state",
    ],
  },
  buildExecutePayload: breakEvenBuildExecutePayload,
  buildReport: buildBreakEvenReport,
  reportCapabilities: {
    primaryKpis:true, decisionState:true, executiveInterpretation:true,
    breakdown:true, scenarioComparison:false, sensitivity:true,
    hiddenLosses:true, missedAssumptions:true, riskWarnings:true,
    checklist:true, recommendations:true, pdfExport:true,
  },
};

const EMPLOYEE_COST_DEFINITION: ProV2ToolDefinition = {
  slug: "true-employee-cost-statement",
  title: "True Employee Cost Statement",
  category: "Workforce Costing",
  fieldContract: EMPLOYEE_COST_GROUPS,
  presets: EMPLOYEE_COST_PRESETS,
  serverContract: {
    toolKey: "true-employee-cost-statement",
    toolId: "PRO_021",
    schemaVersion: "5.3.1",
    requiredInputKeys: ["n_annual_base_salary"],
    optionalInputKeys: [
      "n_payroll_tax_rate", "n_health_insurance_annual",
      "n_pension_contribution_rate", "n_bonus_target_rate",
      "n_paid_leave_weeks", "n_training_budget_annual",
      "n_equipment_it_annual", "n_workspace_facility_annual",
      "n_recruitment_allocation_rate", "n_other_benefits_annual",
      "n_productive_hours_per_year",
    ],
    expectedOutputKeys: [
      "out_base_salary", "out_payroll_taxes", "out_health_insurance",
      "out_pension_contribution", "out_bonus_allocation", "out_paid_leave_cost",
      "out_training_cost", "out_recruitment_allocation", "out_equipment_it_cost",
      "out_workspace_facility_cost", "out_other_benefits",
      "out_fully_loaded_annual_cost", "out_monthly_cost",
      "out_productive_hours_per_year", "out_productive_hourly_cost",
      "out_base_to_loaded_multiplier", "out_primary_cost_driver",
      "out_final_decision_state",
    ],
  },
  buildExecutePayload: employeeCostBuildExecutePayload,
  buildReport: buildEmployeeCostReport,
  reportCapabilities: {
    primaryKpis:true, decisionState:true, executiveInterpretation:true,
    breakdown:true, scenarioComparison:false, sensitivity:true,
    hiddenLosses:true, missedAssumptions:true, riskWarnings:true,
    checklist:true, recommendations:true, pdfExport:true,
  },
};

const SKU_MARGIN_RANKER_DEFINITION: ProV2ToolDefinition = {
  slug: "product-sku-margin-ranker",
  title: "Product SKU Margin Ranker",
  category: "Profitability Analysis",
  fieldContract: SKU_MARGIN_RANKER_GROUPS,
  presets: SKU_MARGIN_RANKER_PRESETS,
  serverContract: {
    toolKey: "product-sku-margin-ranker",
    toolId: "PRO_022",
    schemaVersion: "5.3.1",
    requiredInputKeys: ["n_unit_price","n_material_cost_per_unit","n_labor_cost_per_unit","n_overhead_per_unit","n_logistics_cost_per_unit","n_annual_volume_units","n_target_margin_percent","n_total_portfolio_revenue","n_total_portfolio_profit"],
    optionalInputKeys: [],
    expectedOutputKeys: ["out_sku_revenue","out_variable_cost","out_contribution_amount","out_contribution_margin_percent","out_fully_loaded_profit","out_fully_loaded_margin","out_unit_cost","out_revenue_share_percent","out_profit_share_percent","out_margin_classification","out_repricing_priority","out_concentration_risk","out_final_decision_state"],
  },
  buildExecutePayload: skuMarginRankerBuildExecutePayload,
  buildReport: buildSkuMarginRankerReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const CUSTOMER_SKU_FORENSICS_DEFINITION: ProV2ToolDefinition = {
  slug: "customer-sku-profitability-forensics",
  title: "Customer SKU Profitability Forensics",
  category: "Profitability & Margin Analysis",
  fieldContract: CUSTOMER_SKU_FORENSICS_GROUPS,
  presets: CUSTOMER_SKU_FORENSICS_PRESETS,
  serverContract: {
    toolKey: "customer-sku-profitability-forensics",
    toolId: "PRO_023",
    schemaVersion: "5.3.1",
    requiredInputKeys: ["n_unit_price","n_unit_variable_cost","n_annual_volume","n_logistics_cost_pct","n_service_cost_pct","n_return_rate_pct","n_target_margin"],
    optionalInputKeys: [],
    expectedOutputKeys: ["out_unit_price","out_unit_variable_cost","out_unit_contribution","out_contribution_margin_pct","out_logistics_burden_per_unit","out_service_burden_per_unit","out_return_burden_per_unit","out_total_burden_per_unit","out_net_margin_per_unit","out_net_margin_pct","out_total_annual_revenue","out_total_annual_profit","out_primary_burden_driver","out_contribution_ratio","out_final_decision_state"],
  },
  buildExecutePayload: customerSkuForensicsBuildExecutePayload,
  buildReport: buildCustomerSkuForensicsReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const RECEIVABLES_ADDENDUM_DEFINITION: ProV2ToolDefinition = {
  slug: "receivables-cost-payment-term-addendum",
  title: "Receivables Cost Payment Term Addendum",
  category: "Financial Risk & Pricing",
  fieldContract: RECEIVABLES_ADDENDUM_GROUPS,
  presets: RECEIVABLES_ADDENDUM_PRESETS,
  serverContract: {
    toolKey: "receivables-cost-payment-term-addendum",
    toolId: "PRO_024",
    schemaVersion: "5.3.1",
    requiredInputKeys: ["n_invoice_value","n_payment_days","n_early_payment_discount_pct","n_early_payment_days","n_cost_of_capital_pct","n_admin_collection_cost","n_default_risk_allowance"],
    optionalInputKeys: [],
    expectedOutputKeys: ["out_invoice_value","out_financing_cost","out_admin_collection_cost","out_default_risk_allowance","out_effective_term_cost","out_effective_term_cost_pct","out_margin_erosion_amount","out_required_addendum_amount","out_required_addendum_pct","out_revised_invoice_amount","out_breakeven_payment_term_days","out_final_decision_state"],
  },
  buildExecutePayload: receivablesAddendumBuildExecutePayload,
  buildReport: buildReceivablesAddendumReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const FX_COMMODITY_PRICER_DEFINITION: ProV2ToolDefinition = {
  slug: "fx-commodity-pass-through-pricer",
  title: "FX & Commodity Pass-Through Pricer",
  category: "Pricing & Cost Recovery",
  fieldContract: FX_COMMODITY_PRICER_GROUPS,
  presets: FX_COMMODITY_PRICER_PRESETS,
  serverContract: {
    toolKey: "fx-commodity-pass-through-pricer",
    toolId: "PRO_025",
    schemaVersion: "5.3.1",
    requiredInputKeys: ["n_base_price","n_fx_rate_spot","n_fx_rate_budget","n_commodity_index_current","n_commodity_index_budget","n_material_cost_pct","n_fx_hedge_pct","n_commodity_hedge_pct","n_annual_volume"],
    optionalInputKeys: [],
    expectedOutputKeys: ["out_base_price","out_adjusted_price","out_escalation_amount","out_fx_change_pct","out_commodity_change_pct","out_fx_impact_pct","out_commodity_impact_pct","out_total_pass_through_pct","out_escalation_cost_per_unit","out_annual_escalation_cost","out_money_at_risk","out_primary_price_driver","out_pass_through_severity","out_hedge_adequacy_score","out_final_decision_state"],
  },
  buildExecutePayload: fxCommodityPricerBuildExecutePayload,
  buildReport: buildFxCommodityPricerReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const PLANT_WIDE_SHOP_RATE_DEFINITION: ProV2ToolDefinition = {
  slug: "plant-wide-shop-rate-cost-structure-audit",
  title: "Plant-Wide Shop Rate Cost Structure Audit",
  category: "Cost Management",
  fieldContract: PLANT_WIDE_SHOP_RATE_GROUPS,
  presets: PLANT_WIDE_SHOP_RATE_PRESETS,
  serverContract: {
    toolKey: "plant-wide-shop-rate-cost-structure-audit",
    toolId: "PRO_026",
    schemaVersion: "5.3.1",
    requiredInputKeys: ["n_total_annual_cost","n_total_productive_hours","n_machine_group_cost","n_machine_group_hours","n_overhead_pool","n_overhead_allocation_base","n_current_shop_rate","n_target_margin_pct","n_utilization_pct"],
    optionalInputKeys: [],
    expectedOutputKeys: ["out_total_annual_cost","out_total_productive_hours","out_plant_wide_rate","out_machine_group_rate","out_overhead_absorption_rate","out_actual_utilization_pct","out_under_recovery_per_hour","out_pricing_floor_rate","out_current_shop_rate","out_recovery_gap","out_money_at_risk","out_primary_cost_driver","out_pricing_headroom","out_utilization_leverage","out_final_decision_state"],
  },
  buildExecutePayload: plantWideShopRateBuildExecutePayload,
  buildReport: buildPlantWideShopRateReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

// ── Wave 4 — Capital Investment & Energy ──────────────────────────────
import { NPV_IRR_GROUPS } from "./contracts/capital-equipment-investment-appraisal-npv-irr.contract";
import { NPV_IRR_PRESETS } from "./presets/capital-equipment-investment-appraisal-npv-irr.presets";
import { npvIrrBuildExecutePayload } from "./adapters/capital-equipment-investment-appraisal-npv-irr.adapter";
import { buildNpvIrrReport } from "./insights/capital-equipment-investment-appraisal-npv-irr.insight";

import { BUY_LEASE_KEEP_GROUPS } from "./contracts/machine-investment-feasibility-buy-lease-keep.contract";
import { BUY_LEASE_KEEP_PRESETS } from "./presets/machine-investment-feasibility-buy-lease-keep.presets";
import { buyLeaseKeepBuildExecutePayload } from "./adapters/machine-investment-feasibility-buy-lease-keep.adapter";
import { buildBuyLeaseKeepReport } from "./insights/machine-investment-feasibility-buy-lease-keep.insight";

import { MOTOR_ROI_GROUPS } from "./contracts/motor-compressor-replacement-roi.contract";
import { MOTOR_ROI_PRESETS } from "./presets/motor-compressor-replacement-roi.presets";
import { motorRoiBuildExecutePayload } from "./adapters/motor-compressor-replacement-roi.adapter";
import { buildMotorRoiReport } from "./insights/motor-compressor-replacement-roi.insight";

import { GRANT_FEASIBILITY_GROUPS } from "./contracts/energy-efficiency-grant-incentive-feasibility-pack.contract";
import { GRANT_FEASIBILITY_PRESETS } from "./presets/energy-efficiency-grant-incentive-feasibility-pack.presets";
import { grantFeasibilityBuildExecutePayload } from "./adapters/energy-efficiency-grant-incentive-feasibility-pack.adapter";
import { buildGrantFeasibilityReport } from "./insights/energy-efficiency-grant-incentive-feasibility-pack.insight";

const NPV_IRR_DEFINITION: ProV2ToolDefinition = {
  slug: "capital-equipment-investment-appraisal-npv-irr",
  title: "Capital Equipment Investment Appraisal (NPV/IRR)",
  category: "Financial Planning",
  fieldContract: NPV_IRR_GROUPS,
  presets: NPV_IRR_PRESETS,
  serverContract: {
    toolKey: "capital-equipment-investment-appraisal-npv-irr",
    toolId: "PRO_030",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_initial_investment","n_working_capital",
      "n_annual_cash_inflow_1","n_annual_cash_inflow_2","n_annual_cash_inflow_3",
      "n_annual_cash_inflow_4","n_annual_cash_inflow_5",
      "n_terminal_residual_value","n_discount_rate_percent",
      "n_scenario_downside_pct","n_scenario_upside_pct",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_initial_investment","out_working_capital","out_total_initial_cash",
      "out_annual_cash_flows_sum","out_terminal_value","out_discount_rate",
      "out_npv","out_irr_percent","out_simple_payback_years",
      "out_discounted_payback_years","out_profitability_index",
      "out_scenario_downside_npv","out_scenario_base_npv","out_scenario_upside_npv",
      "out_primary_value_driver","out_investment_decision_state","out_final_decision_state",
    ],
  },
  buildExecutePayload: npvIrrBuildExecutePayload,
  buildReport: buildNpvIrrReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:true,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const BUY_LEASE_KEEP_DEFINITION: ProV2ToolDefinition = {
  slug: "machine-investment-feasibility-buy-lease-keep",
  title: "Machine Investment Feasibility (Buy / Lease / Keep)",
  category: "Financial Planning",
  fieldContract: BUY_LEASE_KEEP_GROUPS,
  presets: BUY_LEASE_KEEP_PRESETS,
  serverContract: {
    toolKey: "machine-investment-feasibility-buy-lease-keep",
    toolId: "PRO_031",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_machine_purchase_price","n_down_payment_pct",
      "n_lease_annual_payment","n_lease_term_years",
      "n_loan_interest_rate_pct","n_loan_term_years",
      "n_annual_maintenance_cost","n_annual_downtime_cost",
      "n_residual_value","n_operating_savings_per_year","n_discount_rate",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_buy_initial_cash","out_buy_annual_payments","out_buy_maintenance","out_buy_downtime",
      "out_buy_total_lifecycle","out_buy_npv",
      "out_lease_initial_cash","out_lease_annual_payments","out_lease_total_lifecycle","out_lease_npv",
      "out_keep_total_lifecycle","out_keep_npv",
      "out_selected_alternative","out_decision_gap","out_final_decision_state",
    ],
  },
  buildExecutePayload: buyLeaseKeepBuildExecutePayload,
  buildReport: buildBuyLeaseKeepReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:true,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const MOTOR_ROI_DEFINITION: ProV2ToolDefinition = {
  slug: "motor-compressor-replacement-roi",
  title: "Motor / Compressor Replacement ROI",
  category: "Energy Efficiency",
  fieldContract: MOTOR_ROI_GROUPS,
  presets: MOTOR_ROI_PRESETS,
  serverContract: {
    toolKey: "motor-compressor-replacement-roi",
    toolId: "PRO_032",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_current_power_kw","n_proposed_power_kw","n_annual_operating_hours",
      "n_energy_price_per_kwh","n_current_maintenance_cost","n_proposed_maintenance_cost",
      "n_replacement_cost","n_useful_life_years","n_discount_rate",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_baseline_energy_kwh","out_baseline_energy_cost","out_proposed_energy_kwh","out_proposed_energy_cost",
      "out_annual_energy_saving","out_maintenance_saving","out_annual_financial_saving","out_replacement_cost",
      "out_simple_payback_years","out_roi_percent","out_npv","out_energy_price_sensitivity",
      "out_primary_saving_driver","out_final_decision_state",
    ],
  },
  buildExecutePayload: motorRoiBuildExecutePayload,
  buildReport: buildMotorRoiReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const GRANT_FEASIBILITY_DEFINITION: ProV2ToolDefinition = {
  slug: "energy-efficiency-grant-incentive-feasibility-pack",
  title: "Energy Efficiency Grant / Incentive Feasibility Pack",
  category: "Energy Efficiency",
  fieldContract: GRANT_FEASIBILITY_GROUPS,
  presets: GRANT_FEASIBILITY_PRESETS,
  serverContract: {
    toolKey: "energy-efficiency-grant-incentive-feasibility-pack",
    toolId: "PRO_033",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_baseline_energy_consumption_kwh","n_baseline_energy_price_per_kwh","n_projected_saving_pct",
      "n_gross_project_cost","n_eligible_project_cost","n_grant_incentive_amount",
      "n_annual_maintenance_cost","n_useful_life_years","n_discount_rate","n_energy_price_escalation_pct",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_baseline_energy_cost","out_projected_energy_saving","out_gross_project_cost","out_eligible_project_cost",
      "out_grant_amount","out_net_investment","out_annual_saving","out_simple_payback_years",
      "out_roi_percent","out_npv","out_grant_dependency_pct","out_energy_price_sensitivity",
      "out_implementation_risk_score","out_final_decision_state",
    ],
  },
  buildExecutePayload: grantFeasibilityBuildExecutePayload,
  buildReport: buildGrantFeasibilityReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

// ── Wave 3 — Operations & Quality Loss ──────────────────────────────

const DOWNTIME_SCRAP_DEFINITION: ProV2ToolDefinition = {
  slug: "downtime-scrap-loss-statement",
  title: "Downtime & Scrap Loss Statement",
  category: "Operations & Quality Loss",
  fieldContract: DOWNTIME_SCRAP_GROUPS,
  presets: DOWNTIME_SCRAP_PRESETS,
  serverContract: {
    toolKey: "downtime-scrap-loss-statement",
    toolId: "PRO_027",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_downtime_hours","n_hourly_contribution_rate","n_annual_event_frequency",
      "n_scrap_quantity","n_material_cost_per_unit",
      "n_rework_hours","n_rework_labor_rate",
      "n_disposal_inspection_cost",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_downtime_hours","out_lost_productive_hours","out_lost_units",
      "out_lost_contribution","out_labor_idle_cost","out_scrap_material_cost",
      "out_rework_cost","out_disposal_inspection_cost","out_total_event_loss",
      "out_annualized_loss","out_primary_loss_driver","out_recovery_priority",
      "out_final_decision_state",
    ],
  },
  buildExecutePayload: downtimeScrapBuildExecutePayload,
  buildReport: buildDowntimeScrapReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const OEE_MONETIZATION_DEFINITION: ProV2ToolDefinition = {
  slug: "oee-loss-monetization-improvement-business-case",
  title: "OEE Loss Monetization & Improvement Business Case",
  category: "Operations & Quality Loss",
  fieldContract: OEE_GROUPS,
  presets: OEE_PRESETS,
  serverContract: {
    toolKey: "oee-loss-monetization-improvement-business-case",
    toolId: "PRO_028",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_planned_production_time_seconds","n_operating_time_seconds","n_net_operating_time_seconds",
      "n_ideal_cycle_time_per_part","n_total_parts_produced","n_good_parts",
      "n_hourly_contribution","n_improvement_investment","n_operating_hours_per_year",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_availability_pct","out_performance_pct","out_quality_pct","out_oee_pct",
      "out_availability_loss_hours","out_performance_loss_hours","out_quality_loss_hours",
      "out_lost_productive_hours","out_lost_good_units",
      "out_availability_loss_amount","out_performance_loss_amount","out_quality_loss_amount",
      "out_total_annual_opportunity","out_largest_oee_loss_driver","out_improvement_roi",
      "out_final_decision_state",
    ],
  },
  buildExecutePayload: oeeBuildExecutePayload,
  buildReport: buildOeeReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const SCRAP_REWORK_DEFINITION: ProV2ToolDefinition = {
  slug: "scrap-rework-cost-tracker",
  title: "Scrap & Rework Cost Tracker",
  category: "Operations & Quality Loss",
  fieldContract: SCRAP_REWORK_GROUPS,
  presets: SCRAP_REWORK_PRESETS,
  serverContract: {
    toolKey: "scrap-rework-cost-tracker",
    toolId: "PRO_029",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_total_produced","n_scrap_quantity","n_rework_quantity","n_monthly_volume",
      "n_unit_material_cost","n_unit_labor_cost",
      "n_rework_labor_rate","n_rework_time_per_unit","n_defect_rate_target_pct",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_scrap_quantity","out_scrap_rate_pct","out_material_loss",
      "out_machine_loss","out_labor_loss","out_rework_cost",
      "out_inspection_cost","out_disposal_cost","out_replacement_production_cost",
      "out_total_loss","out_annualized_loss","out_cost_per_rejected_unit",
      "out_primary_defect_cost_driver","out_final_decision_state",
    ],
  },
  buildExecutePayload: scrapReworkBuildExecutePayload,
  buildReport: buildScrapReworkReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const SMED_DEFINITION: ProV2ToolDefinition = {
  slug: "setup-time-reduction-roi-smed",
  title: "Setup Time Reduction ROI (SMED)",
  category: "Operations & Quality Loss",
  fieldContract: SMED_GROUPS,
  presets: SMED_PRESETS,
  serverContract: {
    toolKey: "setup-time-reduction-roi-smed",
    toolId: "PRO_034",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_current_setup_time_minutes","n_future_setup_time_minutes",
      "n_setups_per_year","n_machine_hourly_rate","n_labor_rate_per_hour","n_operator_count",
      "n_implementation_cost",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_current_setup_time","out_future_setup_time","out_time_saved_per_setup",
      "out_annual_setups","out_annual_hours_recovered","out_labor_saving",
      "out_machine_capacity_value","out_annual_financial_benefit",
      "out_implementation_cost","out_payback_months","out_roi_percent",
      "out_final_decision_state",
    ],
  },
  buildExecutePayload: smedBuildExecutePayload,
  buildReport: buildSmedReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

const OUTSOURCE_VS_IN_HOUSE_DEFINITION: ProV2ToolDefinition = {
  slug: "outsource-vs-in-house-analyzer",
  title: "Outsource vs In-House Analyzer",
  category: "Operations & Quality Loss",
  fieldContract: OUTSOURCE_GROUPS,
  presets: OUTSOURCE_PRESETS,
  serverContract: {
    toolKey: "outsource-vs-in-house-analyzer",
    toolId: "PRO_035",
    schemaVersion: "5.3.1",
    requiredInputKeys: [
      "n_in_house_material_cost_per_unit","n_in_house_labor_cost_per_unit",
      "n_in_house_overhead_per_unit","n_in_house_setup_cost_per_batch",
      "n_outsource_unit_price","n_outsource_logistics_per_unit",
      "n_quality_defect_allowance_pct","n_inventory_lead_time_cost_pct",
      "n_capacity_opportunity_cost_pct","n_annual_volume",
    ],
    optionalInputKeys: [],
    expectedOutputKeys: [
      "out_in_house_variable_cost","out_in_house_allocated_fixed","out_in_house_total_cost",
      "out_supplier_unit_price","out_logistics_import_cost","out_quality_defect_allowance",
      "out_inventory_lead_time_cost","out_capacity_opportunity_cost",
      "out_outsource_total_landed_cost","out_cost_difference","out_break_even_volume",
      "out_make_buy_decision","out_primary_decision_driver","out_final_decision_state",
    ],
  },
  buildExecutePayload: outsourceBuildExecutePayload,
  buildReport: buildOutsourceReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

// ── Deterministic exported map ──────────────────────────────────────────
// Direct access — no side effects, immune to tree-shaking or init order.

export const PRO_V2_TOOL_DEFINITIONS: Record<string, ProV2ToolDefinition> = {
  "weld-procedure-cost-consumable-estimation-suite": WELD_DEFINITION,
  "machine-hourly-rate-proof-report": MACHINE_RATE_DEFINITION,
  "job-quote-builder-pro-pack": JOB_QUOTE_DEFINITION,
  "loss-making-job-detector": LOSS_DETECTOR_DEFINITION,
  "break-even-survival-cash-calculator": BREAK_EVEN_DEFINITION,
  "true-employee-cost-statement": EMPLOYEE_COST_DEFINITION,
  "product-sku-margin-ranker": SKU_MARGIN_RANKER_DEFINITION,
  "customer-sku-profitability-forensics": CUSTOMER_SKU_FORENSICS_DEFINITION,
  "receivables-cost-payment-term-addendum": RECEIVABLES_ADDENDUM_DEFINITION,
  "fx-commodity-pass-through-pricer": FX_COMMODITY_PRICER_DEFINITION,
  "plant-wide-shop-rate-cost-structure-audit": PLANT_WIDE_SHOP_RATE_DEFINITION,

  // ── Wave 4 — Capital Investment & Energy ──────────────────────────────
  "capital-equipment-investment-appraisal-npv-irr": NPV_IRR_DEFINITION,
  "machine-investment-feasibility-buy-lease-keep": BUY_LEASE_KEEP_DEFINITION,
  "motor-compressor-replacement-roi": MOTOR_ROI_DEFINITION,
  "energy-efficiency-grant-incentive-feasibility-pack": GRANT_FEASIBILITY_DEFINITION,

  // ── Wave 3 — Operations & Quality Loss ──────────────────────────────
  "downtime-scrap-loss-statement": DOWNTIME_SCRAP_DEFINITION,
  "oee-loss-monetization-improvement-business-case": OEE_MONETIZATION_DEFINITION,
  "scrap-rework-cost-tracker": SCRAP_REWORK_DEFINITION,
  "setup-time-reduction-roi-smed": SMED_DEFINITION,
  "outsource-vs-in-house-analyzer": OUTSOURCE_VS_IN_HOUSE_DEFINITION,
};

// Make definitions available to proToolRegistry for fallback lookup
setStaticDefinitions(PRO_V2_TOOL_DEFINITIONS);

// ── Initialize the Map registry ─────────────────────────────────────────
// Populates the backward-compatible Map used by getToolDefinition().
// Safe to call multiple times — guarded by initialized flag.

let initialized = false;

export function initProV2Registry(): void {
  if (initialized) return;
  initialized = true;
  registerTool(WELD_DEFINITION);
  registerTool(MACHINE_RATE_DEFINITION);
  registerTool(JOB_QUOTE_DEFINITION);
  registerTool(LOSS_DETECTOR_DEFINITION);
  registerTool(BREAK_EVEN_DEFINITION);
  registerTool(EMPLOYEE_COST_DEFINITION);
  registerTool(SKU_MARGIN_RANKER_DEFINITION);
  registerTool(CUSTOMER_SKU_FORENSICS_DEFINITION);
  registerTool(RECEIVABLES_ADDENDUM_DEFINITION);
  registerTool(FX_COMMODITY_PRICER_DEFINITION);
  registerTool(PLANT_WIDE_SHOP_RATE_DEFINITION);
  registerTool(NPV_IRR_DEFINITION);
  registerTool(BUY_LEASE_KEEP_DEFINITION);
  registerTool(MOTOR_ROI_DEFINITION);
  registerTool(GRANT_FEASIBILITY_DEFINITION);
  registerTool(DOWNTIME_SCRAP_DEFINITION);
  registerTool(OEE_MONETIZATION_DEFINITION);
  registerTool(SCRAP_REWORK_DEFINITION);
  registerTool(SMED_DEFINITION);
  registerTool(OUTSOURCE_VS_IN_HOUSE_DEFINITION);
}

// ── Re-export backward-compatible accessors ─────────────────────────────

import { getToolDefinition, getRegisteredSlugs, getAllToolDefinitions, getDefinitionCount } from "./proToolRegistry";
export { getToolDefinition, getRegisteredSlugs, getAllToolDefinitions, getDefinitionCount };
