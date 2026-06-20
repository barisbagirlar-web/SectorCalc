import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const COMPRESSOR_TANK_SCHEMA: PremiumCalculatorSchema = {
  id: "compressor-tank-sizing-analyzer", legacyPaidSlug: "compressor-tank-sizing-analyzer",
  name: "Kompresör Tankı Boyutlandırma", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Basınçlı hava tankı yanlış boyutlandırılırsa motor sık devreye girer, ömrü kısalır ve enerji verimi düşer.",
  inputs: [
    { id: "airFlow", label: "Kompresör Debisi Q", type: "number", unit: "m³/dk", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "", expertMeaning: "Free air delivery" },
    { id: "maxPressure", label: "Maksimum Basınç", type: "number", unit: "bar", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Cut-out pressure" },
    { id: "minPressure", label: "Minimum Basınç", type: "number", unit: "bar", required: true, smartDefault: 7, validation: { min: 1 }, helper: "", expertMeaning: "Cut-in pressure" },
    { id: "fillTimeTarget", label: "Hedef Dolum Süresi", type: "number", unit: "sn", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Target fill time" },
    { id: "maxStartsPerHour", label: "Max Start/Saat", type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Max motor starts per hour" },
    { id: "pricePerLiter", label: "Tank Litre Fiyatı", type: "number", unit: "USD/L", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Tank cost per liter" },
    { id: "currentTankVol", label: "Mevcut Tank Hacmi", type: "number", unit: "L", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Existing tank volume" },
  ],
  outputs: [
    { id: "requiredTankVol", label: "Gerekli Tank Hacmi", unit: "L", format: "number", isBigNumber: true },
    { id: "cycleTime", label: "Çevrim Süresi", unit: "dk", format: "duration" },
    { id: "cyclesPerHour", label: "Saatteki Çevrim", unit: "çevrim/saat", format: "number" },
    { id: "motorStartCheck", label: "Motor Start Kontrolü", unit: "", format: "score" },
    { id: "tankCost", label: "Tank Maliyeti", unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "motorStartCheck", warning: 0, critical: 0, direction: "higher_is_bad", warningMessage: "Motor start limit aşıldı — tank hacmi artırılmalı.", criticalMessage: "" }],
  formulaPipeline: [
    { formulaId: "measurement.tank_required_vol", inputMap: { fillTimeTarget: "fillTimeTarget", airFlow: "airFlow", maxPressure: "maxPressure", minPressure: "minPressure" }, outputId: "requiredTankVol" },
    { formulaId: "measurement.tank_cycle_time", inputMap: { requiredTankVol: "requiredTankVol", maxPressure: "maxPressure", minPressure: "minPressure", airFlow: "airFlow" }, outputId: "cycleTime" },
    { formulaId: "measurement.tank_cycles_per_hour", inputMap: { cycleTime: "cycleTime" }, outputId: "cyclesPerHour" },
    { formulaId: "measurement.tank_motor_check", inputMap: { cyclesPerHour: "cyclesPerHour", maxStartsPerHour: "maxStartsPerHour" }, outputId: "motorStartCheck" },
    { formulaId: "cost.tank_cost", inputMap: { requiredTankVol: "requiredTankVol", pricePerLiter: "pricePerLiter" }, outputId: "tankCost" },
  ],
  reportTemplate: { title: "Kompresör Tankı Raporu", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Tank = t×Q×Patm / (Pmax - Pmin).", "Çevrim = Tank×(Pmax-Pmin) / (Q×Patm).", "Motor start < maxStart/saat."] },
};
