/**
 * Su Kullanımı Optimize Edici — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WATERUSAGEOPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "water-usage-optimizer-analyzer",
  legacyPaidSlug: "water-usage-optimizer-analyzer",
  name: "Su Kullanımı Optimize Edici",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Su Kullanımı Optimize Edici — premium analysis tool.",
  inputs: [
    { id: "toplam_tuketimgeri_donusum_m3", label: "Toplam Tüketim/Geri Dönüşüm m3", type: "number", required: true },
    { id: "uretim_hacmi", label: "Üretim Hacmi", type: "number", required: true },
    { id: "sebekeatiksu_birim_fiyati_currencym3", label: "Şebeke/Atıksu Birim Fiyatı currency/m3", type: "number", required: true },
    { id: "su_enerji_yogunlugu_kwhm3", label: "Su Enerji Yoğunluğu kWh/m3", type: "number", required: true },
    { id: "kacak_miktari_m3", label: "Kaçak Miktarı m3", type: "number", required: true },
    { id: "ekipman_yatirimi", label: "Ekipman Yatırımı", type: "number", required: true },
    { id: "iskonto_orani", label: "İskonto Oranı", type: "number", required: true },
  ],
  outputs: [
    { id: "water_intensity", label: "Water Intensity", unit: "currency", format: "currency" },
    { id: "baseline_consumption", label: "Baseline Consumption", unit: "currency", format: "currency" },
    { id: "water_savings", label: "Water Savings", unit: "currency", format: "currency" },
    { id: "cost_savings", label: "Cost Savings", unit: "currency", format: "currency" },
    { id: "recycle_rate", label: "Recycle Rate", unit: "currency", format: "currency" },
    { id: "leak_loss", label: "Leak Loss", unit: "currency", format: "currency" },
    { id: "r_o_i__water", label: "R O I_ Water", unit: "currency", format: "currency" },
    { id: "carbon_footprint__water", label: "Carbon Footprint_ Water", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.su_kullanimi_optimize_edici_analyzer_0", inputMap: { TotalWaterConsumed: "total_water_consumed", ProductionVolume: "production_volume" }, outputId: "water_intensity" },
    { formulaId: "custom.su_kullanimi_optimize_edici_analyzer_1", inputMap: { HistoricalAvg: "historical_avg", ProductionVolume: "production_volume" }, outputId: "baseline_consumption" },
    { formulaId: "custom.su_kullanimi_optimize_edici_analyzer_2", inputMap: { BaselineConsumption: "baseline_consumption", ActualConsumption: "actual_consumption" }, outputId: "water_savings" },
    { formulaId: "custom.su_kullanimi_optimize_edici_analyzer_3", inputMap: { WaterSavings: "water_savings", WaterSupplyRate: "water_supply_rate", WastewaterTreatmentRate: "wastewater_treatment_rate" }, outputId: "cost_savings" },
    { formulaId: "custom.su_kullanimi_optimize_edici_analyzer_4", inputMap: { RecycledWater: "recycled_water", TotalWaterConsumed: "total_water_consumed" }, outputId: "recycle_rate" },
    { formulaId: "custom.su_kullanimi_optimize_edici_analyzer_5", inputMap: { TotalSupplied: "total_supplied", TotalMetered: "total_metered" }, outputId: "leak_loss" },
    { formulaId: "custom.su_kullanimi_optimize_edici_analyzer_6", inputMap: { CostSavings: "cost_savings", EquipmentCost: "equipment_cost", InstallationCost: "installation_cost" }, outputId: "r_o_i__water" },
    { formulaId: "custom.su_kullanimi_optimize_edici_analyzer_7", inputMap: { TotalConsumed: "total_consumed", EnergyIntensity_Water: "energy_intensity__water", GridEmissionFactor: "grid_emission_factor" }, outputId: "carbon_footprint__water" },
  ],
  reportTemplate: {
    title: "Su Kullanımı Optimize Edici Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
