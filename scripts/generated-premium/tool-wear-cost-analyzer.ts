/**
 * Takım Aşınma Maliyeti — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TOOLWEARCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "tool-wear-cost-analyzer",
  legacyPaidSlug: "tool-wear-cost-analyzer",
  name: "Takım Aşınma Maliyeti",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Takım Aşınma Maliyeti — premium analysis tool.",
  inputs: [
    { id: "kesme_suresi_dk", label: "Kesme Süresi dk", type: "number", required: true },
    { id: "takim_omru_dk", label: "Takım Ömrü dk", type: "number", required: true },
    { id: "taylor_ussu_n", label: "Taylor Üssü n", type: "number", required: true },
    { id: "takim_degisim_suresi_dk", label: "Takım Değişim Süresi dk", type: "number", required: true },
    { id: "ucinsert_fiyati", label: "Uç/Insert Fiyatı", type: "number", required: true },
    { id: "kenar_sayisi", label: "Kenar Sayısı", type: "number", required: true },
    { id: "makine_saatlik_ucreti", label: "Makine Saatlik Ücreti", type: "number", required: true },
  ],
  outputs: [
    { id: "tool_cost_per_part", label: "Tool Cost Per Part", unit: "currency", format: "currency" },
    { id: "change_cost_per_part", label: "Change Cost Per Part", unit: "currency", format: "currency" },
    { id: "total_tooling_cost", label: "Total Tooling Cost", unit: "currency", format: "currency" },
    { id: "wear_rate", label: "Wear Rate", unit: "currency", format: "currency" },
    { id: "optimal_tool_life", label: "Optimal Tool Life", unit: "currency", format: "currency" },
    { id: "cost_of_premature_failure", label: "Cost Of Premature Failure", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.takim_asinma_maliyeti_analyzer_0", inputMap: { InsertCost: "insert_cost", Edges: "edges", MachiningTime: "machining_time", ToolLife: "tool_life" }, outputId: "tool_cost_per_part" },
    { formulaId: "custom.takim_asinma_maliyeti_analyzer_1", inputMap: { ToolChangeTime: "tool_change_time", MachineRate: "machine_rate", MachiningTime: "machining_time", ToolLife: "tool_life" }, outputId: "change_cost_per_part" },
    { formulaId: "custom.takim_asinma_maliyeti_analyzer_2", inputMap: { ToolCostPerPart: "tool_cost_per_part", ChangeCostPerPart: "change_cost_per_part" }, outputId: "total_tooling_cost" },
    { formulaId: "custom.takim_asinma_maliyeti_analyzer_3", inputMap: { FlankWear: "flank_wear", MachiningTime: "machining_time" }, outputId: "wear_rate" },
    { formulaId: "custom.takim_asinma_maliyeti_analyzer_4", inputMap: { ToolChangeTime: "tool_change_time", InsertCost: "insert_cost", Edges: "edges", MachineRate: "machine_rate" }, outputId: "optimal_tool_life" },
    { formulaId: "custom.takim_asinma_maliyeti_analyzer_5", inputMap: { ExpectedLife: "expected_life", ActualLife: "actual_life", InsertCost: "insert_cost" }, outputId: "cost_of_premature_failure" },
  ],
  reportTemplate: {
    title: "Takım Aşınma Maliyeti Report",
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
