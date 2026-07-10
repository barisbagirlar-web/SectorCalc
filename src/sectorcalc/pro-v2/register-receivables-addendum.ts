// SectorCalc PRO V2 — Receivables Cost Payment Term Addendum Tool Registration

import { registerTool } from "./proToolRegistry";
import { RECEIVABLES_ADDENDUM_GROUPS } from "./contracts/receivables-cost-payment-term-addendum.contract";
import { RECEIVABLES_ADDENDUM_PRESETS } from "./presets/receivables-cost-payment-term-addendum.presets";
import { receivablesAddendumBuildExecutePayload } from "./adapters/receivables-cost-payment-term-addendum.adapter";
import { buildReceivablesAddendumReport } from "./insights/receivables-cost-payment-term-addendum.insight";

export function registerReceivablesAddendumTool(): void {
  registerTool({
    slug: "receivables-cost-payment-term-addendum",
    title: "Receivables Cost Payment Term Addendum",
    category: "Financial Risk & Pricing",
    fieldContract: RECEIVABLES_ADDENDUM_GROUPS,
    presets: RECEIVABLES_ADDENDUM_PRESETS,
    serverContract: {
      toolKey: "receivables-cost-payment-term-addendum",
      toolId: "PRO_024",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_invoice_value",
        "n_payment_days",
        "n_early_payment_discount_pct",
        "n_early_payment_days",
        "n_cost_of_capital_pct",
        "n_admin_collection_cost",
        "n_default_risk_allowance",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_invoice_value",
        "out_financing_cost",
        "out_admin_collection_cost",
        "out_default_risk_allowance",
        "out_effective_term_cost",
        "out_effective_term_cost_pct",
        "out_margin_erosion_amount",
        "out_required_addendum_amount",
        "out_required_addendum_pct",
        "out_revised_invoice_amount",
        "out_breakeven_payment_term_days",
        "out_final_decision_state",
      ],
    },
    buildExecutePayload: receivablesAddendumBuildExecutePayload,
    buildReport: buildReceivablesAddendumReport,
    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
