/**
 * Tool #9 — Basınç Vessel Kalınlık (ASME BPVC)
 * Shell/sphere/head thickness + MAWP + weight
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const HEAD_TYPE_OPTIONS = [
  { value: "cylindrical", label: "Silindirik (Shell)", label_i18n: {"en":"Silindirik (Shell)","tr":"Silindirik (Shell)"} },
  { value: "spherical", label: "Küresel (Sphere)", label_i18n: {"en":"Küresel (Sphere)","tr":"Küresel (Sphere)"} },
  { value: "elliptical", label: "Eliptik (2:1 Head)", label_i18n: {"en":"Eliptik (2:1 Head)","tr":"Eliptik (2:1 Head)"} },
  { value: "torispherical", label: "Torisferik (Head)", label_i18n: {"en":"Torisferik (Head)","tr":"Torisferik (Head)"} },
] as const;

const MATERIAL_OPTIONS = [
  { value: "SA516_70", label: "SA-516 Gr70 (Carbon Steel)", label_i18n: {"en":"SA-516 Gr70 (Carbon Steel)","tr":"SA-516 Gr70 (Carbon Steel)"} },
  { value: "SA240_304", label: "SA-240 304 (Stainless)", label_i18n: {"en":"SA-240 304 (Stainless)","tr":"SA-240 304 (Stainless)"} },
  { value: "SA240_316", label: "SA-240 316 (Stainless)", label_i18n: {"en":"SA-240 316 (Stainless)","tr":"SA-240 316 (Stainless)"} },
] as const;

export const ASME_VESSEL_SCHEMA: PremiumCalculatorSchema = {
  id: "asme-pressure-vessel-analyzer", legacyPaidSlug: "asme-pressure-vessel-analyzer",
  name: "Basınç Vessel Kalınlık Analizi (ASME BPVC)", name_i18n: {"en":"Pressure Vessel Thickness Analysis (ASME BPVC)","tr":"Basınç Vessel Kalınlık Analizi (ASME BPVC)"}, sectorSlug: "sheet-metal", category: "measurement",
  painStatement: "ASME BPVC Section VIII Div.1'e göre basınçlı kap tasarımında duvar kalınlığı, MAWP ve ağırlık hesabı yapılmadan imalat risklidir. Bu araç ASME formülleriyle gerekli kalınlığı ve MAWP'yi hesaplar.", painStatement_i18n: {"en":"ASME BPVC Section VIII Div.1'e göre basınçlı kap tasarımında duvar kalınlığı, MAWP ve ağırlık hesabı yapılmadan imalat risklidir. Bu araç ASME formülleriyle gerekli kalınlığı ve MAWP'yi hesaplar.","tr":"ASME BPVC Section VIII Div.1'e göre basınçlı kap tasarımında duvar kalınlığı, MAWP ve ağırlık hesabı yapılmadan imalat risklidir. Bu araç ASME formülleriyle gerekli kalınlığı ve MAWP'yi hesaplar."},
  inputs: [
    { id: "internalPressure", label: "İç Basınç (P)", label_i18n: {"en":"Internal Pressure (P)","tr":"İç Basınç (P)"}, type: "number", unit: "MPa", required: true, smartDefault: 1.5, validation: { min: 0.001 }, helper: "", expertMeaning: "Internal design pressure", expertMeaning_i18n: {"en":"Internal design pressure","tr":"İç tasarım basıncı"} },
    { id: "innerRadius", label: "İç Yarıçap (R)", label_i18n: {"en":"Inner Radius (R)","tr":"İç Yarıçap (R)"}, type: "number", unit: "mm", required: true, smartDefault: 500, validation: { min: 1 }, helper: "", expertMeaning: "Inside radius of vessel", expertMeaning_i18n: {"en":"Inside radius of vessel","tr":"Kap iç yarıçapı"} },
    { id: "innerDiameter", label: "İç Çap (D)", label_i18n: {"en":"Inner Diameter (D)","tr":"İç Çap (D)"}, type: "number", unit: "mm", required: false, smartDefault: 1000, validation: { min: 1 }, helper: "", expertMeaning: "Inside diameter (for heads)", expertMeaning_i18n: {"en":"Inside diameter (for heads)","tr":"İç çap (kapaklar için)"} },
    { id: "headType", label: "Kapak Tipi", label_i18n: {"en":"Head Type","tr":"Kapak Tipi"}, type: "select", unit: "", required: true, smartDefault: "cylindrical", options: [...HEAD_TYPE_OPTIONS], helper: "", expertMeaning: "ASME head type", expertMeaning_i18n: {"en":"ASME head type","tr":"ASME kapak tipi"} },
    { id: "material", label: "Malzeme", label_i18n: {"en":"Material","tr":"Malzeme"}, type: "select", unit: "", required: true, smartDefault: "SA516_70", options: [...MATERIAL_OPTIONS], helper: "", expertMeaning: "Vessel material grade", expertMeaning_i18n: {"en":"Vessel material grade","tr":"Kap malzeme sınıfı"} },
    { id: "stressAllowable", label: "İzin Verilen Gerilme (S)", label_i18n: {"en":"Allowable Stress (S)","tr":"İzin Verilen Gerilme (S)"}, type: "number", unit: "MPa", required: true, smartDefault: 138, validation: { min: 1 }, helper: "", expertMeaning: "Allowable stress per ASME II-D", expertMeaning_i18n: {"en":"Allowable stress per ASME II-D","tr":"ASME II-D'ye göre izin verilen gerilme"} },
    { id: "jointEfficiency", label: "Kaynak Verimi (E)", label_i18n: {"en":"Joint Efficiency (E)","tr":"Kaynak Verimi (E)"}, type: "number", unit: "", required: true, smartDefault: 0.85, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Joint efficiency per UW-12", expertMeaning_i18n: {"en":"Joint efficiency per UW-12","tr":"UW-12'ye göre kaynak verimi"} },
    { id: "corrosionAllowance", label: "Korozyon Payı (C_A)", label_i18n: {"en":"Corrosion Allowance (C_A)","tr":"Korozyon Payı (C_A)"}, type: "number", unit: "mm", required: true, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Corrosion allowance", expertMeaning_i18n: {"en":"Corrosion allowance","tr":"Korozyon payı"} },
    { id: "vesselLength", label: "Kapak Uzunluğu", label_i18n: {"en":"Head Length","tr":"Kapak Uzunluğu"}, type: "number", unit: "mm", required: false, smartDefault: 2000, validation: { min: 0 }, helper: "", expertMeaning: "Vessel cylindrical length", expertMeaning_i18n: {"en":"Vessel cylindrical length","tr":"Kap silindirik uzunluğu"} },
    { id: "materialDensity", label: "Malzeme Yoğunluğu", label_i18n: {"en":"Material Density","tr":"Malzeme Yoğunluğu"}, type: "number", unit: "kg/m³", required: false, smartDefault: 7850, validation: { min: 0 }, helper: "", expertMeaning: "Material density", expertMeaning_i18n: {"en":"Material density","tr":"Malzeme yoğunluğu"} },
    { id: "crownRadiusMm", label: "Taç Yarıçapı (L) — Torisferik", label_i18n: {"en":"Crown Radius (L) — Torispherical","tr":"Taç Yarıçapı (L) — Torisferik"}, type: "number", unit: "mm", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Crown radius for torispherical head", expertMeaning_i18n: {"en":"Crown radius for torispherical head","tr":"Torisferik kapak için taç yarıçapı"} },
    { id: "knuckleRadiusMm", label: "Büküm Yarıçapı (r) — Torisferik", label_i18n: {"en":"Knuckle Radius (r) — Torispherical","tr":"Büküm Yarıçapı (r) — Torisferik"}, type: "number", unit: "mm", required: false, smartDefault: 100, validation: { min: 0 }, helper: "", expertMeaning: "Knuckle radius for torispherical head", expertMeaning_i18n: {"en":"Knuckle radius for torispherical head","tr":"Torisferik kapak için büküm yarıçapı"} },
  ],
  outputs: [
    { id: "requiredThickness", label: "Gerekli Cidar Kalınlığı", label_i18n: {"en":"Gerekli Cidar Kalınlığı","tr":"Gerekli Cidar Kalınlığı"}, unit: "mm", format: "number" },
    { id: "mawp", label: "MAWP (Max. Allowable Working Pressure)", label_i18n: {"en":"MAWP (Max. Allowable Working Pressure)","tr":"MAWP (Max. Allowable Working Pressure)"}, unit: "MPa", format: "number" },
    { id: "vesselWeight", label: "Kap Ağırlığı", label_i18n: {"en":"Kap Ağırlığı","tr":"Kap Ağırlığı"}, unit: "kg", format: "number" },
    { id: "designVerdict", label: "Tasarım Kararı", label_i18n: {"en":"Tasarım Kararı","tr":"Tasarım Kararı"}, unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "requiredThickness", warning: 10, critical: 25, direction: "higher_is_bad", warningMessage: "Gerekli kalınlık > 10 mm — ağırlık ve maliyet artıyor.", warningMessage_i18n: {"en":"Gerekli kalınlık > 10 mm — ağırlık ve maliyet artıyor.","tr":"Gerekli kalınlık > 10 mm — ağırlık ve maliyet artıyor."}, criticalMessage: "Gerekli kalınlık > 25 mm — alternatif malzeme değerlendirilmeli.", criticalMessage_i18n: {"en":"Gerekli kalınlık > 25 mm — alternatif malzeme değerlendirilmeli.","tr":"Gerekli kalınlık > 25 mm — alternatif malzeme değerlendirilmeli."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.vessel_shell_thickness", inputMap: { pressure: "internalPressure", radius: "innerRadius", stressAllowable: "stressAllowable", jointEfficiency: "jointEfficiency", corrosionAllowance: "corrosionAllowance" }, outputId: "requiredThickness" },
    { formulaId: "measurement.vessel_mawp", inputMap: { stressAllowable: "stressAllowable", jointEfficiency: "jointEfficiency", actualThickness: "requiredThickness", corrosionAllowance: "corrosionAllowance", radius: "innerRadius" }, outputId: "mawp" },
    { formulaId: "measurement.vessel_weight", inputMap: { diameter: "innerDiameter", length: "vesselLength", thickness: "requiredThickness", materialDensity: "materialDensity" }, outputId: "vesselWeight" },
  ],
  reportTemplate: { title: "ASME Pressure Vessel Report", title_i18n: {"en":"ASME Pressure Vessel Report","tr":"ASME Pressure Vessel Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Shell formula per UG-27: t = (P*R)/(S*E - 0.6*P) + CA.", "MAWP per UG-27: P = (S*E*t)/(R + 0.6*t).", "Sphere formula per UG-27: t = (P*R)/(2*S*E - 0.2*P) + CA.", "Torispherical: M = 0.25*(3+SQRT(L/r)), t = (P*L*M)/(2*S*E - 0.2*P) + CA.", "Elliptical 2:1: t = (P*D)/(2*S*E - 0.2*P) + CA."],assumptionNotes_i18n:[{"en":"Shell formula per UG-27: t = (P*R)/(S*E - 0.6*P) + CA.","tr":"Shell formula per UG-27: t = (P*R)/(S*E - 0.6*P) + CA."},{"en":"MAWP per UG-27: P = (S*E*t)/(R + 0.6*t).","tr":"MAWP per UG-27: P = (S*E*t)/(R + 0.6*t)."},{"en":"Sphere formula per UG-27: t = (P*R)/(2*S*E - 0.2*P) + CA.","tr":"Sphere formula per UG-27: t = (P*R)/(2*S*E - 0.2*P) + CA."},{"en":"Torispherical: M = 0.25*(3+SQRT(L/r)), t = (P*L*M)/(2*S*E - 0.2*P) + CA.","tr":"Torispherical: M = 0.25*(3+SQRT(L/r)), t = (P*L*M)/(2*S*E - 0.2*P) + CA."},{"en":"Elliptical 2:1: t = (P*D)/(2*S*E - 0.2*P) + CA.","tr":"Elliptical 2:1: t = (P*D)/(2*S*E - 0.2*P) + CA."}]},
};
