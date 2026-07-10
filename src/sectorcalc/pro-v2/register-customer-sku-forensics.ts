// SectorCalc PRO V2 — Customer SKU Profitability Forensics Tool Registration

import { registerTool } from "./proToolRegistry";
import { CUSTOMER_SKU_FORENSICS_GROUPS } from "./contracts/customer-sku-profitability-forensics.contract";
import { CUSTOMER_SKU_FORENSICS_PRESETS } from "./presets/customer-sku-profitability-forensics.presets";
import { customerSkuForensicsBuildExecutePayload } from "./adapters/customer-sku-profitability-forensics.adapter";
import { buildCustomerSkuForensicsReport } from "./insights/customer-sku-profitability-forensics.insight";

export function registerCustomerSkuForensicsTool(): void {
  registerTool({
    slug: "customer-sku-profitability-forensics",
    title: "Customer SKU Profitability Forensics",
    category: "Profitability & Margin Analysis",
    fieldContract: CUSTOMER_SKU_FORENSICS_GROUPS,
    presets: CUSTOMER_SKU_FORENSICS_PRESETS,
    serverContract: {
      toolKey: "customer-sku-profitability-forensics",
      toolId: "PRO_023",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_unit_price",
        "n_unit_variable_cost",
        "n_annual_volume",
        "n_logistics_cost_pct",
        "n_service_cost_pct",
        "n_return_rate_pct",
        "n_target_margin",
        "n_financing_cost_pct",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_customer_sku_revenue",
        "out_product_cost",
        "out_logistics_cost",
        "out_service_cost",
        "out_returns_claims_cost",
        "out_financing_term_cost",
        "out_contribution_profit",
        "out_fully_loaded_profit",
        "out_margin_percentage",
        "out_cross_subsidization_flag",
        "out_annual_money_at_risk",
        "out_final_decision_state",
      ],
    },
    buildExecutePayload: customerSkuForensicsBuildExecutePayload,
    buildReport: buildCustomerSkuForensicsReport,
    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
