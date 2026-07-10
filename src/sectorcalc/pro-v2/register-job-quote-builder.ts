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
    category: "Workshop Pricing",
    fieldContract: QUOTE_BUILDER_GROUPS,
    presets: QUOTE_BUILDER_PRESETS,
    serverContract: {
      toolKey: "job-quote-builder-pro-pack",
      toolId: "PRO_024",
      schemaVersion: "5.3.1-pro-schema.1",
      requiredInputKeys: [
        "n_batch_quantity","n_material_cost_per_unit","n_cycle_time_seconds_per_unit",
        "n_setup_time_minutes_per_batch","n_machine_rate_per_hour","n_labor_rate_per_hour",
        "n_operator_count","n_annual_unallocated_overhead","n_annual_volume_units",
        "n_scrap_rework_percent","n_target_revenue_margin_percent",
      ],
      optionalInputKeys: [
        "n_tooling_consumables_cost_per_batch","n_external_processing_cost_per_batch",
        "n_packaging_cost_per_batch","n_freight_cost_per_batch","n_other_job_cost_per_batch",
        "n_contingency_percent","n_current_quote_per_unit",
      ],
      expectedOutputKeys: [
        "out_run_machine_hours","out_setup_hours","out_total_machine_hours",
        "out_labor_hours_per_batch","out_material_cost_before_scrap",
        "out_machine_cost_per_batch","out_labor_cost_per_batch","out_overhead_cost_per_batch",
        "out_tooling_consumables_cost_per_batch","out_external_processing_cost_per_batch",
        "out_packaging_cost_per_batch","out_freight_cost_per_batch","out_other_job_cost_per_batch",
        "out_direct_cost_before_scrap","out_scrap_rework_allowance","out_contingency_allowance",
        "out_total_job_cost_per_batch","out_cost_per_good_unit",
        "out_target_sell_price_per_batch","out_target_sell_price_per_unit",
        "out_profit_per_batch","out_profit_per_unit",
        "out_annual_batches","out_annual_revenue_at_target","out_annual_profit_at_target",
        "out_primary_cost_driver","out_final_decision_state",
        "out_current_quote_per_batch","out_current_profit_per_batch","out_achieved_margin_percent",
        "out_price_gap_per_unit","out_annual_underpricing_risk",
        "out_break_even_batch_quantity","out_break_even_status",
      ],
    },
    buildExecutePayload: quoteBuilderBuildExecutePayload,
    buildReport: buildQuoteBuilderReport,
    reportCapabilities: { primaryKpis:true, decisionState:true, executiveInterpretation:true, breakdown:true, scenarioComparison:true, sensitivity:true, hiddenLosses:true, missedAssumptions:true, riskWarnings:true, checklist:true, recommendations:true, pdfExport:true },
  });
}
