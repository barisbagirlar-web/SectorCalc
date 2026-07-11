// SectorCalc PRO V2 — Scrap & Rework Cost Tracker Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { SCRAP_REWORK_GROUPS } from "./contracts/scrap-rework-cost-tracker.contract";
import { SCRAP_REWORK_PRESETS } from "./presets/scrap-rework-cost-tracker.presets";
import { scrapReworkBuildExecutePayload } from "./adapters/scrap-rework-cost-tracker.adapter";
import { buildScrapReworkReport } from "./insights/scrap-rework-cost-tracker.insight";

const SCRAP_REWORK_SLUG = "scrap-rework-cost-tracker";

export function registerScrapReworkTool(): void {
  registerTool({
    slug: SCRAP_REWORK_SLUG,
    title: "Scrap & Rework Cost Tracker",
    category: "Operations Loss Analysis",

    fieldContract: SCRAP_REWORK_GROUPS,
    presets: SCRAP_REWORK_PRESETS,

    serverContract: {
      toolKey: SCRAP_REWORK_SLUG,
      toolId: "PRO_039",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_total_produced",
        "n_scrap_quantity",
        "n_rework_quantity",
        "n_unit_material_cost",
        "n_unit_labor_cost",
        "n_rework_labor_rate",
        "n_rework_time_per_unit",
        "n_defect_rate_target_pct",
        "n_monthly_volume",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_scrap_quantity",
        "out_scrap_rate_pct",
        "out_material_loss",
        "out_machine_loss",
        "out_labor_loss",
        "out_rework_cost",
        "out_inspection_cost",
        "out_disposal_cost",
        "out_replacement_production_cost",
        "out_total_loss",
        "out_annualized_loss",
        "out_cost_per_rejected_unit",
        "out_primary_defect_cost_driver",
        "out_final_decision_state",
      ],
    },

    buildExecutePayload: scrapReworkBuildExecutePayload,
    buildReport: buildScrapReworkReport,

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
