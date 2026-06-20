import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const WELD_STRENGTH_SCHEMA: PremiumCalculatorSchema = {
  id: "weld-strength-analyzer", legacyPaidSlug: "weld-strength-analyzer",
  name: "Kaynak Mukavemeti Analizi", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Kaynak mukavemeti ve güvenlik faktörü hesaplanmazsa, yapısal bütünlük risk altındadır.",
  inputs: [
    { id: "leg", label: "Kaynak Ağız Boyu (Leg)", type: "number", unit: "mm", required: true, smartDefault: 6, validation: { min: 1 }, helper: "", expertMeaning: "Fillet weld leg" },
    { id: "weldLength", label: "Kaynak Uzunluğu", type: "number", unit: "mm", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Weld length" },
    { id: "appliedLoad", label: "Uygulanan Yük", type: "number", unit: "N", required: true, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Applied load" },
    { id: "appliedMoment", label: "Uygulanan Moment", type: "number", unit: "Nmm", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Applied bending moment" },
    { id: "tensileStrength", label: "Elektrod Çekme Dayanımı", type: "number", unit: "MPa", required: true, smartDefault: 480, validation: { min: 0 }, helper: "", expertMeaning: "Electrode tensile strength" },
    { id: "yieldStrength", label: "Malzeme Akma Dayanımı", type: "number", unit: "MPa", required: false, smartDefault: 350, validation: { min: 0 }, helper: "", expertMeaning: "Base metal yield strength" },
  ],
  outputs: [
    { id: "throat", label: "Boğaz Kalınlığı", unit: "mm", format: "number" },
    { id: "shearArea", label: "Kesme Alanı", unit: "mm²", format: "number" },
    { id: "allowableStress", label: "İzin Verilen Kesme Gerilmesi", unit: "MPa", format: "number" },
    { id: "maxShearLoad", label: "Maksimum Kesme Yükü", unit: "N", format: "number" },
    { id: "safetyFactor", label: "Güvenlik Faktörü", unit: "", format: "number" },
  ],
  thresholds: [{ fieldId: "safetyFactor", warning: 2, critical: 1.25, direction: "lower_is_bad", warningMessage: "SF < 2 — tasarım gözden geçirilmeli.", criticalMessage: "SF < 1.25 — yapısal risk acil!" }],
  formulaPipeline: [
    { formulaId: "measurement.weld_throat", inputMap: { leg: "leg" }, outputId: "throat" },
    { formulaId: "measurement.weld_shear_area", inputMap: { throat: "throat", weldLength: "weldLength" }, outputId: "shearArea" },
    { formulaId: "measurement.weld_allowable_stress", inputMap: { tensileStrength: "tensileStrength" }, outputId: "allowableStress" },
    { formulaId: "measurement.weld_max_shear_load", inputMap: { shearArea: "shearArea", allowableStress: "allowableStress" }, outputId: "maxShearLoad" },
    { formulaId: "measurement.weld_safety_factor", inputMap: { maxShearLoad: "maxShearLoad", appliedLoad: "appliedLoad" }, outputId: "safetyFactor" },
  ],
  reportTemplate: { title: "Kaynak Mukavemet Raporu", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Boğaz = Leg × COS(45°).", "İzin verilen kesme = 0.3 × Çekme dayanımı.", "SF < 2 uyarı, SF < 1.25 kritik."] },
};
