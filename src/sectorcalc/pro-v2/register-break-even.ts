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
      requiredInputKeys: [
        "n_annual_revenue",
        "n_variable_cost_percent",
        "n_annual_fixed_costs",
        "n_available_cash_liquidity",
      ],
      optionalInputKeys: [
        "n_unit_selling_price",
        "n_unit_variable_cost",
      ],
      expectedOutputKeys: [
        "out_revenue",
        "out_variable_cost",
        "out_contribution_margin_amount",
        "out_contribution_margin_ratio",
        "out_fixed_operating_cost",
        "out_operating_profit_or_loss",
        "out_break_even_revenue",
        "out_break_even_units",
        "out_revenue_gap",
        "out_unit_gap",
        "out_monthly_cash_burn",
        "out_available_liquidity",
        "out_cash_runway_months",
        "out_margin_of_safety_amount",
        "out_margin_of_safety_percent",
        "out_primary_survival_driver",
        "out_final_decision_state",
      ],
    },
    buildExecutePayload: breakEvenBuildExecutePayload,
    buildReport: buildBreakEvenReport,
    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
