import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const FABRIC_CUTTING_SCHEMA: PremiumCalculatorSchema = {
  id: "fabric-cutting-optimizer-analyzer", legacyPaidSlug: "fabric-cutting-optimizer-analyzer",
  name: "Kumaş Kesim Optimize Edici", name_i18n: {"en":"Kumas Kesim Optimize Edici"}, sectorSlug: "textile", category: "cost",
  painStatement: "Kumaş kesim verimi hesaplanmazsa, fire oranı ve kumaş maliyeti kontrol edilemez.", painStatement_i18n: {"en":"Kumaş kesim verimi hesaplanmazsa, fire oranı ve kumaş maliyeti kontrol edilemez."},
  inputs: [
    { id: "fabricWidth", label: "Kumaş Eni", label_i18n: {"en":"Fabric width"}, type: "number", unit: "m", required: true, smartDefault: 1.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Fabric width", expertMeaning_i18n: {"en":"Fabric width"} },
    { id: "markerLength", label: "Pastal Boyu", label_i18n: {"en":"Pastal Boyu"}, type: "number", unit: "m", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Marker length", expertMeaning_i18n: {"en":"Marker length"} },
    { id: "endLoss", label: "Fire/EndLoss", label_i18n: {"en":"Fire/EndLoss"}, type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0, max: 20 }, helper: "", expertMeaning: "End loss percentage", expertMeaning_i18n: {"en":"End loss percentage"} },
    { id: "patternAreas", label: "Parça Alanları", label_i18n: {"en":"Pattern piece areas"}, type: "number", unit: "m²", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Pattern piece areas", expertMeaning_i18n: {"en":"Pattern piece areas"} },
    { id: "markerEfficiency", label: "Pastal Verimi", label_i18n: {"en":"Pastal Verimi"}, type: "number", unit: "%", required: true, smartDefault: 85, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Marker efficiency", expertMeaning_i18n: {"en":"Marker efficiency"} },
    { id: "pricePerMeter", label: "Metretül Fiyatı", label_i18n: {"en":"Fabric price per meter"}, type: "number", unit: "USD/m", required: true, smartDefault: 12, validation: { min: 0 }, helper: "", expertMeaning: "Fabric price per meter", expertMeaning_i18n: {"en":"Fabric price per meter"} },
    { id: "spliceOverlap", label: "Bindirme Payı", label_i18n: {"en":"Splicing overlap length"}, type: "number", unit: "m", required: false, smartDefault: 0.05, validation: { min: 0 }, helper: "", expertMeaning: "Splicing overlap length", expertMeaning_i18n: {"en":"Splicing overlap length"} },
    { id: "splices", label: "Birleştirme Sayısı", label_i18n: {"en":"Number of fabric splices"}, type: "number", unit: "", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Number of fabric splices", expertMeaning_i18n: {"en":"Number of fabric splices"} },
    { id: "oldEfficiency", label: "Eski Pastal Verimi", label_i18n: {"en":"Eski Pastal Verimi"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Previous marker efficiency", expertMeaning_i18n: {"en":"Previous marker efficiency"} },
  ],
  outputs: [
    { id: "cutEfficiency", label: "Kesim Verimi", label_i18n: {"en":"Kesim Verimi"}, unit: "%", format: "percentage" },
    { id: "fabricRequired", label: "Gerekli Kumaş", label_i18n: {"en":"Gerekli Kumas"}, unit: "m", format: "number" },
    { id: "fabricCost", label: "Kumaş Maliyeti", label_i18n: {"en":"Kumas Maliyeti"}, unit: "USD", format: "currency" },
    { id: "utilGain", label: "Verim İyileştirme Kazancı", label_i18n: {"en":"Verim Iyilestirme Kazanc"}, unit: "USD", format: "currency" },
    { id: "totalYardage", label: "Toplam Pastal Boyu", label_i18n: {"en":"Toplam Pastal Boyu"}, unit: "m", format: "number" },
  ],
  thresholds: [{ fieldId: "cutEfficiency", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — pastal optimizasyonu önerilir.", warningMessage_i18n: {"en":"Verim < %80 — pastal optimizasyonu önerilir."}, criticalMessage: "Verim < %70 — acil iyileştirme gerekli.", criticalMessage_i18n: {"en":"Verim < %70 — acil iyileştirme gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.fabric_marker_eff", inputMap: {
        netArea: "patternAreas",
        grossArea: "markerLength",
        fabricWidth: "fabricWidth"
      }, outputId: "cutEfficiency" },
    { formulaId: "measurement.fabric_required", inputMap: {
        netArea: "patternAreas",
        markerEff: "markerEfficiency",
        endLoss: "endLoss"
      }, outputId: "fabricRequired" },
    { formulaId: "cost.fabric_cost", inputMap: {
        fabricRequired: "fabricRequired",
        pricePerUnit: "pricePerMeter"
      }, outputId: "fabricCost" },
    { formulaId: "cost.fabric_util_gain", inputMap: {
        oldWaste: "oldEfficiency",
        newWaste: "markerEfficiency",
        pricePerUnit: "fabricRequired",
        totalYards: "pricePerMeter"
      }, outputId: "utilGain" },
    { formulaId: "measurement.fabric_total_yardage", inputMap: {
        pieces: "markerLength",
        fabricRequired: "endLoss",
        spliceOverlap: "spliceOverlap",
        splices: "splices"
      }, outputId: "totalYardage" },
  ],
  reportTemplate: { title: "Kumaş Kesim Raporu", title_i18n: {"en":"Kumaş Kesim Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Verim = Toplam Parça Alanı / (Pastal × En).", "Gerekli kumaş = Alan / Verim × (1+Fire).", "İyileştirme = (Yeni - Eski) × Kumaş × Fiyat."],assumptionNotes_i18n:[{"en":"Verim = Toplam Parça Alanı / (Pastal × En)."},{"en":"Gerekli kumaş = Alan / Verim × (1+Fire)."},{"en":"İyileştirme = (Yeni - Eski) × Kumaş × Fiyat."}] },
};
