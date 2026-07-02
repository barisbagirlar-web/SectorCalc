import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CONTAINER_LOAD_SCHEMA: PremiumCalculatorSchema = {
  id: "container-load-analyzer", legacyPaidSlug: "container-load-analyzer",
  name: "Container Load Optimizer", name_i18n: {"en":"Container Load Optimizer"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "If container fill rate is not calculated, transportation cost cannot be optimized and void space is wasted.", painStatement_i18n: {"en":"If container fill rate is not calculated, transportation cost cannot be optimized and void space is wasted."},
  inputs: [
    { id: "containerType", label: "Konteyner Tipi", label_i18n: {"en":"Konteyner Tipi"}, type: "select", unit: "scalar", enumValues: ["20DC", "40DC", "40HC", "20RF", "40RF"], required: true, smartDefault: "40DC", helper: "", expertMeaning: "Container type", expertMeaning_i18n: {"en":"Container type"} },
    { id: "containerVol", label: "Internal volume", label_i18n: {"en":"Internal volume"}, type: "number", unit: "m³", required: true, smartDefault: 67.3, validation: { min: 1 }, helper: "", expertMeaning: "Internal volume", expertMeaning_i18n: {"en":"Internal volume"} },
    { id: "maxPayload", label: "Maksimum Payload", label_i18n: {"en":"Maksimum Payload"}, type: "number", unit: "kg", required: true, smartDefault: 28000, validation: { min: 1 }, helper: "", expertMeaning: "Max payload", expertMeaning_i18n: {"en":"Max payload"} },
    { id: "itemVolumes", label: "Item volumes array", label_i18n: {"en":"Item volumes array"}, type: "number", unit: "m³", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Item volumes array", expertMeaning_i18n: {"en":"Item volumes array"} },
    { id: "itemWeights", label: "Item weights array", label_i18n: {"en":"Item weights array"}, type: "number", unit: "kg", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Item weights array", expertMeaning_i18n: {"en":"Item weights array"} },
    { id: "grossWeight", label: "Total gross weight", label_i18n: {"en":"Total gross weight"}, type: "number", unit: "kg", required: true, smartDefault: 22000, validation: { min: 0 }, helper: "", expertMeaning: "Total gross weight", expertMeaning_i18n: {"en":"Total gross weight"} },
    { id: "freightCost", label: "Container freight cost", label_i18n: {"en":"Container freight cost"}, type: "number", unit: "USD", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Container freight cost", expertMeaning_i18n: {"en":"Container freight cost"} },
    { id: "containerHeight", label: "Internal height", label_i18n: {"en":"Internal height"}, type: "number", unit: "m", required: false, smartDefault: 2.39, validation: { min: 0 }, helper: "", expertMeaning: "Internal height", expertMeaning_i18n: {"en":"Internal height"} },
    { id: "palletHeight", label: "Pallet height", label_i18n: {"en":"Pallet height"}, type: "number", unit: "m", required: false, smartDefault: 1.2, validation: { min: 0 }, helper: "", expertMeaning: "Pallet height", expertMeaning_i18n: {"en":"Pallet height"} },
  ],
  outputs: [
    { id: "volUtil", label: "Hacim Doluluk", label_i18n: {"en":"Hacim Doluluk"}, unit: "%", format: "percentage" },
    { id: "weightUtil", label: "Weight Doluluk", label_i18n: {"en":"Weight Doluluk"}, unit: "%", format: "percentage" },
    { id: "loadEfficiency", label: "Loading Efficiency", label_i18n: {"en":"Loading Efficiency"}, unit: "%", format: "percentage" },
    { id: "wastedSpaceCost", label: "Void Space Cost", label_i18n: {"en":"Void Space Cost"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "loadEfficiency", warning: 75, critical: 50, direction: "lower_is_bad", warningMessage: "Efficiency < 75% — container optimization recommended.", warningMessage_i18n: {"en":"Efficiency < 75% — container optimization recommended."}, criticalMessage: "Efficiency < 50% — Loading plan should be revised.", criticalMessage_i18n: {"en":"Efficiency < 50% — Loading plan should be revised."} }],
  formulaPipeline: [
    { formulaId: "measurement.container_vol_util", inputMap: {
        containerVol: "containerVol",
        cargoVol: "itemVolumes"
      }, outputId: "volUtil" },
    { formulaId: "measurement.container_weight_util", inputMap: {
        maxPayload: "maxPayload",
        cargoWeight: "itemWeights"
      }, outputId: "weightUtil" },
    { formulaId: "measurement.container_efficiency", inputMap: { volUtil: "volUtil", weightUtil: "weightUtil" }, outputId: "loadEfficiency" },
    { formulaId: "cost.container_waste_cost", inputMap: {
        volUtil: "loadEfficiency",
        containerCost: "freightCost"
      }, outputId: "wastedSpaceCost" },
  ],
  reportTemplate: { title: "Container Load Optimization Report", title_i18n: {"en":"Container Load Optimization Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: [],assumptionNotes_i18n:[{"en":"Fill rate = min(Volume%, Weight%)."},{"en":"Empty space cost = (1 - Efficiency) × Freight."}] },
};
