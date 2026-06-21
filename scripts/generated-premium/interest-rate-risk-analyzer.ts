/**
 * FAİZ ORANI RİSKİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const INTERESTRATERISK_SCHEMA: PremiumCalculatorSchema = {
  id: "interest-rate-risk-analyzer",
  legacyPaidSlug: "interest-rate-risk-analyzer",
  name: "FAİZ ORANI RİSKİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "FAİZ ORANI RİSKİ — premium analysis tool.",
  inputs: [
    { id: "degiskensabit_borc", label: "Değişken/Sabit Borç", type: "number", required: true },
    { id: "hedge_orani", label: "Hedge Oranı", type: "number", required: true },
    { id: "duration", label: "Duration", type: "number", required: true },
    { id: "bps_sok", label: "Bps Şok", type: "number", required: true },
    { id: "volatilite", label: "Volatilite", type: "number", required: true },
    { id: "swap_spread", label: "Swap Spread", type: "number", required: true },
    { id: "hedef_nim", label: "Hedef NIM", type: "number", required: true },
  ],
  outputs: [
    { id: "exposure", label: "Exposure", unit: "currency", format: "currency" },
    { id: "shock_impact", label: "Shock Impact", unit: "currency", format: "currency" },
    { id: "dur_gap", label: "Dur Gap", unit: "currency", format: "currency" },
    { id: "e_v_e__change", label: "E V E_ Change", unit: "currency", format: "currency" },
    { id: "n_i_m", label: "N I M", unit: "currency", format: "currency" },
    { id: "va_r", label: "Va R", unit: "currency", format: "currency" },
    { id: "hedge_cost", label: "Hedge Cost", unit: "currency", format: "currency" },
    { id: "break_even", label: "Break Even", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.faiz_orani_riski_analyzer_0", inputMap: { FloatingDebt: "floating_debt", HedgeRatio: "hedge_ratio" }, outputId: "exposure" },
    { formulaId: "custom.faiz_orani_riski_analyzer_1", inputMap: { Exposure: "exposure", BpsChange: "bps_change" }, outputId: "shock_impact" },
    { formulaId: "custom.faiz_orani_riski_analyzer_2", inputMap: { AssetDur: "asset_dur", LiabDur: "liab_dur" }, outputId: "dur_gap" },
    { formulaId: "custom.faiz_orani_riski_analyzer_3", inputMap: { DurGap: "dur_gap", AssetVal: "asset_val", RateChange: "rate_change" }, outputId: "e_v_e__change" },
    { formulaId: "custom.faiz_orani_riski_analyzer_4", inputMap: { Inc: "inc", Exp: "exp", EarningAssets: "earning_assets" }, outputId: "n_i_m" },
    { formulaId: "custom.faiz_orani_riski_analyzer_5", inputMap: { PortVal: "port_val", Volatility: "volatility" }, outputId: "va_r" },
    { formulaId: "custom.faiz_orani_riski_analyzer_6", inputMap: { Notional: "notional", SwapSpread: "swap_spread" }, outputId: "hedge_cost" },
    { formulaId: "custom.faiz_orani_riski_analyzer_7", inputMap: { Fixed: "fixed", Floating_Curr: "floating__curr" }, outputId: "break_even" },
  ],
  reportTemplate: {
    title: "FAİZ ORANI RİSKİ Report",
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
