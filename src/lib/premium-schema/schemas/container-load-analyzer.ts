import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CONTAINER_LOAD_SCHEMA: PremiumCalculatorSchema = {
  id: "container-load-analyzer", legacyPaidSlug: "container-load-analyzer",
  name: "Konteyner Yük Optimizasyonu", name_i18n: {"en":"Container Load Optimization","tr":"Konteyner Yük Optimizasyonu"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Konteyner doluluk oranı hesaplanmazsa, taşıma maliyeti optimize edilemez ve boş alan israfı oluşur.", painStatement_i18n: {"en":"If container fill rate is not calculated, transport cost cannot be optimized and empty space is wasted.","tr":"Konteyner doluluk oranı hesaplanmazsa, taşıma maliyeti optimize edilemez ve boş alan israfı oluşur."},
  inputs: [
    { id: "containerType", label: "Konteyner Tipi", label_i18n: {"en":"Container Type","tr":"Konteyner Tipi"}, type: "select", unit: "", enumValues: ["20DC", "40DC", "40HC", "20RF", "40RF"], required: true, smartDefault: "40DC", helper: "", expertMeaning: "Container type", expertMeaning_i18n: {"en":"Container type","tr":"Konteyner tipi"} },
    { id: "containerVol", label: "İç Hacim", label_i18n: {"en":"Internal Volume","tr":"İç Hacim"}, type: "number", unit: "m³", required: true, smartDefault: 67.3, validation: { min: 1 }, helper: "", expertMeaning: "Internal volume", expertMeaning_i18n: {"en":"Internal volume","tr":"İç hacim"} },
    { id: "maxPayload", label: "Maksimum Payload", label_i18n: {"en":"Max Payload","tr":"Maksimum Payload"}, type: "number", unit: "kg", required: true, smartDefault: 28000, validation: { min: 1 }, helper: "", expertMeaning: "Max payload", expertMeaning_i18n: {"en":"Max payload","tr":"Maksimum yük kapasitesi"} },
    { id: "itemVolumes", label: "Ürün Hacimleri", label_i18n: {"en":"Item Volumes","tr":"Ürün Hacimleri"}, type: "number", unit: "m³", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Item volumes array", expertMeaning_i18n: {"en":"Item volumes array","tr":"Ürün hacim dizisi"} },
    { id: "itemWeights", label: "Ürün Ağırlıkları", label_i18n: {"en":"Item Weights","tr":"Ürün Ağırlıkları"}, type: "number", unit: "kg", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Item weights array", expertMeaning_i18n: {"en":"Item weights array","tr":"Ürün ağırlık dizisi"} },
    { id: "grossWeight", label: "Brüt Ağırlık", label_i18n: {"en":"Gross Weight","tr":"Brüt Ağırlık"}, type: "number", unit: "kg", required: true, smartDefault: 22000, validation: { min: 0 }, helper: "", expertMeaning: "Total gross weight", expertMeaning_i18n: {"en":"Total gross weight","tr":"Toplam brüt ağırlık"} },
    { id: "freightCost", label: "Konteyner Taşıma Bedeli", label_i18n: {"en":"Container Freight Cost","tr":"Konteyner Taşıma Bedeli"}, type: "number", unit: "USD", required: true, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "Container freight cost", expertMeaning_i18n: {"en":"Container freight cost","tr":"Konteyner navlun bedeli"} },
    { id: "containerHeight", label: "Konteyner İç Yüksekliği", label_i18n: {"en":"Container Internal Height","tr":"Konteyner İç Yüksekliği"}, type: "number", unit: "m", required: false, smartDefault: 2.39, validation: { min: 0 }, helper: "", expertMeaning: "Internal height", expertMeaning_i18n: {"en":"Internal height","tr":"İç yükseklik"} },
    { id: "palletHeight", label: "Palet Yüksekliği", label_i18n: {"en":"Pallet Height","tr":"Palet Yüksekliği"}, type: "number", unit: "m", required: false, smartDefault: 1.2, validation: { min: 0 }, helper: "", expertMeaning: "Pallet height", expertMeaning_i18n: {"en":"Pallet height","tr":"Palet yüksekliği"} },
  ],
  outputs: [
    { id: "volUtil", label: "Hacim Doluluk", label_i18n: {"en":"Volume Utilization","tr":"Hacim Doluluk"}, unit: "%", format: "percentage" },
    { id: "weightUtil", label: "Ağırlık Doluluk", label_i18n: {"en":"Weight Utilization","tr":"Ağırlık Doluluk"}, unit: "%", format: "percentage" },
    { id: "loadEfficiency", label: "Yükleme Verimi", label_i18n: {"en":"Loading Efficiency","tr":"Yükleme Verimi"}, unit: "%", format: "percentage" },
    { id: "wastedSpaceCost", label: "Boş Alan Maliyeti", label_i18n: {"en":"Wasted Space Cost","tr":"Boş Alan Maliyeti"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "loadEfficiency", warning: 75, critical: 50, direction: "lower_is_bad", warningMessage: "Verim < %75 — konteyner optimizasyonu önerilir.", warningMessage_i18n: {"en":"Efficiency < 75% — container optimization recommended.","tr":"Verim < %75 — konteyner optimizasyonu önerilir."}, criticalMessage: "Verim < %50 — yükleme planı yenilenmeli.", criticalMessage_i18n: {"en":"Efficiency < 50% — loading plan should be revised.","tr":"Verim < %50 — yükleme planı yenilenmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.container_vol_util", inputMap: { itemVolumes: "itemVolumes", containerVol: "containerVol" }, outputId: "volUtil" },
    { formulaId: "measurement.container_weight_util", inputMap: { itemWeights: "itemWeights", maxPayload: "maxPayload" }, outputId: "weightUtil" },
    { formulaId: "measurement.container_efficiency", inputMap: { volUtil: "volUtil", weightUtil: "weightUtil" }, outputId: "loadEfficiency" },
    { formulaId: "cost.container_waste_cost", inputMap: { loadEfficiency: "loadEfficiency", freightCost: "freightCost" }, outputId: "wastedSpaceCost" },
  ],
  reportTemplate: { title: "Konteyner Yük Raporu", title_i18n: {"en":"Container Load Report","tr":"Konteyner Yük Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Doluluk = min(Hacim%, Ağırlık%).", "Boş alan maliyeti = (1 - Verim) × Navlun."],assumptionNotes_i18n:[{"en":"Utilization = min(Volume%, Weight%).","tr":"Doluluk = min(Hacim%, Ağırlık%)."},{"en":"Wasted space cost = (1 - Efficiency) × Freight.","tr":"Boş alan maliyeti = (1 - Verim) × Navlun."}] },
};
