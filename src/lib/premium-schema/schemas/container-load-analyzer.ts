import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CONTAINER_LOAD_SCHEMA: PremiumCalculatorSchema = {
  id: "container-load-analyzer", legacyPaidSlug: "container-load-analyzer",
  name: "Konteyner Yük Optimizasyonu", sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Konteyner doluluk oranı hesaplanmazsa, taşıma maliyeti optimize edilemez ve boş alan israfı oluşur.",
  inputs: [
    { id: "containerType", label: "Konteyner Tipi", type: "select", unit: "", enumValues: ["20DC", "40DC", "40HC", "20RF", "40RF"], required: true, smartDefault: "40DC", helper: "", expertMeaning: "Container type" },
    { id: "containerVol", label: "İç Hacim", type: "number", unit: "m³", required: true, smartDefault: 67.3, validation: { min: 1 }, helper: "", expertMeaning: "Internal volume" },
    { id: "maxPayload", label: "Maksimum Payload", type: "number", unit: "kg", required: true, smartDefault: 28000, validation: { min: 1 }, helper: "", expertMeaning: "Max payload" },
    { id: "itemVolumes", label: "Ürün Hacimleri", type: "number", unit: "m³", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Item volumes array" },
    { id: "itemWeights", label: "Ürün Ağırlıkları", type: "number", unit: "kg", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Item weights array" },
    { id: "grossWeight", label: "Brüt Ağırlık", type: "number", unit: "kg", required: true, smartDefault: 22000, validation: { min: 0 }, helper: "", expertMeaning: "Total gross weight" },
    { id: "freightCost", label: "Konteyner Taşıma Bedeli", type: "number", unit: "USD", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Container freight cost" },
    { id: "containerHeight", label: "Konteyner İç Yüksekliği", type: "number", unit: "m", required: false, smartDefault: 2.39, validation: { min: 0 }, helper: "", expertMeaning: "Internal height" },
    { id: "palletHeight", label: "Palet Yüksekliği", type: "number", unit: "m", required: false, smartDefault: 1.2, validation: { min: 0 }, helper: "", expertMeaning: "Pallet height" },
  ],
  outputs: [
    { id: "volUtil", label: "Hacim Doluluk", unit: "%", format: "percentage" },
    { id: "weightUtil", label: "Ağırlık Doluluk", unit: "%", format: "percentage" },
    { id: "loadEfficiency", label: "Yükleme Verimi", unit: "%", format: "percentage" },
    { id: "wastedSpaceCost", label: "Boş Alan Maliyeti", unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "loadEfficiency", warning: 75, critical: 50, direction: "lower_is_bad", warningMessage: "Verim < %75 — konteyner optimizasyonu önerilir.", criticalMessage: "Verim < %50 — yükleme planı yenilenmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.container_vol_util", inputMap: { itemVolumes: "itemVolumes", containerVol: "containerVol" }, outputId: "volUtil" },
    { formulaId: "measurement.container_weight_util", inputMap: { itemWeights: "itemWeights", maxPayload: "maxPayload" }, outputId: "weightUtil" },
    { formulaId: "measurement.container_efficiency", inputMap: { volUtil: "volUtil", weightUtil: "weightUtil" }, outputId: "loadEfficiency" },
    { formulaId: "cost.container_waste_cost", inputMap: { loadEfficiency: "loadEfficiency", freightCost: "freightCost" }, outputId: "wastedSpaceCost" },
  ],
  reportTemplate: { title: "Konteyner Yük Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Doluluk = min(Hacim%, Ağırlık%).", "Boş alan maliyeti = (1 - Verim) × Navlun."] },
};
