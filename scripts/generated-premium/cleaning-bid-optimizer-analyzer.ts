/**
 * Temizlik Teklifi Optimize Edici — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CLEANINGBIDOPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "cleaning-bid-optimizer-analyzer",
  legacyPaidSlug: "cleaning-bid-optimizer-analyzer",
  name: "Temizlik Teklifi Optimize Edici",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Temizlik Teklifi Optimize Edici — premium analysis tool.",
  inputs: [
    { id: "temizlenebilir_alan_m2", label: "Temizlenebilir Alan m2", type: "number", required: true },
    { id: "uretim_hizi_m2saat", label: "Üretim Hızı m2/saat", type: "number", required: true },
    { id: "saatlik_ucret_ve_yan_haklar", label: "Saatlik Ücret ve Yan Haklar", type: "number", required: true },
    { id: "sarf_malzeme_m2_maliyeti", label: "Sarf Malzeme m2 Maliyeti", type: "number", required: true },
    { id: "makine_saati", label: "Makine Saati", type: "number", required: true },
    { id: "overhead_orani", label: "Overhead Oranı", type: "number", required: true },
    { id: "hedef_marj", label: "Hedef Marj", type: "number", required: true },
  ],
  outputs: [
    { id: "area_to_clean", label: "Area To Clean", unit: "currency", format: "currency" },
    { id: "labor_hours", label: "Labor Hours", unit: "currency", format: "currency" },
    { id: "labor_cost", label: "Labor Cost", unit: "currency", format: "currency" },
    { id: "material_cost", label: "Material Cost", unit: "currency", format: "currency" },
    { id: "equipment_cost", label: "Equipment Cost", unit: "currency", format: "currency" },
    { id: "overhead", label: "Overhead", unit: "currency", format: "currency" },
    { id: "bid_price", label: "Bid Price", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.temizlik_teklifi_optimize_edici_analyzer_0", inputMap: { TotalSqM: "total_sq_m", CleanablePct: "cleanable_pct" }, outputId: "area_to_clean" },
    { formulaId: "custom.temizlik_teklifi_optimize_edici_analyzer_1", inputMap: { AreaToClean: "area_to_clean", ProductionRatePerHour: "production_rate_per_hour" }, outputId: "labor_hours" },
    { formulaId: "custom.temizlik_teklifi_optimize_edici_analyzer_2", inputMap: { LaborHours: "labor_hours", HourlyWage: "hourly_wage", Burden: "burden" }, outputId: "labor_cost" },
    { formulaId: "custom.temizlik_teklifi_optimize_edici_analyzer_3", inputMap: { AreaToClean: "area_to_clean", ConsumableCostPerSqM: "consumable_cost_per_sq_m" }, outputId: "material_cost" },
    { formulaId: "custom.temizlik_teklifi_optimize_edici_analyzer_4", inputMap: { MachineHours: "machine_hours", DepreciationRate: "depreciation_rate" }, outputId: "equipment_cost" },
    { formulaId: "custom.temizlik_teklifi_optimize_edici_analyzer_5", inputMap: { LaborCost: "labor_cost", MaterialCost: "material_cost", OverheadPct: "overhead_pct" }, outputId: "overhead" },
    { formulaId: "custom.temizlik_teklifi_optimize_edici_analyzer_6", inputMap: { LaborCost: "labor_cost", MaterialCost: "material_cost", EquipmentCost: "equipment_cost", Overhead: "overhead_orani", TargetMargin: "target_margin" }, outputId: "bid_price" },
  ],
  reportTemplate: {
    title: "Temizlik Teklifi Optimize Edici Report",
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
