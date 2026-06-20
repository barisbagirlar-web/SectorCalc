/**
 * Tool #26 — Çatı Alanı & Yük
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const ROOF_AREA_SCHEMA: PremiumCalculatorSchema = {
  id: "roof-area-load-analyzer", legacyPaidSlug: "roof-area-load-analyzer",
  name: "Çatı Alanı & Yük Analizi", sectorSlug: "construction", category: "measurement",
  painStatement: "Çatı alanı ve yük hesabı yapılmadan malzeme siparişi ve statik analiz hatalı olur.", inputs: [
    { id: "roofLength", label: "Çatı Uzunluğu", type: "number", unit: "m", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "", expertMeaning: "Roof length" },
    { id: "roofWidth", label: "Çatı Genişliği", type: "number", unit: "m", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Roof width" },
    { id: "pitchAngle", label: "Eğim Açısı", type: "number", unit: "derece", required: true, smartDefault: 30, validation: { min: 0, max: 90 }, helper: "", expertMeaning: "Roof pitch" },
    { id: "overhangWidth", label: "Saçak Payı", type: "number", unit: "m", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Eaves overhang" },
    { id: "wasteFactor", label: "Fire Oranı", type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Material waste factor" },
    { id: "materialWeight", label: "Malzeme Ağırlığı", type: "number", unit: "kg/m²", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Roofing material weight" },
    { id: "groundSnow", label: "Yer Kar Yükü", type: "number", unit: "kN/m²", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Ground snow load" },
    { id: "exposureFactor", label: "Maruziyet Faktörü", type: "number", unit: "%", required: false, smartDefault: 100, validation: { min: 0, max: 150 }, helper: "", expertMeaning: "Exposure factor Ce" },
    { id: "thermalFactor", label: "Termal Faktör", type: "number", unit: "%", required: false, smartDefault: 100, validation: { min: 0, max: 150 }, helper: "", expertMeaning: "Thermal factor Ct" },
    { id: "slopeFactor", label: "Eğim Faktörü", type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Slope reduction factor Cs" },
  ],
  outputs: [
    { id: "footprint", label: "Taban Alanı", unit: "m²", format: "number" },
    { id: "gableArea", label: "Çatı Yüzey Alanı", unit: "m²", format: "number" },
    { id: "totalMaterialArea", label: "Malzeme Alanı (Fire Dahil)", unit: "m²", format: "number" },
    { id: "deadLoad", label: "Ölü Yük", unit: "kN", format: "number" },
    { id: "snowLoad", label: "Kar Yükü", unit: "kN/m²", format: "number" },
    { id: "combinedLoad", label: "Toplam Yük", unit: "kN/m²", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "combinedLoad", warning: 5, critical: 8, direction: "higher_is_bad", warningMessage: "Yük > 5 kN/m² — taşıyıcı sistem kontrol edilmelidir.", criticalMessage: "Yük > 8 kN/m² — acil statik analiz gerekiyor." }],
  formulaPipeline: [
    { formulaId: "measurement.roof_footprint", inputMap: { roofLength: "roofLength", roofWidth: "roofWidth" }, outputId: "footprint" },
    { formulaId: "measurement.roof_gable_area", inputMap: { footprint: "footprint", pitchAngle: "pitchAngle" }, outputId: "gableArea" },
  ],
  reportTemplate: { title: "Roof Area & Load Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Footprint = L×W. Gable area = Footprint/COS(pitch).", "Dead load = MaterialWeight×TotalArea. Snow load per EN 1991-1-3."] },
};
