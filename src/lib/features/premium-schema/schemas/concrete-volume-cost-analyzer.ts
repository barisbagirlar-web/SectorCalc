/**
 * Tool #12 — Concrete Volume (Concrete Volume & Cost)
 * V_slab → V_footing → V_column → V_wall → Total volume → Weight → Cost
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const CONCRETE_GRADE_OPTIONS = [
  { value: "C20", label: "C20", label_i18n: {"en":"C20"} }, { value: "C25", label: "C25", label_i18n: {"en":"C25"} },
  { value: "C30", label: "C30", label_i18n: {"en":"C30"} }, { value: "C35", label: "C35", label_i18n: {"en":"C35"} },
  { value: "C40", label: "C40", label_i18n: {"en":"C40"} },
] as const;

export const CONCRETE_VOLUME_SCHEMA: PremiumCalculatorSchema = {
  id: "concrete-volume-cost-analyzer", legacyPaidSlug: "concrete-volume-cost-analyzer",
  name: "Concrete Volume & Cost Analyzer", name_i18n: {"en":"Concrete Volume & Cost Analyzer"}, sectorSlug: "construction", category: "measurement",
  painStatement: "When calculating Concrete Volume manually on construction sites, waste, Pump and leveling costs are often overlooked. This tool calculates geometric volume + waste + Cost in a single step.", painStatement_i18n: {"en":"When calculating Concrete Volume manually on construction sites, waste, Pump and leveling costs are often overlooked. This tool calculates geometric volume + waste + Cost in a single step."},
  inputs: [
    { id: "slabLength", label: "Slab length", label_i18n: {"en":"Slab length"}, type: "number", unit: "m", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Slab length", expertMeaning_i18n: {"en":"Slab length"} },
    { id: "slabWidth", label: "Slab width", label_i18n: {"en":"Slab width"}, type: "number", unit: "m", required: false, smartDefault: 8, validation: { min: 0 }, helper: "", expertMeaning: "Slab width", expertMeaning_i18n: {"en":"Slab width"} },
    { id: "slabThickness", label: "Slab thickness", label_i18n: {"en":"Slab thickness"}, type: "number", unit: "cm", required: false, smartDefault: 15, validation: { min: 0 }, helper: "", expertMeaning: "Slab thickness", expertMeaning_i18n: {"en":"Slab thickness"} },
    { id: "footingCount", label: "Number of footings", label_i18n: {"en":"Number of footings"}, type: "number", unit: "units", required: false, smartDefault: 6, validation: { min: 0 }, helper: "", expertMeaning: "Number of footings", expertMeaning_i18n: {"en":"Number of footings"} },
    { id: "footingLength", label: "Footing length", label_i18n: {"en":"Footing length"}, type: "number", unit: "m", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Footing length", expertMeaning_i18n: {"en":"Footing length"} },
    { id: "footingWidth", label: "Footing width", label_i18n: {"en":"Footing width"}, type: "number", unit: "m", required: false, smartDefault: 1, validation: { min: 0 }, helper: "", expertMeaning: "Footing width", expertMeaning_i18n: {"en":"Footing width"} },
    { id: "footingDepth", label: "Footing depth", label_i18n: {"en":"Footing depth"}, type: "number", unit: "m", required: false, smartDefault: 0.5, validation: { min: 0 }, helper: "", expertMeaning: "Footing depth", expertMeaning_i18n: {"en":"Footing depth"} },
    { id: "columnCount", label: "Number of columns", label_i18n: {"en":"Number of columns"}, type: "number", unit: "units", required: false, smartDefault: 10, validation: { min: 0 }, helper: "", expertMeaning: "Number of columns", expertMeaning_i18n: {"en":"Number of columns"} },
    { id: "columnDiameter", label: "Column diameter", label_i18n: {"en":"Column diameter"}, type: "number", unit: "cm", required: false, smartDefault: 40, validation: { min: 0 }, helper: "", expertMeaning: "Column diameter", expertMeaning_i18n: {"en":"Column diameter"} },
    { id: "columnHeight", label: "Column height", label_i18n: {"en":"Column height"}, type: "number", unit: "m", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Column height", expertMeaning_i18n: {"en":"Column height"} },
    { id: "wallLength", label: "Wall length", label_i18n: {"en":"Wall length"}, type: "number", unit: "m", required: false, smartDefault: 20, validation: { min: 0 }, helper: "", expertMeaning: "Wall length", expertMeaning_i18n: {"en":"Wall length"} },
    { id: "wallHeight", label: "Wall height", label_i18n: {"en":"Wall height"}, type: "number", unit: "m", required: false, smartDefault: 3, validation: { min: 0 }, helper: "", expertMeaning: "Wall height", expertMeaning_i18n: {"en":"Wall height"} },
    { id: "wallThickness", label: "Wall thickness", label_i18n: {"en":"Wall thickness"}, type: "number", unit: "cm", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Wall thickness", expertMeaning_i18n: {"en":"Wall thickness"} },
    { id: "concreteGrade", label: "Concrete strength class", label_i18n: {"en":"Concrete strength class"}, type: "select", unit: "scalar", required: false, smartDefault: "C25", options: [...CONCRETE_GRADE_OPTIONS], helper: "", expertMeaning: "Concrete strength class", expertMeaning_i18n: {"en":"Concrete strength class"} },
    { id: "concreteDensity", label: "Concrete density", label_i18n: {"en":"Concrete density"}, type: "number", unit: "kg/m³", required: false, smartDefault: 2400, validation: { min: 0 }, helper: "", expertMeaning: "Concrete density", expertMeaning_i18n: {"en":"Concrete density"} },
    { id: "wasteFactor", label: "Waste factor", label_i18n: {"en":"Waste factor"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Waste factor", expertMeaning_i18n: {"en":"Waste factor"} },
    { id: "unitPrice", label: "Concrete Unit Fiyat", label_i18n: {"en":"Concrete Unit Fiyat"}, type: "number", unit: "USD/m³", required: false, smartDefault: 120, validation: { min: 0 }, helper: "", expertMeaning: "Concrete price per m³", expertMeaning_i18n: {"en":"Concrete price per m³"} },
    { id: "pumpCost", label: "Pump Cost", label_i18n: {"en":"Pump Cost"}, type: "number", unit: "USD", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Concrete pump cost", expertMeaning_i18n: {"en":"Concrete pump cost"} },
  ],
  outputs: [
    { id: "totalVolume", label: "Total Concrete Volume", label_i18n: {"en":"Total Concrete Volume"}, unit: "m³", format: "number" },
    { id: "totalWeight", label: "Total Weight", label_i18n: {"en":"Total Weight"}, unit: "kg", format: "number" },
    { id: "truckLoads", label: "Truck Loads", label_i18n: {"en":"Truck Loads"}, unit: "units", format: "number" },
    { id: "totalCost", label: "Total Cost", label_i18n: {"en":"Total Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "totalCost", warning: 10000, critical: 50000, direction: "higher_is_bad", warningMessage: "Concrete Cost > $10K — evaluate alternative supplier.", warningMessage_i18n: {"en":"Concrete Cost > $10K — evaluate alternative supplier."}, criticalMessage: "Concrete Cost > $50K — tendering process should be initiated.", criticalMessage_i18n: {"en":"Concrete Cost > $50K — tendering process should be initiated."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.concrete_volume_total", inputMap: { slabLength: "slabLength", slabWidth: "slabWidth", slabThickness: "slabThickness", footingLength: "footingLength", footingWidth: "footingWidth", footingDepth: "footingDepth", footingCount: "footingCount", columnDiameter: "columnDiameter", columnHeight: "columnHeight", columnCount: "columnCount", wallLength: "wallLength", wallHeight: "wallHeight", wallThickness: "wallThickness", wasteFactor: "wasteFactor" }, outputId: "totalVolume" },
  ],
  reportTemplate: { title: "Concrete Volume & Cost Report", title_i18n: {"en":"Concrete Volume & Cost Report"}, sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["V_slab = L × W × T (m). V_footing = L × W × D × Count.", "V_column = π×(D/2)²×H×Count. V_wall = L × H × T.", "Total volume with waste = V_geometric × (1 + WasteFactor/100).", "Truck loads = CEILING(TotalVolume / 8 m³). Standard truck = 8 m³."],assumptionNotes_i18n:[{"en":"V_slab = L × W × T (m). V_footing = L × W × D × Count."},{"en":"V_column = π×(D/2)²×H×Count. V_wall = L × H × T."},{"en":"Total volume with waste = V_geometric × (1 + WasteFactor/100)."},{"en":"Truck loads = CEILING(TotalVolume / 8 m³). Standard truck = 8 m³."}] },
};
