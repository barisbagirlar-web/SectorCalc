/**
 * DİKİŞ HATTI DENGELEYİCİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SEWINGLINEBALANCEANALYZERPRO_SCHEMA: PremiumCalculatorSchema = {
  id: "sewing-line-balance-analyzer-pro",
  legacyPaidSlug: "sewing-line-balance-analyzer-pro",
  name: "DİKİŞ HATTI DENGELEYİCİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "DİKİŞ HATTI DENGELEYİCİ — premium analysis tool.",
  inputs: [
    { id: "smv_sureleri", label: "SMV Süreleri", type: "array", required: true },
    { id: "vardiyadurus", label: "Vardiya/Duruş", type: "number", required: true },
    { id: "hedef_adet", label: "Hedef Adet", type: "number", required: true },
    { id: "operator", label: "Operatör", type: "number", required: true },
    { id: "hedef_verim", label: "Hedef Verim", type: "number", required: true },
    { id: "hata", label: "Hata", type: "number", required: true },
  ],
  outputs: [
    { id: "takt_time", label: "Takt Time", unit: "currency", format: "currency" },
    { id: "cycle_total", label: "Cycle Total", unit: "currency", format: "currency" },
    { id: "theo_operators", label: "Theo Operators", unit: "currency", format: "currency" },
    { id: "act_operators", label: "Act Operators", unit: "currency", format: "currency" },
    { id: "line_eff", label: "Line Eff", unit: "currency", format: "currency" },
    { id: "balance_delay", label: "Balance Delay", unit: "currency", format: "currency" },
    { id: "smoothness", label: "Smoothness", unit: "currency", format: "currency" },
    { id: "w_i_p", label: "W I P", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.dikis_hatti_dengeleyici_analyzer_0", inputMap: { AvailableTime: "available_time", Demand: "demand" }, outputId: "takt_time" },
    { formulaId: "custom.dikis_hatti_dengeleyici_analyzer_1", inputMap: { SMV: "s_m_v" }, outputId: "cycle_total" },
    { formulaId: "custom.dikis_hatti_dengeleyici_analyzer_2", inputMap: { CycleTotal: "cycle_total", TaktTime: "takt_time" }, outputId: "theo_operators" },
    { formulaId: "custom.dikis_hatti_dengeleyici_analyzer_3", inputMap: { TheoOperators: "operator" }, outputId: "act_operators" },
    { formulaId: "custom.dikis_hatti_dengeleyici_analyzer_4", inputMap: { CycleTotal: "cycle_total", ActOperators: "operator", TaktTime: "takt_time" }, outputId: "line_eff" },
    { formulaId: "custom.dikis_hatti_dengeleyici_analyzer_5", inputMap: { LineEff: "line_eff" }, outputId: "balance_delay" },
    { formulaId: "custom.dikis_hatti_dengeleyici_analyzer_6", inputMap: { MaxCycle: "max_cycle", Cycle_i: "cycle_i", ActOperators: "operator" }, outputId: "smoothness" },
    { formulaId: "custom.dikis_hatti_dengeleyici_analyzer_7", inputMap: { Bottleneck: "bottleneck", Takt: "takt", Demand: "demand" }, outputId: "w_i_p" },
  ],
  reportTemplate: {
    title: "DİKİŞ HATTI DENGELEYİCİ Report",
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
