/**
 * Tool #32 — Vakum Kaçağı Enerji
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const VACUUM_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "vacuum-leak-energy-analyzer", legacyPaidSlug: "vacuum-leak-energy-analyzer",
  name: "Vakum Kaçağı Enerji Maliyeti", name_i18n: {"en":"Vakum Kacagi Enerji Maliyeti","tr":"Vakum Kaçağı Enerji Maliyeti"}, sectorSlug: "energy-carbon", category: "cost",
  painStatement: "Vakum sistemlerindeki kaçaklar fark edilmeden yüksek enerji tüketimine ve üretim kaybına yol açar. Kaçak debisi ölçülmezse gereksiz kompresör kapasitesi kullanılır.", painStatement_i18n: {"en":"Vakum sistemlerindeki kaçaklar fark edilmeden yüksek enerji tüketimine ve üretim kaybına yol açar. Kaçak debisi ölçülmezse gereksiz kompresör kapasitesi kullanılır.","tr":"Vakum sistemlerindeki kaçaklar fark edilmeden yüksek enerji tüketimine ve üretim kaybına yol açar. Kaçak debisi ölçülmezse gereksiz kompresör kapasitesi kullanılır."},
  inputs: [
    { id: "leakRate", label: "Kaçak Debisi", label_i18n: {"en":"Vacuum leak rate","tr":"Kaçak Debisi"}, type: "number", unit: "L/dk", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Vacuum leak rate", expertMeaning_i18n: {"en":"Vacuum leak rate","tr":"kaçak debisi"} },
    { id: "systemPressure", label: "Sistem Basıncı", label_i18n: {"en":"System vacuum pressure","tr":"Sistem Basıncı"}, type: "number", unit: "kPa", required: true, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "System vacuum pressure", expertMeaning_i18n: {"en":"System vacuum pressure","tr":"sistem basıncı"} },
    { id: "operatingHours", label: "Çalışma Saati / Yıl", label_i18n: {"en":"Annual operating hours","tr":"Çalışma Saati / Yıl"}, type: "number", unit: "saat", required: true, smartDefault: 8760, validation: { min: 1 }, helper: "", expertMeaning: "Annual operating hours", expertMeaning_i18n: {"en":"Annual operating hours","tr":"çalışma saati / yıl"} },
    { id: "energyRate", label: "Enerji Birim Maliyeti", label_i18n: {"en":"Enerji Birim Maliyeti","tr":"Enerji Birim Maliyeti"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.12, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per kWh", expertMeaning_i18n: {"en":"Cost per kWh","tr":"Cost per kWh"} },
    { id: "numLeaks", label: "Kaçak Sayısı", label_i18n: {"en":"Number of identified leaks","tr":"Kaçak Sayısı"}, type: "number", unit: "adet", required: false, smartDefault: 5, validation: { min: 1 }, helper: "", expertMeaning: "Number of identified leaks", expertMeaning_i18n: {"en":"Number of identified leaks","tr":"kaçak sayısı"} },
    { id: "motorPower", label: "Vakum Pompa Gücü", label_i18n: {"en":"Vacuum pump motor power","tr":"Vakum Pompa Gücü"}, type: "number", unit: "kW", required: false, smartDefault: 7.5, validation: { min: 0.1 }, helper: "", expertMeaning: "Vacuum pump motor power", expertMeaning_i18n: {"en":"Vacuum pump motor power","tr":"vakum pompa gücü"} },
    { id: "capacityWaste", label: "Kapasite Kaybı", label_i18n: {"en":"Capacity wasted due to leaks","tr":"Kapasite Kaybı"}, type: "number", unit: "%", required: false, smartDefault: 15, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Capacity wasted due to leaks", expertMeaning_i18n: {"en":"Capacity wasted due to leaks","tr":"kapasite kaybı"} },
  ],
  outputs: [
    { id: "vacuumLeakRate", label: "Toplam Kaçak Debisi", label_i18n: {"en":"Toplam Kacak Debisi","tr":"Toplam Kaçak Debisi"}, unit: "L/dk", format: "number" },
    { id: "vacuumLeakCost", label: "Kaçak Enerji Maliyeti", label_i18n: {"en":"Kacak Enerji Maliyeti","tr":"Kaçak Enerji Maliyeti"}, unit: "USD/yıl", format: "currency" },
    { id: "vacuumCapacityWaste", label: "Kapasite İsrafı", label_i18n: {"en":"Kapasite Israf","tr":"Kapasite İsrafı"}, unit: "%", format: "percentage" },
    { id: "potentialSavings", label: "Potansiyel Tasarruf", label_i18n: {"en":"Potansiyel Tasarruf","tr":"Potansiyel Tasarruf"}, unit: "USD/yıl", format: "currency" },
  ],
  thresholds: [
    { fieldId: "vacuumLeakCost", warning: 5000, critical: 15000, direction: "higher_is_bad", warningMessage: "Kaçak maliyeti > $5K — vakum hattı bakımı planlanmalı.", warningMessage_i18n: {"en":"Kaçak maliyeti > $5K — vakum hattı bakımı planlanmalı.","tr":"Kaçak maliyeti > $5K — vakum hattı bakımı planlanmalı."}, criticalMessage: "Kaçak maliyeti > $15K — acil kaçak onarım programı başlatılmalı.", criticalMessage_i18n: {"en":"Kaçak maliyeti > $15K — acil kaçak onarım programı başlatılmalı.","tr":"Kaçak maliyeti > $15K — acil kaçak onarım programı başlatılmalı."} },
    { fieldId: "vacuumCapacityWaste", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Kapasite kaybı > %10 — kompresör yükü optimize edilmeli.", warningMessage_i18n: {"en":"Kapasite kaybı > %10 — kompresör yükü optimize edilmeli.","tr":"Kapasite kaybı > %10 — kompresör yükü optimize edilmeli."}, criticalMessage: "Kapasite kaybı > %25 — sistem yeniden tasarlanmalı.", criticalMessage_i18n: {"en":"Kapasite kaybı > %25 — sistem yeniden tasarlanmalı.","tr":"Kapasite kaybı > %25 — sistem yeniden tasarlanmalı."} },
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
  reportTemplate: { title: "Vakum Kaçağı Enerji Maliyeti Raporu", title_i18n: {"en":"Vakum Kaçağı Enerji Maliyeti Raporu","tr":"Vakum Kaçağı Enerji Maliyeti Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Kaçak debisi ortalama değer üzerinden hesaplanır.", "Enerji maliyeti sabit $/kWh üzerinden hesaplanır.", "Kapasite kaybı yüzdesel olarak tahmin edilmiştir."],assumptionNotes_i18n:[{"en":"Kaçak debisi ortalama değer üzerinden hesaplanır.","tr":"Kaçak debisi ortalama değer üzerinden hesaplanır."},{"en":"Enerji maliyeti sabit $/kWh üzerinden hesaplanır.","tr":"Enerji maliyeti sabit $/kWh üzerinden hesaplanır."},{"en":"Kapasite kaybı yüzdesel olarak tahmin edilmiştir.","tr":"Kapasite kaybı yüzdesel olarak tahmin edilmiştir."}] },
};
