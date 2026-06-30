/**
 * Tool #39 — Fabrika Yerleşim Mesafe
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FACTORY_LAYOUT_SCHEMA: PremiumCalculatorSchema = {
  id: "factory-layout-distance-analyzer", legacyPaidSlug: "factory-layout-distance-analyzer",
  name: "Fabrika Yerleşim Mesafe & Akış Analizi", name_i18n: {"en":"Factory Layout Distance & Flow Analyzer","tr":"Fabrika Yerleşim Mesafe & Akış Analizi"}, sectorSlug: "sheet-metal", category: "measurement",
  painStatement: "Fabrika içi malzeme akış mesafeleri optimize edilmezse taşıma maliyeti artar ve verimlilik düşer.", painStatement_i18n: {"en":"Fabrika içi malzeme akış mesafeleri optimize edilmezse taşıma maliyeti artar ve verimlilik düşer.","tr":"Fabrika içi malzeme akış mesafeleri optimize edilmezse taşıma maliyeti artar ve verimlilik düşer."},
  inputs: [
    { id: "flowMatrix", label: "Akış Matrisi (2D dizi)", label_i18n: {"en":"Material flow between departments","tr":"Akış Matrisi (2D dizi)"}, type: "number", unit: "", matrix: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Material flow between departments", expertMeaning_i18n: {"en":"Material flow between departments","tr":"akış matrisi (2d dizi)"} },
    { id: "distanceMatrix", label: "Mesafe Matrisi (2D dizi)", label_i18n: {"en":"Mesafe Matrisi (2D dizi)","tr":"Mesafe Matrisi (2D dizi)"}, type: "number", unit: "m", matrix: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Distance between departments", expertMeaning_i18n: {"en":"Distance between departments","tr":"Distance between departments"} },
    { id: "costPerDist", label: "Birim Taşıma Maliyeti", label_i18n: {"en":"Cost per unit distance","tr":"Birim Taşıma Maliyeti"}, type: "number", unit: "USD/m", required: true, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Cost per unit distance", expertMeaning_i18n: {"en":"Cost per unit distance","tr":"birim taşıma maliyeti"} },
    { id: "equipmentArea", label: "Ekipman Alanı", label_i18n: {"en":"Total equipment footprint","tr":"Ekipman Alanı"}, type: "number", unit: "m²", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Total equipment footprint", expertMeaning_i18n: {"en":"Total equipment footprint","tr":"ekipman alanı"} },
    { id: "facilityArea", label: "Tesis Alanı", label_i18n: {"en":"Total facility area","tr":"Tesis Alanı"}, type: "number", unit: "m²", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total facility area", expertMeaning_i18n: {"en":"Total facility area","tr":"tesis alanı"} },
    { id: "matHandlingCost", label: "Malzeme Taşıma Maliyeti", label_i18n: {"en":"Material handling cost","tr":"Malzeme Taşıma Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Material handling cost", expertMeaning_i18n: {"en":"Material handling cost","tr":"malzeme taşıma maliyeti"} },
    { id: "spaceCost", label: "Alan Maliyeti", label_i18n: {"en":"Alan Maliyeti","tr":"Alan Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Space cost", expertMeaning_i18n: {"en":"Space cost","tr":"Space cost"} },
    { id: "congestionCost", label: "Sıkışıklık Maliyeti", label_i18n: {"en":"Congestion cost","tr":"Sıkışıklık Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Congestion cost", expertMeaning_i18n: {"en":"Congestion cost","tr":"sıkışıklık maliyeti"} },
  ],
  outputs: [
    { id: "totalFlowCost", label: "Toplam Akış Maliyeti", label_i18n: {"en":"Toplam Aks Maliyeti","tr":"Toplam Akış Maliyeti"}, unit: "USD", format: "currency" },
    { id: "spaceUtilization", label: "Alan Kullanım Oranı", label_i18n: {"en":"Alan Kullanm Oran","tr":"Alan Kullanım Oranı"}, unit: "%", format: "percentage" },
    { id: "totalLayoutCost", label: "Toplam Yerleşim Maliyeti", label_i18n: {"en":"Toplam Yerlesim Maliyeti","tr":"Toplam Yerleşim Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "spaceUtilization", warning: 50, critical: 35, direction: "lower_is_bad", warningMessage: "Alan kullanımı < %50 — yerleşim optimizasyonu önerilir.", warningMessage_i18n: {"en":"Alan kullanımı < %50 — yerleşim optimizasyonu önerilir.","tr":"Alan kullanımı < %50 — yerleşim optimizasyonu önerilir."}, criticalMessage: "Alan kullanımı < %35 — acil yeniden düzenleme.", criticalMessage_i18n: {"en":"Alan kullanımı < %35 — acil yeniden düzenleme.","tr":"Alan kullanımı < %35 — acil yeniden düzenleme."} }],
  formulaPipeline: [
    { formulaId: "measurement.layout_flow_cost", inputMap: { flowMatrix: "flowMatrix", distanceMatrix: "distanceMatrix", costPerDist: "costPerDist" }, outputId: "totalFlowCost" },
    { formulaId: "measurement.layout_space_util", inputMap: {
        equipArea: "equipmentArea",
        facArea: "facilityArea"
      }, outputId: "spaceUtilization" },
    { formulaId: "cost.layout_total_cost", inputMap: {
        spaceCost: "spaceCost",
        matHandCost: "matHandlingCost",
        spaceUtil: "congestionCost"
      ,
        congestion: "congestion",
        congCost: "congCost"}, outputId: "totalLayoutCost" },
  ],
  reportTemplate: { title: "Factory Layout Distance Report", title_i18n: {"en":"Factory Layout Distance Report","tr":"Factory Layout Distance Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Flow cost = Σ(Flow×Dist×CostPerDist).", "Space util = EquipArea/FacArea.", "Total = MatHandling+Space+Congestion."],assumptionNotes_i18n:[{"en":"Flow cost = Σ(Flow×Dist×CostPerDist).","tr":"Flow cost = Σ(Flow×Dist×CostPerDist)."},{"en":"Space util = EquipArea/FacArea.","tr":"Space util = EquipArea/FacArea."},{"en":"Total = MatHandling+Space+Congestion.","tr":"Total = MatHandling+Space+Congestion."}] },
};
