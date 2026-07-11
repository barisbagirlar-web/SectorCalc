// SectorCalc PRO V2 — Downtime & Scrap Loss Statement Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { DOWNTIME_SCRAP_GROUPS } from "./contracts/downtime-scrap-loss-statement.contract";
import { DOWNTIME_SCRAP_PRESETS } from "./presets/downtime-scrap-loss-statement.presets";
import { downtimeScrapBuildExecutePayload } from "./adapters/downtime-scrap-loss-statement.adapter";
import { buildDowntimeScrapReport } from "./insights/downtime-scrap-loss-statement.insight";

const DOWNTIME_SCRAP_SLUG = "downtime-scrap-loss-statement";

export function registerDowntimeScrapTool(): void {
  registerTool({
    slug: DOWNTIME_SCRAP_SLUG,
    title: "Downtime & Scrap Loss Statement",
    category: "Operations Loss Analysis",

    fieldContract: DOWNTIME_SCRAP_GROUPS,
    presets: DOWNTIME_SCRAP_PRESETS,

    serverContract: {
      toolKey: DOWNTIME_SCRAP_SLUG,
      toolId: "PRO_026",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_downtime_hours",
        "n_hourly_contribution_rate",
        "n_scrap_quantity",
        "n_material_cost_per_unit",
        "n_rework_hours",
        "n_rework_labor_rate",
        "n_disposal_inspection_cost",
        "n_annual_event_frequency",
      ],
      optionalInputKeys: ["source_confidence"],
      expectedOutputKeys: [
        "out_downtime_hours",
        "out_lost_productive_hours",
        "out_lost_units",
        "out_lost_contribution",
        "out_labor_idle_cost",
        "out_scrap_material_cost",
        "out_rework_cost",
        "out_disposal_inspection_cost",
        "out_total_event_loss",
        "out_annualized_loss",
        "out_primary_loss_driver",
        "out_recovery_priority",
        "out_final_decision_state",
      ],
    },

    buildExecutePayload: downtimeScrapBuildExecutePayload,
    buildReport: buildDowntimeScrapReport,

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
