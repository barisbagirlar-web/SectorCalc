/**
 * Tool — Sulama Maliyet
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const IRRIGATION_COST_CHECK_ANALYZER: PremiumCalculatorSchema = {
  id: "irrigation-cost-check-analyzer", legacyPaidSlug: "irrigation-cost-check-analyzer",
  name: "Sulama Maliyet Kontrolü", name_i18n: {"en":"Sulama Maliyet Kontrolu","tr":"Sulama Maliyet Kontrolü"}, sectorSlug: "food", category: "cost",
  painStatement: "Sulama maliyetleri su, enerji ve işçilik kalemlerinde doğru hesaplanmazsa çiftçi veya işletme ürün maliyetini gerçekçi göremez.", painStatement_i18n: {"en":"Sulama maliyetleri su, enerji ve işçilik kalemlerinde doğru hesaplanmazsa çiftçi veya işletme ürün maliyetini gerçekçi göremez.","tr":"Sulama maliyetleri su, enerji ve işçilik kalemlerinde doğru hesaplanmazsa çiftçi veya işletme ürün maliyetini gerçekçi göremez."},
  inputs: [
    { id: "areaHectares", label: "Alan Büyüklüğü", label_i18n: {"en":"Irrigated area in hectares","tr":"Alan Büyüklüğü"}, type: "number", unit: "ha", required: true, smartDefault: 50, validation: { min: 0.1 }, helper: "", expertMeaning: "Irrigated area in hectares", expertMeaning_i18n: {"en":"Irrigated area in hectares","tr":"alan büyüklüğü"} },
    { id: "cropWaterNeed", label: "Bitki Su İhtiyacı", label_i18n: {"en":"Crop water requirement per season","tr":"Bitki Su İhtiyacı"}, type: "number", unit: "mm/sezon", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Crop water requirement per season", expertMeaning_i18n: {"en":"Crop water requirement per season","tr":"bitki su i̇htiyacı"} },
    { id: "rainfall", label: "Yağış Miktarı", label_i18n: {"en":"Effective rainfall per season","tr":"Yağış Miktarı"}, type: "number", unit: "mm/sezon", required: false, smartDefault: 150, validation: { min: 0 }, helper: "", expertMeaning: "Effective rainfall per season", expertMeaning_i18n: {"en":"Effective rainfall per season","tr":"yağış miktarı"} },
    { id: "irrigationEfficiency", label: "Sulama Verimliliği", label_i18n: {"en":"Irrigation system efficiency","tr":"Sulama Verimliliği"}, type: "number", unit: "%", required: false, smartDefault: 75, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Irrigation system efficiency", expertMeaning_i18n: {"en":"Irrigation system efficiency","tr":"sulama verimliliği"} },
    { id: "waterCost", label: "Su Birim Maliyeti", label_i18n: {"en":"Su Birim Maliyeti","tr":"Su Birim Maliyeti"}, type: "number", unit: "USD/m³", required: true, smartDefault: 0.12, validation: { min: 0.001 }, helper: "", expertMeaning: "Cost per cubic meter of water", expertMeaning_i18n: {"en":"Cost per cubic meter of water","tr":"Cost per cubic meter of water"} },
    { id: "pumpPower", label: "Pompa Gücü", label_i18n: {"en":"Pump power in kW","tr":"Pompa Gücü"}, type: "number", unit: "kW", required: true, smartDefault: 15, validation: { min: 0.1 }, helper: "", expertMeaning: "Pump power in kW", expertMeaning_i18n: {"en":"Pump power in kW","tr":"pompa gücü"} },
    { id: "pumpHours", label: "Pompa Çalışma Süresi", label_i18n: {"en":"Pump operating hours per season","tr":"Pompa Çalışma Süresi"}, type: "number", unit: "saat/sezon", required: false, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Pump operating hours per season", expertMeaning_i18n: {"en":"Pump operating hours per season","tr":"pompa çalışma süresi"} },
    { id: "electricityCost", label: "Elektrik Birim Maliyeti", label_i18n: {"en":"Elektrik Birim Maliyeti","tr":"Elektrik Birim Maliyeti"}, type: "number", unit: "USD/kWh", required: true, smartDefault: 0.10, validation: { min: 0.001 }, helper: "", expertMeaning: "Electricity cost per kWh", expertMeaning_i18n: {"en":"Electricity cost per kWh","tr":"Electricity cost per kWh"} },
    { id: "laborCost", label: "İşçilik Maliyeti", label_i18n: {"en":"Total labor cost for irrigation","tr":"İşçilik Maliyeti"}, type: "number", unit: "USD/sezon", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Total labor cost for irrigation", expertMeaning_i18n: {"en":"Total labor cost for irrigation","tr":"i̇şçilik maliyeti"} },
  ],
  outputs: [
    { id: "irrigationWaterReq", label: "Sulama Suyu İhtiyacı", label_i18n: {"en":"Sulama Suyu Ihtiyac","tr":"Sulama Suyu İhtiyacı"}, unit: "m³/sezon", format: "number", isBigNumber: true },
    { id: "irrigationEnergyCost", label: "Sulama Enerji Maliyeti", label_i18n: {"en":"Sulama Enerji Maliyeti","tr":"Sulama Enerji Maliyeti"}, unit: "USD/sezon", format: "currency" },
    { id: "irrigationTotalCost", label: "Toplam Sulama Maliyeti", label_i18n: {"en":"Toplam Sulama Maliyeti","tr":"Toplam Sulama Maliyeti"}, unit: "USD/sezon", format: "currency" },
  ],
  thresholds: [{ fieldId: "irrigationTotalCost", warning: 20000, critical: 40000, direction: "higher_is_bad", warningMessage: "Sulama maliyeti >$20K — sistem verimliliği sorgulanmalı.", warningMessage_i18n: {"en":"Sulama maliyeti >$20K — sistem verimliliği sorgulanmalı.","tr":"Sulama maliyeti >$20K — sistem verimliliği sorgulanmalı."}, criticalMessage: "Sulama maliyeti >$40K — alternatif sulama yöntemleri değerlendirilmeli.", criticalMessage_i18n: {"en":"Sulama maliyeti >$40K — alternatif sulama yöntemleri değerlendirilmeli.","tr":"Sulama maliyeti >$40K — alternatif sulama yöntemleri değerlendirilmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.irrigation_water_req", inputMap: {
        cropWaterNeed: "cropWaterNeed",
        rainfall: "rainfall",
        area: "areaHectares",
        irrigationEfficiency: "irrigationEfficiency"
      }, outputId: "irrigationWaterReq" },
    { formulaId: "cost.irrigation_energy_cost", inputMap: { pumpPower: "pumpPower", pumpHours: "pumpHours", electricityCost: "electricityCost" }, outputId: "irrigationEnergyCost" },
    { formulaId: "cost.irrigation_total_cost", inputMap: {
        irrigationEnergyCost: "irrigationEnergyCost",
        irrigationWaterReq: "irrigationWaterReq",
        laborCost: "laborCost",
        depreciation: "waterCost"
      }, outputId: "irrigationTotalCost" },
  ],
  reportTemplate: { title: "Sulama Maliyet Kontrol Raporu", title_i18n: {"en":"Sulama Maliyet Kontrol Raporu","tr":"Sulama Maliyet Kontrol Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Sulama suyu = (bitki ihtiyacı − yağış) × alan × 10 / verimlilik.", "Enerji maliyeti = güç × saat × elektrik birim fiyatı.", "Toplam maliyet = su + enerji + işçilik.", "10 mm = 100 m³/ha dönüşümü kullanılır."],assumptionNotes_i18n:[{"en":"Sulama suyu = (bitki ihtiyacı − yağış) × alan × 10 / verimlilik.","tr":"Sulama suyu = (bitki ihtiyacı − yağış) × alan × 10 / verimlilik."},{"en":"Enerji maliyeti = güç × saat × elektrik birim fiyatı.","tr":"Enerji maliyeti = güç × saat × elektrik birim fiyatı."},{"en":"Toplam maliyet = su + enerji + işçilik.","tr":"Toplam maliyet = su + enerji + işçilik."},{"en":"10 mm = 100 m³/ha dönüşümü kullanılır.","tr":"10 mm = 100 m³/ha dönüşümü kullanılır."}] },
};
