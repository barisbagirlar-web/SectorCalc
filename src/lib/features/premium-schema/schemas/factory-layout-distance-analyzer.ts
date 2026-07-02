
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FACTORY_LAYOUT_SCHEMA: PremiumCalculatorSchema = {
  id: "factory-layout-distance-analyzer", legacyPaidSlug: "factory-layout-distance-analyzer",
  name: "Factory Layout Distance & Flow Analyzer", name_i18n: {"en":"Factory Layout Distance & Flow Analyzer"}, sectorSlug: "sheet-metal", category: "measurement",
  painStatement: "If in-plant material flow distances are not optimized, carrying cost increases and productivity decreases.", painStatement_i18n: {"en":"If in-plant material flow distances are not optimized, carrying cost increases and productivity decreases."},
  inputs: [
    { id: "flowMatrix", label: "Material flow between departments", label_i18n: {"en":"Material flow between departments"}, type: "number", unit: "scalar", matrix: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Material flow between departments", expertMeaning_i18n: {"en":"Material flow between departments"} },
    { id: "distanceMatrix", label: "Distance Matrisi (2D dizi)", label_i18n: {"en":"Distance Matrisi (2D dizi)"}, type: "number", unit: "m", matrix: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Distance between departments", expertMeaning_i18n: {"en":"Distance between departments"} },
    { id: "costPerDist", label: "Cost per unit distance", label_i18n: {"en":"Cost per unit distance"}, type: "number", unit: "USD/m", required: true, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Cost per unit distance", expertMeaning_i18n: {"en":"Cost per unit distance"} },
    { id: "equipmentArea", label: "Total equipment footprint", label_i18n: {"en":"Total equipment footprint"}, type: "number", unit: "m²", required: false, smartDefault: 800, validation: { min: 0 }, helper: "", expertMeaning: "Total equipment footprint", expertMeaning_i18n: {"en":"Total equipment footprint"} },
    { id: "facilityArea", label: "Total facility area", label_i18n: {"en":"Total facility area"}, type: "number", unit: "m²", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total facility area", expertMeaning_i18n: {"en":"Total facility area"} },
    { id: "matHandlingCost", label: "Material handling cost", label_i18n: {"en":"Material handling cost"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Material handling cost", expertMeaning_i18n: {"en":"Material handling cost"} },
    { id: "spaceCost", label: "Alan Cost", label_i18n: {"en":"Alan Cost"}, type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Space cost", expertMeaning_i18n: {"en":"Space cost"} },
    { id: "congestionCost", label: "Congestion cost", label_i18n: {"en":"Congestion cost"}, type: "number", unit: "USD", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Congestion cost", expertMeaning_i18n: {"en":"Congestion cost"} },
  ],
  outputs: [
    { id: "totalFlowCost", label: "Total Aks Cost", label_i18n: {"en":"Total Aks Cost"}, unit: "USD", format: "currency" },
    { id: "spaceUtilization", label: "Alan Utilization Rate", label_i18n: {"en":"Alan Utilization Rate"}, unit: "%", format: "percentage" },
    { id: "totalLayoutCost", label: "Total Yerlesim Cost", label_i18n: {"en":"Total Yerlesim Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "spaceUtilization", warning: 50, critical: 35, direction: "lower_is_bad", warningMessage: "Space utilization < 50% - layout optimization recommended.", warningMessage_i18n: {"en":"Space utilization < 50% - layout optimization recommended."}, criticalMessage: "Space utilization < 35% - urgent rearrangement.", criticalMessage_i18n: {"en":"Space utilization < 35% - urgent rearrangement."} }],
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
        congestion: "congestionCost",
        congCost: "congestionCost"}, outputId: "totalLayoutCost" },
  ],
  reportTemplate: { title: "Factory Layout Distance Report", title_i18n: {"en":"Factory Layout Distance Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Flow cost = Σ(Flow×Dist×CostPerDist).", "Space util = EquipArea/FacArea.", "Total = MatHandling+Space+Congestion."],assumptionNotes_i18n:[{"en":"Flow cost = Σ(Flow×Dist×CostPerDist)."},{"en":"Space util = EquipArea/FacArea."},{"en":"Total = MatHandling+Space+Congestion."}] },
};
