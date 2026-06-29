import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FABRIC_CUTTING_SCHEMA: PremiumCalculatorSchema = {
  id: "fabric-cutting-optimizer-analyzer", legacyPaidSlug: "fabric-cutting-optimizer-analyzer",
  name: "Kumaş Kesim Optimize Edici", name_i18n: {"en":"Fabric Cutting Optimizer","tr":"Kumaş Kesim Optimize Edici"}, sectorSlug: "textile", category: "cost",
  painStatement: "Kumaş kesim verimi hesaplanmazsa, fire oranı ve kumaş maliyeti kontrol edilemez.", painStatement_i18n: {"en":"If fabric cutting efficiency is not calculated, waste rate and fabric cost cannot be controlled.","tr":"Kumaş kesim verimi hesaplanmazsa, fire oranı ve kumaş maliyeti kontrol edilemez."},
  inputs: [
    { id: "fabricWidth", label: "Kumaş Eni", label_i18n: {"en":"Fabric Width","tr":"Kumaş Eni"}, type: "number", unit: "m", required: true, smartDefault: 1.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Fabric width", expertMeaning_i18n: {"en":"Fabric width","tr":"Kumaş eni"} },
    { id: "markerLength", label: "Pastal Boyu", label_i18n: {"en":"Marker Length","tr":"Pastal Boyu"}, type: "number", unit: "m", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Marker length", expertMeaning_i18n: {"en":"Marker length","tr":"Pastal boyu"} },
    { id: "endLoss", label: "Fire/EndLoss", label_i18n: {"en":"Waste/End Loss","tr":"Fire/EndLoss"}, type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0, max: 20 }, helper: "", expertMeaning: "End loss percentage", expertMeaning_i18n: {"en":"End loss percentage","tr":"Fire/end kaybı yüzdesi"} },
    { id: "patternAreas", label: "Parça Alanları", label_i18n: {"en":"Pattern Piece Areas","tr":"Parça Alanları"}, type: "number", unit: "m²", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Pattern piece areas", expertMeaning_i18n: {"en":"Pattern piece areas","tr":"Kesim parça alanları"} },
    { id: "markerEfficiency", label: "Pastal Verimi", label_i18n: {"en":"Marker Efficiency","tr":"Pastal Verimi"}, type: "number", unit: "%", required: true, smartDefault: 85, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Marker efficiency", expertMeaning_i18n: {"en":"Marker efficiency","tr":"Pastal verimi"} },
    { id: "pricePerMeter", label: "Metretül Fiyatı", label_i18n: {"en":"Price Per Linear Meter","tr":"Metretül Fiyatı"}, type: "number", unit: "USD/m", required: true, smartDefault: 12, validation: { min: 0 }, helper: "", expertMeaning: "Fabric price per meter", expertMeaning_i18n: {"en":"Fabric price per meter","tr":"Metre başına kumaş fiyatı"} },
    { id: "spliceOverlap", label: "Bindirme Payı", label_i18n: {"en":"Splicing Overlap","tr":"Bindirme Payı"}, type: "number", unit: "m", required: false, smartDefault: 0.05, validation: { min: 0 }, helper: "", expertMeaning: "Splicing overlap length", expertMeaning_i18n: {"en":"Splicing overlap length","tr":"Bindirme payı uzunluğu"} },
    { id: "splices", label: "Birleştirme Sayısı", label_i18n: {"en":"Number of Splices","tr":"Birleştirme Sayısı"}, type: "number", unit: "", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Number of fabric splices", expertMeaning_i18n: {"en":"Number of fabric splices","tr":"Kumaş birleştirme sayısı"} },
    { id: "oldEfficiency", label: "Eski Pastal Verimi", label_i18n: {"en":"Previous Marker Efficiency","tr":"Eski Pastal Verimi"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Previous marker efficiency", expertMeaning_i18n: {"en":"Previous marker efficiency","tr":"Önceki pastal verimi"} },
  ],
  outputs: [
    { id: "cutEfficiency", label: "Kesim Verimi", label_i18n: {"en":"Cutting Efficiency","tr":"Kesim Verimi"}, unit: "%", format: "percentage" },
    { id: "fabricRequired", label: "Gerekli Kumaş", label_i18n: {"en":"Required Fabric","tr":"Gerekli Kumaş"}, unit: "m", format: "number" },
    { id: "fabricCost", label: "Kumaş Maliyeti", label_i18n: {"en":"Fabric Cost","tr":"Kumaş Maliyeti"}, unit: "USD", format: "currency" },
    { id: "utilGain", label: "Verim İyileştirme Kazancı", label_i18n: {"en":"Efficiency Improvement Gain","tr":"Verim İyileştirme Kazancı"}, unit: "USD", format: "currency" },
    { id: "totalYardage", label: "Toplam Pastal Boyu", label_i18n: {"en":"Total Marker Length","tr":"Toplam Pastal Boyu"}, unit: "m", format: "number" },
  ],
  thresholds: [{ fieldId: "cutEfficiency", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — pastal optimizasyonu önerilir.", warningMessage_i18n: {"en":"Efficiency < 80% — marker optimization recommended.","tr":"Verim < %80 — pastal optimizasyonu önerilir."}, criticalMessage: "Verim < %70 — acil iyileştirme gerekli.", criticalMessage_i18n: {"en":"Efficiency < 70% — urgent improvement needed.","tr":"Verim < %70 — acil iyileştirme gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.fabric_marker_eff", inputMap: { patternAreas: "patternAreas", markerLength: "markerLength", fabricWidth: "fabricWidth" }, outputId: "cutEfficiency" },
    { formulaId: "measurement.fabric_required", inputMap: { patternAreas: "patternAreas", markerEfficiency: "markerEfficiency", endLoss: "endLoss" }, outputId: "fabricRequired" },
    { formulaId: "cost.fabric_cost", inputMap: { fabricRequired: "fabricRequired", pricePerMeter: "pricePerMeter" }, outputId: "fabricCost" },
    { formulaId: "cost.fabric_util_gain", inputMap: { oldEfficiency: "oldEfficiency", markerEfficiency: "markerEfficiency", fabricRequired: "fabricRequired", pricePerMeter: "pricePerMeter" }, outputId: "utilGain" },
    { formulaId: "measurement.fabric_total_yardage", inputMap: { markerLength: "markerLength", endLoss: "endLoss", spliceOverlap: "spliceOverlap", splices: "splices" }, outputId: "totalYardage" },
  ],
  reportTemplate: { title: "Kumaş Kesim Raporu", title_i18n: {"en":"Fabric Cutting Report","tr":"Kumaş Kesim Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Verim = Toplam Parça Alanı / (Pastal × En).", "Gerekli kumaş = Alan / Verim × (1+Fire).", "İyileştirme = (Yeni - Eski) × Kumaş × Fiyat."],assumptionNotes_i18n:[{"en":"Efficiency = Total Piece Area / (Marker × Width).","tr":"Verim = Toplam Parça Alanı / (Pastal × En)."},{"en":"Required fabric = Area / Efficiency × (1+Waste).","tr":"Gerekli kumaş = Alan / Verim × (1+Fire)."},{"en":"Improvement = (New - Old) × Fabric × Price.","tr":"İyileştirme = (Yeni - Eski) × Kumaş × Fiyat."}] },
};
