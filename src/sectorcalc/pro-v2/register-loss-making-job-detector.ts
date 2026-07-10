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
      requiredInputKeys: ["n_machine_rate","n_material_cost","n_labor_rate","n_overhead_rate","n_defect_or_loss_cost","n_target_margin","n_batch_quantity","n_annual_volume","n_source_confidence_ratio"],
      optionalInputKeys: [],
      expectedOutputKeys: ["out_evidence_completeness","out_normalized_demand","out_demand_metric","out_capacity_metric","out_utilization_margin","out_money_at_risk","out_threshold_crossing","out_fmea_trigger","out_final_decision_state"],
    },
    buildExecutePayload: lossDetectorBuildExecutePayload,
    buildReport: buildLossDetectorReport,
    reportCapabilities: { primaryKpis:true, decisionState:true, executiveInterpretation:true, breakdown:true, scenarioComparison:false, sensitivity:true, hiddenLosses:true, missedAssumptions:true, riskWarnings:true, checklist:true, recommendations:true, pdfExport:true },
  });
}
