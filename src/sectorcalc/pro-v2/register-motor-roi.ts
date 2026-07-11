// SectorCalc PRO V2 — Motor/Compressor Replacement ROI Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { MOTOR_ROI_GROUPS } from "./contracts/motor-compressor-replacement-roi.contract";
import { MOTOR_ROI_PRESETS } from "./presets/motor-compressor-replacement-roi.presets";
import { motorRoiBuildExecutePayload } from "./adapters/motor-compressor-replacement-roi.adapter";
import { buildMotorRoiReport } from "./insights/motor-compressor-replacement-roi.insight";

const SLUG = "motor-compressor-replacement-roi";

export function registerMotorRoiTool(): void {
  registerTool({
    slug: SLUG,
    title: "Motor / Compressor Replacement ROI",
    category: "Energy Efficiency",

    fieldContract: MOTOR_ROI_GROUPS,
    presets: MOTOR_ROI_PRESETS,

    serverContract: {
      toolKey: SLUG,
      toolId: "PRO_032",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_current_power_kw", "n_proposed_power_kw",
        "n_annual_operating_hours", "n_energy_price_per_kwh",
        "n_current_maintenance_cost", "n_proposed_maintenance_cost",
        "n_replacement_cost", "n_useful_life_years", "n_discount_rate",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_baseline_energy_kwh", "out_baseline_energy_cost",
        "out_proposed_energy_kwh", "out_proposed_energy_cost",
        "out_annual_energy_saving", "out_maintenance_saving",
        "out_annual_financial_saving", "out_replacement_cost",
        "out_simple_payback_years", "out_roi_percent",
        "out_npv", "out_energy_price_sensitivity",
        "out_primary_saving_driver", "out_final_decision_state",
      ],
    },

    buildExecutePayload: motorRoiBuildExecutePayload,
    buildReport: buildMotorRoiReport,

    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
