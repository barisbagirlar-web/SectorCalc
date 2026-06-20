/**
 * Tool #29 — Depo Yerleşimi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const WAREHOUSE_LAYOUT_SCHEMA: PremiumCalculatorSchema = {
  id: "warehouse-layout-analyzer", legacyPaidSlug: "warehouse-layout-analyzer",
  name: "Depo Yerleşimi & Verimlilik Analizi", sectorSlug: "logistics-transport", category: "measurement",
  painStatement: "Depo yerleşimi optimize edilmezse palet pozisyonu, throughput ve toplama verimliliği düşer, işletme maliyeti artar.",
  inputs: [
    { id: "warehouseFootprint", label: "Depo Taban Alanı", type: "number", unit: "m²", required: true, smartDefault: 2000, validation: { min: 1 }, helper: "", expertMeaning: "Warehouse footprint" },
    { id: "utilRate", label: "Depolama Kullanım Oranı", type: "number", unit: "%", required: true, smartDefault: 70, validation: { min: 1, max: 100 }, helper: "", expertMeaning: "Storage utilization rate" },
    { id: "palletFootprint", label: "Palet Alanı", type: "number", unit: "m²", required: true, smartDefault: 1.0, validation: { min: 0.1 }, helper: "", expertMeaning: "Pallet footprint (L×W)" },
    { id: "aisleFactor", label: "Koridor Katsayısı", type: "number", unit: "", required: true, smartDefault: 1.5, validation: { min: 1 }, helper: "", expertMeaning: "Aisle space multiplier" },
    { id: "rackLevels", label: "Raf Seviye Sayısı", type: "number", unit: "", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of rack levels" },
    { id: "doorCount", label: "Yükleme Kapısı Sayısı", type: "number", unit: "", required: false, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of loading doors" },
    { id: "turnaroundLoad", label: "Yükleme Süresi", type: "number", unit: "saat", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Loading turnaround hours" },
    { id: "turnaroundUnload", label: "Boşaltma Süresi", type: "number", unit: "saat", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Unloading turnaround hours" },
    { id: "pickLines", label: "Toplama Kalemi Sayısı", type: "number", unit: "adet/gün", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Daily pick lines" },
    { id: "travelTime", label: "Toplam Seyahat Süresi", type: "number", unit: "saat/gün", required: false, smartDefault: 40, validation: { min: 0 }, helper: "", expertMeaning: "Daily travel time for picking" },
    { id: "facilityCost", label: "Tesis Yıllık Maliyeti", type: "number", unit: "USD/yıl", required: false, smartDefault: 120000, validation: { min: 0 }, helper: "", expertMeaning: "Total facility cost" },
  ],
  outputs: [
    { id: "palletPositions", label: "Palet Pozisyonu (Tek Kat)", unit: "adet", format: "number" },
    { id: "verticalCap", label: "Dikey Kapasite", unit: "adet", format: "number" },
    { id: "throughputCap", label: "Throughput Kapasitesi", unit: "araç/gün", format: "number" },
    { id: "pickEfficiency", label: "Toplama Verimliliği", unit: "kalem/saat", format: "number" },
    { id: "costPerPosition", label: "Pozisyon Başına Maliyet", unit: "USD/yıl", format: "currency", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "costPerPosition", warning: 150, critical: 250, direction: "higher_is_bad", warningMessage: "Pozisyon maliyeti > $150 — optimizasyon fırsatı var.", criticalMessage: "Pozisyon maliyeti > $250 — depo verimliliği düşük." }],
  formulaPipeline: [
    { formulaId: "measurement.warehouse_pallet_positions", inputMap: { warehouseFootprint: "warehouseFootprint", utilRate: "utilRate", palletFootprint: "palletFootprint", aisleFactor: "aisleFactor" }, outputId: "palletPositions" },
    { formulaId: "measurement.warehouse_vertical_cap", inputMap: { palletPositions: "palletPositions", rackLevels: "rackLevels" }, outputId: "verticalCap" },
    { formulaId: "measurement.warehouse_throughput_cap", inputMap: { doorCount: "doorCount", turnaroundLoad: "turnaroundLoad", turnaroundUnload: "turnaroundUnload" }, outputId: "throughputCap" },
    { formulaId: "measurement.warehouse_pick_efficiency", inputMap: { pickLines: "pickLines", travelTime: "travelTime" }, outputId: "pickEfficiency" },
    { formulaId: "cost.warehouse_cost_per_pos", inputMap: { facilityCost: "facilityCost", palletPositions: "palletPositions" }, outputId: "costPerPosition" },
  ],
  reportTemplate: { title: "Warehouse Layout Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Positions = (Area×UtilRate)/(PalletFP×AisleFactor).", "Throughput = Doors/(TurnLoad+TurnUnload).", "PickEfficiency = Lines/TravelTime."] },
};
