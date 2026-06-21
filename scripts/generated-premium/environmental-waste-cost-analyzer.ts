/**
 * ENVIRONMENTAL FIRE — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ENVIRONMENTALWASTECOST_SCHEMA: PremiumCalculatorSchema = {
  id: "environmental-waste-cost-analyzer",
  legacyPaidSlug: "environmental-waste-cost-analyzer",
  name: "ENVIRONMENTAL FIRE",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ENVIRONMENTAL FIRE — premium analysis tool.",
  inputs: [
    { id: "tehlikesiztehlikeligeri_donusum", label: "Tehlikesiz/Tehlikeli/Geri Dönüşüm", type: "number", required: true },
    { id: "hava_emisyon", label: "Hava Emisyon", type: "number", required: true },
    { id: "depolamabertaraf_bedeli", label: "Depolama/Bertaraf Bedeli", type: "number", required: true },
    { id: "hurda_gelir", label: "Hurda Gelir", type: "number", required: true },
    { id: "ceza_risk", label: "Ceza Risk", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__disp", label: "Cost_ Disp", unit: "currency", format: "currency" },
    { id: "cost__haz", label: "Cost_ Haz", unit: "currency", format: "currency" },
    { id: "cost__recyc", label: "Cost_ Recyc", unit: "currency", format: "currency" },
    { id: "cost__emis", label: "Cost_ Emis", unit: "currency", format: "currency" },
    { id: "penalty_risk", label: "Penalty Risk", unit: "currency", format: "currency" },
    { id: "total", label: "Total", unit: "currency", format: "currency" },
    { id: "waste_intensity", label: "Waste Intensity", unit: "currency", format: "currency" },
    { id: "circularity", label: "Circularity", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.environmental_fire_analyzer_0", inputMap: { Waste: "waste", DispFee: "disp_fee" }, outputId: "cost__disp" },
    { formulaId: "custom.environmental_fire_analyzer_1", inputMap: { HazMass: "haz_mass", HazFee: "haz_fee", Surcharge: "surcharge" }, outputId: "cost__haz" },
    { formulaId: "custom.environmental_fire_analyzer_2", inputMap: { RecycMass: "recyc_mass", SortCost: "sort_cost", ScrapRev: "scrap_rev" }, outputId: "cost__recyc" },
    { formulaId: "custom.environmental_fire_analyzer_3", inputMap: { Air: "air", CarbonPrice: "carbon_price", Water: "water", TreatCost: "treat_cost" }, outputId: "cost__emis" },
    { formulaId: "custom.environmental_fire_analyzer_4", inputMap: { ProbViolation: "prob_violation", Fine: "fine" }, outputId: "penalty_risk" },
    { formulaId: "custom.environmental_fire_analyzer_5", inputMap: { Disp: "disp", Haz: "haz", Recyc: "recyc", Emis: "hava_emisyon", Penalty: "penalty" }, outputId: "total" },
    { formulaId: "custom.environmental_fire_analyzer_6", inputMap: { TotalWaste: "total_waste", Volume: "volume" }, outputId: "waste_intensity" },
    { formulaId: "custom.environmental_fire_analyzer_7", inputMap: { Recyc: "recyc", TotalWaste: "total_waste" }, outputId: "circularity" },
  ],
  reportTemplate: {
    title: "ENVIRONMENTAL FIRE Report",
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
