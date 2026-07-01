/**
 * Tool — Su Kullanımı
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const WATER_USAGE_OPTIMIZER_ANALYZER: PremiumCalculatorSchema = {
  id: "water-usage-optimizer-analyzer", legacyPaidSlug: "water-usage-optimizer-analyzer",
  name: "Water Usage Optimization Analyzer", name_i18n: {"en":"Water Usage Optimization Analyzer"}, sectorSlug: "energy-carbon", category: "measurement",
  painStatement: "Endüstriyel su tüketimi izlenmezse su yoğunluğu artar, atık su maliyeti yükselir ve verimlilik düşer.", painStatement_i18n: {"en":"Endüstriyel Water Consumption if not tracked Water yoğunluğu artar, Waste Water Cost yükselir ve productivity düşer."},
  inputs: [
    { id: "totalWaterUse", label: "Annual total water use", label_i18n: {"en":"Annual total water use"}, type: "number", unit: "m³/yıl", required: true, smartDefault: 50000, validation: { min: 1 }, helper: "", expertMeaning: "Annual total water use", expertMeaning_i18n: {"en":"Annual total water use"} },
    { id: "productionOutput", label: "Annual production output", label_i18n: {"en":"Annual production output"}, type: "number", unit: "ton/yıl", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production output", expertMeaning_i18n: {"en":"Annual production output"} },
    { id: "waterCostPerM3", label: "Water Unit Cost", label_i18n: {"en":"Water Unit Cost"}, type: "number", unit: "USD/m³", required: true, smartDefault: 1.5, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per cubic meter", expertMeaning_i18n: {"en":"Cost per cubic meter"} },
    { id: "wastewaterCostPerM3", label: "Wastewater treatment cost per m³", label_i18n: {"en":"Wastewater treatment cost per m³"}, type: "number", unit: "USD/m³", required: true, smartDefault: 2.0, validation: { min: 0.01 }, helper: "", expertMeaning: "Wastewater treatment cost per m³", expertMeaning_i18n: {"en":"Wastewater treatment cost per m³"} },
    { id: "wastewaterPct", label: "Percentage of water that becomes wastewater", label_i18n: {"en":"Percentage of water that becomes wastewater"}, type: "number", unit: "%", required: false, smartDefault: 70, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Percentage of water that becomes wastewater", expertMeaning_i18n: {"en":"Percentage of water that becomes wastewater"} },
    { id: "targetWaterIntensity", label: "Target water intensity", label_i18n: {"en":"Target water intensity"}, type: "number", unit: "m³/ton", required: false, smartDefault: 3, validation: { min: 0.1 }, helper: "", expertMeaning: "Target water intensity", expertMeaning_i18n: {"en":"Target water intensity"} },
    { id: "efficiencyInvestment", label: "Investment for water efficiency", label_i18n: {"en":"Investment for water efficiency"}, type: "number", unit: "USD", required: false, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Investment for water efficiency", expertMeaning_i18n: {"en":"Investment for water efficiency"} },
  ],
  outputs: [
    { id: "waterIntensity", label: "Su Yogunlugu", label_i18n: {"en":"Water Yogunlugu"}, unit: "m³/ton", format: "number" },
    { id: "waterSavingsTotal", label: "Total Water Savings", label_i18n: {"en":"Total Water Savings"}, unit: "m³/yıl", format: "number", isBigNumber: true },
    { id: "waterCostSavings", label: "Su Maliyet Tasarrufu", label_i18n: {"en":"Water Cost Tasarrufu"}, unit: "USD/yıl", format: "currency" },
    { id: "waterRoi", label: "Su Verimliligi ROI", label_i18n: {"en":"Water Verimliligi ROI"}, unit: "%", format: "percentage" },
  ],
  thresholds: [{ fieldId: "waterIntensity", warning: 5, critical: 8, direction: "higher_is_bad", warningMessage: "Su yoğunluğu >5 m³/ton — verimlilik iyileştirme fırsatı var.", warningMessage_i18n: {"en":"Water yoğunluğu >5 m³/ton — productivity improvement fırsatı var."}, criticalMessage: "Su yoğunluğu >8 m³/ton — acil su yönetim programı gerekli.", criticalMessage_i18n: {"en":"Water yoğunluğu >8 m³/ton — urgent Water management program gerekli."} }],
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
  reportTemplate: { title: "Su Kullanım Optimizasyon Raporu", title_i18n: {"en":"Water Utilization optimization Raporu"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Su yoğunluğu = toplam kullanım / üretim miktarı.", "Tasarruf = (mevcut − hedef) yoğunluk × üretim.", "Atık su maliyeti toplam suyun atık su oranı kadar kadarına uygulanır."],assumptionNotes_i18n:[{"en":"Su yoğunluğu = toplam kullanım / üretim miktarı."},{"en":"Tasarruf = (mevcut − hedef) yoğunluk × üretim."},{"en":"Atık su maliyeti toplam suyun atık su oranı kadar kadarına uygulanır."}] },
};
