// SectorCalc PRO V2 — Job Quote Builder Tool Registration

import { registerTool } from "./proToolRegistry";
import { QUOTE_BUILDER_GROUPS } from "./contracts/job-quote-builder-pro-pack.contract";
import { QUOTE_BUILDER_PRESETS } from "./presets/job-quote-builder-pro-pack.presets";
import { quoteBuilderBuildExecutePayload } from "./adapters/job-quote-builder-pro-pack.adapter";
import { buildQuoteBuilderReport } from "./insights/job-quote-builder-pro-pack.insight";

export function registerJobQuoteBuilderTool(): void {
  registerTool({
    slug: "job-quote-builder-pro-pack",
    title: "Job Quote Builder Pro Pack",
    category: "Workshop Costing",
    fieldContract: QUOTE_BUILDER_GROUPS,
    presets: QUOTE_BUILDER_PRESETS,
    serverContract: {
      toolKey: "job-quote-builder-pro-pack",
      toolId: "PRO_018",
      schemaVersion: "5.3.1",
      requiredInputKeys: ["n_machine_rate","n_cycle_time","n_setup_time","n_batch_quantity","n_material_cost","n_target_margin","n_annual_volume","n_labor_rate","n_overhead_rate","n_defect_or_loss_cost","n_uncertainty_multiplier","n_source_confidence_ratio"],
      optionalInputKeys: [],
      expectedOutputKeys: ["out_evidence_completeness","out_normalized_demand","out_demand_metric","out_capacity_metric","out_utilization_margin","out_money_at_risk","out_threshold_crossing","out_fmea_trigger","out_final_decision_state"],
    },
    buildExecutePayload: quoteBuilderBuildExecutePayload,
    buildReport: buildQuoteBuilderReport,
    reportCapabilities: { primaryKpis:true, decisionState:true, executiveInterpretation:true, breakdown:true, scenarioComparison:false, sensitivity:true, hiddenLosses:true, missedAssumptions:true, riskWarnings:true, checklist:true, recommendations:true, pdfExport:true },
  });
}
