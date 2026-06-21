/**
 * Project Maliyet Tahmin — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PROJECTCOSTESTIMATE_SCHEMA: PremiumCalculatorSchema = {
  id: "project-cost-estimate-analyzer",
  legacyPaidSlug: "project-cost-estimate-analyzer",
  name: "Project Maliyet Tahmin",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Project Maliyet Tahmin — premium analysis tool.",
  inputs: [
    { id: "iscilik_saatleriucretleri", label: "İşçilik Saatleri/Ücretleri", type: "matrix", required: true },
    { id: "malzeme_listesi", label: "Malzeme Listesi", type: "matrix", required: true },
    { id: "ekipman_kiralama", label: "Ekipman Kiralama", type: "array", required: true },
    { id: "taseron_teklifleri", label: "Taşeron Teklifleri", type: "array", required: true },
    { id: "overhead_orani", label: "Overhead Oranı", type: "number", required: true },
    { id: "risk_kontenjansi", label: "Risk Kontenjansı", type: "number", required: true },
    { id: "onaylanmis_butce", label: "Onaylanmış Bütçe", type: "number", required: true },
  ],
  outputs: [
    { id: "direct_labor", label: "Direct Labor", unit: "currency", format: "currency" },
    { id: "direct_material", label: "Direct Material", unit: "currency", format: "currency" },
    { id: "equipment", label: "Equipment", unit: "currency", format: "currency" },
    { id: "subcontractor", label: "Subcontractor", unit: "currency", format: "currency" },
    { id: "overhead", label: "Overhead", unit: "currency", format: "currency" },
    { id: "contingency", label: "Contingency", unit: "currency", format: "currency" },
    { id: "total_estimate", label: "Total Estimate", unit: "currency", format: "currency" },
    { id: "cost_variance", label: "Cost Variance", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.project_maliyet_tahmin_analyzer_0", inputMap: { Hours_i: "hours_i", Rate_i: "rate_i" }, outputId: "direct_labor" },
    { formulaId: "custom.project_maliyet_tahmin_analyzer_1", inputMap: { Quantity_j: "quantity_j", Price_j: "price_j" }, outputId: "direct_material" },
    { formulaId: "custom.project_maliyet_tahmin_analyzer_2", inputMap: { RentalDays_k: "rental_days_k", DailyRate_k: "daily_rate_k" }, outputId: "equipment" },
    { formulaId: "custom.project_maliyet_tahmin_analyzer_3", inputMap: { LumpSum_m: "lump_sum_m" }, outputId: "subcontractor" },
    { formulaId: "custom.project_maliyet_tahmin_analyzer_4", inputMap: { DirectLabor: "direct_labor", DirectMaterial: "direct_material", OverheadRate: "overhead_rate" }, outputId: "overhead" },
    { formulaId: "custom.project_maliyet_tahmin_analyzer_5", inputMap: { Direct: "direct", Overhead: "overhead_orani", RiskFactor: "risk_factor" }, outputId: "contingency" },
    { formulaId: "custom.project_maliyet_tahmin_analyzer_6", inputMap: { DirectLabor: "direct_labor", DirectMaterial: "direct_material", Equipment: "equipment", Subcontractor: "subcontractor", Overhead: "overhead_orani", Contingency: "contingency" }, outputId: "total_estimate" },
    { formulaId: "custom.project_maliyet_tahmin_analyzer_7", inputMap: { TotalEstimate: "total_estimate", Budget: "budget" }, outputId: "cost_variance" },
  ],
  reportTemplate: {
    title: "Project Maliyet Tahmin Report",
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
