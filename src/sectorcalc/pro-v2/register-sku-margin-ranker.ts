// SectorCalc PRO V2 — Product SKU Margin Ranker Tool Registration

import { registerTool } from "./proToolRegistry";
import { SKU_MARGIN_RANKER_GROUPS } from "./contracts/product-sku-margin-ranker.contract";
import { SKU_MARGIN_RANKER_PRESETS } from "./presets/product-sku-margin-ranker.presets";
import { skuMarginRankerBuildExecutePayload } from "./adapters/product-sku-margin-ranker.adapter";
import { buildSkuMarginRankerReport } from "./insights/product-sku-margin-ranker.insight";

export function registerSkuMarginRankerTool(): void {
  registerTool({
    slug: "product-sku-margin-ranker",
    title: "Product SKU Margin Ranker",
    category: "Profitability Analysis",
    fieldContract: SKU_MARGIN_RANKER_GROUPS,
    presets: SKU_MARGIN_RANKER_PRESETS,
    serverContract: {
      toolKey: "product-sku-margin-ranker",
      toolId: "PRO_022",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_unit_price",
        "n_material_cost_per_unit",
        "n_labor_cost_per_unit",
        "n_overhead_per_unit",
        "n_logistics_cost_per_unit",
        "n_annual_volume_units",
        "n_target_margin_percent",
        "n_total_portfolio_revenue",
        "n_total_portfolio_profit",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_sku_revenue",
        "out_variable_cost",
        "out_contribution_amount",
        "out_contribution_margin_percent",
        "out_fully_loaded_profit",
        "out_fully_loaded_margin",
        "out_unit_cost",
        "out_revenue_share_percent",
        "out_profit_share_percent",
        "out_margin_classification",
        "out_repricing_priority",
        "out_concentration_risk",
        "out_final_decision_state",
      ],
    },
    buildExecutePayload: skuMarginRankerBuildExecutePayload,
    buildReport: buildSkuMarginRankerReport,
    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
