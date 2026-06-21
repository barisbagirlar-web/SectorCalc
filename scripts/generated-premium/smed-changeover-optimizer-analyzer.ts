/**
 * SMED Değişim Optimize Edici — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SMEDCHANGEOVEROPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "smed-changeover-optimizer-analyzer",
  legacyPaidSlug: "smed-changeover-optimizer-analyzer",
  name: "SMED Değişim Optimize Edici",
  sectorSlug: "general",
  category: "cost",
  painStatement: "SMED Değişim Optimize Edici — premium analysis tool.",
  inputs: [
    { id: "mevcut_icdis_ayar_dk", label: "Mevcut İç/Dış Ayar dk", type: "number", required: true },
    { id: "degisim_frekansi", label: "Değişim Frekansı", type: "number", required: true },
    { id: "hedef_ic_ayar_dk", label: "Hedef İç Ayar dk", type: "number", required: true },
    { id: "donusturme_orani", label: "Dönüştürme Oranı", type: "number", required: true },
    { id: "darbogaz_cikti_degeri_currencydk", label: "Darboğaz Çıktı Değeri currency/dk", type: "number", required: true },
    { id: "smed_yatirimi", label: "SMED Yatırımı", type: "number", required: true },
    { id: "vardiya_suresi_dk", label: "Vardiya Süresi dk", type: "number", required: true },
  ],
  outputs: [
    { id: "current_setup_time", label: "Current Setup Time", unit: "currency", format: "currency" },
    { id: "target_setup_time", label: "Target Setup Time", unit: "currency", format: "currency" },
    { id: "conversion_rate", label: "Conversion Rate", unit: "currency", format: "currency" },
    { id: "capacity_recovered", label: "Capacity Recovered", unit: "currency", format: "currency" },
    { id: "financial_gain", label: "Financial Gain", unit: "currency", format: "currency" },
    { id: "s_m_e_d__investment", label: "S M E D_ Investment", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.smed_degisim_optimize_edici_analyzer_0", inputMap: { Internal_Current: "internal__current", External_Current: "external__current" }, outputId: "current_setup_time" },
    { formulaId: "custom.smed_degisim_optimize_edici_analyzer_1", inputMap: { Internal_Target: "internal__target", External_Target: "external__target" }, outputId: "target_setup_time" },
    { formulaId: "custom.smed_degisim_optimize_edici_analyzer_2", inputMap: { Internal_Current: "internal__current", Internal_Target: "internal__target" }, outputId: "conversion_rate" },
    { formulaId: "custom.smed_degisim_optimize_edici_analyzer_3", inputMap: { CurrentSetupTime: "current_setup_time", TargetSetupTime: "target_setup_time", ChangeoverFrequency: "changeover_frequency" }, outputId: "capacity_recovered" },
    { formulaId: "custom.smed_degisim_optimize_edici_analyzer_4", inputMap: { CapacityRecovered: "capacity_recovered", BottleneckThroughput: "bottleneck_throughput", UnitMargin: "unit_margin" }, outputId: "financial_gain" },
    { formulaId: "custom.smed_degisim_optimize_edici_analyzer_5", inputMap: { Training: "training", Tooling: "tooling", Modification: "modification" }, outputId: "s_m_e_d__investment" },
    { formulaId: "custom.smed_degisim_optimize_edici_analyzer_6", inputMap: { FinancialGain: "financial_gain", SMED_Investment: "s_m_e_d__investment" }, outputId: "r_o_i" },
  ],
  reportTemplate: {
    title: "SMED Değişim Optimize Edici Report",
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
