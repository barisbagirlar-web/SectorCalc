/**
 * HACİMSEL AĞIRLIK — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const VOLUMETRICWEIGHTCHARGEABLE_SCHEMA: PremiumCalculatorSchema = {
  id: "volumetric-weight-chargeable-analyzer",
  legacyPaidSlug: "volumetric-weight-chargeable-analyzer",
  name: "HACİMSEL AĞIRLIK",
  sectorSlug: "general",
  category: "cost",
  painStatement: "HACİMSEL AĞIRLIK — premium analysis tool.",
  inputs: [
    { id: "lwh", label: "L/W/H", type: "number", required: true },
    { id: "brut", label: "Brüt", type: "number", required: true },
    { id: "mod", label: "Mod", type: "text", required: true },
    { id: "kgcbm_fiyat", label: "kg/CBM Fiyat", type: "number", required: true },
    { id: "min_threshold", label: "Min Threshold", type: "number", required: true },
    { id: "istifleme", label: "İstifleme", type: "number", required: true },
  ],
  outputs: [
    { id: "vol_weight__air", label: "Vol Weight_ Air", unit: "currency", format: "currency" },
    { id: "vol_weight__road", label: "Vol Weight_ Road", unit: "currency", format: "currency" },
    { id: "vol_weight__sea", label: "Vol Weight_ Sea", unit: "currency", format: "currency" },
    { id: "chargeable", label: "Chargeable", unit: "currency", format: "currency" },
    { id: "freight", label: "Freight", unit: "currency", format: "currency" },
    { id: "density", label: "Density", unit: "currency", format: "currency" },
    { id: "stack_loss", label: "Stack Loss", unit: "currency", format: "currency" },
    { id: "ineff", label: "Ineff", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.hacimsel_agirlik_analyzer_0", inputMap: {  }, outputId: "vol_weight__air" },
    { formulaId: "custom.hacimsel_agirlik_analyzer_1", inputMap: {  }, outputId: "vol_weight__road" },
    { formulaId: "custom.hacimsel_agirlik_analyzer_2", inputMap: {  }, outputId: "vol_weight__sea" },
    { formulaId: "custom.hacimsel_agirlik_analyzer_3", inputMap: { Gross: "gross", VolWeight: "vol_weight" }, outputId: "chargeable" },
    { formulaId: "custom.hacimsel_agirlik_analyzer_4", inputMap: { Chargeable: "chargeable", Rate: "rate" }, outputId: "freight" },
    { formulaId: "custom.hacimsel_agirlik_analyzer_5", inputMap: { Gross: "gross", Vol: "vol" }, outputId: "density" },
    { formulaId: "custom.hacimsel_agirlik_analyzer_6", inputMap: { ActualLoad: "actual_load", MaxCont: "max_cont" }, outputId: "stack_loss" },
    { formulaId: "custom.hacimsel_agirlik_analyzer_7", inputMap: { Chargeable: "chargeable", Gross: "gross", Rate: "rate" }, outputId: "ineff" },
  ],
  reportTemplate: {
    title: "HACİMSEL AĞIRLIK Report",
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
