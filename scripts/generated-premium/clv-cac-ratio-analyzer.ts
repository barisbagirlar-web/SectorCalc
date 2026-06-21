/**
 * CLV / CAC ORANI — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CLVCACRATIO_SCHEMA: PremiumCalculatorSchema = {
  id: "clv-cac-ratio-analyzer",
  legacyPaidSlug: "clv-cac-ratio-analyzer",
  name: "CLV / CAC ORANI",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CLV / CAC ORANI — premium analysis tool.",
  inputs: [
    { id: "butce", label: "Bütçe", type: "number", required: true },
    { id: "yeni_musteri", label: "Yeni Müşteri", type: "number", required: true },
    { id: "siparis_degeri", label: "Sipariş Değeri", type: "number", required: true },
    { id: "siklik", label: "Sıklık", type: "number", required: true },
    { id: "yasam_suresi", label: "Yaşam Süresi", type: "number", required: true },
    { id: "churn", label: "Churn", type: "number", required: true },
    { id: "brut_marj", label: "Brüt Marj", type: "number", required: true },
    { id: "wacc", label: "WACC", type: "number", required: true },
  ],
  outputs: [
    { id: "c_l_v", label: "C L V", unit: "currency", format: "currency" },
    { id: "gross_margin_c_l_v", label: "Gross Margin C L V", unit: "currency", format: "currency" },
    { id: "discounted_c_l_v", label: "Discounted C L V", unit: "currency", format: "currency" },
    { id: "c_a_c", label: "C A C", unit: "currency", format: "currency" },
    { id: "payback", label: "Payback", unit: "currency", format: "currency" },
    { id: "l_t_v__c_a_c", label: "L T V_ C A C", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.clv_cac_orani_analyzer_0", inputMap: { AvgOrderValue: "avg_order_value", PurchaseFreq: "purchase_freq", Lifespan: "lifespan" }, outputId: "c_l_v" },
    { formulaId: "custom.clv_cac_orani_analyzer_1", inputMap: { CLV: "c_l_v", GrossMarginPct: "gross_margin_pct" }, outputId: "gross_margin_c_l_v" },
    { formulaId: "custom.clv_cac_orani_analyzer_2", inputMap: { GrossMarginCLV: "gross_margin_c_l_v", Retention: "retention", DiscountRate: "discount_rate" }, outputId: "discounted_c_l_v" },
    { formulaId: "custom.clv_cac_orani_analyzer_3", inputMap: { SalesMarketing: "sales_marketing", Salaries: "salaries", Overhead: "overhead", NewCustomers: "new_customers" }, outputId: "c_a_c" },
    { formulaId: "custom.clv_cac_orani_analyzer_4", inputMap: { CAC: "c_a_c", AvgMonthlyGrossProfit: "avg_monthly_gross_profit" }, outputId: "payback" },
    { formulaId: "custom.clv_cac_orani_analyzer_5", inputMap: { DiscountedCLV: "discounted_c_l_v", CAC: "c_a_c" }, outputId: "l_t_v__c_a_c" },
  ],
  reportTemplate: {
    title: "CLV / CAC ORANI Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
