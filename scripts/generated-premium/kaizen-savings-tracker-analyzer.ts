/**
 * KAIZEN TASARRUF TAKİPÇİSİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const KAIZENSAVINGSTRACKER_SCHEMA: PremiumCalculatorSchema = {
  id: "kaizen-savings-tracker-analyzer",
  legacyPaidSlug: "kaizen-savings-tracker-analyzer",
  name: "KAIZEN TASARRUF TAKİPÇİSİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "KAIZEN TASARRUF TAKİPÇİSİ — premium analysis tool.",
  inputs: [
    { id: "bazgercek_maliyet", label: "Baz/Gerçek Maliyet", type: "number", required: true },
    { id: "sure", label: "Süre", type: "number", required: true },
    { id: "hacim", label: "Hacim", type: "number", required: true },
    { id: "iscilikmalzeme", label: "İşçilik/Malzeme", type: "number", required: true },
    { id: "donusum", label: "Dönüşüm", type: "number", required: true },
    { id: "kontrol_ayi", label: "Kontrol Ayı", type: "number", required: true },
  ],
  outputs: [
    { id: "hard", label: "Hard", unit: "currency", format: "currency" },
    { id: "soft", label: "Soft", unit: "currency", format: "currency" },
    { id: "imp_cost", label: "Imp Cost", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
    { id: "payback", label: "Payback", unit: "currency", format: "currency" },
    { id: "sust", label: "Sust", unit: "currency", format: "currency" },
    { id: "cum", label: "Cum", unit: "currency", format: "currency" },
    { id: "opp", label: "Opp", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kaizen_tasarruf_takipcisi_analyzer_0", inputMap: { Baseline: "baseline", Actual: "actual", Vol: "vol" }, outputId: "hard" },
    { formulaId: "custom.kaizen_tasarruf_takipcisi_analyzer_1", inputMap: { TimeSaved: "time_saved", LabRate: "lab_rate", Conv: "conv" }, outputId: "soft" },
    { formulaId: "custom.kaizen_tasarruf_takipcisi_analyzer_2", inputMap: { Lab_K: "lab__k", Mat: "mat", Down: "down" }, outputId: "imp_cost" },
    { formulaId: "custom.kaizen_tasarruf_takipcisi_analyzer_3", inputMap: { Hard: "hard", Soft: "soft", ImpCost: "imp_cost" }, outputId: "r_o_i" },
    { formulaId: "custom.kaizen_tasarruf_takipcisi_analyzer_4", inputMap: { ImpCost: "imp_cost", MonthSav: "month_sav" }, outputId: "payback" },
    { formulaId: "custom.kaizen_tasarruf_takipcisi_analyzer_5", inputMap: { Sav_M6: "sav__m6", Sav_M1: "sav__m1" }, outputId: "sust" },
    { formulaId: "custom.kaizen_tasarruf_takipcisi_analyzer_6", inputMap: { MonthSav: "month_sav" }, outputId: "cum" },
    { formulaId: "custom.kaizen_tasarruf_takipcisi_analyzer_7", inputMap: { Time_K: "time__k", ProdRate: "prod_rate", Margin: "margin" }, outputId: "opp" },
  ],
  reportTemplate: {
    title: "KAIZEN TASARRUF TAKİPÇİSİ Report",
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
