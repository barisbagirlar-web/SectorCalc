/**
 * HVAC KAPASİTE — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HVACCAPACITY_SCHEMA: PremiumCalculatorSchema = {
  id: "hvac-capacity-analyzer",
  legacyPaidSlug: "hvac-capacity-analyzer",
  name: "HVAC KAPASİTE",
  sectorSlug: "general",
  category: "cost",
  painStatement: "HVAC KAPASİTE — premium analysis tool.",
  inputs: [
    { id: "alanhacim", label: "Alan/Hacim", type: "number", required: true },
    { id: "disic_sicaklik", label: "Dış/İç Sıcaklık", type: "number", required: true },
    { id: "u_degerleri", label: "U Değerleri", type: "array", required: true },
    { id: "kisiisik", label: "Kişi/Işık", type: "number", required: true },
    { id: "ach", label: "ACH", type: "number", required: true },
    { id: "eer", label: "EER", type: "number", required: true },
    { id: "saat", label: "Saat", type: "number", required: true },
    { id: "tarif", label: "Tarif", type: "number", required: true },
  ],
  outputs: [
    { id: "sensible", label: "Sensible", unit: "currency", format: "currency" },
    { id: "latent", label: "Latent", unit: "currency", format: "currency" },
    { id: "total", label: "Total", unit: "currency", format: "currency" },
    { id: "envelope", label: "Envelope", unit: "currency", format: "currency" },
    { id: "internal", label: "Internal", unit: "currency", format: "currency" },
    { id: "vent", label: "Vent", unit: "currency", format: "currency" },
    { id: "tons", label: "Tons", unit: "currency", format: "currency" },
    { id: "e_e_r", label: "E E R", unit: "currency", format: "currency" },
    { id: "annual_cost", label: "Annual Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.hvac_kapasite_analyzer_0", inputMap: { CFM: "c_f_m", DeltaT: "delta_t" }, outputId: "sensible" },
    { formulaId: "custom.hvac_kapasite_analyzer_1", inputMap: { CFM: "c_f_m", DeltaW: "delta_w" }, outputId: "latent" },
    { formulaId: "custom.hvac_kapasite_analyzer_2", inputMap: { Sensible: "sensible", Latent: "latent" }, outputId: "total" },
    { formulaId: "custom.hvac_kapasite_analyzer_3", inputMap: { Area: "area", DeltaT: "delta_t" }, outputId: "envelope" },
    { formulaId: "custom.hvac_kapasite_analyzer_4", inputMap: { Occ: "occ", SensPer: "sens_per", Light: "light", Equip: "equip" }, outputId: "internal" },
    { formulaId: "custom.hvac_kapasite_analyzer_5", inputMap: { CFM_Out: "c_f_m__out", T_Out: "t__out", T_In: "t__in" }, outputId: "vent" },
    { formulaId: "custom.hvac_kapasite_analyzer_6", inputMap: { Total: "total" }, outputId: "tons" },
    { formulaId: "custom.hvac_kapasite_analyzer_7", inputMap: { BTU: "b_t_u" }, outputId: "e_e_r" },
    { formulaId: "custom.hvac_kapasite_analyzer_8", inputMap: { Total: "total", EER: "eer", Hours: "hours", ElecRate: "elec_rate" }, outputId: "annual_cost" },
  ],
  reportTemplate: {
    title: "HVAC KAPASİTE Report",
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
