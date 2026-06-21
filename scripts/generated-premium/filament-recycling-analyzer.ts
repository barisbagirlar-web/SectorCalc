/**
 * FILAMENT RECYCLING — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FILAMENTRECYCLING_SCHEMA: PremiumCalculatorSchema = {
  id: "filament-recycling-analyzer",
  legacyPaidSlug: "filament-recycling-analyzer",
  name: "FILAMENT RECYCLING",
  sectorSlug: "general",
  category: "cost",
  painStatement: "FILAMENT RECYCLING — premium analysis tool.",
  inputs: [
    { id: "saf_fiyatfire", label: "Saf Fiyat/Fire", type: "currency/number", required: true },
    { id: "toplamapellet", label: "Toplama/Pellet", type: "number", required: true },
    { id: "verim", label: "Verim", type: "number", required: true },
    { id: "enerji", label: "Enerji", type: "kWh", required: true },
    { id: "mukavemet_kayip", label: "Mukavemet Kayıp", type: "number", required: true },
    { id: "karbon", label: "Karbon", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__virgin", label: "Cost_ Virgin", unit: "currency", format: "currency" },
    { id: "cost__recyc", label: "Cost_ Recyc", unit: "currency", format: "currency" },
    { id: "qual_penalty", label: "Qual Penalty", unit: "currency", format: "currency" },
    { id: "energy_sav", label: "Energy Sav", unit: "currency", format: "currency" },
    { id: "carbon_cred", label: "Carbon Cred", unit: "currency", format: "currency" },
    { id: "total__r", label: "Total_ R", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.filament_recycling_analyzer_0", inputMap: { Price_V: "price__v", Scrap_V: "scrap__v", Transp_V: "transp__v" }, outputId: "cost__virgin" },
    { formulaId: "custom.filament_recycling_analyzer_1", inputMap: { Collect: "collect", Sort: "sort", Pellet: "toplamapellet", Yield: "yield" }, outputId: "cost__recyc" },
    { formulaId: "custom.filament_recycling_analyzer_2", inputMap: { Tensile_V: "tensile__v", Tensile_R: "tensile__r", AppFactor: "app_factor" }, outputId: "qual_penalty" },
    { formulaId: "custom.filament_recycling_analyzer_3", inputMap: { Energy_V: "energy__v", Energy_R: "energy__r", EnergyCost: "energy_cost" }, outputId: "energy_sav" },
    { formulaId: "custom.filament_recycling_analyzer_4", inputMap: { CO2_V: "c_o2__v", CO2_R: "c_o2__r", CarbonPrice: "carbon_price" }, outputId: "carbon_cred" },
    { formulaId: "custom.filament_recycling_analyzer_5", inputMap: { Cost_Recyc: "cost__recyc", QualPenalty: "qual_penalty", EnergySav: "energy_sav", CarbonCred: "carbon_cred" }, outputId: "total__r" },
    { formulaId: "custom.filament_recycling_analyzer_6", inputMap: { Cost_V: "cost__v", Total_R: "total__r", Vol: "vol", Capex: "capex" }, outputId: "r_o_i" },
  ],
  reportTemplate: {
    title: "FILAMENT RECYCLING Report",
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
