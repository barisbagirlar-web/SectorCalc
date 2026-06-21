/**
 * ENFLASYON ESKALASYON — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const INFLATIONESCALATION_SCHEMA: PremiumCalculatorSchema = {
  id: "inflation-escalation-analyzer",
  legacyPaidSlug: "inflation-escalation-analyzer",
  name: "ENFLASYON ESKALASYON",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ENFLASYON ESKALASYON — premium analysis tool.",
  inputs: [
    { id: "baz_malzeme", label: "Baz Malzeme", type: "number", required: true },
    { id: "malzeme_enflasyon", label: "Malzeme Enflasyon", type: "number", required: true },
    { id: "baz_iscilik", label: "Baz İşçilik", type: "number", required: true },
    { id: "ucret_artis", label: "Ücret Artış", type: "number", required: true },
    { id: "sure", label: "Süre", type: "number", required: true },
    { id: "risk", label: "Risk", type: "text", required: true },
    { id: "nominalgenel_enflasyon", label: "Nominal/Genel Enflasyon", type: "number", required: true },
  ],
  outputs: [
    { id: "esc__mat", label: "Esc_ Mat", unit: "currency", format: "currency" },
    { id: "esc__lab", label: "Esc_ Lab", unit: "currency", format: "currency" },
    { id: "base_adj", label: "Base Adj", unit: "currency", format: "currency" },
    { id: "real_disc", label: "Real Disc", unit: "currency", format: "currency" },
    { id: "n_p_v__nom", label: "N P V_ Nom", unit: "currency", format: "currency" },
    { id: "n_p_v__real", label: "N P V_ Real", unit: "currency", format: "currency" },
    { id: "contingency", label: "Contingency", unit: "currency", format: "currency" },
    { id: "total", label: "Total", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.enflasyon_eskalasyon_analyzer_0", inputMap: { Infl_Mat: "infl__mat", Years: "years" }, outputId: "esc__mat" },
    { formulaId: "custom.enflasyon_eskalasyon_analyzer_1", inputMap: { Infl_Lab: "infl__lab", Years: "years" }, outputId: "esc__lab" },
    { formulaId: "custom.enflasyon_eskalasyon_analyzer_2", inputMap: { BaseMat: "base_mat", Esc_Mat: "esc__mat", BaseLab: "base_lab", Esc_Lab: "esc__lab" }, outputId: "base_adj" },
    { formulaId: "custom.enflasyon_eskalasyon_analyzer_3", inputMap: { Nominal: "nominalgenel_enflasyon", Infl: "infl" }, outputId: "real_disc" },
    { formulaId: "custom.enflasyon_eskalasyon_analyzer_4", inputMap: { Cash: "cash", Esc: "esc", Nom: "nominalgenel_enflasyon" }, outputId: "n_p_v__nom" },
    { formulaId: "custom.enflasyon_eskalasyon_analyzer_5", inputMap: { Cash: "cash", Real: "real" }, outputId: "n_p_v__real" },
    { formulaId: "custom.enflasyon_eskalasyon_analyzer_6", inputMap: { BaseAdj: "base_adj", ConfFactor: "conf_factor" }, outputId: "contingency" },
    { formulaId: "custom.enflasyon_eskalasyon_analyzer_7", inputMap: { BaseAdj: "base_adj", Contingency: "contingency" }, outputId: "total" },
  ],
  reportTemplate: {
    title: "ENFLASYON ESKALASYON Report",
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
