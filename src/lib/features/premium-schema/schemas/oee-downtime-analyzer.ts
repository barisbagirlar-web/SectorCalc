/**
 * Tool #25 — OEE ve Durma Süresi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const OEE_DOWNTIME_SCHEMA: PremiumCalculatorSchema = {
  id: "oee-downtime-analyzer", legacyPaidSlug: "oee-downtime-analyzer",
  name: "OEE ve Durma Süresi Analizi", name_i18n: {"en":"OEE & Downtime Analysis"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Without calculating OEE subcomponents and overall equipment effectiveness, the true cost of downtime remains hidden.", painStatement_i18n: {"en":"Without calculating OEE subcomponents and overall equipment effectiveness, the true cost of downtime remains hidden."},
  inputs: [
    { id: "plannedProdTime", label: "Planned Production Time", label_i18n: {"en":"Planned Production Time"}, type: "number", unit: "saat/vardiya", required: true, smartDefault: 480, validation: { min: 1 }, helper: "", expertMeaning: "Planned production time per shift", expertMeaning_i18n: {"en":"Planned production time per shift"} },
    { id: "downtimeMinutes", label: "Toplam Durma Süresi", label_i18n: {"en":"Total Downtime"}, type: "number", unit: "dakika/vardiya", required: true, smartDefault: 60, validation: { min: 0 }, helper: "", expertMeaning: "Total downtime per shift", expertMeaning_i18n: {"en":"Total downtime per shift"} },
    { id: "idealCycleMinutes", label: "Ideal Cycle Time", label_i18n: {"en":"Ideal Cycle Time"}, type: "number", unit: "dakika/adet", required: true, smartDefault: 0.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Ideal cycle time per unit", expertMeaning_i18n: {"en":"Ideal cycle time per unit"} },
    { id: "totalParts", label: "Total Parts Produced", label_i18n: {"en":"Total Parts Produced"}, type: "number", unit: "adet", required: true, smartDefault: 800, validation: { min: 1 }, helper: "", expertMeaning: "Total parts produced", expertMeaning_i18n: {"en":"Total parts produced"} },
    { id: "goodParts", label: "Good Parts Count", label_i18n: {"en":"Good Parts Count"}, type: "number", unit: "adet", required: true, smartDefault: 760, validation: { min: 0 }, helper: "", expertMeaning: "Good (defect-free) parts", expertMeaning_i18n: {"en":"Good (defect-free) parts"} },
    { id: "machineHourlyCost", label: "Makine Saatlik Maliyeti", label_i18n: {"en":"Machine Hourly Cost"}, type: "number", unit: "USD/saat", required: true, smartDefault: 120, validation: { min: 0.01 }, helper: "", expertMeaning: "Machine cost per hour", expertMeaning_i18n: {"en":"Machine cost per hour"} },
    { id: "numShiftsYear", label: "Annual Shift Count", label_i18n: {"en":"Annual Shift Count"}, type: "number", unit: "vardiya/yıl", required: false, smartDefault: 720, validation: { min: 1 }, helper: "", expertMeaning: "Shifts per year", expertMeaning_i18n: {"en":"Shifts per year"} },
  ],
  outputs: [
    { id: "oeeAvailability", label: "OEE Kullanlabilirlik", label_i18n: {"en":"OEE Kullanlabilirlik"}, unit: "%", format: "number" },
    { id: "oeePerformance", label: "OEE Performans", label_i18n: {"en":"OEE Performans"}, unit: "%", format: "number" },
    { id: "oeeQuality", label: "OEE Kalite", label_i18n: {"en":"OEE Quality"}, unit: "%", format: "number" },
    { id: "oeeScore", label: "OEE Skoru", label_i18n: {"en":"OEE Skoru"}, unit: "%", format: "number" },
    { id: "teepScore", label: "TEEP Skoru", label_i18n: {"en":"TEEP Skoru"}, unit: "%", format: "number" },
    { id: "downtimeCost", label: "Durma Maliyeti", label_i18n: {"en":"Durma Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "speedLossCost", label: "Hz Kayb Maliyeti", label_i18n: {"en":"Hz Loss Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "qualityLossCost", label: "Kalite Kayb Maliyeti", label_i18n: {"en":"Quality Loss Cost"}, unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [{ fieldId: "oeeScore", warning: 75, critical: 55, direction: "lower_is_bad", warningMessage: "OEE < 75% — improvement opportunity exists.", warningMessage_i18n: {"en":"OEE < 75% — improvement opportunity exists."}, criticalMessage: "OEE < 55% — urgent improvement program required.", criticalMessage_i18n: {"en":"OEE < 55% — urgent improvement program required."} }],
  formulaPipeline: [
    { formulaId: "measurement.oee_availability", inputMap: {
        plannedProdTime: "plannedProdTime",
        operatingTime: "downtimeMinutes"
      }, outputId: "oeeAvailability" },
    { formulaId: "measurement.oee_performance", inputMap: {
        totalParts: "totalParts",
        idealCycleTime: "idealCycleMinutes",
        operatingTime: "plannedProdTime",
        downtimeMinutes: "downtimeMinutes"
      }, outputId: "oeePerformance" },
    { formulaId: "measurement.oee_quality", inputMap: { goodParts: "goodParts", totalParts: "totalParts" }, outputId: "oeeQuality" },
    { formulaId: "measurement.oee_score", inputMap: { oeeAvailability: "oeeAvailability", oeePerformance: "oeePerformance", oeeQuality: "oeeQuality" }, outputId: "oeeScore" },
    { formulaId: "measurement.teep_score", inputMap: {
        operatingTime: "oeeScore"
      ,
        totalCalendarTime: "totalCalendarTime",
        oeePerformance: "oeePerformance",
        oeeQuality: "oeeQuality"}, outputId: "teepScore" },
    { formulaId: "cost.oee_downtime_cost", inputMap: {
        plannedProdTime: "downtimeMinutes",
        operatingTime: "machineHourlyCost",
        costPerHour: "numShiftsYear"
      }, outputId: "downtimeCost" },
    { formulaId: "cost.oee_speed_loss", inputMap: {
        totalParts: "totalParts",
        operatingTime: "idealCycleMinutes",
        idealCycleTime: "plannedProdTime",
        costPerHour: "downtimeMinutes",
        machineHourlyCost: "machineHourlyCost",
        numShiftsYear: "numShiftsYear"
      }, outputId: "speedLossCost" },
    { formulaId: "cost.oee_quality_loss", inputMap: {
        totalParts: "totalParts",
        goodParts: "goodParts",
        costPerPart: "machineHourlyCost",
        numShiftsYear: "numShiftsYear"
      }, outputId: "qualityLossCost" },
  ],
  reportTemplate: { title: "OEE & Downtime Report", title_i18n: {"en":"OEE & Downtime Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["OEE = Availability × Performance × Quality.", "World-class OEE > 85%.", "Speed loss = (ideal × total) − (planned − downtime)."],assumptionNotes_i18n:[{"en":"OEE = Availability × Performance × Quality."},{"en":"World-class OEE > 85%."},{"en":"Speed loss = (ideal × total) − (planned − downtime)."}]},
};
