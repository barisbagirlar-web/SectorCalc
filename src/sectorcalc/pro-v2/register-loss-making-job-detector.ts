// SectorCalc PRO V2 — Loss Making Job Detector Tool Registration

import { registerTool } from "./proToolRegistry";
import { LOSS_DETECTOR_GROUPS } from "./contracts/loss-making-job-detector.contract";
import { LOSS_DETECTOR_PRESETS } from "./presets/loss-making-job-detector.presets";
import { lossDetectorBuildExecutePayload } from "./adapters/loss-making-job-detector.adapter";
import { buildLossDetectorReport } from "./insights/loss-making-job-detector.insight";

export function registerLossMakingJobDetectorTool(): void {
  registerTool({
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
        "n_batch_quantity",
        "n_selling_price_per_unit",
        "n_material_cost_per_unit",
        "n_cycle_time_seconds_per_unit",
        "n_setup_time_minutes_per_batch",
        "n_machine_rate_per_hour",
        "n_operator_count",
        "n_labor_rate_per_hour",
        "n_allocated_overhead",
        "n_scrap_rework_percent",
        "n_target_revenue_margin_percent",
        "n_annual_volume_units",
      ],
      optionalInputKeys: [
        "n_external_processing_per_batch",
        "n_packaging_freight_per_batch",
        "n_other_job_cost_per_batch",
      ],
      expectedOutputKeys: [
        "out_job_revenue",
        "out_direct_material_cost",
        "out_machine_cost",
        "out_labor_cost",
        "out_external_processing_cost",
        "out_packaging_freight_cost",
        "out_other_job_cost",
        "out_allocated_overhead",
        "out_scrap_rework_cost",
        "out_fully_loaded_job_cost",
        "out_contribution_profit",
        "out_operating_profit",
        "out_revenue_margin_percent",
        "out_profit_loss_per_unit",
        "out_minimum_sustainable_price",
        "out_target_price",
        "out_repricing_gap",
        "out_break_even_quantity",
        "out_annualized_money_at_risk",
        "out_primary_loss_driver",
        "out_final_decision_state",
      ],
    },
    buildExecutePayload: lossDetectorBuildExecutePayload,
    buildReport: buildLossDetectorReport,
    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
