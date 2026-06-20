/**
 * Tool #32 — Vakum Kaçağı Enerji
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const VACUUM_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "vacuum-leak-energy-analyzer", legacyPaidSlug: "vacuum-leak-energy-analyzer",
  name: "Vakum Kaçağı Enerji Maliyeti", sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Vakum sistemlerindeki kaçaklar fark edilmeden yüksek enerji tüketimine ve üretim kaybına yol açar. Kaçak debisi ölçülmezse gereksiz kompresör kapasitesi kullanılır.",
  inputs: [
    { id: "leakRate", label: "Kaçak Debisi", type: "number", unit: "L/dk", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Vacuum leak rate" },
    { id: "systemPressure", label: "Sistem Basıncı", type: "number", unit: "kPa", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "System vacuum pressure" },
    { id: "operatingHours", label: "Çalışma Saati / Yıl", type: "number", unit: "saat", required: true, smartDefault: 8760, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating hours" },
    { id: "energyRate", label: "Enerji Birim Maliyeti", type: "number", unit: "USD/kWh", required: true, smartDefault: 0.12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per kWh" },
    { id: "numLeaks", label: "Kaçak Sayısı", type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of identified leaks" },
    { id: "motorPower", label: "Vakum Pompa Gücü", type: "number", unit: "kW", required: false, smartDefault: 7.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Vacuum pump motor power" },
    { id: "capacityWaste", label: "Kapasite Kaybı", type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Capacity wasted due to leaks" },
  ],
  outputs: [
    { id: "vacuumLeakRate", label: "Toplam Kaçak Debisi", unit: "L/dk", format: "number" },
    { id: "vacuumLeakCost", label: "Kaçak Enerji Maliyeti", unit: "USD/yıl", format: "currency" },
    { id: "vacuumCapacityWaste", label: "Kapasite İsrafı", unit: "%", format: "percentage" },
    { id: "potentialSavings", label: "Potansiyel Tasarruf", unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [
    { fieldId: "vacuumLeakCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Kaçak maliyeti > $5K — vakum hattı bakımı planlanmalı.", criticalMessage: "Kaçak maliyeti > $15K — acil kaçak onarım programı başlatılmalı." },
    { fieldId: "vacuumCapacityWaste", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Kapasite kaybı > %10 — kompresör yükü optimize edilmeli.", criticalMessage: "Kapasite kaybı > %25 — sistem yeniden tasarlanmalı." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.vacuum_leak_rate", inputMap: { leakRate: "leakRate", numLeaks: "numLeaks" }, outputId: "vacuumLeakRate" },
    { formulaId: "cost.vacuum_leak_cost", inputMap: { vacuumLeakRate: "vacuumLeakRate", operatingHours: "operatingHours", energyRate: "energyRate", motorPower: "motorPower" }, outputId: "vacuumLeakCost" },
    { formulaId: "measurement.vacuum_capacity_waste", inputMap: { capacityWaste: "capacityWaste", motorPower: "motorPower" }, outputId: "vacuumCapacityWaste" },
    { formulaId: "cost.vacuum_savings_potential", inputMap: { vacuumLeakCost: "vacuumLeakCost", capacityWaste: "capacityWaste" }, outputId: "potentialSavings" },
  ],
  reportTemplate: { title: "Vakum Kaçağı Enerji Maliyeti Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Kaçak debisi ortalama değer üzerinden hesaplanır.", "Enerji maliyeti sabit $/kWh üzerinden hesaplanır.", "Kapasite kaybı yüzdesel olarak tahmin edilmiştir."] },
};
