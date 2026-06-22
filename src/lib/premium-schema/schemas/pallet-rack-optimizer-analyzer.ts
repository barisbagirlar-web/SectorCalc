/**
 * Tool #33 — Palet Rafı Optimizasyonu
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const PALLET_RACK_OPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "pallet-rack-optimizer-analyzer", legacyPaidSlug: "pallet-rack-optimizer-analyzer",
  name: "Palet Rafı Kapasite Optimizasyonu", name_i18n: {"en":"Palet Rafi Kapasite Optimizasyonu","tr":"Palet Rafı Kapasite Optimizasyonu"}, sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Palet rafı düzeni ve kapasitesi optimize edilmezse depo alanı verimsiz kullanılır ve operasyonel maliyet artar.", painStatement_i18n: {"en":"Palet rafı düzeni ve kapasitesi optimize edilmezse depo alanı verimsiz kullanılır ve operasyonel maliyet artar.","tr":"Palet rafı düzeni ve kapasitesi optimize edilmezse depo alanı verimsiz kullanılır ve operasyonel maliyet artar."},
  inputs: [
    { id: "rackWidth", label: "Raf Genişliği", label_i18n: {"en":"Rack width in mm","tr":"Raf Genişliği"}, type: "number", unit: "mm", required: true, smartDefault: 2700, validation: { min: 100 }, helper: "", expertMeaning: "Rack width in mm", expertMeaning_i18n: {"en":"Rack width in mm","tr":"raf genişliği"} },
    { id: "rackDepth", label: "Raf Derinliği", label_i18n: {"en":"Rack depth in mm","tr":"Raf Derinliği"}, type: "number", unit: "mm", required: true, smartDefault: 1100, validation: { min: 100 }, helper: "", expertMeaning: "Rack depth in mm", expertMeaning_i18n: {"en":"Rack depth in mm","tr":"raf derinliği"} },
    { id: "rackHeight", label: "Raf Yüksekliği", label_i18n: {"en":"Rack height in mm","tr":"Raf Yüksekliği"}, type: "number", unit: "mm", required: true, smartDefault: 5000, validation: { min: 100 }, helper: "", expertMeaning: "Rack height in mm", expertMeaning_i18n: {"en":"Rack height in mm","tr":"raf yüksekliği"} },
    { id: "loadCapacity", label: "Birim Yük Kapasitesi", label_i18n: {"en":"Load capacity per pallet position","tr":"Birim Yük Kapasitesi"}, type: "number", unit: "kg", required: true, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Load capacity per pallet position", expertMeaning_i18n: {"en":"Load capacity per pallet position","tr":"birim yük kapasitesi"} },
    { id: "numberOfLevels", label: "Raf Kat Sayısı", label_i18n: {"en":"Number of rack levels","tr":"Raf Kat Sayısı"}, type: "number", unit: "kat", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of rack levels", expertMeaning_i18n: {"en":"Number of rack levels","tr":"raf kat sayısı"} },
    { id: "warehouseWidth", label: "Depo Genişliği", label_i18n: {"en":"Warehouse width in meters","tr":"Depo Genişliği"}, type: "number", unit: "m", required: false, smartDefault: 40, validation: { min: 1 }, helper: "", expertMeaning: "Warehouse width in meters", expertMeaning_i18n: {"en":"Warehouse width in meters","tr":"depo genişliği"} },
    { id: "warehouseLength", label: "Depo Uzunluğu", label_i18n: {"en":"Warehouse length in meters","tr":"Depo Uzunluğu"}, type: "number", unit: "m", required: false, smartDefault: 80, validation: { min: 1 }, helper: "", expertMeaning: "Warehouse length in meters", expertMeaning_i18n: {"en":"Warehouse length in meters","tr":"depo uzunluğu"} },
    { id: "costPerPosition", label: "Raf Pozisyon Maliyeti", label_i18n: {"en":"Raf Pozisyon Maliyeti","tr":"Raf Pozisyon Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cost per rack position", expertMeaning_i18n: {"en":"Cost per rack position","tr":"Cost per rack position"} },
  ],
  outputs: [
    { id: "rackCapacity", label: "Toplam Raf Kapasitesi", label_i18n: {"en":"Toplam Raf Kapasitesi","tr":"Toplam Raf Kapasitesi"}, unit: "kg", format: "number", isBigNumber: true },
    { id: "floorUtilization", label: "Alan Kullanım Oranı", label_i18n: {"en":"Alan Kullanm Oran","tr":"Alan Kullanım Oranı"}, unit: "%", format: "number" },
    { id: "rackThroughput", label: "Raf Çıktı Hızı", label_i18n: {"en":"Raf Ckt Hz","tr":"Raf Çıktı Hızı"}, unit: "birim/saat", format: "number" },
    { id: "rackSafetyFactor", label: "Raf Güvenlik Faktörü", label_i18n: {"en":"Raf Guvenlik Faktoru","tr":"Raf Güvenlik Faktörü"}, unit: "", format: "number" },
    { id: "rackCostPerPosition", label: "Pozisyon Başına Maliyet", label_i18n: {"en":"Pozisyon Basna Maliyet","tr":"Pozisyon Başına Maliyet"}, unit: "USD", format: "currency" },
    { id: "retrievalTime", label: "Ortalama Erişim Süresi", label_i18n: {"en":"Ortalama Erisim Suresi","tr":"Ortalama Erişim Süresi"}, unit: "saniye", format: "number" },
  ],
  thresholds: [{ fieldId: "floorUtilization", warning: 65, critical: 50, direction: "lower_is_bad", warningMessage: "Alan kullanımı < %65 — yerleşim optimizasyonu önerilir.", warningMessage_i18n: {"en":"Alan kullanımı < %65 — yerleşim optimizasyonu önerilir.","tr":"Alan kullanımı < %65 — yerleşim optimizasyonu önerilir."}, criticalMessage: "Alan kullanımı < %50 — depo düzeni yenilenmeli.", criticalMessage_i18n: {"en":"Alan kullanımı < %50 — depo düzeni yenilenmeli.","tr":"Alan kullanımı < %50 — depo düzeni yenilenmeli."} }],
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
    { formulaId: "cost.rack_cost_per_position", inputMap: { costPerPosition: "costPerPosition", numberOfLevels: "numberOfLevels" }, outputId: "rackCostPerPosition" },
    { formulaId: "measurement.rack_retrieval_time", inputMap: {
        totalTravelDist: "rackHeight",
        forkSpeed: "rackDepth"
      }, outputId: "retrievalTime" },
  ],
  reportTemplate: { title: "Pallet Rack Optimization Report", title_i18n: {"en":"Pallet Rack Optimization Report","tr":"Pallet Rack Optimization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 10, assumptionNotes: ["Kapasite = kat × pozisyon × yük kapasitesi.", "Alan kullanımı = raf alanı / depo alanı.", "Güvenlik faktörü = yük / dayanım oranı.", "Erişim süresi raf yüksekliği ve derinliğine bağlıdır."],assumptionNotes_i18n:[{"en":"Kapasite = kat × pozisyon × yük kapasitesi.","tr":"Kapasite = kat × pozisyon × yük kapasitesi."},{"en":"Alan kullanımı = raf alanı / depo alanı.","tr":"Alan kullanımı = raf alanı / depo alanı."},{"en":"Güvenlik faktörü = yük / dayanım oranı.","tr":"Güvenlik faktörü = yük / dayanım oranı."},{"en":"Erişim süresi raf yüksekliği ve derinliğine bağlıdır.","tr":"Erişim süresi raf yüksekliği ve derinliğine bağlıdır."}] },
};
