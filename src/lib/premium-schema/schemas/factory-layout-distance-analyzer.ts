/**
 * Tool #39 — Fabrika Yerleşim Mesafe
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FACTORY_LAYOUT_SCHEMA: PremiumCalculatorSchema = {
  id: "factory-layout-distance-analyzer", legacyPaidSlug: "factory-layout-distance-analyzer",
  name: "Fabrika Yerleşim Mesafe & Akış Analizi", name_i18n: {"en":"Factory Layout Distance & Flow Analysis","tr":"Fabrika Yerleşim Mesafe & Akış Analizi"}, sectorSlug: "sheet-metal", category: "measurement",
  painStatement: "Fabrika içi malzeme akış mesafeleri optimize edilmezse taşıma maliyeti artar ve verimlilik düşer.", painStatement_i18n: {"en":"If internal material flow distances are not optimized, transport cost increases and efficiency decreases.","tr":"Fabrika içi malzeme akış mesafeleri optimize edilmezse taşıma maliyeti artar ve verimlilik düşer."},
  inputs: [
    { id: "flowMatrix", label: "Akış Matrisi (2D dizi)", label_i18n: {"en":"Flow Matrix (2D array)","tr":"Akış Matrisi (2D dizi)"}, type: "number", unit: "", matrix: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Material flow between departments", expertMeaning_i18n: {"en":"Material flow between departments","tr":"Departmanlar arası malzeme akışı"} },
    { id: "distanceMatrix", label: "Mesafe Matrisi (2D dizi)", label_i18n: {"en":"Distance Matrix (2D array)","tr":"Mesafe Matrisi (2D dizi)"}, type: "number", unit: "m", matrix: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Distance between departments", expertMeaning_i18n: {"en":"Distance between departments","tr":"Departmanlar arası mesafe"} },
    { id: "costPerDist", label: "Birim Taşıma Maliyeti", label_i18n: {"en":"Unit Transport Cost","tr":"Birim Taşıma Maliyeti"}, type: "number", unit: "USD/m", required: true, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Cost per unit distance", expertMeaning_i18n: {"en":"Cost per unit distance","tr":"Birim mesafe başına maliyet"} },
    { id: "equipmentArea", label: "Ekipman Alanı", label_i18n: {"en":"Equipment Area","tr":"Ekipman Alanı"}, type: "number", unit: "m²", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Total equipment footprint", expertMeaning_i18n: {"en":"Total equipment footprint","tr":"Toplam ekipman alanı"} },
    { id: "facilityArea", label: "Tesis Alanı", label_i18n: {"en":"Facility Area","tr":"Tesis Alanı"}, type: "number", unit: "m²", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total facility area", expertMeaning_i18n: {"en":"Total facility area","tr":"Toplam tesis alanı"} },
    { id: "matHandlingCost", label: "Malzeme Taşıma Maliyeti", label_i18n: {"en":"Material Handling Cost","tr":"Malzeme Taşıma Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Material handling cost", expertMeaning_i18n: {"en":"Material handling cost","tr":"Malzeme taşıma maliyeti"} },
    { id: "spaceCost", label: "Alan Maliyeti", label_i18n: {"en":"Space Cost","tr":"Alan Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Space cost", expertMeaning_i18n: {"en":"Space cost","tr":"Alan maliyeti"} },
    { id: "congestionCost", label: "Sıkışıklık Maliyeti", label_i18n: {"en":"Congestion Cost","tr":"Sıkışıklık Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Congestion cost", expertMeaning_i18n: {"en":"Congestion cost","tr":"Sıkışıklık maliyeti"} },
  ],
  outputs: [
    { id: "totalFlowCost", label: "Toplam Akış Maliyeti", label_i18n: {"en":"Total Flow Cost","tr":"Toplam Akış Maliyeti"}, unit: "USD", format: "currency" },
    { id: "spaceUtilization", label: "Alan Kullanım Oranı", label_i18n: {"en":"Space Utilization Rate","tr":"Alan Kullanım Oranı"}, unit: "%", format: "percentage" },
    { id: "totalLayoutCost", label: "Toplam Yerleşim Maliyeti", label_i18n: {"en":"Total Layout Cost","tr":"Toplam Yerleşim Maliyeti"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "spaceUtilization", warning: 50, critical: 35, direction: "lower_is_bad", warningMessage: "Alan kullanımı < %50 — yerleşim optimizasyonu önerilir.", warningMessage_i18n: {"en":"Space utilization < 50% — layout optimization recommended.","tr":"Alan kullanımı < %50 — yerleşim optimizasyonu önerilir."}, criticalMessage: "Alan kullanımı < %35 — acil yeniden düzenleme.", criticalMessage_i18n: {"en":"Space utilization < 35% — urgent rearrangement needed.","tr":"Alan kullanımı < %35 — acil yeniden düzenleme."} }],
  formulaPipeline: [
    { formulaId: "measurement.layout_flow_cost", inputMap: { flowMatrix: "flowMatrix", distanceMatrix: "distanceMatrix", costPerDist: "costPerDist" }, outputId: "totalFlowCost" },
    { formulaId: "measurement.layout_space_util", inputMap: { equipmentArea: "equipmentArea", facilityArea: "facilityArea" }, outputId: "spaceUtilization" },
    { formulaId: "cost.layout_total_cost", inputMap: { matHandlingCost: "matHandlingCost", spaceCost: "spaceCost", congestionCost: "congestionCost" }, outputId: "totalLayoutCost" },
  ],
  reportTemplate: { title: "Factory Layout Distance Report", title_i18n: {"en":"Factory Layout Distance Report","tr":"Factory Layout Distance Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Flow cost = Σ(Flow×Dist×CostPerDist).", "Space util = EquipArea/FacArea.", "Total = MatHandling+Space+Congestion."],assumptionNotes_i18n:[{"en":"Flow cost = Σ(Flow×Dist×CostPerDist).","tr":"Flow cost = Σ(Flow×Dist×CostPerDist)."},{"en":"Space util = EquipArea/FacArea.","tr":"Space util = EquipArea/FacArea."},{"en":"Total = MatHandling+Space+Congestion.","tr":"Total = MatHandling+Space+Congestion."}] },
};
