/**
 * Tool #25 — OEE ve Durma Süresi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const OEE_DOWNTIME_SCHEMA: PremiumCalculatorSchema = {
  id: "oee-downtime-analyzer", legacyPaidSlug: "oee-downtime-analyzer",
  name: "OEE ve Durma Süresi Analizi", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "OEE alt bileşenleri ve toplam ekipman verimliliği hesaplanmazsa durma süresinin gerçek maliyeti görünmez.",
  inputs: [
    { id: "plannedProdTime", label: "Planlı Üretim Süresi", type: "number", unit: "saat/vardiya", required: true, smartDefault: 480, validation: { min: 1 }, helper: "", expertMeaning: "Planned production time per shift" },
    { id: "downtimeMinutes", label: "Toplam Durma Süresi", type: "number", unit: "dakika/vardiya", required: true, smartDefault: 60, validation: { min: 0 }, helper: "", expertMeaning: "Total downtime per shift" },
    { id: "idealCycleMinutes", label: "İdeal Çevrim Süresi", type: "number", unit: "dakika/adet", required: true, smartDefault: 0.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Ideal cycle time per unit" },
    { id: "totalParts", label: "Üretilen Toplam Parça", type: "number", unit: "adet", required: true, smartDefault: 800, validation: { min: 1 }, helper: "", expertMeaning: "Total parts produced" },
    { id: "goodParts", label: "Sağlam Parça Sayısı", type: "number", unit: "adet", required: true, smartDefault: 760, validation: { min: 0 }, helper: "", expertMeaning: "Good (defect-free) parts" },
    { id: "machineHourlyCost", label: "Makine Saatlik Maliyeti", type: "number", unit: "USD/saat", required: true, smartDefault: 120, validation: { min: 0.01 }, helper: "", expertMeaning: "Machine cost per hour" },
    { id: "numShiftsYear", label: "Yıllık Vardiya Sayısı", type: "number", unit: "vardiya/yıl", required: false, smartDefault: 720, validation: { min: 1 }, helper: "", expertMeaning: "Shifts per year" },
  ],
  outputs: [
    { id: "oeeAvailability", label: "OEE Kullanılabilirlik", unit: "%", format: "number" },
    { id: "oeePerformance", label: "OEE Performans", unit: "%", format: "number" },
    { id: "oeeQuality", label: "OEE Kalite", unit: "%", format: "number" },
    { id: "oeeScore", label: "OEE Skoru", unit: "%", format: "number" },
    { id: "teepScore", label: "TEEP Skoru", unit: "%", format: "number" },
    { id: "downtimeCost", label: "Durma Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "speedLossCost", label: "Hız Kaybı Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "qualityLossCost", label: "Kalite Kaybı Maliyeti", unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "oeeScore", warning: 75, critical: 55, direction: "lower_is_bad", warningMessage: "OEE < %75 — iyileştirme fırsatı mevcut.", criticalMessage: "OEE < %55 — acil iyileştirme programı gerekiyor." }],
  formulaPipeline: [
    { formulaId: "measurement.oee_availability", inputMap: { plannedProdTime: "plannedProdTime", downtimeMinutes: "downtimeMinutes" }, outputId: "oeeAvailability" },
    { formulaId: "measurement.oee_performance", inputMap: { idealCycleMinutes: "idealCycleMinutes", totalParts: "totalParts", plannedProdTime: "plannedProdTime", downtimeMinutes: "downtimeMinutes" }, outputId: "oeePerformance" },
    { formulaId: "measurement.oee_quality", inputMap: { goodParts: "goodParts", totalParts: "totalParts" }, outputId: "oeeQuality" },
    { formulaId: "measurement.oee_score", inputMap: { oeeAvailability: "oeeAvailability", oeePerformance: "oeePerformance", oeeQuality: "oeeQuality" }, outputId: "oeeScore" },
    { formulaId: "measurement.teep_score", inputMap: { oeeScore: "oeeScore" }, outputId: "teepScore" },
    { formulaId: "cost.oee_downtime_cost", inputMap: { downtimeMinutes: "downtimeMinutes", machineHourlyCost: "machineHourlyCost", numShiftsYear: "numShiftsYear" }, outputId: "downtimeCost" },
    { formulaId: "cost.oee_speed_loss", inputMap: { idealCycleMinutes: "idealCycleMinutes", totalParts: "totalParts", plannedProdTime: "plannedProdTime", downtimeMinutes: "downtimeMinutes", machineHourlyCost: "machineHourlyCost", numShiftsYear: "numShiftsYear" }, outputId: "speedLossCost" },
    { formulaId: "cost.oee_quality_loss", inputMap: { goodParts: "goodParts", totalParts: "totalParts", machineHourlyCost: "machineHourlyCost", numShiftsYear: "numShiftsYear" }, outputId: "qualityLossCost" },
  ],
  reportTemplate: { title: "OEE & Downtime Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["OEE = Kullanılabilirlik × Performans × Kalite.", "Dünya-klasmanı OEE > %85.", "Hız kaybı = (ideal × toplam) − (planlanan − durma)."] },
};
