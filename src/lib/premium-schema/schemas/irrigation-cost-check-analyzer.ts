/**
 * Tool — Sulama Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const IRRIGATION_COST_CHECK_ANALYZER: PremiumCalculatorSchema = {
  id: "irrigation-cost-check-analyzer", legacyPaidSlug: "irrigation-cost-check-analyzer",
  name: "Sulama Maliyet Kontrolü", sectorSlug: "food", category: "cost",
  painStatement: "Sulama maliyetleri su, enerji ve işçilik kalemlerinde doğru hesaplanmazsa çiftçi veya işletme ürün maliyetini gerçekçi göremez.",
  inputs: [
    { id: "areaHectares", label: "Alan Büyüklüğü", type: "number", unit: "ha", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Irrigated area in hectares" },
    { id: "cropWaterNeed", label: "Bitki Su İhtiyacı", type: "number", unit: "mm/sezon", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Crop water requirement per season" },
    { id: "rainfall", label: "Yağış Miktarı", type: "number", unit: "mm/sezon", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Effective rainfall per season" },
    { id: "irrigationEfficiency", label: "Sulama Verimliliği", type: "number", unit: "%", required: false, smartDefault: 75, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Irrigation system efficiency" },
    { id: "waterCost", label: "Su Birim Maliyeti", type: "number", unit: "USD/m³", required: true, smartDefault: 0.12, validation: { min: 0.001 }, helper: "", expertMeaning: "Cost per cubic meter of water" },
    { id: "pumpPower", label: "Pompa Gücü", type: "number", unit: "kW", required: true, smartDefault: 15, validation: { min: 0.1 }, helper: "", expertMeaning: "Pump power in kW" },
    { id: "pumpHours", label: "Pompa Çalışma Süresi", type: "number", unit: "saat/sezon", required: false, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Pump operating hours per season" },
    { id: "electricityCost", label: "Elektrik Birim Maliyeti", type: "number", unit: "USD/kWh", required: true, smartDefault: 0.10, validation: { min: 0.001 }, helper: "", expertMeaning: "Electricity cost per kWh" },
    { id: "laborCost", label: "İşçilik Maliyeti", type: "number", unit: "USD/sezon", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total labor cost for irrigation" },
  ],
  outputs: [
    { id: "irrigationWaterReq", label: "Sulama Suyu İhtiyacı", unit: "m³/sezon", format: "number", isBigNumber: true },
    { id: "irrigationEnergyCost", label: "Sulama Enerji Maliyeti", unit: "USD/sezon", format: "currency" },
    { id: "irrigationTotalCost", label: "Toplam Sulama Maliyeti", unit: "USD/sezon", format: "currency" },
  ],
  thresholds: [{ fieldId: "irrigationTotalCost", warning: 20000, critical: 40000, direction: "higher_is_bad", warningMessage: "Sulama maliyeti >$20K — sistem verimliliği sorgulanmalı.", criticalMessage: "Sulama maliyeti >$40K — alternatif sulama yöntemleri değerlendirilmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.irrigation_water_req", inputMap: { areaHectares: "areaHectares", cropWaterNeed: "cropWaterNeed", rainfall: "rainfall", irrigationEfficiency: "irrigationEfficiency" }, outputId: "irrigationWaterReq" },
    { formulaId: "cost.irrigation_energy_cost", inputMap: { pumpPower: "pumpPower", pumpHours: "pumpHours", electricityCost: "electricityCost" }, outputId: "irrigationEnergyCost" },
    { formulaId: "cost.irrigation_total_cost", inputMap: { irrigationWaterReq: "irrigationWaterReq", waterCost: "waterCost", irrigationEnergyCost: "irrigationEnergyCost", laborCost: "laborCost" }, outputId: "irrigationTotalCost" },
  ],
  reportTemplate: { title: "Sulama Maliyet Kontrol Raporu", sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Sulama suyu = (bitki ihtiyacı − yağış) × alan × 10 / verimlilik.", "Enerji maliyeti = güç × saat × elektrik birim fiyatı.", "Toplam maliyet = su + enerji + işçilik.", "10 mm = 100 m³/ha dönüşümü kullanılır."] },
};
