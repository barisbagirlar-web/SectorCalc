/**
 * BAŞABAŞ NOKTASI — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BREAKEVENMARGINOFSAFETY_SCHEMA: PremiumCalculatorSchema = {
  id: "break-even-margin-of-safety-analyzer",
  legacyPaidSlug: "break-even-margin-of-safety-analyzer",
  name: "BAŞABAŞ NOKTASI",
  sectorSlug: "general",
  category: "cost",
  painStatement: "BAŞABAŞ NOKTASI — premium analysis tool.",
  inputs: [
    { id: "sabit_maliyetler", label: "Sabit Maliyetler", type: "number", required: true },
    { id: "birim_degisken_maliyet", label: "Birim Değişken Maliyet", type: "number", required: true },
    { id: "birim_fiyat", label: "Birim Fiyat", type: "number", required: true },
    { id: "guncel_hacim", label: "Güncel Hacim", type: "number", required: true },
    { id: "guncel_gelir", label: "Güncel Gelir", type: "number", required: true },
    { id: "hedef_kr", label: "Hedef Kâr", type: "number", required: true },
  ],
  outputs: [
    { id: "b_e_p__units", label: "B E P_ Units", unit: "currency", format: "currency" },
    { id: "b_e_p__revenue", label: "B E P_ Revenue", unit: "currency", format: "currency" },
    { id: "c_m_r", label: "C M R", unit: "currency", format: "currency" },
    { id: "margin_of_safety__percent", label: "Margin Of Safety_ Percent", unit: "currency", format: "currency" },
    { id: "operating_leverage", label: "Operating Leverage", unit: "currency", format: "currency" },
    { id: "target_profit__units", label: "Target Profit_ Units", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.basabas_noktasi_analyzer_0", inputMap: { FixedCosts: "fixed_costs", UnitPrice: "unit_price", UnitVariableCost: "unit_variable_cost" }, outputId: "b_e_p__units" },
    { formulaId: "custom.basabas_noktasi_analyzer_1", inputMap: { FixedCosts: "fixed_costs", CMR: "c_m_r" }, outputId: "b_e_p__revenue" },
    { formulaId: "custom.basabas_noktasi_analyzer_2", inputMap: { UnitPrice: "unit_price", UnitVariableCost: "unit_variable_cost" }, outputId: "c_m_r" },
    { formulaId: "custom.basabas_noktasi_analyzer_3", inputMap: { ActualSales: "actual_sales", BEP_Units: "b_e_p__units" }, outputId: "margin_of_safety__percent" },
    { formulaId: "custom.basabas_noktasi_analyzer_4", inputMap: { ContributionMargin: "contribution_margin", NetOperatingIncome: "net_operating_income" }, outputId: "operating_leverage" },
    { formulaId: "custom.basabas_noktasi_analyzer_5", inputMap: { FixedCosts: "fixed_costs", TargetProfit: "target_profit", UnitContributionMargin: "unit_contribution_margin" }, outputId: "target_profit__units" },
  ],
  reportTemplate: {
    title: "BAŞABAŞ NOKTASI Report",
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
