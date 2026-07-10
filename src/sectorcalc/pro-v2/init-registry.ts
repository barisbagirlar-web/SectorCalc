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
// PENDING: contracts/adapters/insights/presets need to be created

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
      "out_weld_mass_kg","out_deposited_mass_kg","out_number_of_passes",
      "out_wire_mass_kg","out_wire_cost","out_gas_cost",
      "out_arc_time_seconds","out_total_job_time_seconds",
      "out_labor_cost","out_shop_overhead_cost","out_total_base_cost",
      "out_contingency_amount","out_total_cost_floor",
      "out_margin_amount","out_margin_percent",
      "out_cost_per_meter","out_cost_per_meter_floor",
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
    requiredInputKeys: ["n_unit_price","n_unit_variable_cost","n_annual_volume","n_logistics_cost_pct","n_service_cost_pct","n_return_rate_pct","n_target_margin","n_financing_cost_pct"],
    optionalInputKeys: [],
    expectedOutputKeys: ["out_customer_sku_revenue","out_product_cost","out_logistics_cost","out_service_cost","out_returns_claims_cost","out_financing_term_cost","out_contribution_profit","out_fully_loaded_profit","out_margin_percentage","out_cross_subsidization_flag","out_annual_money_at_risk","out_final_decision_state"],
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
    requiredInputKeys: ["n_base_price","n_fx_rate_spot","n_fx_rate_budget","n_commodity_index_current","n_commodity_index_budget","n_material_cost_pct","n_fx_hedge_pct","n_commodity_hedge_pct","n_annual_volume","n_target_margin_percent"],
    optionalInputKeys: [],
    expectedOutputKeys: ["out_baseline_cost","out_fx_change_percent","out_commodity_change_percent","out_weighted_cost_change_pct","out_deadband_threshold_pct","out_pass_through_amount","out_revised_price","out_protected_margin","out_unprotected_exposure","out_annual_escalation","out_price_review_trigger","out_final_decision_state"],
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
    requiredInputKeys: ["n_total_annual_cost","n_total_productive_hours","n_machine_group_cost","n_machine_group_hours","n_overhead_pool","n_overhead_allocation_base","n_current_shop_rate","n_target_margin_pct","n_utilization_pct","n_labor_burden","n_facility_burden","n_maintenance_burden","n_energy_burden"],
    optionalInputKeys: [],
    expectedOutputKeys: ["out_annual_direct_cost","out_annual_indirect_cost","out_productive_hours","out_fixed_cost_per_hour","out_labor_burden_per_hour","out_facility_burden_per_hour","out_maintenance_burden_per_hour","out_energy_burden_per_hour","out_plant_wide_shop_rate","out_current_rate_gap","out_annual_under_recovery","out_primary_cost_pool","out_final_decision_state"],
  },
  buildExecutePayload: plantWideShopRateBuildExecutePayload,
  buildReport: buildPlantWideShopRateReport,
  reportCapabilities: { primaryKpis:true,decisionState:true,executiveInterpretation:true,breakdown:true,scenarioComparison:false,sensitivity:true,hiddenLosses:true,missedAssumptions:true,riskWarnings:true,checklist:true,recommendations:true,pdfExport:true },
};

// ── Wave 4 — Capital Investment & Energy ──────────────────────────────
// PENDING: contracts/adapters/insights/presets need to be created (PRO_030–PRO_033)

// ── Wave 3 — Operations & Quality Loss ──────────────────────────────
// PENDING: contracts/adapters/insights/presets need to be created (PRO_026, PRO_019, PRO_039, PRO_038, PRO_033)

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
}

// ── Re-export backward-compatible accessors ─────────────────────────────

import { getToolDefinition, getRegisteredSlugs, getAllToolDefinitions, getDefinitionCount } from "./proToolRegistry";
export { getToolDefinition, getRegisteredSlugs, getAllToolDefinitions, getDefinitionCount };
