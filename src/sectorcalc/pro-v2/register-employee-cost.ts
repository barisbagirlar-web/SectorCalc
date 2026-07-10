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
      requiredInputKeys: [
        "n_annual_base_salary",
      ],
      optionalInputKeys: [
        "n_payroll_tax_rate",
        "n_health_insurance_annual",
        "n_pension_contribution_rate",
        "n_bonus_target_rate",
        "n_paid_leave_weeks",
        "n_training_budget_annual",
        "n_equipment_it_annual",
        "n_workspace_facility_annual",
        "n_recruitment_allocation_rate",
        "n_other_benefits_annual",
        "n_productive_hours_per_year",
      ],
      expectedOutputKeys: [
        "out_base_salary",
        "out_payroll_taxes",
        "out_health_insurance",
        "out_pension_contribution",
        "out_bonus_allocation",
        "out_paid_leave_cost",
        "out_training_cost",
        "out_recruitment_allocation",
        "out_equipment_it_cost",
        "out_workspace_facility_cost",
        "out_other_benefits",
        "out_fully_loaded_annual_cost",
        "out_monthly_cost",
        "out_productive_hours_per_year",
        "out_productive_hourly_cost",
        "out_base_to_loaded_multiplier",
        "out_primary_cost_driver",
        "out_final_decision_state",
      ],
    },
    buildExecutePayload: employeeCostBuildExecutePayload,
    buildReport: buildEmployeeCostReport,
    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
