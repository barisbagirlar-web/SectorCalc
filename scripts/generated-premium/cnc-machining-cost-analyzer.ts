/**
 * CNC İŞLEME MALİYETİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CNCMACHININGCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "cnc-machining-cost-analyzer",
  legacyPaidSlug: "cnc-machining-cost-analyzer",
  name: "CNC İŞLEME MALİYETİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CNC İŞLEME MALİYETİ — premium analysis tool.",
  inputs: [
    { id: "kg_fiyat", label: "kg Fiyat", type: "number", required: true },
    { id: "yogunluk", label: "Yoğunluk", type: "number", required: true },
    { id: "makine_ucreti", label: "Makine Ücreti", type: "number", required: true },
    { id: "takim_omru", label: "Takım Ömrü", type: "number", required: true },
    { id: "takim_maliyeti", label: "Takım Maliyeti", type: "number", required: true },
    { id: "enerji_tarifesi", label: "Enerji Tarifesi", type: "number", required: true },
    { id: "gider_carpani", label: "Gider Çarpanı", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__material", label: "Cost_ Material", unit: "currency", format: "currency" },
    { id: "cost__machining", label: "Cost_ Machining", unit: "currency", format: "currency" },
    { id: "cost__tooling", label: "Cost_ Tooling", unit: "currency", format: "currency" },
    { id: "cost__energy", label: "Cost_ Energy", unit: "currency", format: "currency" },
    { id: "cost__overhead", label: "Cost_ Overhead", unit: "currency", format: "currency" },
    { id: "total_unit_cost", label: "Total Unit Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cnc_isleme_maliyeti_analyzer_0", inputMap: { Volume_raw: "volume_raw", Density: "density", PricePerKg: "price_per_kg", ScrapRate: "scrap_rate" }, outputId: "cost__material" },
    { formulaId: "custom.cnc_isleme_maliyeti_analyzer_1", inputMap: { T_total: "t_total", MachineRate: "machine_rate" }, outputId: "cost__machining" },
    { formulaId: "custom.cnc_isleme_maliyeti_analyzer_2", inputMap: { T_cut: "t_cut", ToolLife: "tool_life", ToolCost: "tool_cost" }, outputId: "cost__tooling" },
    { formulaId: "custom.cnc_isleme_maliyeti_analyzer_3", inputMap: { Power: "power", T_total: "t_total", ElecRate: "elec_rate" }, outputId: "cost__energy" },
    { formulaId: "custom.cnc_isleme_maliyeti_analyzer_4", inputMap: { T_total: "t_total", OverheadRate: "overhead_rate" }, outputId: "cost__overhead" },
    { formulaId: "custom.cnc_isleme_maliyeti_analyzer_5", inputMap: { Material: "material", Machining: "machining", Tooling: "tooling", Energy: "energy", Overhead: "overhead", Quality: "quality" }, outputId: "total_unit_cost" },
  ],
  reportTemplate: {
    title: "CNC İŞLEME MALİYETİ Report",
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
