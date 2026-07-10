// SectorCalc PRO V2 — FX Commodity Pass-Through Pricer Tool Registration

import { registerTool } from "./proToolRegistry";
import { FX_COMMODITY_PRICER_GROUPS } from "./contracts/fx-commodity-pass-through-pricer.contract";
import { FX_COMMODITY_PRICER_PRESETS } from "./presets/fx-commodity-pass-through-pricer.presets";
import { fxCommodityPricerBuildExecutePayload } from "./adapters/fx-commodity-pass-through-pricer.adapter";
import { buildFxCommodityPricerReport } from "./insights/fx-commodity-pass-through-pricer.insight";

export function registerFxCommodityPricerTool(): void {
  registerTool({
    slug: "fx-commodity-pass-through-pricer",
    title: "FX & Commodity Pass-Through Pricer",
    category: "Pricing & Cost Recovery",
    fieldContract: FX_COMMODITY_PRICER_GROUPS,
    presets: FX_COMMODITY_PRICER_PRESETS,
    serverContract: {
      toolKey: "fx-commodity-pass-through-pricer",
      toolId: "PRO_025",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_base_price",
        "n_fx_rate_spot",
        "n_fx_rate_budget",
        "n_commodity_index_current",
        "n_commodity_index_budget",
        "n_material_cost_pct",
        "n_fx_hedge_pct",
        "n_commodity_hedge_pct",
        "n_annual_volume",
        "n_target_margin_percent",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_baseline_cost",
        "out_fx_change_percent",
        "out_commodity_change_percent",
        "out_weighted_cost_change_pct",
        "out_deadband_threshold_pct",
        "out_pass_through_amount",
        "out_revised_price",
        "out_protected_margin",
        "out_unprotected_exposure",
        "out_annual_escalation",
        "out_price_review_trigger",
        "out_final_decision_state",
      ],
    },
    buildExecutePayload: fxCommodityPricerBuildExecutePayload,
    buildReport: buildFxCommodityPricerReport,
    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
