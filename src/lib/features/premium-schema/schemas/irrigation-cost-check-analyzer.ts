/**
 * Tool — Sulama Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const IRRIGATION_COST_CHECK_ANALYZER: PremiumCalculatorSchema = {
  id: "irrigation-cost-check-analyzer", legacyPaidSlug: "irrigation-cost-check-analyzer",
  name: "Sulama Maliyet Kontrolü", name_i18n: {"en":"Irrigation Cost Check Analyzer"}, sectorSlug: "food", category: "cost",
  painStatement: "Sulama maliyetleri su, enerji ve işçilik kalemlerinde doğru hesaplanmazsa çiftçi veya işletme ürün maliyetini gerçekçi göremez.", painStatement_i18n: {"en":"Irrigation maliyetleri Water, energy ve işçilik kalemlerinde accurate if not calculated çiftçi veya operation product maliyetini gerçekçi göremez."},
  inputs: [
    { id: "areaHectares", label: "Irrigated area in hectares", label_i18n: {"en":"Irrigated area in hectares"}, type: "number", unit: "ha", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Irrigated area in hectares", expertMeaning_i18n: {"en":"Irrigated area in hectares"} },
    { id: "cropWaterNeed", label: "Crop water requirement per season", label_i18n: {"en":"Crop water requirement per season"}, type: "number", unit: "mm/sezon", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Crop water requirement per season", expertMeaning_i18n: {"en":"Crop water requirement per season"} },
    { id: "rainfall", label: "Effective rainfall per season", label_i18n: {"en":"Effective rainfall per season"}, type: "number", unit: "mm/sezon", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Effective rainfall per season", expertMeaning_i18n: {"en":"Effective rainfall per season"} },
    { id: "irrigationEfficiency", label: "Irrigation system efficiency", label_i18n: {"en":"Irrigation system efficiency"}, type: "number", unit: "%", required: false, smartDefault: 75, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Irrigation system efficiency", expertMeaning_i18n: {"en":"Irrigation system efficiency"} },
    { id: "waterCost", label: "Water Unit Cost", label_i18n: {"en":"Water Unit Cost"}, type: "number", unit: "USD/m³", required: true, smartDefault: 0.12, validation: { min: 0.001 }, helper: "", expertMeaning: "Cost per cubic meter of water", expertMeaning_i18n: {"en":"Cost per cubic meter of water"} },
    { id: "pumpPower", label: "Pompa Gücü", label_i18n: {"en":"Pump power in kW"}, type: "number", unit: "kW", required: true, smartDefault: 15, validation: { min: 0.1 }, helper: "", expertMeaning: "Pump power in kW", expertMeaning_i18n: {"en":"Pump power in kW"} },
    { id: "pumpHours", label: "Pump operating hours per season", label_i18n: {"en":"Pump operating hours per season"}, type: "number", unit: "saat/sezon", required: false, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Pump operating hours per season", expertMeaning_i18n: {"en":"Pump operating hours per season"} },
    { id: "electricityCost", label: "Electricity Unit Cost", label_i18n: {"en":"Electricity Unit Cost"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.10, validation: { min: 0.001 }, helper: "", expertMeaning: "Electricity cost per kWh", expertMeaning_i18n: {"en":"Electricity cost per kWh"} },
    { id: "laborCost", label: "Total labor cost for irrigation", label_i18n: {"en":"Total labor cost for irrigation"}, type: "number", unit: "USD/sezon", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total labor cost for irrigation", expertMeaning_i18n: {"en":"Total labor cost for irrigation"} },
  ],
  outputs: [
    { id: "irrigationWaterReq", label: "Sulama Suyu Ihtiyac", label_i18n: {"en":"Irrigation Suyu Ihtiyac"}, unit: "m³/sezon", format: "number", isBigNumber: true },
    { id: "irrigationEnergyCost", label: "Irrigation Energy Cost", label_i18n: {"en":"Irrigation Energy Cost"}, unit: "USD/sezon", format: "currency" },
    { id: "irrigationTotalCost", label: "Total Irrigation Cost", label_i18n: {"en":"Total Irrigation Cost"}, unit: "USD/sezon", format: "currency" },
  ],
  thresholds: [{ fieldId: "irrigationTotalCost", warning: 20000, critical: 40000, direction: "higher_is_bad", warningMessage: "Sulama maliyeti >$20K — sistem verimliliği sorgulanmalı.", warningMessage_i18n: {"en":"Irrigation Cost >$20K — System verimliliği sorgulanmalı."}, criticalMessage: "Sulama maliyeti >$40K — alternatif sulama yöntemleri değerlendirilmeli.", criticalMessage_i18n: {"en":"Irrigation Cost >$40K — alternatif Irrigation yöntemleri değerlendirilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.irrigation_water_req", inputMap: {
        cropWaterNeed: "cropWaterNeed",
        rainfall: "rainfall",
        area: "areaHectares",
        irrigationEfficiency: "irrigationEfficiency"
      ,
        etc: "etc",
        effectiveRainfall: "effectiveRainfall"}, outputId: "irrigationWaterReq" },
    { formulaId: "cost.irrigation_energy_cost", inputMap: { pumpPower: "pumpPower", pumpHours: "pumpHours", electricityCost: "electricityCost" ,
        waterRequirement: "waterRequirement",
        totalHead: "totalHead",
        pumpEff: "pumpEff",
        motorEff: "motorEff",
        elecRate: "elecRate"}, outputId: "irrigationEnergyCost" },
    { formulaId: "cost.irrigation_total_cost", inputMap: {
        irrigationEnergyCost: "irrigationEnergyCost",
        irrigationWaterReq: "irrigationWaterReq",
        laborCost: "laborCost",
        depreciation: "waterCost"
      ,
        energyCost: "energyCost",
        maintCost: "maintCost"}, outputId: "irrigationTotalCost" },
  ],
  reportTemplate: { title: "Sulama Maliyet Kontrol Raporu", title_i18n: {"en":"Irrigation Cost control Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Sulama suyu = (bitki ihtiyacı − yağış) × alan × 10 / verimlilik.", "Enerji maliyeti = güç × saat × elektrik birim fiyatı.", "Toplam maliyet = su + enerji + işçilik.", "10 mm = 100 m³/ha dönüşümü kullanılır."],assumptionNotes_i18n:[{"en":"Sulama suyu = (bitki ihtiyacı − yağış) × alan × 10 / verimlilik."},{"en":"Enerji maliyeti = güç × saat × elektrik birim fiyatı."},{"en":"Toplam maliyet = su + enerji + işçilik."},{"en":"10 mm = 100 m³/ha dönüşümü kullanılır."}] },
};
