/**
 * HYDRAULIC SİSTEM KAYIP — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HYDRAULICSYSTEMLOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "hydraulic-system-loss-analyzer",
  legacyPaidSlug: "hydraulic-system-loss-analyzer",
  name: "HYDRAULIC SİSTEM KAYIP",
  sectorSlug: "general",
  category: "cost",
  painStatement: "HYDRAULIC SİSTEM KAYIP — premium analysis tool.",
  inputs: [
    { id: "basinc", label: "Basınç", type: "number", required: true },
    { id: "pompa_debisi", label: "Pompa Debisi", type: "number", required: true },
    { id: "kacak", label: "Kaçak", type: "number", required: true },
    { id: "boru_dusum", label: "Boru Düşüm", type: "number", required: true },
    { id: "vana_kayip", label: "Vana Kayıp", type: "number", required: true },
    { id: "saat", label: "Saat", type: "number", required: true },
    { id: "verim", label: "Verim", type: "number", required: true },
    { id: "tarif", label: "Tarif", type: "number", required: true },
  ],
  outputs: [
    { id: "loss__leak", label: "Loss_ Leak", unit: "currency", format: "currency" },
    { id: "loss__fric", label: "Loss_ Fric", unit: "currency", format: "currency" },
    { id: "loss__valve", label: "Loss_ Valve", unit: "currency", format: "currency" },
    { id: "heat", label: "Heat", unit: "currency", format: "currency" },
    { id: "eff", label: "Eff", unit: "currency", format: "currency" },
    { id: "cost__loss", label: "Cost_ Loss", unit: "currency", format: "currency" },
    { id: "degrade", label: "Degrade", unit: "currency", format: "currency" },
    { id: "cool", label: "Cool", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.hydraulic_sistem_kayip_analyzer_0", inputMap: { Q_Leak: "q__leak" }, outputId: "loss__leak" },
    { formulaId: "custom.hydraulic_sistem_kayip_analyzer_1", inputMap: { DeltaP_Pipe: "delta_p__pipe", Q_Flow: "q__flow" }, outputId: "loss__fric" },
    { formulaId: "custom.hydraulic_sistem_kayip_analyzer_2", inputMap: { DeltaP_Valve: "delta_p__valve", Q_Flow: "q__flow" }, outputId: "loss__valve" },
    { formulaId: "custom.hydraulic_sistem_kayip_analyzer_3", inputMap: { Loss_Leak: "loss__leak", Loss_Fric: "loss__fric", Loss_Valve: "loss__valve" }, outputId: "heat" },
    { formulaId: "custom.hydraulic_sistem_kayip_analyzer_4", inputMap: { P_Out: "p__out", P_In: "p__in" }, outputId: "eff" },
    { formulaId: "custom.hydraulic_sistem_kayip_analyzer_5", inputMap: { Heat: "heat", Hours: "hours", ElecRate: "elec_rate" }, outputId: "cost__loss" },
    { formulaId: "custom.hydraulic_sistem_kayip_analyzer_6", inputMap: { T_Avg: "t__avg", Thresh: "thresh", FluidCost: "fluid_cost" }, outputId: "degrade" },
    { formulaId: "custom.hydraulic_sistem_kayip_analyzer_7", inputMap: { Heat: "heat", COP: "c_o_p", ElecRate: "elec_rate" }, outputId: "cool" },
  ],
  reportTemplate: {
    title: "HYDRAULIC SİSTEM KAYIP Report",
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
