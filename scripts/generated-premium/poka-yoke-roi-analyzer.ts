/**
 * Poka-Yoke ROI — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const POKAYOKEROI_SCHEMA: PremiumCalculatorSchema = {
  id: "poka-yoke-roi-analyzer",
  legacyPaidSlug: "poka-yoke-roi-analyzer",
  name: "Poka-Yoke ROI",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Poka-Yoke ROI — premium analysis tool.",
  inputs: [
    { id: "mevcut_hata_orani", label: "Mevcut Hata Oranı", type: "number", required: true },
    { id: "hata_basina_maliyet", label: "Hata Başına Maliyet", type: "number", required: true },
    { id: "etkililik", label: "Etkililik", type: "number", required: true },
    { id: "yillik_uretim", label: "Yıllık Üretim", type: "number", required: true },
    { id: "tasarimuygulamaegitim_maliyeti", label: "Tasarım/Uygulama/Eğitim Maliyeti", type: "number", required: true },
    { id: "yillik_bakim_maliyeti", label: "Yıllık Bakım Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "current_defect_rate", label: "Current Defect Rate", unit: "currency", format: "currency" },
    { id: "defect_cost__annual", label: "Defect Cost_ Annual", unit: "currency", format: "currency" },
    { id: "poka_yoke__cost", label: "Poka Yoke_ Cost", unit: "currency", format: "currency" },
    { id: "new_defect_rate", label: "New Defect Rate", unit: "currency", format: "currency" },
    { id: "savings", label: "Savings", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
    { id: "payback_months", label: "Payback Months", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.poka_yoke_roi_analyzer_0", inputMap: { Defects: "defects", TotalUnits: "total_units" }, outputId: "current_defect_rate" },
    { formulaId: "custom.poka_yoke_roi_analyzer_1", inputMap: { CurrentDefectRate: "current_defect_rate", TotalUnits: "total_units", CostPerDefect: "cost_per_defect" }, outputId: "defect_cost__annual" },
    { formulaId: "custom.poka_yoke_roi_analyzer_2", inputMap: { Design: "design", Implementation: "implementation", Training: "training", Maintenance: "maintenance" }, outputId: "poka_yoke__cost" },
    { formulaId: "custom.poka_yoke_roi_analyzer_3", inputMap: { CurrentDefectRate: "current_defect_rate", Effectiveness: "effectiveness" }, outputId: "new_defect_rate" },
    { formulaId: "custom.poka_yoke_roi_analyzer_4", inputMap: { CurrentDefectRate: "current_defect_rate", NewDefectRate: "new_defect_rate", TotalUnits: "total_units", CostPerDefect: "cost_per_defect" }, outputId: "savings" },
    { formulaId: "custom.poka_yoke_roi_analyzer_5", inputMap: { Savings: "savings", PokaYoke_Cost: "poka_yoke__cost" }, outputId: "r_o_i" },
    { formulaId: "custom.poka_yoke_roi_analyzer_6", inputMap: { PokaYoke_Cost: "poka_yoke__cost", Savings: "savings" }, outputId: "payback_months" },
  ],
  reportTemplate: {
    title: "Poka-Yoke ROI Report",
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
