// SectorCalc PRO V2 — Break-Even Survival Cash Tool Registration

import { registerTool } from "./proToolRegistry";
import { BREAK_EVEN_GROUPS } from "./contracts/break-even-survival-cash-calculator.contract";
import { BREAK_EVEN_PRESETS } from "./presets/break-even-survival-cash-calculator.presets";
import { breakEvenBuildExecutePayload } from "./adapters/break-even-survival-cash-calculator.adapter";
import { buildBreakEvenReport } from "./insights/break-even-survival-cash-calculator.insight";

export function registerBreakEvenTool(): void {
  registerTool({
    slug: "break-even-survival-cash-calculator",
    title: "Break-Even Survival Cash Calculator",
    category: "Financial Planning",
    fieldContract: BREAK_EVEN_GROUPS,
    presets: BREAK_EVEN_PRESETS,
    serverContract: {
      toolKey: "break-even-survival-cash-calculator",
      toolId: "PRO_020",
      schemaVersion: "5.3.1",
      requiredInputKeys: ["n_initial_investment","n_annual_net_cash_flow","n_discount_rate","n_analysis_years","n_residual_value","n_stress_downside_factor","n_annual_volume","n_labor_rate","n_overhead_rate","n_defect_or_loss_cost","n_source_confidence_ratio"],
      optionalInputKeys: [],
      expectedOutputKeys: ["out_evidence_completeness","out_normalized_demand","out_reference_deviation","out_derating_factor","out_demand_metric","out_capacity_metric","out_utilization_margin","out_expanded_uncertainty","out_threshold_crossing","out_sensitivity_driver","out_fmea_trigger","out_money_at_risk","out_scenario_delta","out_audit_hash_payload","out_final_decision_state"],
    },
    buildExecutePayload: breakEvenBuildExecutePayload,
    buildReport: buildBreakEvenReport,
    reportCapabilities: { primaryKpis:true, decisionState:true, executiveInterpretation:true, breakdown:false, scenarioComparison:false, sensitivity:true, hiddenLosses:true, missedAssumptions:true, riskWarnings:true, checklist:true, recommendations:true, pdfExport:true },
  });
}
