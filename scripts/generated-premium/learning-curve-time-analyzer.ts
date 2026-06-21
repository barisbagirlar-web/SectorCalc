/**
 * Öğrenme Eğrisi Süre Tahmincisi — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const LEARNINGCURVETIME_SCHEMA: PremiumCalculatorSchema = {
  id: "learning-curve-time-analyzer",
  legacyPaidSlug: "learning-curve-time-analyzer",
  name: "Öğrenme Eğrisi Süre Tahmincisi",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Öğrenme Eğrisi Süre Tahmincisi — premium analysis tool.",
  inputs: [
    { id: "ilk_birim_suresi", label: "İlk Birim Süresi", type: "number", required: true },
    { id: "ogrenme_orani", label: "Öğrenme Oranı", type: "number", required: true },
    { id: "hedef_standart_sure", label: "Hedef Standart Süre", type: "number", required: true },
    { id: "toplam_uretim_adedi_n", label: "Toplam Üretim Adedi N", type: "number", required: true },
    { id: "saatlik_iscilik_maliyeti", label: "Saatlik İşçilik Maliyeti", type: "number", required: true },
    { id: "hata_duzeltme_suresi", label: "Hata Düzeltme Süresi", type: "number", required: true },
  ],
  outputs: [
    { id: "learning_rate", label: "Learning Rate", unit: "currency", format: "currency" },
    { id: "slope_b", label: "Slope_b", unit: "currency", format: "currency" },
    { id: "time__n", label: "Time_ N", unit: "currency", format: "currency" },
    { id: "cumulative_time__n", label: "Cumulative Time_ N", unit: "currency", format: "currency" },
    { id: "average_time__n", label: "Average Time_ N", unit: "currency", format: "currency" },
    { id: "cost__n", label: "Cost_ N", unit: "currency", format: "currency" },
    { id: "breakeven_unit", label: "Breakeven Unit", unit: "currency", format: "currency" },
    { id: "total_labor_cost", label: "Total Labor Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.ogrenme_egrisi_sure_tahmincisi_analyzer_0", inputMap: { Time_2N: "time_2_n", Time_N: "time__n" }, outputId: "learning_rate" },
    { formulaId: "custom.ogrenme_egrisi_sure_tahmincisi_analyzer_1", inputMap: { LearningRate: "learning_rate" }, outputId: "slope_b" },
    { formulaId: "custom.ogrenme_egrisi_sure_tahmincisi_analyzer_2", inputMap: { Time_1: "time_1" }, outputId: "time__n" },
    { formulaId: "custom.ogrenme_egrisi_sure_tahmincisi_analyzer_3", inputMap: { Time_1: "time_1" }, outputId: "cumulative_time__n" },
    { formulaId: "custom.ogrenme_egrisi_sure_tahmincisi_analyzer_4", inputMap: { CumulativeTime_N: "cumulative_time__n" }, outputId: "average_time__n" },
    { formulaId: "custom.ogrenme_egrisi_sure_tahmincisi_analyzer_5", inputMap: { Time_N: "time__n", LaborRate: "labor_rate" }, outputId: "cost__n" },
    { formulaId: "custom.ogrenme_egrisi_sure_tahmincisi_analyzer_6", inputMap: { where: "where", StandardTime: "standard_time", is: "saatlik_iscilik_maliyeti", reached: "reached" }, outputId: "breakeven_unit" },
    { formulaId: "custom.ogrenme_egrisi_sure_tahmincisi_analyzer_7", inputMap: { CumulativeTime_N: "cumulative_time__n", LaborRate: "labor_rate" }, outputId: "total_labor_cost" },
  ],
  reportTemplate: {
    title: "Öğrenme Eğrisi Süre Tahmincisi Report",
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
