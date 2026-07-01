/**
 * Tool — Su Kullanımı
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const WATER_USAGE_OPTIMIZER_ANALYZER: PremiumCalculatorSchema = {
  id: "water-usage-optimizer-analyzer", legacyPaidSlug: "water-usage-optimizer-analyzer",
  name: "Su Kullanımı Optimizasyon Analizi", name_i18n: {"en":"Water Usage Optimization Analyzer"}, sectorSlug: "energy-carbon", category: "measurement",
  painStatement: "Endüstriyel su tüketimi izlenmezse su yoğunluğu artar, atık su maliyeti yükselir ve verimlilik düşer.", painStatement_i18n: {"en":"Endüstriyel su tüketimi izlenmezse su yoğunluğu artar, atık su maliyeti yükselir ve verimlilik düşer."},
  inputs: [
    { id: "totalWaterUse", label: "Toplam Su Kullanımı", label_i18n: {"en":"Annual total water use"}, type: "number", unit: "m³/yıl", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Annual total water use", expertMeaning_i18n: {"en":"Annual total water use"} },
    { id: "productionOutput", label: "Üretim Miktarı", label_i18n: {"en":"Annual production output"}, type: "number", unit: "ton/yıl", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production output", expertMeaning_i18n: {"en":"Annual production output"} },
    { id: "waterCostPerM3", label: "Su Birim Maliyeti", label_i18n: {"en":"Su Birim Maliyeti"}, type: "number", unit: "USD/m³", required: true, smartDefault: 1.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per cubic meter", expertMeaning_i18n: {"en":"Cost per cubic meter"} },
    { id: "wastewaterCostPerM3", label: "Atık Su Birim Maliyeti", label_i18n: {"en":"Wastewater treatment cost per m³"}, type: "number", unit: "USD/m³", required: true, smartDefault: 2.0, validation: { min: 0.01 }, helper: "", expertMeaning: "Wastewater treatment cost per m³", expertMeaning_i18n: {"en":"Wastewater treatment cost per m³"} },
    { id: "wastewaterPct", label: "Atık Su Oranı", label_i18n: {"en":"Percentage of water that becomes wastewater"}, type: "number", unit: "%", required: false, smartDefault: 70, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Percentage of water that becomes wastewater", expertMeaning_i18n: {"en":"Percentage of water that becomes wastewater"} },
    { id: "targetWaterIntensity", label: "Hedef Su Yoğunluğu", label_i18n: {"en":"Target water intensity"}, type: "number", unit: "m³/ton", required: false, smartDefault: 3, validation: { min: 0.1 }, helper: "", expertMeaning: "Target water intensity", expertMeaning_i18n: {"en":"Target water intensity"} },
    { id: "efficiencyInvestment", label: "Verimlilik Yatırım Maliyeti", label_i18n: {"en":"Investment for water efficiency"}, type: "number", unit: "USD", required: false, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Investment for water efficiency", expertMeaning_i18n: {"en":"Investment for water efficiency"} },
  ],
  outputs: [
    { id: "waterIntensity", label: "Su Yoğunluğu", label_i18n: {"en":"Su Yogunlugu"}, unit: "m³/ton", format: "number" },
    { id: "waterSavingsTotal", label: "Toplam Su Tasarrufu", label_i18n: {"en":"Toplam Su Tasarrufu"}, unit: "m³/yıl", format: "number", isBigNumber: true },
    { id: "waterCostSavings", label: "Su Maliyet Tasarrufu", label_i18n: {"en":"Su Maliyet Tasarrufu"}, unit: "USD/yıl", format: "currency" },
    { id: "waterRoi", label: "Su Verimliliği ROI", label_i18n: {"en":"Su Verimliligi ROI"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "waterIntensity", warning: 5, critical: 8, direction: "higher_is_bad", warningMessage: "Su yoğunluğu >5 m³/ton — verimlilik iyileştirme fırsatı var.", warningMessage_i18n: {"en":"Su yoğunluğu >5 m³/ton — verimlilik iyileştirme fırsatı var."}, criticalMessage: "Su yoğunluğu >8 m³/ton — acil su yönetim programı gerekli.", criticalMessage_i18n: {"en":"Su yoğunluğu >8 m³/ton — acil su yönetim programı gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.water_intensity", inputMap: { totalWaterUse: "totalWaterUse", productionOutput: "productionOutput" ,
        totalWater: "totalWater",
        productionVolume: "productionVolume"}, outputId: "waterIntensity" },
    { formulaId: "cost.water_savings_total", inputMap: { waterIntensity: "waterIntensity", targetWaterIntensity: "targetWaterIntensity", productionOutput: "productionOutput" ,
        baselineConsumption: "baselineConsumption",
        actualConsumption: "actualConsumption"}, outputId: "waterSavingsTotal" },
    { formulaId: "cost.water_cost_savings", inputMap: { waterSavingsTotal: "waterSavingsTotal", waterCostPerM3: "waterCostPerM3", wastewaterCostPerM3: "wastewaterCostPerM3", wastewaterPct: "wastewaterPct" ,
        waterSavings: "waterSavings",
        supplyRate: "supplyRate",
        wastewaterRate: "wastewaterRate"}, outputId: "waterCostSavings" },
    { formulaId: "cost.water_roi", inputMap: {
        waterCostSavings: "waterCostSavings",
        efficiencyInvestment: "efficiencyInvestment"
      ,
        costSavings: "costSavings",
        equipmentCost: "equipmentCost",
        installationCost: "installationCost"}, outputId: "waterRoi" },
  ],
  reportTemplate: { title: "Su Kullanım Optimizasyon Raporu", title_i18n: {"en":"Su Kullanım Optimizasyon Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Su yoğunluğu = toplam kullanım / üretim miktarı.", "Tasarruf = (mevcut − hedef) yoğunluk × üretim.", "Atık su maliyeti toplam suyun atık su oranı kadar kadarına uygulanır."],assumptionNotes_i18n:[{"en":"Su yoğunluğu = toplam kullanım / üretim miktarı."},{"en":"Tasarruf = (mevcut − hedef) yoğunluk × üretim."},{"en":"Atık su maliyeti toplam suyun atık su oranı kadar kadarına uygulanır."}] },
};
