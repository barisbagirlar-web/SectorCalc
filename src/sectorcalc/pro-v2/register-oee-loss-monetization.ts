// SectorCalc PRO V2 — OEE Loss Monetization & Improvement Business Case Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { OEE_GROUPS } from "./contracts/oee-loss-monetization-improvement-business-case.contract";
import { OEE_PRESETS } from "./presets/oee-loss-monetization-improvement-business-case.presets";
import { oeeBuildExecutePayload } from "./adapters/oee-loss-monetization-improvement-business-case.adapter";
import { buildOeeReport } from "./insights/oee-loss-monetization-improvement-business-case.insight";

const OEE_SLUG = "oee-loss-monetization-improvement-business-case";

export function registerOeeTool(): void {
  registerTool({
    slug: OEE_SLUG,
    title: "OEE Loss Monetization & Improvement Business Case",
    category: "Operations Loss Analysis",

    fieldContract: OEE_GROUPS,
    presets: OEE_PRESETS,

    serverContract: {
      toolKey: OEE_SLUG,
      toolId: "PRO_019",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_planned_production_time_seconds",
        "n_operating_time_seconds",
        "n_net_operating_time_seconds",
        "n_ideal_cycle_time_per_part",
        "n_total_parts_produced",
        "n_good_parts",
        "n_hourly_contribution",
        "n_improvement_investment",
        "n_operating_hours_per_year",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_availability_pct",
        "out_performance_pct",
        "out_quality_pct",
        "out_oee_pct",
        "out_availability_loss_hours",
        "out_performance_loss_hours",
        "out_quality_loss_hours",
        "out_lost_productive_hours",
        "out_lost_good_units",
        "out_availability_loss_amount",
        "out_performance_loss_amount",
        "out_quality_loss_amount",
        "out_total_annual_opportunity",
        "out_largest_oee_loss_driver",
        "out_improvement_roi",
        "out_final_decision_state",
      ],
    },

    buildExecutePayload: oeeBuildExecutePayload,
    buildReport: buildOeeReport,

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
