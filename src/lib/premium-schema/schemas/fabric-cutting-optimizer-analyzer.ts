import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const FABRIC_CUTTING_SCHEMA: PremiumCalculatorSchema = {
  id: "fabric-cutting-optimizer-analyzer", legacyPaidSlug: "fabric-cutting-optimizer-analyzer",
  name: "Kumaş Kesim Optimize Edici", sectorSlug: "textile", category: "cost",
  painStatement: "Kumaş kesim verimi hesaplanmazsa, fire oranı ve kumaş maliyeti kontrol edilemez.",
  inputs: [
    { id: "fabricWidth", label: "Kumaş Eni", type: "number", unit: "m", required: true, smartDefault: 1.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Fabric width" },
    { id: "markerLength", label: "Pastal Boyu", type: "number", unit: "m", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Marker length" },
    { id: "endLoss", label: "Fire/EndLoss", type: "number", unit: "%", required: false, smartDefault: 2, validation: { min: 0, max: 20 }, helper: "", expertMeaning: "End loss percentage" },
    { id: "patternAreas", label: "Parça Alanları", type: "number", unit: "m²", array: true, required: true, validation: { min: 0 }, helper: "", expertMeaning: "Pattern piece areas" },
    { id: "markerEfficiency", label: "Pastal Verimi", type: "number", unit: "%", required: true, smartDefault: 85, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Marker efficiency" },
    { id: "pricePerMeter", label: "Metretül Fiyatı", type: "number", unit: "USD/m", required: true, smartDefault: 12, validation: { min: 0 }, helper: "", expertMeaning: "Fabric price per meter" },
    { id: "spliceOverlap", label: "Bindirme Payı", type: "number", unit: "m", required: false, smartDefault: 0.05, validation: { min: 0 }, helper: "", expertMeaning: "Splicing overlap length" },
    { id: "splices", label: "Birleştirme Sayısı", type: "number", unit: "", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Number of fabric splices" },
    { id: "oldEfficiency", label: "Eski Pastal Verimi", type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Previous marker efficiency" },
  ],
  outputs: [
    { id: "cutEfficiency", label: "Kesim Verimi", unit: "%", format: "percentage" },
    { id: "fabricRequired", label: "Gerekli Kumaş", unit: "m", format: "number" },
    { id: "fabricCost", label: "Kumaş Maliyeti", unit: "USD", format: "currency" },
    { id: "utilGain", label: "Verim İyileştirme Kazancı", unit: "USD", format: "currency" },
    { id: "totalYardage", label: "Toplam Pastal Boyu", unit: "m", format: "number" },
  ],
  thresholds: [{ fieldId: "cutEfficiency", warning: 80, critical: 70, direction: "lower_is_bad", warningMessage: "Verim < %80 — pastal optimizasyonu önerilir.", criticalMessage: "Verim < %70 — acil iyileştirme gerekli." }],
  formulaPipeline: [
    { formulaId: "measurement.fabric_marker_eff", inputMap: { patternAreas: "patternAreas", markerLength: "markerLength", fabricWidth: "fabricWidth" }, outputId: "cutEfficiency" },
    { formulaId: "measurement.fabric_required", inputMap: { patternAreas: "patternAreas", markerEfficiency: "markerEfficiency", endLoss: "endLoss" }, outputId: "fabricRequired" },
    { formulaId: "cost.fabric_cost", inputMap: { fabricRequired: "fabricRequired", pricePerMeter: "pricePerMeter" }, outputId: "fabricCost" },
    { formulaId: "cost.fabric_util_gain", inputMap: { oldEfficiency: "oldEfficiency", markerEfficiency: "markerEfficiency", fabricRequired: "fabricRequired", pricePerMeter: "pricePerMeter" }, outputId: "utilGain" },
    { formulaId: "measurement.fabric_total_yardage", inputMap: { markerLength: "markerLength", endLoss: "endLoss", spliceOverlap: "spliceOverlap", splices: "splices" }, outputId: "totalYardage" },
  ],
  reportTemplate: { title: "Kumaş Kesim Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.05, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Verim = Toplam Parça Alanı / (Pastal × En).", "Gerekli kumaş = Alan / Verim × (1+Fire).", "İyileştirme = (Yeni - Eski) × Kumaş × Fiyat."] },
};
