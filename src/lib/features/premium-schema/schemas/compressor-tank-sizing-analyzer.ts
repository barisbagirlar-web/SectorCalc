import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const COMPRESSOR_TANK_SCHEMA: PremiumCalculatorSchema = {
  id: "compressor-tank-sizing-analyzer", legacyPaidSlug: "compressor-tank-sizing-analyzer",
  name: "Compressor Tank Sizing Analyzer", name_i18n: {"en":"Compressor Tank Sizing Analyzer"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "If the compressed air tank is incorrectly sized, the motor short-cycles frequently, its lifespan shortens, and energy efficiency drops.", painStatement_i18n: {"en":"If the compressed air tank is incorrectly sized, the motor short-cycles frequently, its lifespan shortens, and energy efficiency drops."},
  inputs: [
    { id: "airFlow", label: "Kompresör Debisi Q", label_i18n: {"en":"Free air delivery"}, type: "number", unit: "m³/dk", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "", expertMeaning: "Free air delivery", expertMeaning_i18n: {"en":"Free air delivery"} },
    { id: "maxPressure", label: "Cut-out pressure", label_i18n: {"en":"Cut-out pressure"}, type: "number", unit: "bar", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Cut-out pressure", expertMeaning_i18n: {"en":"Cut-out pressure"} },
    { id: "minPressure", label: "Cut-in pressure", label_i18n: {"en":"Cut-in pressure"}, type: "number", unit: "bar", required: true, smartDefault: 7, validation: { min: 1 }, helper: "", expertMeaning: "Cut-in pressure", expertMeaning_i18n: {"en":"Cut-in pressure"} },
    { id: "fillTimeTarget", label: "Hedef Dolum Süresi", label_i18n: {"en":"Target fill time"}, type: "number", unit: "sn", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Target fill time", expertMeaning_i18n: {"en":"Target fill time"} },
    { id: "maxStartsPerHour", label: "Max Start/Saat", label_i18n: {"en":"Max Start/Saat"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Max motor starts per hour", expertMeaning_i18n: {"en":"Max Motor starts per hour"} },
    { id: "pricePerLiter", label: "Tank cost per liter", label_i18n: {"en":"Tank cost per liter"}, type: "number", unit: "USD/L", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Tank cost per liter", expertMeaning_i18n: {"en":"Tank cost per liter"} },
    { id: "currentTankVol", label: "Mevcut Tank Hacmi", label_i18n: {"en":"Current Tank Volume"}, type: "number", unit: "L", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Existing tank volume", expertMeaning_i18n: {"en":"Existing tank volume"} },
  ],
  outputs: [
    { id: "requiredTankVol", label: "Gerekli Tank Hacmi", label_i18n: {"en":"required Tank Volume"}, unit: "L", format: "number", isBigNumber: true },
    { id: "cycleTime", label: "Cycle Time", label_i18n: {"en":"Cycle Time"}, unit: "dk", format: "duration" },
    { id: "cyclesPerHour", label: "Saatteki Cevrim", label_i18n: {"en":"Saatteki Cycle"}, unit: "çevrim/saat", format: "number" },
    { id: "motorStartCheck", label: "Motor Start Kontrolü", label_i18n: {"en":"Motor Start Kontrolu"}, unit: "", format: "score" },
    { id: "tankCost", label: "Tank Cost", label_i18n: {"en":"Tank Cost"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "motorStartCheck", warning: 0, critical: 0, direction: "higher_is_bad", warningMessage: "Motor start limit aşıldı — tank hacmi artırılmalı.", warningMessage_i18n: {"en":"Motor start limit exceeded — tank Volume must be increased."}, criticalMessage: "" }],
  formulaPipeline: [
    { formulaId: "measurement.tank_required_vol", inputMap: {
        demand: "fillTimeTarget",
        reserveDays: "airFlow",
        maxPressure: "maxPressure",
        minPressure: "minPressure"
      }, outputId: "requiredTankVol" },
    { formulaId: "measurement.tank_cycle_time", inputMap: {
        tankCapacity: "requiredTankVol",
        feedRate: "maxPressure",
        minPressure: "minPressure",
        airFlow: "airFlow"
      }, outputId: "cycleTime" },
    { formulaId: "measurement.tank_cycles_per_hour", inputMap: { cycleTime: "cycleTime" }, outputId: "cyclesPerHour" },
    { formulaId: "measurement.tank_motor_check", inputMap: {
        requiredPower: "cyclesPerHour",
        motorPower: "maxStartsPerHour"
      }, outputId: "motorStartCheck" },
    { formulaId: "cost.tank_cost", inputMap: {
        tankCapacity: "requiredTankVol",
        costPerUnitVol: "pricePerLiter"
      }, outputId: "tankCost" },
  ],
  reportTemplate: { title: "Kompresör Tankı Raporu", title_i18n: {"en":"Compressor Tank Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Tank = t×Q×Patm / (Pmax - Pmin).", "Çevrim = Tank×(Pmax-Pmin) / (Q×Patm).", "Motor start < maxStart/saat."],assumptionNotes_i18n:[{"en":"Tank = t×Q×Patm / (Pmax - Pmin)."},{"en":"Cycle = Tank×(Pmax-Pmin) / (Q×Patm)."},{"en":"Motor start < maxStart/saat."}] },
};
