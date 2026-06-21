/**
 * Kaynak Mukavemeti — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const WELDSTRENGTH_SCHEMA: PremiumCalculatorSchema = {
  id: "weld-strength-analyzer",
  legacyPaidSlug: "weld-strength-analyzer",
  name: "Kaynak Mukavemeti",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kaynak Mukavemeti — premium analysis tool.",
  inputs: [
    { id: "kaynak_boyu_leg", label: "Kaynak Boyu Leg", type: "number", required: true },
    { id: "uzunluk", label: "Uzunluk", type: "number", required: true },
    { id: "uygulanan_yukmoment", label: "Uygulanan Yük/Moment", type: "number", required: true },
    { id: "elektrod_cekme_dayanimi", label: "Elektrod Çekme Dayanımı", type: "number", required: true },
    { id: "malzeme_akma", label: "Malzeme Akma", type: "number", required: true },
    { id: "ndt_hata_orani", label: "NDT Hata Oranı", type: "number", required: true },
    { id: "guvenlik_faktoru_hedefi", label: "Güvenlik Faktörü Hedefi", type: "number", required: true },
  ],
  outputs: [
    { id: "throat_thickness", label: "Throat Thickness", unit: "currency", format: "currency" },
    { id: "area__shear", label: "Area_ Shear", unit: "currency", format: "currency" },
    { id: "allowable_shear_stress", label: "Allowable Shear Stress", unit: "currency", format: "currency" },
    { id: "max_load__shear", label: "Max Load_ Shear", unit: "currency", format: "currency" },
    { id: "safety_factor", label: "Safety Factor", unit: "currency", format: "currency" },
    { id: "bending_stress", label: "Bending Stress", unit: "currency", format: "currency" },
    { id: "combined_stress", label: "Combined Stress", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kaynak_mukavemeti_analyzer_0", inputMap: { Leg: "kaynak_boyu_leg" }, outputId: "throat_thickness" },
    { formulaId: "custom.kaynak_mukavemeti_analyzer_1", inputMap: { ThroatThickness: "throat_thickness", Length: "length" }, outputId: "area__shear" },
    { formulaId: "custom.kaynak_mukavemeti_analyzer_2", inputMap: { TensileStrength_Electrode: "tensile_strength__electrode" }, outputId: "allowable_shear_stress" },
    { formulaId: "custom.kaynak_mukavemeti_analyzer_3", inputMap: { Area_Shear: "area__shear", AllowableShearStress: "allowable_shear_stress" }, outputId: "max_load__shear" },
    { formulaId: "custom.kaynak_mukavemeti_analyzer_4", inputMap: { MaxLoad_Shear: "max_load__shear", AppliedLoad: "applied_load" }, outputId: "safety_factor" },
    { formulaId: "custom.kaynak_mukavemeti_analyzer_5", inputMap: { AppliedMoment: "applied_moment", ThroatThickness: "throat_thickness", MomentOfInertia: "moment_of_inertia" }, outputId: "bending_stress" },
    { formulaId: "custom.kaynak_mukavemeti_analyzer_6", inputMap: { ShearStress: "shear_stress", BendingStress: "bending_stress" }, outputId: "combined_stress" },
  ],
  reportTemplate: {
    title: "Kaynak Mukavemeti Report",
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
