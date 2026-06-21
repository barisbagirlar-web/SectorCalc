/**
 * DEĞİŞİM MATRİSİ SMED — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SMEDCHANGEOVERMATRIX_SCHEMA: PremiumCalculatorSchema = {
  id: "smed-changeover-matrix-analyzer",
  legacyPaidSlug: "smed-changeover-matrix-analyzer",
  name: "DEĞİŞİM MATRİSİ SMED",
  sectorSlug: "general",
  category: "cost",
  painStatement: "DEĞİŞİM MATRİSİ SMED — premium analysis tool.",
  inputs: [
    { id: "icdis_ayar_suresi", label: "İç/Dış Ayar Süresi", type: "number", required: true },
    { id: "aylik_degisim", label: "Aylık Değişim", type: "number", required: true },
    { id: "donusturme_orani", label: "Dönüştürme Oranı", type: "number", required: true },
    { id: "yillik_talep", label: "Yıllık Talep", type: "number", required: true },
    { id: "tasima_maliyeti", label: "Taşıma Maliyeti", type: "number", required: true },
    { id: "makine_ucreti", label: "Makine Ücreti", type: "number", required: true },
  ],
  outputs: [
    { id: "t_internal", label: "T_internal", unit: "currency", format: "currency" },
    { id: "t_external", label: "T_external", unit: "currency", format: "currency" },
    { id: "t_total", label: "T_total", unit: "currency", format: "currency" },
    { id: "t_target", label: "T_target", unit: "currency", format: "currency" },
    { id: "e_b_q", label: "E B Q", unit: "currency", format: "currency" },
    { id: "setup_cost", label: "Setup Cost", unit: "currency", format: "currency" },
    { id: "annual_savings", label: "Annual Savings", unit: "currency", format: "currency" },
    { id: "capacity_gain", label: "Capacity Gain", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.degisim_matrisi_smed_analyzer_0", inputMap: { SetupStopped: "setup_stopped" }, outputId: "t_internal" },
    { formulaId: "custom.degisim_matrisi_smed_analyzer_1", inputMap: { SetupRunning: "setup_running" }, outputId: "t_external" },
    { formulaId: "custom.degisim_matrisi_smed_analyzer_2", inputMap: { T_internal: "t_internal", T_external: "t_external" }, outputId: "t_total" },
    { formulaId: "custom.degisim_matrisi_smed_analyzer_3", inputMap: { T_internal: "t_internal", ConversionRate: "conversion_rate", T_external: "t_external" }, outputId: "t_target" },
    { formulaId: "custom.degisim_matrisi_smed_analyzer_4", inputMap: { Demand: "demand", SetupCost: "setup_cost", HoldingCost: "holding_cost" }, outputId: "e_b_q" },
    { formulaId: "custom.degisim_matrisi_smed_analyzer_5", inputMap: { T_total: "t_total", MachineRate: "machine_rate", Labor: "labor" }, outputId: "setup_cost" },
    { formulaId: "custom.degisim_matrisi_smed_analyzer_6", inputMap: { T_total: "t_total", T_target: "t_target", Freq: "freq", Rate: "rate" }, outputId: "annual_savings" },
    { formulaId: "custom.degisim_matrisi_smed_analyzer_7", inputMap: { T_total: "t_total", T_target: "t_target", Freq: "freq", Available: "available" }, outputId: "capacity_gain" },
  ],
  reportTemplate: {
    title: "DEĞİŞİM MATRİSİ SMED Report",
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
