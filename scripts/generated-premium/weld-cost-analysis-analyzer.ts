/**
 * Kaynak Maliyeti — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WELDCOSTANALYSIS_SCHEMA: PremiumCalculatorSchema = {
  id: "weld-cost-analysis-analyzer",
  legacyPaidSlug: "weld-cost-analysis-analyzer",
  name: "Kaynak Maliyeti",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kaynak Maliyeti — premium analysis tool.",
  inputs: [
    { id: "toplam_kaynak_metresi", label: "Toplam Kaynak Metresi", type: "number", required: true },
    { id: "vardiya_suresi", label: "Vardiya Süresi", type: "number", required: true },
    { id: "ilerleme_hizi_cmmin", label: "İlerleme Hızı cm/min", type: "number", required: true },
    { id: "ark_suresi_orani", label: "Ark Süresi Oranı", type: "number", required: true },
    { id: "dolgugazenerji_maliyeti", label: "Dolgu/Gaz/Enerji Maliyeti", type: "number", required: true },
    { id: "iscilikoverhead", label: "İşçilik/Overhead", type: "number", required: true },
  ],
  outputs: [
    { id: "operating_factor", label: "Operating Factor", unit: "currency", format: "currency" },
    { id: "deposition_rate", label: "Deposition Rate", unit: "currency", format: "currency" },
    { id: "total_joint_cost", label: "Total Joint Cost", unit: "currency", format: "currency" },
    { id: "cost_per_meter", label: "Cost Per Meter", unit: "currency", format: "currency" },
    { id: "consumable_cost_pct", label: "Consumable Cost Pct", unit: "currency", format: "currency" },
    { id: "labor_cost_pct", label: "Labor Cost Pct", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kaynak_maliyeti_analyzer_0", inputMap: { ArcTime: "arc_time", TotalShiftTime: "total_shift_time" }, outputId: "operating_factor" },
    { formulaId: "custom.kaynak_maliyeti_analyzer_1", inputMap: { Weight_Deposited: "weight__deposited", ArcTime: "arc_time" }, outputId: "deposition_rate" },
    { formulaId: "custom.kaynak_maliyeti_analyzer_2", inputMap: { Length: "length", TravelSpeed: "travel_speed", LaborRate: "labor_rate", OverheadRate: "overhead_rate", OperatingFactor: "operating_factor", FillerCost: "filler_cost", GasCost: "gas_cost", PowerCost: "power_cost" }, outputId: "total_joint_cost" },
    { formulaId: "custom.kaynak_maliyeti_analyzer_3", inputMap: { TotalJointCost: "total_joint_cost", Length: "length" }, outputId: "cost_per_meter" },
    { formulaId: "custom.kaynak_maliyeti_analyzer_4", inputMap: { FillerCost: "filler_cost", TotalJointCost: "total_joint_cost" }, outputId: "consumable_cost_pct" },
    { formulaId: "custom.kaynak_maliyeti_analyzer_5", inputMap: { LaborCost: "labor_cost", TotalJointCost: "total_joint_cost" }, outputId: "labor_cost_pct" },
  ],
  reportTemplate: {
    title: "Kaynak Maliyeti Report",
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
