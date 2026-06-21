/**
 * İŞLEME STRATEJİSİ SÜRE — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MACHININGSTRATEGY_SCHEMA: PremiumCalculatorSchema = {
  id: "machining-strategy-analyzer",
  legacyPaidSlug: "machining-strategy-analyzer",
  name: "İŞLEME STRATEJİSİ SÜRE",
  sectorSlug: "general",
  category: "cost",
  painStatement: "İŞLEME STRATEJİSİ SÜRE — premium analysis tool.",
  inputs: [
    { id: "vc", label: "V_c", type: "number", required: true },
    { id: "f", label: "f", type: "number", required: true },
    { id: "ap", label: "a_p", type: "number", required: true },
    { id: "m", label: "m", type: "array", required: true },
    { id: "max_guc", label: "Max Güç", type: "number", required: true },
    { id: "ozgul_enerji", label: "Özgül Enerji", type: "number", required: true },
    { id: "degisim_sure", label: "Değişim Süre", type: "number", required: true },
    { id: "takim", label: "Takım", type: "number", required: true },
  ],
  outputs: [
    { id: "m_r_r", label: "M R R", unit: "currency", format: "currency" },
    { id: "power", label: "Power", unit: "currency", format: "currency" },
    { id: "tool_life", label: "Tool Life", unit: "currency", format: "currency" },
    { id: "cost", label: "Cost", unit: "currency", format: "currency" },
    { id: "opt__vc", label: "Opt_ Vc", unit: "currency", format: "currency" },
    { id: "t_opt", label: "T_opt", unit: "currency", format: "currency" },
    { id: "ra", label: "Ra", unit: "currency", format: "currency" },
    { id: "check", label: "Check", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.isleme_stratejisi_sure_analyzer_0", inputMap: { V_c: "v_c", a_p: "a_p" }, outputId: "m_r_r" },
    { formulaId: "custom.isleme_stratejisi_sure_analyzer_1", inputMap: { MRR: "m", SpecEnergy: "spec_energy" }, outputId: "power" },
    { formulaId: "custom.isleme_stratejisi_sure_analyzer_2", inputMap: { V_c: "v_c" }, outputId: "tool_life" },
    { formulaId: "custom.isleme_stratejisi_sure_analyzer_3", inputMap: { Mach: "m", Change: "change", Tool: "tool" }, outputId: "cost" },
    { formulaId: "custom.isleme_stratejisi_sure_analyzer_4", inputMap: { T_opt: "t_opt" }, outputId: "opt__vc" },
    { formulaId: "custom.isleme_stratejisi_sure_analyzer_5", inputMap: { ChangeTime: "m", ToolCost: "tool_cost", MachRate: "m" }, outputId: "t_opt" },
    { formulaId: "custom.isleme_stratejisi_sure_analyzer_6", inputMap: { NoseRad: "nose_rad" }, outputId: "ra" },
    { formulaId: "custom.isleme_stratejisi_sure_analyzer_7", inputMap: { Power: "power", MaxPower: "m", Ra: "ra", Tol: "tol" }, outputId: "check" },
  ],
  reportTemplate: {
    title: "İŞLEME STRATEJİSİ SÜRE Report",
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
