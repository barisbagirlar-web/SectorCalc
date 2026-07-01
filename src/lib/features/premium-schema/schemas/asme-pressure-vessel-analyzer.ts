/**
 * Tool #9 — Basinc Vessel Kalinlik (ASME BPVC)
 * Shell/sphere/head thickness + MAWP + weight
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const HEAD_TYPE_OPTIONS = [
  { value: "cylindrical", label: "Silindirik (Shell)", label_i18n: {"en":"Silindirik (Shell)"} },
  { value: "spherical", label: "Kuresel (Sphere)", label_i18n: {"en":"Kuresel (Sphere)"} },
  { value: "elliptical", label: "Eliptik (2:1 Head)", label_i18n: {"en":"Eliptik (2:1 Head)"} },
  { value: "torispherical", label: "Torisferik (Head)", label_i18n: {"en":"Torisferik (Head)"} },
] as const;

const MATERIAL_OPTIONS = [
  { value: "SA516_70", label: "SA-516 Gr70 (Carbon Steel)", label_i18n: {"en":"SA-516 Gr70 (Carbon Steel)"} },
  { value: "SA240_304", label: "SA-240 304 (Stainless)", label_i18n: {"en":"SA-240 304 (Stainless)"} },
  { value: "SA240_316", label: "SA-240 316 (Stainless)", label_i18n: {"en":"SA-240 316 (Stainless)"} },
] as const;

export const ASME_VESSEL_SCHEMA: PremiumCalculatorSchema = {
  id: "asme-pressure-vessel-analyzer", legacyPaidSlug: "asme-pressure-vessel-analyzer",
  name: "Pressure Vessel Thickness Analysis (ASME BPVC)", name_i18n: {"en":"Pressure Vessel Thickness Analysis (ASME BPVC)"}, sectorSlug: "sheet-metal", category: "measurement",
  painStatement: "ASME BPVC Section VIII Div.1'e gore basincli kap tasariminda duvar kalinligi, MAWP ve agirlik calc yapilmadan imalat risklidir. Bu arac ASME formulleriyle gerekli kalinligi ve MAWP'yi hesaplar.", painStatement_i18n: {"en":"Wall thickness, MAWP, and Weight calculation without manufacturing per ASME BPVC Section VIII Div.1 for pressure vessel design is risky. This tool calculates required thickness and MAWP using ASME formulas."},
  inputs: [
    { id: "internalPressure", label: "Internal Pressure (P)", label_i18n: {"en":"Internal Pressure (P)"}, type: "number", unit: "MPa", required: true, smartDefault: 1.5, validation: { min: 0.001 }, helper: "", expertMeaning: "Internal design pressure", expertMeaning_i18n: {"en":"Internal design pressure"} },
    { id: "innerRadius", label: "Inner Radius (R)", label_i18n: {"en":"Inner Radius (R)"}, type: "number", unit: "mm", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Inside radius of vessel", expertMeaning_i18n: {"en":"Inside radius of vessel"} },
    { id: "innerDiameter", label: "Inner Diameter (D)", label_i18n: {"en":"Inner Diameter (D)"}, type: "number", unit: "mm", required: false, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Inside diameter (for heads)", expertMeaning_i18n: {"en":"Inside diameter (for heads)"} },
    { id: "headType", label: "Kapak Tipi", label_i18n: {"en":"Head Type"}, type: "select", unit: "", required: true, smartDefault: "cylindrical", options: [...HEAD_TYPE_OPTIONS], helper: "", expertMeaning: "ASME head type", expertMeaning_i18n: {"en":"ASME head type"} },
    { id: "material", label: "Malzeme", label_i18n: {"en":"Material"}, type: "select", unit: "", required: true, smartDefault: "SA516_70", options: [...MATERIAL_OPTIONS], helper: "", expertMeaning: "Vessel material grade", expertMeaning_i18n: {"en":"Vessel material grade"} },
    { id: "stressAllowable", label: "Allowable Stress (S)", label_i18n: {"en":"Allowable Stress (S)"}, type: "number", unit: "MPa", required: true, smartDefault: 138, validation: { min: 1 }, helper: "", expertMeaning: "Allowable stress per ASME II-D", expertMeaning_i18n: {"en":"Allowable stress per ASME II-D"} },
    { id: "jointEfficiency", label: "Kaynak Verimi (E)", label_i18n: {"en":"Joint Efficiency (E)"}, type: "number", unit: "", required: true, smartDefault: 0.85, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Joint efficiency per UW-12", expertMeaning_i18n: {"en":"Joint efficiency per UW-12"} },
    { id: "corrosionAllowance", label: "Corrosion Allowance (C_A)", label_i18n: {"en":"Corrosion Allowance (C_A)"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Corrosion allowance", expertMeaning_i18n: {"en":"Corrosion allowance"} },
    { id: "vesselLength", label: "Head Length", label_i18n: {"en":"Head Length"}, type: "number", unit: "mm", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Vessel cylindrical length", expertMeaning_i18n: {"en":"Vessel cylindrical length"} },
    { id: "materialDensity", label: "Material Density", label_i18n: {"en":"Material Density"}, type: "number", unit: "kg/m³", required: false, smartDefault: 7850, validation: { min: 0 }, helper: "", expertMeaning: "Material density", expertMeaning_i18n: {"en":"Material density"} },
    { id: "crownRadiusMm", label: "Crown Radius (L) — Torispherical", label_i18n: {"en":"Crown Radius (L) — Torispherical"}, type: "number", unit: "mm", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Crown radius for torispherical head", expertMeaning_i18n: {"en":"Crown radius for torispherical head"} },
    { id: "knuckleRadiusMm", label: "Knuckle Radius (r) — Torispherical", label_i18n: {"en":"Knuckle Radius (r) — Torispherical"}, type: "number", unit: "mm", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Knuckle radius for torispherical head", expertMeaning_i18n: {"en":"Knuckle radius for torispherical head"} },
  ],
  outputs: [
    { id: "requiredThickness", label: "Gerekli Cidar Kalnlg", label_i18n: {"en":"required Cidar Kalnlg"}, unit: "mm", format: "number" },
    { id: "mawp", label: "MAWP (Max. Allowable Working Pressure)", label_i18n: {"en":"MAWP (Max. Allowable Working Pressure)"}, unit: "MPa", format: "number" },
    { id: "vesselWeight", label: "Kap Agrlg", label_i18n: {"en":"vessel Agrlg"}, unit: "kg", format: "number" },
    { id: "designVerdict", label: "Tasarm Karar", label_i18n: {"en":"Tasarm decision"}, unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "requiredThickness", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Gerekli kalinlik > 10 mm — agirlik ve maliyet artiyor.", warningMessage_i18n: {"en":"Required thickness > 10 mm — Weight and Cost increasing."}, criticalMessage: "Gerekli kalinlik > 25 mm — alternatif malzeme degerlendirilmeli.", criticalMessage_i18n: {"en":"Required thickness > 25 mm — alternative material should be evaluated."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.vessel_shell_thickness", inputMap: { pressure: "internalPressure", radius: "innerRadius", stressAllowable: "stressAllowable", jointEfficiency: "jointEfficiency", corrosionAllowance: "corrosionAllowance" }, outputId: "requiredThickness" },
    { formulaId: "measurement.vessel_mawp", inputMap: { stressAllowable: "stressAllowable", jointEfficiency: "jointEfficiency", actualThickness: "requiredThickness", corrosionAllowance: "corrosionAllowance", radius: "innerRadius" }, outputId: "mawp" },
    { formulaId: "measurement.vessel_weight", inputMap: { diameter: "innerDiameter", length: "vesselLength", thickness: "requiredThickness", materialDensity: "materialDensity" }, outputId: "vesselWeight" },
  ],
  reportTemplate: { title: "ASME Pressure Vessel Report", title_i18n: {"en":"ASME Pressure Vessel Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Shell formula per UG-27: t = (P*R)/(S*E - 0.6*P) + CA.", "MAWP per UG-27: P = (S*E*t)/(R + 0.6*t).", "Sphere formula per UG-27: t = (P*R)/(2*S*E - 0.2*P) + CA.", "Torispherical: M = 0.25*(3+SQRT(L/r)), t = (P*L*M)/(2*S*E - 0.2*P) + CA.", "Elliptical 2:1: t = (P*D)/(2*S*E - 0.2*P) + CA."],assumptionNotes_i18n:[{"en":"Shell formula per UG-27: t = (P*R)/(S*E - 0.6*P) + CA."},{"en":"MAWP per UG-27: P = (S*E*t)/(R + 0.6*t)."},{"en":"Sphere formula per UG-27: t = (P*R)/(2*S*E - 0.2*P) + CA."},{"en":"Torispherical: M = 0.25*(3+SQRT(L/r)), t = (P*L*M)/(2*S*E - 0.2*P) + CA."},{"en":"Elliptical 2:1: t = (P*D)/(2*S*E - 0.2*P) + CA."}]},
};
