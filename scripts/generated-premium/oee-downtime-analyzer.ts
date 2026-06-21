/**
 * OEE ve Durma Süresi — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const OEEDOWNTIME_SCHEMA: PremiumCalculatorSchema = {
  id: "oee-downtime-analyzer",
  legacyPaidSlug: "oee-downtime-analyzer",
  name: "OEE ve Durma Süresi",
  sectorSlug: "general",
  category: "cost",
  painStatement: "OEE ve Durma Süresi — premium analysis tool.",
  inputs: [
    { id: "planligercek_calisma_suresi", label: "Planlı/Gerçek Çalışma Süresi", type: "number", required: true },
    { id: "ideal_cevrim", label: "İdeal Çevrim", type: "number", required: true },
    { id: "toplamsaglam_adet", label: "Toplam/Sağlam Adet", type: "number", required: true },
    { id: "dakika_basina_durus_maliyeti", label: "Dakika Başına Duruş Maliyeti", type: "number", required: true },
    { id: "birim_maliyet", label: "Birim Maliyet", type: "number", required: true },
    { id: "takvim_suresi_alltime", label: "Takvim Süresi AllTime", type: "number", required: true },
  ],
  outputs: [
    { id: "availability", label: "Availability", unit: "currency", format: "currency" },
    { id: "performance", label: "Performance", unit: "currency", format: "currency" },
    { id: "quality", label: "Quality", unit: "currency", format: "currency" },
    { id: "o_e_e", label: "O E E", unit: "currency", format: "currency" },
    { id: "t_e_e_p", label: "T E E P", unit: "currency", format: "currency" },
    { id: "downtime_cost", label: "Downtime Cost", unit: "currency", format: "currency" },
    { id: "speed_loss", label: "Speed Loss", unit: "currency", format: "currency" },
    { id: "quality_loss", label: "Quality Loss", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.oee_ve_durma_suresi_analyzer_0", inputMap: { OperatingTime: "operating_time", PlannedProductionTime: "planned_production_time" }, outputId: "availability" },
    { formulaId: "custom.oee_ve_durma_suresi_analyzer_1", inputMap: { IdealCycleTime: "ideal_cycle_time", TotalCount: "total_count", OperatingTime: "operating_time" }, outputId: "performance" },
    { formulaId: "custom.oee_ve_durma_suresi_analyzer_2", inputMap: { GoodCount: "good_count", TotalCount: "total_count" }, outputId: "quality" },
    { formulaId: "custom.oee_ve_durma_suresi_analyzer_3", inputMap: { Availability: "availability", Performance: "performance", Quality: "quality" }, outputId: "o_e_e" },
    { formulaId: "custom.oee_ve_durma_suresi_analyzer_4", inputMap: { OEE: "o_e_e", PlannedProductionTime: "planned_production_time", AllTime: "all_time" }, outputId: "t_e_e_p" },
    { formulaId: "custom.oee_ve_durma_suresi_analyzer_5", inputMap: { PlannedProductionTime: "planned_production_time", OperatingTime: "operating_time", CostPerMinute: "cost_per_minute" }, outputId: "downtime_cost" },
    { formulaId: "custom.oee_ve_durma_suresi_analyzer_6", inputMap: { OperatingTime: "operating_time", IdealCycleTime: "ideal_cycle_time", TotalCount: "total_count", CostPerMinute: "cost_per_minute" }, outputId: "speed_loss" },
    { formulaId: "custom.oee_ve_durma_suresi_analyzer_7", inputMap: { TotalCount: "total_count", GoodCount: "good_count", UnitCost: "unit_cost" }, outputId: "quality_loss" },
  ],
  reportTemplate: {
    title: "OEE ve Durma Süresi Report",
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
