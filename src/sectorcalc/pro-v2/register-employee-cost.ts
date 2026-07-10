// SectorCalc PRO V2 — True Employee Cost Statement Tool Registration

import { registerTool } from "./proToolRegistry";
import { EMPLOYEE_COST_GROUPS } from "./contracts/true-employee-cost-statement.contract";
import { EMPLOYEE_COST_PRESETS } from "./presets/true-employee-cost-statement.presets";
import { employeeCostBuildExecutePayload } from "./adapters/true-employee-cost-statement.adapter";
import { buildEmployeeCostReport } from "./insights/true-employee-cost-statement.insight";

export function registerEmployeeCostTool(): void {
  registerTool({
    slug: "true-employee-cost-statement",
    title: "True Employee Cost Statement",
    category: "Workforce Costing",
    fieldContract: EMPLOYEE_COST_GROUPS,
    presets: EMPLOYEE_COST_PRESETS,
    serverContract: {
      toolKey: "true-employee-cost-statement",
      toolId: "PRO_021",
      schemaVersion: "5.3.1",
      requiredInputKeys: ["n_labor_rate","n_overhead_rate","n_source_confidence_ratio"],
      optionalInputKeys: [],
      expectedOutputKeys: ["out_evidence_completeness","out_normalized_demand","out_capacity_metric","out_utilization_margin","out_demand_metric","out_threshold_crossing","out_fmea_trigger","out_money_at_risk","out_final_decision_state"],
    },
    buildExecutePayload: employeeCostBuildExecutePayload,
    buildReport: buildEmployeeCostReport,
    reportCapabilities: { primaryKpis:true, decisionState:true, executiveInterpretation:true, breakdown:true, scenarioComparison:false, sensitivity:true, hiddenLosses:true, missedAssumptions:true, riskWarnings:true, checklist:true, recommendations:true, pdfExport:true },
  });
}
