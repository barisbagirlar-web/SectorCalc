/**
 * Tool #33 — Palet Rafı Optimizasyonu
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const PALLET_RACK_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "pallet-rack-optimizer-analyzer", legacyPaidSlug: "pallet-rack-optimizer-analyzer",
  name: "Palet Rafi Kapasite Optimizasyonu", name_i18n: {"en":"Palet Rafi Capacity Optimizasyonu"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Palet rafı düzeni ve kapasitesi optimize edilmezse depo alanı verimsiz kullanılır ve operasyonel maliyet artar.", painStatement_i18n: {"en":"If pallet rack layout and capacity are not optimized, warehouse space is used inefficiently and operational cost increases."},
  inputs: [
    { id: "rackWidth", label: "Rack width in mm", label_i18n: {"en":"Rack width in mm"}, type: "number", unit: "mm", required: true, smartDefault: 2700, validation: { min: 100 }, helper: "", expertMeaning: "Rack width in mm", expertMeaning_i18n: {"en":"Rack width in mm"} },
    { id: "rackDepth", label: "Rack depth in mm", label_i18n: {"en":"Rack depth in mm"}, type: "number", unit: "mm", required: true, smartDefault: 1100, validation: { min: 100 }, helper: "", expertMeaning: "Rack depth in mm", expertMeaning_i18n: {"en":"Rack depth in mm"} },
    { id: "rackHeight", label: "Rack height in mm", label_i18n: {"en":"Rack height in mm"}, type: "number", unit: "mm", required: true, smartDefault: 5000, validation: { min: 100 }, helper: "", expertMeaning: "Rack height in mm", expertMeaning_i18n: {"en":"Rack height in mm"} },
    { id: "loadCapacity", label: "Birim Yük Kapasitesi", label_i18n: {"en":"Load capacity per pallet position"}, type: "number", unit: "kg", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Load capacity per pallet position", expertMeaning_i18n: {"en":"Load capacity per pallet position"} },
    { id: "numberOfLevels", label: "Number of rack levels", label_i18n: {"en":"Number of rack levels"}, type: "number", unit: "kat", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of rack levels", expertMeaning_i18n: {"en":"Number of rack levels"} },
    { id: "warehouseWidth", label: "Warehouse width in meters", label_i18n: {"en":"Warehouse width in meters"}, type: "number", unit: "m", required: false, smartDefault: 40, validation: { min: 1 }, helper: "", expertMeaning: "Warehouse width in meters", expertMeaning_i18n: {"en":"Warehouse width in meters"} },
    { id: "warehouseLength", label: "Warehouse length in meters", label_i18n: {"en":"Warehouse length in meters"}, type: "number", unit: "m", required: false, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Warehouse length in meters", expertMeaning_i18n: {"en":"Warehouse length in meters"} },
    { id: "costPerPosition", label: "Raf Pozisyon Maliyeti", label_i18n: {"en":"Raf position Cost"}, type: "number", unit: "USD", required: false, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cost per rack position", expertMeaning_i18n: {"en":"Cost per rack position"} },
  ],
  outputs: [
    { id: "rackCapacity", label: "Toplam Raf Kapasitesi", label_i18n: {"en":"Total Raf Capacity"}, unit: "kg", format: "number", isBigNumber: true },
    { id: "floorUtilization", label: "Alan Kullanm Oran", label_i18n: {"en":"Alan Utilization Rate"}, unit: "%", format: "number" },
    { id: "rackThroughput", label: "Raf Ckt Hz", label_i18n: {"en":"Raf Ckt Hz"}, unit: "birim/saat", format: "number" },
    { id: "rackSafetyFactor", label: "Raf Güvenlik Faktörü", label_i18n: {"en":"Raf Guvenlik Faktoru"}, unit: "", format: "number" },
    { id: "rackCostPerPosition", label: "Pozisyon Basna Maliyet", label_i18n: {"en":"position Per Cost"}, unit: "USD", format: "currency" },
    { id: "retrievalTime", label: "Ortalama Erisim Suresi", label_i18n: {"en":"Average Erisim Duration"}, unit: "saniye", format: "number" },
  ],
  thresholds: [{ fieldId: "floorUtilization", warning: 65, critical: 50, direction: "lower_is_bad", warningMessage: "Alan kullanımı < %65 — yerleşim optimizasyonu önerilir.", warningMessage_i18n: {"en":"Space utilization < %65 — layout optimization is recommended."}, criticalMessage: "Alan kullanımı < %50 — depo düzeni yenilenmeli.", criticalMessage_i18n: {"en":"Space utilization < %50 — warehouse layout should be renewed."} }],
  formulaPipeline: [
    { formulaId: "measurement.rack_capacity", inputMap: {
        rackQty: "loadCapacity",
        palletsPerBay: "numberOfLevels",
        levels: "rackWidth",
        rackDepth: "rackDepth"
      }, outputId: "rackCapacity" },
    { formulaId: "measurement.floor_utilization_rack", inputMap: {
        rackFootprint: "rackWidth",
        totalFloorArea: "rackDepth",
        warehouseWidth: "warehouseWidth",
        warehouseLength: "warehouseLength",
        numberOfLevels: "numberOfLevels"
      }, outputId: "floorUtilization" },
    { formulaId: "measurement.rack_throughput", inputMap: {
        totalMoves: "numberOfLevels",
        availableHours: "rackWidth"
      }, outputId: "rackThroughput" },
    { formulaId: "measurement.rack_safety_factor", inputMap: {
        maxLoadRating: "loadCapacity",
        actualLoad: "rackHeight"
      }, outputId: "rackSafetyFactor" },
    { formulaId: "cost.rack_cost_per_position", inputMap: { costPerPosition: "costPerPosition", numberOfLevels: "numberOfLevels" ,
        totalRackCost: "totalRackCost",
        rackCapacity: "rackCapacity"}, outputId: "rackCostPerPosition" },
    { formulaId: "measurement.rack_retrieval_time", inputMap: {
        totalTravelDist: "rackHeight",
        forkSpeed: "rackDepth"
      }, outputId: "retrievalTime" },
  ],
  reportTemplate: { title: "Pallet Rack Optimization Report", title_i18n: {"en":"Pallet Rack Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Kapasite = kat × pozisyon × yük kapasitesi.", "Alan kullanımı = raf alanı / depo alanı.", "Güvenlik faktörü = yük / dayanım oranı.", "Erişim süresi raf yüksekliği ve derinliğine bağlıdır."],assumptionNotes_i18n:[{"en":"Capacity = tier × position × load capacity."},{"en":"Space utilization = rack area / warehouse area."},{"en":"Safety factor = load / strength ratio."},{"en":"Access time depends on rack height and depth."}] },
};
