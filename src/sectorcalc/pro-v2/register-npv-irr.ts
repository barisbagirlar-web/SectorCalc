// SectorCalc PRO V2 — Capital Equipment Investment Appraisal (NPV/IRR) Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { NPV_IRR_GROUPS } from "./contracts/capital-equipment-investment-appraisal-npv-irr.contract";
import { NPV_IRR_PRESETS } from "./presets/capital-equipment-investment-appraisal-npv-irr.presets";
import { npvIrrBuildExecutePayload } from "./adapters/capital-equipment-investment-appraisal-npv-irr.adapter";
import { buildNpvIrrReport } from "./insights/capital-equipment-investment-appraisal-npv-irr.insight";

const SLUG = "capital-equipment-investment-appraisal-npv-irr";

export function registerNpvIrrTool(): void {
  registerTool({
    slug: SLUG,
    title: "Capital Equipment Investment Appraisal (NPV/IRR)",
    category: "Financial Planning",

    fieldContract: NPV_IRR_GROUPS,
    presets: NPV_IRR_PRESETS,

    serverContract: {
      toolKey: SLUG,
      toolId: "PRO_030",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_initial_investment", "n_working_capital",
        "n_annual_cash_inflow_1", "n_annual_cash_inflow_2",
        "n_annual_cash_inflow_3", "n_annual_cash_inflow_4",
        "n_annual_cash_inflow_5",
        "n_terminal_residual_value", "n_discount_rate_percent",
        "n_scenario_downside_pct", "n_scenario_upside_pct",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_initial_investment", "out_working_capital", "out_total_initial_cash",
        "out_annual_cash_flows_sum", "out_terminal_value", "out_discount_rate",
        "out_npv", "out_irr_percent", "out_simple_payback_years",
        "out_discounted_payback_years", "out_profitability_index",
        "out_scenario_downside_npv", "out_scenario_base_npv", "out_scenario_upside_npv",
        "out_primary_value_driver", "out_investment_decision_state",
        "out_final_decision_state",
      ],
    },

    buildExecutePayload: npvIrrBuildExecutePayload,
    buildReport: buildNpvIrrReport,

    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: true, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
