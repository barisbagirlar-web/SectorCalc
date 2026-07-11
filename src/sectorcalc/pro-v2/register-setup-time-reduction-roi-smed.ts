// SectorCalc PRO V2 — Setup Time Reduction ROI (SMED) Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { SMED_GROUPS } from "./contracts/setup-time-reduction-roi-smed.contract";
import { SMED_PRESETS } from "./presets/setup-time-reduction-roi-smed.presets";
import { smedBuildExecutePayload } from "./adapters/setup-time-reduction-roi-smed.adapter";
import { buildSmedReport } from "./insights/setup-time-reduction-roi-smed.insight";

const SMED_SLUG = "setup-time-reduction-roi-smed";

export function registerSmedTool(): void {
  registerTool({
    slug: SMED_SLUG,
    title: "Setup Time Reduction ROI (SMED)",
    category: "Operations Loss Analysis",

    fieldContract: SMED_GROUPS,
    presets: SMED_PRESETS,

    serverContract: {
      toolKey: SMED_SLUG,
      toolId: "PRO_038",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_current_setup_time_minutes",
        "n_future_setup_time_minutes",
        "n_setups_per_year",
        "n_machine_hourly_rate",
        "n_labor_rate_per_hour",
        "n_implementation_cost",
        "n_operator_count",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_current_setup_time",
        "out_future_setup_time",
        "out_time_saved_per_setup",
        "out_annual_setups",
        "out_annual_hours_recovered",
        "out_labor_saving",
        "out_machine_capacity_value",
        "out_annual_financial_benefit",
        "out_implementation_cost",
        "out_payback_months",
        "out_roi_percent",
        "out_final_decision_state",
      ],
    },

    buildExecutePayload: smedBuildExecutePayload,
    buildReport: buildSmedReport,

    reportCapabilities: {
      primaryKpis: true,
      decisionState: true,
      executiveInterpretation: true,
      breakdown: true,
      scenarioComparison: false,
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
