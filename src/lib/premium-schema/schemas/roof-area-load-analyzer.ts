/**
 * Tool #26 — Çatı Alanı & Yük
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ROOF_AREA_SCHEMA: PremiumCalculatorSchema = {
  id: "roof-area-load-analyzer", legacyPaidSlug: "roof-area-load-analyzer",
  name: "Çatı Alanı & Yük Analizi", name_i18n: {"en":"Roof Area & Load Analysis","tr":"Çatı Alanı & Yük Analizi"}, sectorSlug: "construction", category: "measurement",
  painStatement: "Çatı alanı ve yük hesabı yapılmadan malzeme siparişi ve statik analiz hatalı olur.", painStatement_i18n: {"en":"Without roof area and load calculations, material ordering and structural analysis will be incorrect.","tr":"Çatı alanı ve yük hesabı yapılmadan malzeme siparişi ve statik analiz hatalı olur."}, inputs: [
    { id: "roofLength", label: "Çatı Uzunluğu", label_i18n: {"en":"Çatı Uzunluğu","tr":"Çatı Uzunluğu"}, type: "number", unit: "m", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "", expertMeaning: "Roof length", expertMeaning_i18n: {"en":"Roof length","tr":"Roof length"} },
    { id: "roofWidth", label: "Çatı Genişliği", label_i18n: {"en":"Çatı Genişliği","tr":"Çatı Genişliği"}, type: "number", unit: "m", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Roof width", expertMeaning_i18n: {"en":"Roof width","tr":"Roof width"} },
    { id: "pitchAngle", label: "Eğim Açısı", label_i18n: {"en":"Eğim Açısı","tr":"Eğim Açısı"}, type: "number", unit: "derece", required: true, smartDefault: 30, validation: { min: 0, max: 90 }, helper: "", expertMeaning: "Roof pitch", expertMeaning_i18n: {"en":"Roof pitch","tr":"Roof pitch"} },
    { id: "overhangWidth", label: "Saçak Payı", label_i18n: {"en":"Saçak Payı","tr":"Saçak Payı"}, type: "number", unit: "m", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Eaves overhang", expertMeaning_i18n: {"en":"Eaves overhang","tr":"Eaves overhang"} },
    { id: "wasteFactor", label: "Fire Oranı", label_i18n: {"en":"Fire Oranı","tr":"Fire Oranı"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Material waste factor", expertMeaning_i18n: {"en":"Material waste factor","tr":"Material waste factor"} },
    { id: "materialWeight", label: "Malzeme Ağırlığı", label_i18n: {"en":"Malzeme Ağırlığı","tr":"Malzeme Ağırlığı"}, type: "number", unit: "kg/m²", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Roofing material weight", expertMeaning_i18n: {"en":"Roofing material weight","tr":"Roofing material weight"} },
    { id: "groundSnow", label: "Yer Kar Yükü", label_i18n: {"en":"Yer Kar Yükü","tr":"Yer Kar Yükü"}, type: "number", unit: "kN/m²", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Ground snow load", expertMeaning_i18n: {"en":"Ground snow load","tr":"Ground snow load"} },
    { id: "exposureFactor", label: "Maruziyet Faktörü", label_i18n: {"en":"Maruziyet Faktörü","tr":"Maruziyet Faktörü"}, type: "number", unit: "%", required: false, smartDefault: 100, validation: { min: 0, max: 150 }, helper: "", expertMeaning: "Exposure factor Ce", expertMeaning_i18n: {"en":"Exposure factor Ce","tr":"Exposure factor Ce"} },
    { id: "thermalFactor", label: "Termal Faktör", label_i18n: {"en":"Termal Faktör","tr":"Termal Faktör"}, type: "number", unit: "%", required: false, smartDefault: 100, validation: { min: 0, max: 150 }, helper: "", expertMeaning: "Thermal factor Ct", expertMeaning_i18n: {"en":"Thermal factor Ct","tr":"Thermal factor Ct"} },
    { id: "slopeFactor", label: "Eğim Faktörü", label_i18n: {"en":"Eğim Faktörü","tr":"Eğim Faktörü"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Slope reduction factor Cs", expertMeaning_i18n: {"en":"Slope reduction factor Cs","tr":"Slope reduction factor Cs"} },
  ],
  outputs: [
    { id: "footprint", label: "Taban Alanı", label_i18n: {"en":"Taban Alanı","tr":"Taban Alanı"}, unit: "m²", format: "number" },
    { id: "gableArea", label: "Çatı Yüzey Alanı", label_i18n: {"en":"Çatı Yüzey Alanı","tr":"Çatı Yüzey Alanı"}, unit: "m²", format: "number" },
    { id: "totalMaterialArea", label: "Malzeme Alanı (Fire Dahil)", label_i18n: {"en":"Malzeme Alanı (Fire Dahil)","tr":"Malzeme Alanı (Fire Dahil)"}, unit: "m²", format: "number" },
    { id: "deadLoad", label: "Ölü Yük", label_i18n: {"en":"Ölü Yük","tr":"Ölü Yük"}, unit: "kN", format: "number" },
    { id: "snowLoad", label: "Kar Yükü", label_i18n: {"en":"Kar Yükü","tr":"Kar Yükü"}, unit: "kN/m²", format: "number" },
    { id: "combinedLoad", label: "Toplam Yük", label_i18n: {"en":"Toplam Yük","tr":"Toplam Yük"}, unit: "kN/m²", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "combinedLoad", warning: 5, critical: 8, direction: "higher_is_bad", warningMessage: "Yük > 5 kN/m² — taşıyıcı sistem kontrol edilmelidir.", warningMessage_i18n: {"en":"Load > 5 kN/m² — structural system should be checked.","tr":"Yük > 5 kN/m² — taşıyıcı sistem kontrol edilmelidir."}, criticalMessage: "Yük > 8 kN/m² — acil statik analiz gerekiyor.", criticalMessage_i18n: {"en":"Load > 8 kN/m² — urgent structural analysis required.","tr":"Yük > 8 kN/m² — acil statik analiz gerekiyor."} }],
  formulaPipeline: [
    { formulaId: "measurement.roof_footprint", inputMap: { roofLength: "roofLength", roofWidth: "roofWidth" }, outputId: "footprint" },
    { formulaId: "measurement.roof_gable_area", inputMap: { footprint: "footprint", pitchAngle: "pitchAngle" }, outputId: "gableArea" },
  ],
  reportTemplate: { title: "Roof Area & Load Report", title_i18n: {"en":"Roof Area & Load Report","tr":"Çatı Alanı ve Yük Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Footprint = L×W. Gable area = Footprint/COS(pitch).", "Dead load = MaterialWeight×TotalArea. Snow load per EN 1991-1-3."],assumptionNotes_i18n:[{"en":"Footprint = L×W. Gable area = Footprint/COS(pitch).","tr":"Footprint = L×W. Gable area = Footprint/COS(pitch)."},{"en":"Dead load = MaterialWeight×TotalArea. Snow load per EN 1991-1-3.","tr":"Dead load = MaterialWeight×TotalArea. Snow load per EN 1991-1-3."}] },
};
