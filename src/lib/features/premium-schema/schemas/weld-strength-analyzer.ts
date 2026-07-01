import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const WELD_STRENGTH_SCHEMA: PremiumCalculatorSchema = {
  id: "weld-strength-analyzer", legacyPaidSlug: "weld-strength-analyzer",
  name: "Weld Strength Analyzer", name_i18n: {"en":"Weld Strength Analyzer"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Kaynak mukavemeti ve güvenlik faktörü hesaplanmazsa, yapısal bütünlük risk altındadır.", painStatement_i18n: {"en":"Kaynak mukavemeti ve güvenlik faktörü hesaplanmazsa, yapısal bütünlük risk altındadır."},
  inputs: [
    { id: "leg", label: "Kaynak Ağız Boyu (Leg)", label_i18n: {"en":"Fillet weld leg"}, type: "number", unit: "mm", required: true, smartDefault: 6, validation: { min: 1 }, helper: "", expertMeaning: "Fillet weld leg", expertMeaning_i18n: {"en":"Fillet weld leg"} },
    { id: "weldLength", label: "Kaynak Uzunluğu", label_i18n: {"en":"Weld length"}, type: "number", unit: "mm", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Weld length", expertMeaning_i18n: {"en":"Weld length"} },
    { id: "appliedLoad", label: "Uygulanan Yük", label_i18n: {"en":"Applied load"}, type: "number", unit: "N", required: true, smartDefault: 50000, validation: { min: 0 }, helper: "", expertMeaning: "Applied load", expertMeaning_i18n: {"en":"Applied load"} },
    { id: "appliedMoment", label: "Uygulanan Moment", label_i18n: {"en":"Uygulanan Moment"}, type: "number", unit: "Nmm", required: false, smartDefault: 0, validation: { min: 0 }, helper: "", expertMeaning: "Applied bending moment", expertMeaning_i18n: {"en":"Applied bending moment"} },
    { id: "tensileStrength", label: "Elektrod Çekme Dayanımı", label_i18n: {"en":"Electrode tensile strength"}, type: "number", unit: "MPa", required: true, smartDefault: 480, validation: { min: 0 }, helper: "", expertMeaning: "Electrode tensile strength", expertMeaning_i18n: {"en":"Electrode tensile strength"} },
    { id: "yieldStrength", label: "Malzeme Akma Dayanımı", label_i18n: {"en":"Base metal yield strength"}, type: "number", unit: "MPa", required: false, smartDefault: 350, validation: { min: 0 }, helper: "", expertMeaning: "Base metal yield strength", expertMeaning_i18n: {"en":"Base metal yield strength"} },
  ],
  outputs: [
    { id: "throat", label: "Boğaz Kalınlığı", label_i18n: {"en":"Bogaz Kalnlg"}, unit: "mm", format: "number" },
    { id: "shearArea", label: "Kesme Alanı", label_i18n: {"en":"Kesme Alan"}, unit: "mm²", format: "number" },
    { id: "allowableStress", label: "İzin Verilen Kesme Gerilmesi", label_i18n: {"en":"Izin Verilen Kesme Gerilmesi"}, unit: "MPa", format: "number" },
    { id: "maxShearLoad", label: "Maksimum Kesme Yükü", label_i18n: {"en":"Maksimum Kesme Yuku"}, unit: "N", format: "number" },
    { id: "safetyFactor", label: "Güvenlik Faktörü", label_i18n: {"en":"Guvenlik Faktoru"}, unit: "", format: "number" },
  ],
  thresholds: [{ fieldId: "safetyFactor", warning: 2, critical: 1.25, direction: "lower_is_bad", warningMessage: "SF < 2 — tasarım gözden geçirilmeli.", warningMessage_i18n: {"en":"SF < 2 — tasarım gözden geçirilmeli."}, criticalMessage: "SF < 1.25 — yapısal risk acil!", criticalMessage_i18n: {"en":"SF < 1.25 — yapısal risk acil!"} }],
  formulaPipeline: [
    { formulaId: "measurement.weld_throat", inputMap: { leg: "leg" }, outputId: "throat" },
    { formulaId: "measurement.weld_shear_area", inputMap: { throat: "throat", weldLength: "weldLength" }, outputId: "shearArea" },
    { formulaId: "measurement.weld_allowable_stress", inputMap: { tensileStrength: "tensileStrength" }, outputId: "allowableStress" },
    { formulaId: "measurement.weld_max_shear_load", inputMap: { shearArea: "shearArea", allowableStress: "allowableStress" }, outputId: "maxShearLoad" },
    { formulaId: "measurement.weld_safety_factor", inputMap: { maxShearLoad: "maxShearLoad", appliedLoad: "appliedLoad" }, outputId: "safetyFactor" },
  ],
  reportTemplate: { title: "Kaynak Mukavemet Raporu", title_i18n: {"en":"Kaynak Mukavemet Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Boğaz = Leg × COS(45°).", "İzin verilen kesme = 0.3 × Çekme dayanımı.", "SF < 2 uyarı, SF < 1.25 kritik."],assumptionNotes_i18n:[{"en":"Boğaz = Leg × COS(45°)."},{"en":"İzin verilen kesme = 0.3 × Çekme dayanımı."},{"en":"SF < 2 uyarı, SF < 1.25 kritik."}] },
};
