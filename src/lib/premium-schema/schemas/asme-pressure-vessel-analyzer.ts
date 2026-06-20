/**
 * Tool #9 — Basınç Vessel Kalınlık (ASME BPVC)
 * Shell/sphere/head thickness + MAWP + weight
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const HEAD_TYPE_OPTIONS = [
  { value: "cylindrical", label: "Silindirik (Shell)" },
  { value: "spherical", label: "Küresel (Sphere)" },
  { value: "elliptical", label: "Eliptik (2:1 Head)" },
  { value: "torispherical", label: "Torisferik (Head)" },
] as const;

const MATERIAL_OPTIONS = [
  { value: "SA516_70", label: "SA-516 Gr70 (Carbon Steel)" },
  { value: "SA240_304", label: "SA-240 304 (Stainless)" },
  { value: "SA240_316", label: "SA-240 316 (Stainless)" },
] as const;

export const ASME_VESSEL_SCHEMA: PremiumCalculatorSchema = {
  id: "asme-pressure-vessel-analyzer", legacyPaidSlug: "asme-pressure-vessel-analyzer",
  name: "Basınç Vessel Kalınlık Analizi (ASME BPVC)", sectorSlug: "sheet-metal", category: "measurement",
  painStatement: "ASME BPVC Section VIII Div.1'e göre basınçlı kap tasarımında duvar kalınlığı, MAWP ve ağırlık hesabı yapılmadan imalat risklidir. Bu araç ASME formülleriyle gerekli kalınlığı ve MAWP'yi hesaplar.",
  inputs: [
    { id: "internalPressure", label: "İç Basınç (P)", type: "number", unit: "MPa", required: true, smartDefault: 1.5, validation: { min: 0.001 }, helper: "", expertMeaning: "Internal design pressure" },
    { id: "innerRadius", label: "İç Yarıçap (R)", type: "number", unit: "mm", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Inside radius of vessel" },
    { id: "innerDiameter", label: "İç Çap (D)", type: "number", unit: "mm", required: false, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Inside diameter (for heads)" },
    { id: "headType", label: "Kapak Tipi", type: "select", unit: "", required: true, smartDefault: "cylindrical", options: [...HEAD_TYPE_OPTIONS], helper: "", expertMeaning: "ASME head type" },
    { id: "material", label: "Malzeme", type: "select", unit: "", required: true, smartDefault: "SA516_70", options: [...MATERIAL_OPTIONS], helper: "", expertMeaning: "Vessel material grade" },
    { id: "stressAllowable", label: "İzin Verilen Gerilme (S)", type: "number", unit: "MPa", required: true, smartDefault: 138, validation: { min: 1 }, helper: "", expertMeaning: "Allowable stress per ASME II-D" },
    { id: "jointEfficiency", label: "Kaynak Verimi (E)", type: "number", unit: "", required: true, smartDefault: 0.85, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Joint efficiency per UW-12" },
    { id: "corrosionAllowance", label: "Korozyon Payı (C_A)", type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Corrosion allowance" },
    { id: "vesselLength", label: "Kapak Uzunluğu", type: "number", unit: "mm", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Vessel cylindrical length" },
    { id: "materialDensity", label: "Malzeme Yoğunluğu", type: "number", unit: "kg/m³", required: false, smartDefault: 7850, validation: { min: 0 }, helper: "", expertMeaning: "Material density" },
    { id: "crownRadiusMm", label: "Taç Yarıçapı (L) — Torisferik", type: "number", unit: "mm", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Crown radius for torispherical head" },
    { id: "knuckleRadiusMm", label: "Büküm Yarıçapı (r) — Torisferik", type: "number", unit: "mm", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Knuckle radius for torispherical head" },
  ],
  outputs: [
    { id: "requiredThickness", label: "Gerekli Cidar Kalınlığı", unit: "mm", format: "number" },
    { id: "mawp", label: "MAWP (Max. Allowable Working Pressure)", unit: "MPa", format: "number" },
    { id: "vesselWeight", label: "Kap Ağırlığı", unit: "kg", format: "number" },
    { id: "designVerdict", label: "Tasarım Kararı", unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "requiredThickness", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Gerekli kalınlık > 10 mm — ağırlık ve maliyet artıyor.", criticalMessage: "Gerekli kalınlık > 25 mm — alternatif malzeme değerlendirilmeli." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.vessel_shell_thickness", inputMap: { pressure: "internalPressure", radius: "innerRadius", stressAllowable: "stressAllowable", jointEfficiency: "jointEfficiency", corrosionAllowance: "corrosionAllowance" }, outputId: "requiredThickness" },
    { formulaId: "measurement.vessel_mawp", inputMap: { stressAllowable: "stressAllowable", jointEfficiency: "jointEfficiency", actualThickness: "requiredThickness", corrosionAllowance: "corrosionAllowance", radius: "innerRadius" }, outputId: "mawp" },
    { formulaId: "measurement.vessel_weight", inputMap: { diameter: "innerDiameter", length: "vesselLength", thickness: "requiredThickness", materialDensity: "materialDensity" }, outputId: "vesselWeight" },
  ],
  reportTemplate: { title: "ASME Pressure Vessel Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Shell formula per UG-27: t = (P*R)/(S*E - 0.6*P) + CA.", "MAWP per UG-27: P = (S*E*t)/(R + 0.6*t).", "Sphere formula per UG-27: t = (P*R)/(2*S*E - 0.2*P) + CA.", "Torispherical: M = 0.25*(3+SQRT(L/r)), t = (P*L*M)/(2*S*E - 0.2*P) + CA.", "Elliptical 2:1: t = (P*D)/(2*S*E - 0.2*P) + CA."] },
};
