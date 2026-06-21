/**
 * Kesim Parameters Takım ömrü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CUTTINGTOOLLIFE_SCHEMA: PremiumCalculatorSchema = {
  id: "cutting-tool-life-analyzer",
  legacyPaidSlug: "cutting-tool-life-analyzer",
  name: "Kesim Parameters Takım ömrü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kesim Parameters Takım ömrü — premium analysis tool.",
  inputs: [
    { id: "kesme_hizi_vc", label: "Kesme Hızı V_c", type: "number", required: true },
    { id: "ilerleme_f", label: "İlerleme f", type: "number", required: true },
    { id: "derinlik_ap", label: "Derinlik a_p", type: "number", required: true },
    { id: "k", label: "k", type: "array", required: true },
    { id: "takim_ucu_maliyeti", label: "Takım Ucu Maliyeti", type: "number", required: true },
    { id: "kenar_sayisi", label: "Kenar Sayısı", type: "number", required: true },
    { id: "takim_degisim_suresi", label: "Takım Değişim Süresi", type: "number", required: true },
    { id: "makine_ucreti", label: "Makine Ücreti", type: "number", required: true },
  ],
  outputs: [
    { id: "tool_life__t", label: "Tool Life_ T", unit: "currency", format: "currency" },
    { id: "taylor_exponent_n", label: "Taylor Exponent_n", unit: "currency", format: "currency" },
    { id: "cost_per_part__tool", label: "Cost Per Part_ Tool", unit: "currency", format: "currency" },
    { id: "optimal_tool_life__cost", label: "Optimal Tool Life_ Cost", unit: "currency", format: "currency" },
    { id: "optimal__vc", label: "Optimal_ Vc", unit: "currency", format: "currency" },
    { id: "production_rate", label: "Production Rate", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kesim_parameters_takim_omru_analyzer_0", inputMap: { V_c: "v_c", a_p: "a_p" }, outputId: "tool_life__t" },
    { formulaId: "custom.kesim_parameters_takim_omru_analyzer_1", inputMap: { T1: "t1", T2: "t2", V1: "v1", V2: "v2" }, outputId: "taylor_exponent_n" },
    { formulaId: "custom.kesim_parameters_takim_omru_analyzer_2", inputMap: { ToolCost: "tool_cost", Edges: "edges", MachiningTime: "machining_time", ToolLife: "tool_life" }, outputId: "cost_per_part__tool" },
    { formulaId: "custom.kesim_parameters_takim_omru_analyzer_3", inputMap: { ToolChangeTime: "tool_change_time", ToolCost: "tool_cost", Edges: "edges", MachineRate: "machine_rate" }, outputId: "optimal_tool_life__cost" },
    { formulaId: "custom.kesim_parameters_takim_omru_analyzer_4", inputMap: { OptimalToolLife_Cost: "optimal_tool_life__cost" }, outputId: "optimal__vc" },
    { formulaId: "custom.kesim_parameters_takim_omru_analyzer_5", inputMap: { MachiningTime: "machining_time", ToolLife: "tool_life", ToolChangeTime: "tool_change_time" }, outputId: "production_rate" },
  ],
  reportTemplate: {
    title: "Kesim Parameters Takım ömrü Report",
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
