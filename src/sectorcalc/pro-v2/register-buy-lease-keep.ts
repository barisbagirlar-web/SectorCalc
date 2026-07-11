// SectorCalc PRO V2 — Machine Investment Feasibility (Buy/Lease/Keep) Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { BUY_LEASE_KEEP_GROUPS } from "./contracts/machine-investment-feasibility-buy-lease-keep.contract";
import { BUY_LEASE_KEEP_PRESETS } from "./presets/machine-investment-feasibility-buy-lease-keep.presets";
import { buyLeaseKeepBuildExecutePayload } from "./adapters/machine-investment-feasibility-buy-lease-keep.adapter";
import { buildBuyLeaseKeepReport } from "./insights/machine-investment-feasibility-buy-lease-keep.insight";

const SLUG = "machine-investment-feasibility-buy-lease-keep";

export function registerBuyLeaseKeepTool(): void {
  registerTool({
    slug: SLUG,
    title: "Machine Investment Feasibility (Buy / Lease / Keep)",
    category: "Financial Planning",

    fieldContract: BUY_LEASE_KEEP_GROUPS,
    presets: BUY_LEASE_KEEP_PRESETS,

    serverContract: {
      toolKey: SLUG,
      toolId: "PRO_031",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_machine_purchase_price", "n_down_payment_pct",
        "n_lease_annual_payment", "n_lease_term_years",
        "n_loan_interest_rate_pct", "n_loan_term_years",
        "n_annual_maintenance_cost", "n_annual_downtime_cost",
        "n_residual_value", "n_operating_savings_per_year",
        "n_discount_rate",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_buy_initial_cash", "out_buy_annual_payments",
        "out_buy_maintenance", "out_buy_downtime",
        "out_buy_total_lifecycle", "out_buy_npv",
        "out_lease_initial_cash", "out_lease_annual_payments",
        "out_lease_total_lifecycle", "out_lease_npv",
        "out_keep_total_lifecycle", "out_keep_npv",
        "out_selected_alternative", "out_decision_gap",
        "out_final_decision_state",
      ],
    },

    buildExecutePayload: buyLeaseKeepBuildExecutePayload,
    buildReport: buildBuyLeaseKeepReport,

    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: true, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
