// SectorCalc PRO V2 — Machine Hourly Rate Proof Report Tool Registration
// Complete registration matching the approved 23-input, 34-output server contract.

import { registerTool } from "./proToolRegistry";
import { MACHINE_RATE_GROUPS } from "./contracts/machine-hourly-rate-proof-report.contract";
import { MACHINE_RATE_PRESETS } from "./presets/machine-hourly-rate-proof-report.presets";
import { machineRateBuildExecutePayload } from "./adapters/machine-hourly-rate-proof-report.adapter";
import { buildMachineRateReport } from "./insights/machine-hourly-rate-proof-report.insight";

const SLUG = "machine-hourly-rate-proof-report";

const REQUIRED_INPUTS = [
  "n_planned_operating_hours", "n_utilization_percent", "n_planned_downtime_percent",
  "n_purchase_price", "n_residual_value", "n_economic_life_years",
  "n_maintenance_cost", "n_insurance_tax_cost",
  "n_facility_allocation", "n_machine_power_kw", "n_electricity_price",
  "n_consumables_cost_per_hour", "n_tooling_cost_per_hour",
  "n_operator_count", "n_labor_rate_per_hour",
  "n_current_shop_rate", "n_target_margin_percent",
];

const OPTIONAL_INPUTS = [
  "n_financing_cost_percent", "n_other_annual_fixed_cost",
  "n_annual_production_volume", "n_cycle_time_seconds",
  "n_setup_time_minutes", "n_average_batch_quantity",
];

const EXPECTED_OUTPUTS = [
  "out_scheduled_hours_per_year", "out_available_hours_per_year", "out_productive_hours_per_year",
  "out_annual_depreciation_cost", "out_annual_financing_cost", "out_annual_fixed_cost",
  "out_depreciation_cost_per_hour", "out_maintenance_cost_per_hour",
  "out_insurance_tax_cost_per_hour", "out_facility_cost_per_hour",
  "out_financing_cost_per_hour", "out_other_fixed_cost_per_hour",
  "out_fixed_cost_per_productive_hour",
  "out_energy_cost_per_hour", "out_labor_cost_per_hour",
  "out_consumables_cost_per_hour", "out_tooling_cost_per_hour",
  "out_variable_cost_per_hour", "out_total_cost_per_hour",
  "out_minimum_sustainable_rate", "out_target_sell_rate",
  "out_current_rate_gap", "out_annual_under_recovery_or_surplus",
  "out_break_even_contribution_per_hour", "out_utilization_breakeven_percent",
  "out_break_even_status", "out_primary_cost_driver", "out_final_decision_state",
  "out_setup_count_per_year", "out_required_machine_hours",
  "out_capacity_requirement_percent", "out_cost_per_part",
  "out_target_sell_price_per_part", "out_production_scenario_state",
];

export function registerMachineHourlyRateTool(): void {
  registerTool({
    slug: SLUG,
    title: "Machine Hourly Rate Proof Report",
    category: "Workshop Costing",
    fieldContract: MACHINE_RATE_GROUPS,
    presets: MACHINE_RATE_PRESETS,
    serverContract: {
      toolKey: SLUG,
      toolId: "PRO_017",
      schemaVersion: "5.3.1-pro-schema.1",
      requiredInputKeys: REQUIRED_INPUTS,
      optionalInputKeys: OPTIONAL_INPUTS,
      expectedOutputKeys: EXPECTED_OUTPUTS,
    },
    buildExecutePayload: machineRateBuildExecutePayload,
    buildReport: buildMachineRateReport,
    reportCapabilities: {
      primaryKpis: true,
      decisionState: true,
      executiveInterpretation: true,
      breakdown: true,
      scenarioComparison: true,
      sensitivity: true,
      hiddenLosses: true,
      missedAssumptions: true,
      riskWarnings: true,
      checklist: true,
      recommendations: true,
      pdfExport: true,
    },
  });
}
