import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TahtaMdfSuntaMAgirlikHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "tahta-mdf-sunta-m-agirlik-hesabi",
  name: "Tahta — Mdf — Sunta m² Ağırlık Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Material science and industrial engineering standard for wood-based panels",

  inputs: [
    {
      id: "panelLength",
      label: "Panel length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 2.44,
      validation: { min: 0.001, max: 10 },
      helper: "Must be positive length in meters",
      expertMeaning: "Panel length",
    },
    {
      id: "panelWidth",
      label: "Panel width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 1.22,
      validation: { min: 0.001, max: 10 },
      helper: "Must be positive width in meters",
      expertMeaning: "Panel width",
    },
    {
      id: "panelThickness",
      label: "Panel thickness",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.018,
      validation: { min: 0.001, max: 0.1 },
      helper: "Must be positive thickness in meters",
      expertMeaning: "Panel thickness",
    },
    {
      id: "materialDensity",
      label: "Material density",
      type: "number",
      unit: "kg/m³",
      required: true,
      smartDefault: 700,
      validation: { min: 100, max: 1200 },
      helper: "Must be positive density in kg/m³ typical for wood-based panels",
      expertMeaning: "Material density",
    },
    {
      id: "moistureContent",
      label: "Moisture content",
      type: "number",
      unit: "%",
      required: false,
      smartDefault: 8,
      validation: { min: 0, max: 30, step: 0.1 },
      helper: "Optional moisture adjustment, percent between 0 and 30",
      expertMeaning: "Moisture content",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "panelLength",
        "b": "panelWidth",
        "c": "panelThickness"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "panelLength",
        "target": "panelWidth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Panel weight",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Panel area",
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
      "Panel is rectangular with uniform thickness",
      "Density is uniform across the panel",
      "Moisture content adjustment is linear and small (<30%)",
    ],
  },
};
