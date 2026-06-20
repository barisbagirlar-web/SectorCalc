/**
 * Tool #33 — Palet Rafı Optimizasyonu
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PALLET_RACK_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "pallet-rack-optimizer-analyzer", legacyPaidSlug: "pallet-rack-optimizer-analyzer",
  name: "Palet Rafı Kapasite Optimizasyonu", sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Palet rafı düzeni ve kapasitesi optimize edilmezse depo alanı verimsiz kullanılır ve operasyonel maliyet artar.",
  inputs: [
    { id: "rackWidth", label: "Raf Genişliği", type: "number", unit: "mm", required: true, smartDefault: 2700, validation: { min: 100 }, helper: "", expertMeaning: "Rack width in mm" },
    { id: "rackDepth", label: "Raf Derinliği", type: "number", unit: "mm", required: true, smartDefault: 1100, validation: { min: 100 }, helper: "", expertMeaning: "Rack depth in mm" },
    { id: "rackHeight", label: "Raf Yüksekliği", type: "number", unit: "mm", required: true, smartDefault: 5000, validation: { min: 100 }, helper: "", expertMeaning: "Rack height in mm" },
    { id: "loadCapacity", label: "Birim Yük Kapasitesi", type: "number", unit: "kg", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Load capacity per pallet position" },
    { id: "numberOfLevels", label: "Raf Kat Sayısı", type: "number", unit: "kat", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of rack levels" },
    { id: "warehouseWidth", label: "Depo Genişliği", type: "number", unit: "m", required: false, smartDefault: 40, validation: { min: 1 }, helper: "", expertMeaning: "Warehouse width in meters" },
    { id: "warehouseLength", label: "Depo Uzunluğu", type: "number", unit: "m", required: false, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Warehouse length in meters" },
    { id: "costPerPosition", label: "Raf Pozisyon Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cost per rack position" },
  ],
  outputs: [
    { id: "rackCapacity", label: "Toplam Raf Kapasitesi", unit: "kg", format: "number", isBigNumber: true },
    { id: "floorUtilization", label: "Alan Kullanım Oranı", unit: "%", format: "number" },
    { id: "rackThroughput", label: "Raf Çıktı Hızı", unit: "birim/saat", format: "number" },
    { id: "rackSafetyFactor", label: "Raf Güvenlik Faktörü", unit: "", format: "number" },
    { id: "rackCostPerPosition", label: "Pozisyon Başına Maliyet", unit: "USD", format: "currency" },
    { id: "retrievalTime", label: "Ortalama Erişim Süresi", unit: "saniye", format: "number" },
  ],
  thresholds: [{ fieldId: "floorUtilization", warning: 65, critical: 50, direction: "lower_is_bad", warningMessage: "Alan kullanımı < %65 — yerleşim optimizasyonu önerilir.", criticalMessage: "Alan kullanımı < %50 — depo düzeni yenilenmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.rack_capacity", inputMap: { loadCapacity: "loadCapacity", numberOfLevels: "numberOfLevels", rackWidth: "rackWidth", rackDepth: "rackDepth" }, outputId: "rackCapacity" },
    { formulaId: "measurement.floor_utilization_rack", inputMap: { rackWidth: "rackWidth", rackDepth: "rackDepth", warehouseWidth: "warehouseWidth", warehouseLength: "warehouseLength", numberOfLevels: "numberOfLevels" }, outputId: "floorUtilization" },
    { formulaId: "measurement.rack_throughput", inputMap: { numberOfLevels: "numberOfLevels", rackWidth: "rackWidth" }, outputId: "rackThroughput" },
    { formulaId: "measurement.rack_safety_factor", inputMap: { loadCapacity: "loadCapacity", rackHeight: "rackHeight" }, outputId: "rackSafetyFactor" },
    { formulaId: "cost.rack_cost_per_position", inputMap: { costPerPosition: "costPerPosition", numberOfLevels: "numberOfLevels" }, outputId: "rackCostPerPosition" },
    { formulaId: "measurement.rack_retrieval_time", inputMap: { rackHeight: "rackHeight", rackDepth: "rackDepth" }, outputId: "retrievalTime" },
  ],
  reportTemplate: { title: "Pallet Rack Optimization Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Kapasite = kat × pozisyon × yük kapasitesi.", "Alan kullanımı = raf alanı / depo alanı.", "Güvenlik faktörü = yük / dayanım oranı.", "Erişim süresi raf yüksekliği ve derinliğine bağlıdır."] },
};
