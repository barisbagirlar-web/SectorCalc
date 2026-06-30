import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const COMPRESSOR_TANK_SCHEMA: PremiumCalculatorSchema = {
  id: "compressor-tank-sizing-analyzer", legacyPaidSlug: "compressor-tank-sizing-analyzer",
  name: "Kompresör Tankı Boyutlandırma", name_i18n: {"en":"Kompresor Tanki Boyutlandirma","tr":"Kompresör Tankı Boyutlandırma"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Basınçlı hava tankı yanlış boyutlandırılırsa motor sık devreye girer, ömrü kısalır ve enerji verimi düşer.", painStatement_i18n: {"en":"Basınçlı hava tankı yanlış boyutlandırılırsa motor sık devreye girer, ömrü kısalır ve enerji verimi düşer.","tr":"Basınçlı hava tankı yanlış boyutlandırılırsa motor sık devreye girer, ömrü kısalır ve enerji verimi düşer."},
  inputs: [
    { id: "airFlow", label: "Kompresör Debisi Q", label_i18n: {"en":"Free air delivery","tr":"Kompresör Debisi Q"}, type: "number", unit: "m³/dk", required: true, smartDefault: 2, validation: { min: 0.01 }, helper: "", expertMeaning: "Free air delivery", expertMeaning_i18n: {"en":"Free air delivery","tr":"kompresör debisi q"} },
    { id: "maxPressure", label: "Maksimum Basınç", label_i18n: {"en":"Cut-out pressure","tr":"Maksimum Basınç"}, type: "number", unit: "bar", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Cut-out pressure", expertMeaning_i18n: {"en":"Cut-out pressure","tr":"maksimum basınç"} },
    { id: "minPressure", label: "Minimum Basınç", label_i18n: {"en":"Cut-in pressure","tr":"Minimum Basınç"}, type: "number", unit: "bar", required: true, smartDefault: 7, validation: { min: 1 }, helper: "", expertMeaning: "Cut-in pressure", expertMeaning_i18n: {"en":"Cut-in pressure","tr":"minimum basınç"} },
    { id: "fillTimeTarget", label: "Hedef Dolum Süresi", label_i18n: {"en":"Target fill time","tr":"Hedef Dolum Süresi"}, type: "number", unit: "sn", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Target fill time", expertMeaning_i18n: {"en":"Target fill time","tr":"hedef dolum süresi"} },
    { id: "maxStartsPerHour", label: "Max Start/Saat", label_i18n: {"en":"Max Start/Saat","tr":"Max Start/Saat"}, type: "number", unit: "", required: true, smartDefault: 10, validation: { min: 1 }, helper: "", expertMeaning: "Max motor starts per hour", expertMeaning_i18n: {"en":"Max motor starts per hour","tr":"Max motor starts per hour"} },
    { id: "pricePerLiter", label: "Tank Litre Fiyatı", label_i18n: {"en":"Tank cost per liter","tr":"Tank Litre Fiyatı"}, type: "number", unit: "USD/L", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Tank cost per liter", expertMeaning_i18n: {"en":"Tank cost per liter","tr":"tank litre fiyatı"} },
    { id: "currentTankVol", label: "Mevcut Tank Hacmi", label_i18n: {"en":"Mevcut Tank Hacmi","tr":"Mevcut Tank Hacmi"}, type: "number", unit: "L", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Existing tank volume", expertMeaning_i18n: {"en":"Existing tank volume","tr":"Existing tank volume"} },
  ],
  outputs: [
    { id: "requiredTankVol", label: "Gerekli Tank Hacmi", label_i18n: {"en":"Gerekli Tank Hacmi","tr":"Gerekli Tank Hacmi"}, unit: "L", format: "number", isBigNumber: true },
    { id: "cycleTime", label: "Çevrim Süresi", label_i18n: {"en":"Cevrim Suresi","tr":"Çevrim Süresi"}, unit: "dk", format: "duration" },
    { id: "cyclesPerHour", label: "Saatteki Çevrim", label_i18n: {"en":"Saatteki Cevrim","tr":"Saatteki Çevrim"}, unit: "çevrim/saat", format: "number" },
    { id: "motorStartCheck", label: "Motor Start Kontrolü", label_i18n: {"en":"Motor Start Kontrolu","tr":"Motor Start Kontrolü"}, unit: "", format: "score" },
    { id: "tankCost", label: "Tank Maliyeti", label_i18n: {"en":"Tank Maliyeti","tr":"Tank Maliyeti"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "motorStartCheck", warning: 0, critical: 0, direction: "higher_is_bad", warningMessage: "Motor start limit aşıldı — tank hacmi artırılmalı.", warningMessage_i18n: {"en":"Motor start limit aşıldı — tank hacmi artırılmalı.","tr":"Motor start limit aşıldı — tank hacmi artırılmalı."}, criticalMessage: "" }],
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
  reportTemplate: { title: "Kompresör Tankı Raporu", title_i18n: {"en":"Kompresör Tankı Raporu","tr":"Kompresör Tankı Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Tank = t×Q×Patm / (Pmax - Pmin).", "Çevrim = Tank×(Pmax-Pmin) / (Q×Patm).", "Motor start < maxStart/saat."],assumptionNotes_i18n:[{"en":"Tank = t×Q×Patm / (Pmax - Pmin).","tr":"Tank = t×Q×Patm / (Pmax - Pmin)."},{"en":"Çevrim = Tank×(Pmax-Pmin) / (Q×Patm).","tr":"Çevrim = Tank×(Pmax-Pmin) / (Q×Patm)."},{"en":"Motor start < maxStart/saat.","tr":"Motor start < maxStart/saat."}] },
};
