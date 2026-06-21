/**
 * Yenileme Bütçesi Optimize Edici — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RENOVATIONBUDGETOPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "renovation-budget-optimizer-analyzer",
  legacyPaidSlug: "renovation-budget-optimizer-analyzer",
  name: "Yenileme Bütçesi Optimize Edici",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Yenileme Bütçesi Optimize Edici — premium analysis tool.",
  inputs: [
    { id: "alan_m2", label: "Alan m2", type: "number", required: true },
    { id: "yenileme_seviyesi", label: "Yenileme Seviyesi", type: "text", required: true },
    { id: "proje_suresi_ay", label: "Proje Süresi ay", type: "number", required: true },
    { id: "m2_baz_maliyet", label: "m2 Baz Maliyet", type: "number", required: true },
    { id: "enflasyon", label: "Enflasyon", type: "number", required: true },
    { id: "risk_faktoru", label: "Risk Faktörü", type: "number", required: true },
    { id: "tasarimizin_oranlari", label: "Tasarım/İzin Oranları", type: "number", required: true },
    { id: "ffe_butcesi", label: "FF&E Bütçesi", type: "number", required: true },
    { id: "eskiyeni_mulk_degeri", label: "Eski/Yeni Mülk Değeri", type: "number", required: true },
  ],
  outputs: [
    { id: "base_cost", label: "Base Cost", unit: "currency", format: "currency" },
    { id: "escalation", label: "Escalation", unit: "currency", format: "currency" },
    { id: "contingency", label: "Contingency", unit: "currency", format: "currency" },
    { id: "soft_costs", label: "Soft Costs", unit: "currency", format: "currency" },
    { id: "total_budget", label: "Total Budget", unit: "currency", format: "currency" },
    { id: "r_o_i__renovation", label: "R O I_ Renovation", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.yenileme_butcesi_optimize_edici_analyzer_0", inputMap: { Area: "area", CostPerSqM_ByComplexity: "cost_per_sq_m__by_complexity" }, outputId: "base_cost" },
    { formulaId: "custom.yenileme_butcesi_optimize_edici_analyzer_1", inputMap: { BaseCost: "base_cost", InflationRate: "inflation_rate", ProjectDuration: "project_duration" }, outputId: "escalation" },
    { formulaId: "custom.yenileme_butcesi_optimize_edici_analyzer_2", inputMap: { BaseCost: "base_cost", Escalation: "escalation", RiskFactor: "risk_factor" }, outputId: "contingency" },
    { formulaId: "custom.yenileme_butcesi_optimize_edici_analyzer_3", inputMap: { BaseCost: "base_cost", Escalation: "escalation", DesignFeePct: "design_fee_pct", PermitFeePct: "permit_fee_pct" }, outputId: "soft_costs" },
    { formulaId: "custom.yenileme_butcesi_optimize_edici_analyzer_4", inputMap: { BaseCost: "base_cost", Escalation: "escalation", Contingency: "contingency", SoftCosts: "soft_costs", FF_E: "f_f__e" }, outputId: "total_budget" },
    { formulaId: "custom.yenileme_butcesi_optimize_edici_analyzer_5", inputMap: { NewPropertyValue: "new_property_value", OldPropertyValue: "old_property_value", TotalBudget: "total_budget" }, outputId: "r_o_i__renovation" },
  ],
  reportTemplate: {
    title: "Yenileme Bütçesi Optimize Edici Report",
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
