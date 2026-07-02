
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const ROOF_AREA_SCHEMA: PremiumCalculatorSchema = {
  id: "roof-area-load-analyzer", legacyPaidSlug: "roof-area-load-analyzer",
  name: "Roof Area & Load Analysis", name_i18n: {"en":"Roof Area & Load Analysis"}, sectorSlug: "construction", category: "measurement",
  painStatement: "Without calculating roof area and load, material orders and structural analysis will be incorrect.", painStatement_i18n: {"en":"Without calculating roof area and load, material orders and structural analysis will be incorrect."}, inputs: [
    { id: "roofLength", label: "Roof length", label_i18n: {"en":"Roof length"}, type: "number", unit: "m", required: true, smartDefault: 20, validation: { min: 0.1 }, helper: "", expertMeaning: "Roof length", expertMeaning_i18n: {"en":"Roof length"} },
    { id: "roofWidth", label: "Roof width", label_i18n: {"en":"Roof width"}, type: "number", unit: "m", required: true, smartDefault: 10, validation: { min: 0.1 }, helper: "", expertMeaning: "Roof width", expertMeaning_i18n: {"en":"Roof width"} },
    { id: "pitchAngle", label: "Roof pitch", label_i18n: {"en":"Roof pitch"}, type: "number", unit: "derece", required: true, smartDefault: 30, validation: { min: 0, max: 90 }, helper: "", expertMeaning: "Roof pitch", expertMeaning_i18n: {"en":"Roof pitch"} },
    { id: "overhangWidth", label: "Eaves overhang", label_i18n: {"en":"Eaves overhang"}, type: "number", unit: "m", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Eaves overhang", expertMeaning_i18n: {"en":"Eaves overhang"} },
    { id: "wasteFactor", label: "Waste Rate", label_i18n: {"en":"Waste Rate"}, type: "number", unit: "%", required: false, smartDefault: 10, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Material waste factor", expertMeaning_i18n: {"en":"Material waste factor"} },
    { id: "materialWeight", label: "Roofing material weight", label_i18n: {"en":"Roofing material weight"}, type: "number", unit: "kg/m²", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Roofing material weight", expertMeaning_i18n: {"en":"Roofing material weight"} },
    { id: "groundSnow", label: "Ground snow load", label_i18n: {"en":"Ground snow load"}, type: "number", unit: "kN/m²", required: false, smartDefault: 1.5, validation: { min: 0 }, helper: "", expertMeaning: "Ground snow load", expertMeaning_i18n: {"en":"Ground snow load"} },
    { id: "exposureFactor", label: "Exposure factor Ce", label_i18n: {"en":"Exposure factor Ce"}, type: "number", unit: "%", required: false, smartDefault: 100, validation: { min: 0, max: 150 }, helper: "", expertMeaning: "Exposure factor Ce", expertMeaning_i18n: {"en":"Exposure factor Ce"} },
    { id: "thermalFactor", label: "Thermal factor Ct", label_i18n: {"en":"Thermal factor Ct"}, type: "number", unit: "%", required: false, smartDefault: 100, validation: { min: 0, max: 150 }, helper: "", expertMeaning: "Thermal factor Ct", expertMeaning_i18n: {"en":"Thermal factor Ct"} },
    { id: "slopeFactor", label: "Slope reduction factor Cs", label_i18n: {"en":"Slope reduction factor Cs"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Slope reduction factor Cs", expertMeaning_i18n: {"en":"Slope reduction factor Cs"} },
  ],
  outputs: [
    { id: "footprint", label: "Taban Alan", label_i18n: {"en":"Taban Alan"}, unit: "m²", format: "number" },
    { id: "gableArea", label: "Cat Yuzey Alan", label_i18n: {"en":"Cat Yuzey Alan"}, unit: "m²", format: "number" },
    { id: "totalMaterialArea", label: "material Alan (waste Dahil)", label_i18n: {"en":"material Alan (waste Dahil)"}, unit: "m²", format: "number" },
    { id: "deadLoad", label: "Dead Load", label_i18n: {"en":"Dead Load"}, unit: "kN", format: "number" },
    { id: "snowLoad", label: "Snow Load", label_i18n: {"en":"Snow Load"}, unit: "kN/m²", format: "number" },
    { id: "combinedLoad", label: "Total Load", label_i18n: {"en":"Total Load"}, unit: "kN/m²", format: "number", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "combinedLoad", warning: 5, critical: 8, direction: "higher_is_bad", warningMessage: "Load > 5 kN/m² — load-bearing system must be checked.", warningMessage_i18n: {"en":"Load > 5 kN/m² — load-bearing system must be checked."}, criticalMessage: "Load > 8 kN/m² — urgent statik analiz gerekiyor.", criticalMessage_i18n: {"en":"Load > 8 kN/m² — urgent statik analiz gerekiyor."} }],
  formulaPipeline: [
    { formulaId: "measurement.roof_material_area", inputMap: { gableArea: "gableArea", wasteFactor: "wasteFactor" }, outputId: "measurement_roof_material_area_out" },
    { formulaId: "measurement.roof_footprint", inputMap: { roofLength: "roofLength", roofWidth: "roofWidth" ,
        buildingLength: "roofLength",
        buildingWidth: "roofWidth"}, outputId: "footprint" },
    { formulaId: "measurement.roof_gable_area", inputMap: { footprint: "footprint", pitchAngle: "pitchAngle" }, outputId: "gableArea" },
  ],
  reportTemplate: { title: "Roof Area & Load Report", title_i18n: {"en":"Roof Area & Load Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Footprint = L×W. Gable area = Footprint/COS(pitch).", "Dead load = MaterialWeight×TotalArea. Snow load per EN 1991-1-3."],assumptionNotes_i18n:[{"en":"Footprint = L×W. Gable area = Footprint/COS(pitch)."},{"en":"Dead load = MaterialWeight×TotalArea. Snow load per EN 1991-1-3."}] },
};
