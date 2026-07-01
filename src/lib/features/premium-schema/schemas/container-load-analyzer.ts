import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CONTAINER_LOAD_SCHEMA: PremiumCalculatorSchema = {
  id: "container-load-analyzer", legacyPaidSlug: "container-load-analyzer",
  name: "Konteyner Yük Optimizasyonu", name_i18n: {"en":"Konteyner Yuk Optimizasyonu"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Konteyner doluluk oranı hesaplanmazsa, taşıma maliyeti optimize edilemez ve boş alan israfı oluşur.", painStatement_i18n: {"en":"Konteyner doluluk oranı hesaplanmazsa, taşıma maliyeti optimize edilemez ve boş alan israfı oluşur."},
  inputs: [
    { id: "containerType", label: "Konteyner Tipi", label_i18n: {"en":"Konteyner Tipi"}, type: "select", unit: "", enumValues: ["20DC", "40DC", "40HC", "20RF", "40RF"], required: true, smartDefault: "40DC", helper: "", expertMeaning: "Container type", expertMeaning_i18n: {"en":"Container type"} },
    { id: "containerVol", label: "İç Hacim", label_i18n: {"en":"Internal volume"}, type: "number", unit: "m³", required: true, smartDefault: 67.3, validation: { min: 1 }, helper: "", expertMeaning: "Internal volume", expertMeaning_i18n: {"en":"Internal volume"} },
    { id: "maxPayload", label: "Maksimum Payload", label_i18n: {"en":"Maksimum Payload"}, type: "number", unit: "kg", required: true, smartDefault: 28000, validation: { min: 1 }, helper: "", expertMeaning: "Max payload", expertMeaning_i18n: {"en":"Max payload"} },
    { id: "itemVolumes", label: "Ürün Hacimleri", label_i18n: {"en":"Item volumes array"}, type: "number", unit: "m³", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Item volumes array", expertMeaning_i18n: {"en":"Item volumes array"} },
    { id: "itemWeights", label: "Ürün Ağırlıkları", label_i18n: {"en":"Item weights array"}, type: "number", unit: "kg", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Item weights array", expertMeaning_i18n: {"en":"Item weights array"} },
    { id: "grossWeight", label: "Brüt Ağırlık", label_i18n: {"en":"Total gross weight"}, type: "number", unit: "kg", required: true, smartDefault: 22000, validation: { min: 0 }, helper: "", expertMeaning: "Total gross weight", expertMeaning_i18n: {"en":"Total gross weight"} },
    { id: "freightCost", label: "Konteyner Taşıma Bedeli", label_i18n: {"en":"Container freight cost"}, type: "number", unit: "USD", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Container freight cost", expertMeaning_i18n: {"en":"Container freight cost"} },
    { id: "containerHeight", label: "Konteyner İç Yüksekliği", label_i18n: {"en":"Internal height"}, type: "number", unit: "m", required: false, smartDefault: 2.39, validation: { min: 0 }, helper: "", expertMeaning: "Internal height", expertMeaning_i18n: {"en":"Internal height"} },
    { id: "palletHeight", label: "Palet Yüksekliği", label_i18n: {"en":"Pallet height"}, type: "number", unit: "m", required: false, smartDefault: 1.2, validation: { min: 0 }, helper: "", expertMeaning: "Pallet height", expertMeaning_i18n: {"en":"Pallet height"} },
  ],
  outputs: [
    { id: "volUtil", label: "Hacim Doluluk", label_i18n: {"en":"Hacim Doluluk"}, unit: "%", format: "percentage" },
    { id: "weightUtil", label: "Ağırlık Doluluk", label_i18n: {"en":"Agrlk Doluluk"}, unit: "%", format: "percentage" },
    { id: "loadEfficiency", label: "Yükleme Verimi", label_i18n: {"en":"Yukleme Verimi"}, unit: "%", format: "percentage" },
    { id: "wastedSpaceCost", label: "Boş Alan Maliyeti", label_i18n: {"en":"Bos Alan Maliyeti"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "loadEfficiency", warning: 75, critical: 50, direction: "lower_is_bad", warningMessage: "Verim < %75 — konteyner optimizasyonu önerilir.", warningMessage_i18n: {"en":"Verim < %75 — konteyner optimizasyonu önerilir."}, criticalMessage: "Verim < %50 — yükleme planı yenilenmeli.", criticalMessage_i18n: {"en":"Verim < %50 — yükleme planı yenilenmeli."} }],
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
  reportTemplate: { title: "Konteyner Yük Raporu", title_i18n: {"en":"Konteyner Yük Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Doluluk = min(Hacim%, Ağırlık%).", "Boş alan maliyeti = (1 - Verim) × Navlun."],assumptionNotes_i18n:[{"en":"Doluluk = min(Hacim%, Ağırlık%)."},{"en":"Boş alan maliyeti = (1 - Verim) × Navlun."}] },
};
