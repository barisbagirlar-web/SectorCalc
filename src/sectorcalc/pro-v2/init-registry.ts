// SectorCalc PRO V2 — Registry Initialization
// Source of truth for all PRO V2 tool definitions.
// Uses a deterministic exported Record (not a side-effect map).
// Calls registerTool() during init to populate the backward-compatible Map.

import type { ProV2ToolDefinition } from "./proToolRegistry";
import { registerTool } from "./proToolRegistry";

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

// ── Deterministic exported map ──────────────────────────────────────────
// Direct access — no side effects, immune to tree-shaking or init order.

export const PRO_V2_TOOL_DEFINITIONS: Record<string, ProV2ToolDefinition> = {
  "weld-procedure-cost-consumable-estimation-suite": WELD_DEFINITION,
  "machine-hourly-rate-proof-report": MACHINE_RATE_DEFINITION,
};

// ── Initialize the Map registry ─────────────────────────────────────────
// Populates the backward-compatible Map used by getToolDefinition().
// Safe to call multiple times — guarded by initialized flag.
// All definitions are already resolved statically, no dependency on
// external registration modules.

let initialized = false;

export function initProV2Registry(): void {
  if (initialized) return;
  initialized = true;
  registerTool(WELD_DEFINITION);
  registerTool(MACHINE_RATE_DEFINITION);
}

// ── Re-export backward-compatible accessors ─────────────────────────────

import { getToolDefinition, getRegisteredSlugs, getAllToolDefinitions, getDefinitionCount } from "./proToolRegistry";
export { getToolDefinition, getRegisteredSlugs, getAllToolDefinitions, getDefinitionCount };
