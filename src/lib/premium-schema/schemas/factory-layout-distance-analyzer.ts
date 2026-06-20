/**
 * Tool #39 — Fabrika Yerleşim Mesafe
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FACTORY_LAYOUT_SCHEMA: PremiumCalculatorSchema = {
  id: "factory-layout-distance-analyzer", legacyPaidSlug: "factory-layout-distance-analyzer",
  name: "Fabrika Yerleşim Mesafe & Akış Analizi", sectorSlug: "sheet-metal", category: "measurement",
  painStatement: "Fabrika içi malzeme akış mesafeleri optimize edilmezse taşıma maliyeti artar ve verimlilik düşer.",
  inputs: [
    { id: "flowMatrix", label: "Akış Matrisi (2D dizi)", type: "number", unit: "", matrix: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Material flow between departments" },
    { id: "distanceMatrix", label: "Mesafe Matrisi (2D dizi)", type: "number", unit: "m", matrix: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Distance between departments" },
    { id: "costPerDist", label: "Birim Taşıma Maliyeti", type: "number", unit: "USD/m", required: true, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Cost per unit distance" },
    { id: "equipmentArea", label: "Ekipman Alanı", type: "number", unit: "m²", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Total equipment footprint" },
    { id: "facilityArea", label: "Tesis Alanı", type: "number", unit: "m²", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total facility area" },
    { id: "matHandlingCost", label: "Malzeme Taşıma Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Material handling cost" },
    { id: "spaceCost", label: "Alan Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Space cost" },
    { id: "congestionCost", label: "Sıkışıklık Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Congestion cost" },
  ],
  outputs: [
    { id: "totalFlowCost", label: "Toplam Akış Maliyeti", unit: "USD", format: "currency" },
    { id: "spaceUtilization", label: "Alan Kullanım Oranı", unit: "%", format: "percentage" },
    { id: "totalLayoutCost", label: "Toplam Yerleşim Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "spaceUtilization", warning: 50, critical: 35, direction: "lower_is_bad", warningMessage: "Alan kullanımı < %50 — yerleşim optimizasyonu önerilir.", criticalMessage: "Alan kullanımı < %35 — acil yeniden düzenleme." }],
  formulaPipeline: [
    { formulaId: "measurement.layout_flow_cost", inputMap: { flowMatrix: "flowMatrix", distanceMatrix: "distanceMatrix", costPerDist: "costPerDist" }, outputId: "totalFlowCost" },
    { formulaId: "measurement.layout_space_util", inputMap: { equipmentArea: "equipmentArea", facilityArea: "facilityArea" }, outputId: "spaceUtilization" },
    { formulaId: "cost.layout_total_cost", inputMap: { matHandlingCost: "matHandlingCost", spaceCost: "spaceCost", congestionCost: "congestionCost" }, outputId: "totalLayoutCost" },
  ],
  reportTemplate: { title: "Factory Layout Distance Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Flow cost = Σ(Flow×Dist×CostPerDist).", "Space util = EquipArea/FacArea.", "Total = MatHandling+Space+Congestion."] },
};
