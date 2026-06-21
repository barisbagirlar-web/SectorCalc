/**
 * Vsm finansal Dönüştürücü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const VSMFINANCIALCONVERTER_SCHEMA: PremiumCalculatorSchema = {
  id: "vsm-financial-converter-analyzer",
  legacyPaidSlug: "vsm-financial-converter-analyzer",
  name: "Vsm finansal Dönüştürücü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Vsm finansal Dönüştürücü — premium analysis tool.",
  inputs: [
    { id: "toplam_lead_time_gun", label: "Toplam Lead Time gün", type: "number", required: true },
    { id: "katma_degerli_sure_dk", label: "Katma Değerli Süre dk", type: "number", required: true },
    { id: "wip_stok_degeri", label: "WIP Stok Değeri", type: "number", required: true },
    { id: "gunluk_tasima_maliyeti", label: "Günlük Taşıma Maliyeti", type: "number", required: true },
    { id: "eskiyeni_cevrim_suresi_dk", label: "Eski/Yeni Çevrim Süresi dk", type: "number", required: true },
    { id: "yillik_hacim", label: "Yıllık Hacim", type: "number", required: true },
    { id: "kalite_iyilestirme_tasarrufu", label: "Kalite İyileştirme Tasarrufu", type: "number", required: true },
  ],
  outputs: [
    { id: "lead_time_cost", label: "Lead Time Cost", unit: "currency", format: "currency" },
    { id: "value_added_ratio", label: "Value Added Ratio", unit: "currency", format: "currency" },
    { id: "non_value_added_cost", label: "Non Value Added Cost", unit: "currency", format: "currency" },
    { id: "inventory_reduction_savings", label: "Inventory Reduction Savings", unit: "currency", format: "currency" },
    { id: "productivity_gain", label: "Productivity Gain", unit: "currency", format: "currency" },
    { id: "total_financial_impact", label: "Total Financial Impact", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.vsm_finansal_donusturucu_analyzer_0", inputMap: { WIP_Inventory: "w_i_p__inventory", DailyCarryingCost: "daily_carrying_cost", TotalLeadTimeDays: "total_lead_time_days" }, outputId: "lead_time_cost" },
    { formulaId: "custom.vsm_finansal_donusturucu_analyzer_1", inputMap: { ValueAddedTime: "value_added_time", TotalLeadTime: "total_lead_time" }, outputId: "value_added_ratio" },
    { formulaId: "custom.vsm_finansal_donusturucu_analyzer_2", inputMap: { TotalLeadTime: "total_lead_time", ValueAddedTime: "value_added_time", CostPerMinute: "cost_per_minute" }, outputId: "non_value_added_cost" },
    { formulaId: "custom.vsm_finansal_donusturucu_analyzer_3", inputMap: { OldWIP: "old_w_i_p", NewWIP: "new_w_i_p", CarryingRate: "carrying_rate" }, outputId: "inventory_reduction_savings" },
    { formulaId: "custom.vsm_finansal_donusturucu_analyzer_4", inputMap: { OldCycleTime: "old_cycle_time", NewCycleTime: "new_cycle_time", AnnualVolume: "annual_volume", LaborRate: "labor_rate" }, outputId: "productivity_gain" },
    { formulaId: "custom.vsm_finansal_donusturucu_analyzer_5", inputMap: { InventoryReductionSavings: "inventory_reduction_savings", ProductivityGain: "productivity_gain", QualityImprovementSavings: "quality_improvement_savings" }, outputId: "total_financial_impact" },
  ],
  reportTemplate: {
    title: "Vsm finansal Dönüştürücü Report",
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
