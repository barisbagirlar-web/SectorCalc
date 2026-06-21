/**
 * Kur Riski — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CURRENCYRISK_SCHEMA: PremiumCalculatorSchema = {
  id: "currency-risk-analyzer",
  legacyPaidSlug: "currency-risk-analyzer",
  name: "Kur Riski",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kur Riski — premium analysis tool.",
  inputs: [
    { id: "doviz_gelirgider", label: "Döviz Gelir/Gider", type: "number", required: true },
    { id: "vadeler", label: "Vadeler", type: "array", required: true },
    { id: "doviz_cifti", label: "Döviz Çifti", type: "text", required: true },
    { id: "volatilite", label: "Volatilite", type: "number", required: true },
    { id: "zaman_ufku", label: "Zaman Ufku", type: "number", required: true },
    { id: "zskoru", label: "Z-Skoru", type: "number", required: true },
    { id: "hedge_orani", label: "Hedge Oranı", type: "number", required: true },
    { id: "forward_puani", label: "Forward Puanı", type: "number", required: true },
    { id: "spotforward_kur", label: "Spot/Forward Kur", type: "number", required: true },
  ],
  outputs: [
    { id: "exposure__f_c", label: "Exposure_ F C", unit: "currency", format: "currency" },
    { id: "va_r__historical", label: "Va R_ Historical", unit: "currency", format: "currency" },
    { id: "va_r__parametric", label: "Va R_ Parametric", unit: "currency", format: "currency" },
    { id: "hedged_exposure", label: "Hedged Exposure", unit: "currency", format: "currency" },
    { id: "unhedged_va_r", label: "Unhedged Va R", unit: "currency", format: "currency" },
    { id: "cost_of_hedge", label: "Cost Of Hedge", unit: "currency", format: "currency" },
    { id: "net_impact", label: "Net Impact", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kur_riski_analyzer_0", inputMap: { TotalRevenue_FC: "total_revenue__f_c", TotalCost_FC: "total_cost__f_c" }, outputId: "exposure__f_c" },
    { formulaId: "custom.kur_riski_analyzer_1", inputMap: { Exposure_FC: "exposure__f_c", StdDev_ExchangeRate: "std_dev__exchange_rate", Z_Score: "z__score" }, outputId: "va_r__historical" },
    { formulaId: "custom.kur_riski_analyzer_2", inputMap: { Exposure_FC: "exposure__f_c", Volatility: "volatility", TimeHorizon: "time_horizon" }, outputId: "va_r__parametric" },
    { formulaId: "custom.kur_riski_analyzer_3", inputMap: { Exposure_FC: "exposure__f_c", HedgeRatio: "hedge_ratio" }, outputId: "hedged_exposure" },
    { formulaId: "custom.kur_riski_analyzer_4", inputMap: { VaR_Historical: "va_r__historical", HedgeRatio: "hedge_ratio" }, outputId: "unhedged_va_r" },
    { formulaId: "custom.kur_riski_analyzer_5", inputMap: { Notional: "notional", ForwardPoints: "forward_points" }, outputId: "cost_of_hedge" },
    { formulaId: "custom.kur_riski_analyzer_6", inputMap: { SpotRate: "spot_rate", ForwardRate: "forward_rate", HedgedExposure: "hedged_exposure" }, outputId: "net_impact" },
  ],
  reportTemplate: {
    title: "Kur Riski Report",
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
