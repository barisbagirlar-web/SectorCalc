/**
 * EVM MALİYET FORECAST — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const EVMCOSTFORECAST_SCHEMA: PremiumCalculatorSchema = {
  id: "evm-cost-forecast-analyzer",
  legacyPaidSlug: "evm-cost-forecast-analyzer",
  name: "EVM MALİYET FORECAST",
  sectorSlug: "general",
  category: "cost",
  painStatement: "EVM MALİYET FORECAST — premium analysis tool.",
  inputs: [
    { id: "bac", label: "BAC", type: "number", required: true },
    { id: "pv", label: "PV", type: "number", required: true },
    { id: "ev", label: "EV", type: "number", required: true },
    { id: "ac", label: "AC", type: "number", required: true },
    { id: "varyans_nedeni", label: "Varyans Nedeni", type: "text", required: true },
    { id: "kalan_risk", label: "Kalan Risk", type: "number", required: true },
    { id: "yonetim_rezervi", label: "Yönetim Rezervi", type: "number", required: true },
  ],
  outputs: [
    { id: "s_v", label: "S V", unit: "currency", format: "currency" },
    { id: "c_v", label: "C V", unit: "currency", format: "currency" },
    { id: "s_p_i", label: "S P I", unit: "currency", format: "currency" },
    { id: "c_p_i", label: "C P I", unit: "currency", format: "currency" },
    { id: "e_a_c__c_p_i", label: "E A C_ C P I", unit: "currency", format: "currency" },
    { id: "e_a_c__c_p_i__s_p_i", label: "E A C_ C P I_ S P I", unit: "currency", format: "currency" },
    { id: "e_t_c", label: "E T C", unit: "currency", format: "currency" },
    { id: "v_a_c", label: "V A C", unit: "currency", format: "currency" },
    { id: "t_c_p_i", label: "T C P I", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.evm_maliyet_forecast_analyzer_0", inputMap: { EV: "ev", PV: "pv" }, outputId: "s_v" },
    { formulaId: "custom.evm_maliyet_forecast_analyzer_1", inputMap: { EV: "ev", AC: "ac" }, outputId: "c_v" },
    { formulaId: "custom.evm_maliyet_forecast_analyzer_2", inputMap: { EV: "ev", PV: "pv" }, outputId: "s_p_i" },
    { formulaId: "custom.evm_maliyet_forecast_analyzer_3", inputMap: { EV: "ev", AC: "ac" }, outputId: "c_p_i" },
    { formulaId: "custom.evm_maliyet_forecast_analyzer_4", inputMap: { BAC: "bac", CPI: "c_p_i" }, outputId: "e_a_c__c_p_i" },
    { formulaId: "custom.evm_maliyet_forecast_analyzer_5", inputMap: { AC: "ac", BAC: "bac", EV: "ev", CPI: "c_p_i", SPI: "s_p_i" }, outputId: "e_a_c__c_p_i__s_p_i" },
    { formulaId: "custom.evm_maliyet_forecast_analyzer_6", inputMap: { EAC: "ac", AC: "ac" }, outputId: "e_t_c" },
    { formulaId: "custom.evm_maliyet_forecast_analyzer_7", inputMap: { BAC: "bac", EAC: "ac" }, outputId: "v_a_c" },
    { formulaId: "custom.evm_maliyet_forecast_analyzer_8", inputMap: { BAC: "bac", EV: "ev", AC: "ac" }, outputId: "t_c_p_i" },
  ],
  reportTemplate: {
    title: "EVM MALİYET FORECAST Report",
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
