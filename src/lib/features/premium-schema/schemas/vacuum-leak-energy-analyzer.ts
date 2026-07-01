/**
 * Tool #32 — Vakum Kaçağı Enerji
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const VACUUM_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "vacuum-leak-energy-analyzer", legacyPaidSlug: "vacuum-leak-energy-analyzer",
  name: "Vacuum Leak Energy Cost Analyzer", name_i18n: {"en":"Vacuum Leak Energy Cost Analyzer"}, sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Vakum sistemlerindeki kaçaklar fark edilmeden yüksek enerji tüketimine ve üretim kaybına yol açar. Kaçak debisi ölçülmezse gereksiz kompresör kapasitesi kullanılır.", painStatement_i18n: {"en":"Leaks in vacuum systems cause high energy consumption and production loss if not detected. If leak flow rate is not measured, unnecessary compressor capacity is used."},
  inputs: [
    { id: "leakRate", label: "Vacuum leak rate", label_i18n: {"en":"Vacuum leak rate"}, type: "number", unit: "L/dk", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Vacuum leak rate", expertMeaning_i18n: {"en":"Vacuum leak rate"} },
    { id: "systemPressure", label: "System vacuum pressure", label_i18n: {"en":"System vacuum pressure"}, type: "number", unit: "kPa", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "System vacuum pressure", expertMeaning_i18n: {"en":"System vacuum pressure"} },
    { id: "operatingHours", label: "Annual operating hours", label_i18n: {"en":"Annual operating hours"}, type: "number", unit: "saat", required: true, smartDefault: 8760, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours"} },
    { id: "energyRate", label: "Energy Unit Cost", label_i18n: {"en":"Energy Unit Cost"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per kWh", expertMeaning_i18n: {"en":"Cost per kWh"} },
    { id: "numLeaks", label: "Number of identified leaks", label_i18n: {"en":"Number of identified leaks"}, type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of identified leaks", expertMeaning_i18n: {"en":"Number of identified leaks"} },
    { id: "motorPower", label: "Vakum Pompa Gücü", label_i18n: {"en":"Vacuum pump Motor power"}, type: "number", unit: "kW", required: false, smartDefault: 7.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Vacuum pump motor power", expertMeaning_i18n: {"en":"Vacuum pump Motor power"} },
    { id: "capacityWaste", label: "Capacity wasted due to leaks", label_i18n: {"en":"Capacity wasted due to leaks"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Capacity wasted due to leaks", expertMeaning_i18n: {"en":"Capacity wasted due to leaks"} },
  ],
  outputs: [
    { id: "vacuumLeakRate", label: "Total Leak Flow Rate", label_i18n: {"en":"Total Leak Flow Rate"}, unit: "L/dk", format: "number" },
    { id: "vacuumLeakCost", label: "Leak Energy Cost", label_i18n: {"en":"Leak Energy Cost"}, unit: "USD/yıl", format: "currency" },
    { id: "vacuumCapacityWaste", label: "Capacity Waste", label_i18n: {"en":"Capacity Waste"}, unit: "%", format: "percentage" },
    { id: "potentialSavings", label: "Potansiyel Tasarruf", label_i18n: {"en":"Potansiyel Tasarruf"}, unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [
    { fieldId: "vacuumLeakCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Kaçak maliyeti > $5K — vakum hattı bakımı planlanmalı.", warningMessage_i18n: {"en":"Leak cost > $5K — vacuum line maintenance should be scheduled."}, criticalMessage: "Kaçak maliyeti > $15K — acil kaçak onarım programı başlatılmalı.", criticalMessage_i18n: {"en":"Leak cost > $15K — urgent leak repair program should be initiated."} },
    { fieldId: "vacuumCapacityWaste", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Kapasite kaybı > %10 — kompresör yükü optimize edilmeli.", warningMessage_i18n: {"en":"Capacity Loss > 10% — compressor Load must be optimized."}, criticalMessage: "Kapasite kaybı > %25 — sistem yeniden tasarlanmalı.", criticalMessage_i18n: {"en":"Capacity Loss > 25% — System must be redesigned."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.vacuum_leak_rate", inputMap: { leakRate: "leakRate", numLeaks: "numLeaks" ,
        pressureDrop: "pressureDrop",
        chamberVolume: "chamberVolume",
        testDuration: "testDuration"}, outputId: "vacuumLeakRate" },
    { formulaId: "cost.vacuum_leak_cost", inputMap: {
        vacuumLeakRate: "vacuumLeakRate",
        operatingHours: "operatingHours",
        energyCostPerUnit: "energyRate",
        motorPower: "motorPower"
      }, outputId: "vacuumLeakCost" },
    { formulaId: "measurement.vacuum_capacity_waste", inputMap: { capacityWaste: "capacityWaste", motorPower: "motorPower" ,
        vacuumLeakRate: "vacuumLeakRate",
        vacuumCapacity: "vacuumCapacity"}, outputId: "vacuumCapacityWaste" },
    { formulaId: "cost.vacuum_savings_potential", inputMap: { vacuumLeakCost: "vacuumLeakCost", capacityWaste: "capacityWaste" }, outputId: "potentialSavings" },
  ],
  reportTemplate: { title: "Vakum Kaçağı Enerji Maliyeti Raporu", title_i18n: {"en":"Vacuum Leak Energy Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Kaçak debisi ortalama değer üzerinden hesaplanır.", "Enerji maliyeti sabit $/kWh üzerinden hesaplanır.", "Kapasite kaybı yüzdesel olarak tahmin edilmiştir."],assumptionNotes_i18n:[{"en":"Leak flow rate is calculated based on the average value."},{"en":"Energy cost is calculated based on a fixed $/kWh rate."},{"en":"Capacity loss is estimated as a percentage."}] },
};
