/**
 * HURDA ORANI OPTİMİZE — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SCRAPRATEOPTIMIZE_SCHEMA: PremiumCalculatorSchema = {
  id: "scrap-rate-optimize-analyzer",
  legacyPaidSlug: "scrap-rate-optimize-analyzer",
  name: "HURDA ORANI OPTİMİZE",
  sectorSlug: "general",
  category: "cost",
  painStatement: "HURDA ORANI OPTİMİZE — premium analysis tool.",
  inputs: [
    { id: "girdihurda", label: "Girdi/Hurda", type: "number", required: true },
    { id: "nedenler", label: "Nedenler", type: "array", required: true },
    { id: "hammaddemakine", label: "Hammadde/Makine", type: "number", required: true },
    { id: "salvage", label: "Salvage", type: "number", required: true },
    { id: "hedef", label: "Hedef", type: "number", required: true },
    { id: "marj", label: "Marj", type: "number", required: true },
  ],
  outputs: [
    { id: "scrap_rate", label: "Scrap Rate", unit: "currency", format: "currency" },
    { id: "cost__mat", label: "Cost_ Mat", unit: "currency", format: "currency" },
    { id: "cost__lab", label: "Cost_ Lab", unit: "currency", format: "currency" },
    { id: "cost__o_h", label: "Cost_ O H", unit: "currency", format: "currency" },
    { id: "opp_cost", label: "Opp Cost", unit: "currency", format: "currency" },
    { id: "total_cost", label: "Total Cost", unit: "currency", format: "currency" },
    { id: "pareto", label: "Pareto", unit: "currency", format: "currency" },
    { id: "target", label: "Target", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.hurda_orani_optimize_analyzer_0", inputMap: { ScrapQty: "scrap_qty", TotalInput: "total_input" }, outputId: "scrap_rate" },
    { formulaId: "custom.hurda_orani_optimize_analyzer_1", inputMap: { ScrapQty: "scrap_qty", MatCost: "mat_cost" }, outputId: "cost__mat" },
    { formulaId: "custom.hurda_orani_optimize_analyzer_2", inputMap: { ScrapQty: "scrap_qty", Cycle: "cycle", LabRate: "lab_rate" }, outputId: "cost__lab" },
    { formulaId: "custom.hurda_orani_optimize_analyzer_3", inputMap: { ScrapQty: "scrap_qty", Cycle: "cycle", MachRate: "mach_rate" }, outputId: "cost__o_h" },
    { formulaId: "custom.hurda_orani_optimize_analyzer_4", inputMap: { ScrapQty: "scrap_qty", UnitMargin: "unit_margin" }, outputId: "opp_cost" },
    { formulaId: "custom.hurda_orani_optimize_analyzer_5", inputMap: { Mat: "mat", Lab: "lab", OH: "o_h", Opp: "opp", Salvage: "salvage" }, outputId: "total_cost" },
    { formulaId: "custom.hurda_orani_optimize_analyzer_6", inputMap: { Defects: "defects", Freq: "freq", DESC: "d_e_s_c" }, outputId: "pareto" },
    { formulaId: "custom.hurda_orani_optimize_analyzer_7", inputMap: { Benchmark: "benchmark", ImpFactor: "imp_factor" }, outputId: "target" },
  ],
  reportTemplate: {
    title: "HURDA ORANI OPTİMİZE Report",
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
