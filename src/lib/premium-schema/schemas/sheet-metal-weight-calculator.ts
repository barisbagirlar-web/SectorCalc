import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SheetMetalWeightCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "sheet-metal-weight-calculator",
  name: "Sheet Metal Weight Calculator",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard material weight calculation using density, thickness, width, and length",

  inputs: [
    {
      id: "materialThickness",
      label: "Material thickness",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 1.5,
      validation: { min: 0.1, max: 100 },
      helper: "Thickness must be positive",
      expertMeaning: "Material thickness",
    },
    {
      id: "materialWidth",
      label: "Material width",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 5000 },
      helper: "Width must be positive",
      expertMeaning: "Material width",
    },
    {
      id: "materialLength",
      label: "Material length",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 2000,
      validation: { min: 1, max: 12000 },
      helper: "Length must be positive",
      expertMeaning: "Material length",
    },
    {
      id: "materialDensity",
      label: "Material density",
      type: "number",
      unit: "kg/m³",
      required: true,
      smartDefault: 7850,
      validation: { min: 100, max: 20000 },
      helper: "Density must be positive",
      expertMeaning: "Material density",
    },
    {
      id: "quantity",
      label: "Number of pieces",
      type: "number",
      unit: "pieces",
      required: true,
      smartDefault: 1,
      validation: { min: 1, max: 100000 },
      helper: "Quantity must be positive integer",
      expertMeaning: "Number of pieces",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "materialThickness",
        "b": "materialWidth",
        "c": "materialLength"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "materialThickness",
        "target": "materialWidth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Weight per piece",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total weight",
      unit: "%",
      format: "percentage",
      isBigNumber: false,
    }
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 1,
      critical: 3,
      direction: "higher_is_bad",
      warningMessage: "Exposure is entering warning band — review drivers.",
      criticalMessage: "Exposure is critical — immediate operational review required.",
    },
  ],

  reportTemplate: {
    title: "[object Object] Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Material is homogeneous and density is uniform",
      "Dimensions are nominal and do not include tolerances",
      "No allowance for coatings, finishes, or cutouts",
    ],
  },
};
