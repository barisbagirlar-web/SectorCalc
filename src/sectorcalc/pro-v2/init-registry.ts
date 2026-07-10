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

// ── Deterministic exported map ──────────────────────────────────────────
// Direct access — no side effects, immune to tree-shaking or init order.

export const PRO_V2_TOOL_DEFINITIONS: Record<string, ProV2ToolDefinition> = {
  "weld-procedure-cost-consumable-estimation-suite": WELD_DEFINITION,
  "machine-hourly-rate-proof-report": MACHINE_RATE_DEFINITION,
  "job-quote-builder-pro-pack": JOB_QUOTE_DEFINITION,
  "loss-making-job-detector": LOSS_DETECTOR_DEFINITION,
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
}

// ── Re-export backward-compatible accessors ─────────────────────────────

import { getToolDefinition, getRegisteredSlugs, getAllToolDefinitions, getDefinitionCount } from "./proToolRegistry";
export { getToolDefinition, getRegisteredSlugs, getAllToolDefinitions, getDefinitionCount };
