import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ForkliftTranspaletKullanimMaliyeti_SCHEMA: PremiumCalculatorSchema = {
  id: "forklift-transpalet-kullanim-maliyeti",
  name: "Forklift — Transpalet Kullanım Maliyeti",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting and equipment lifecycle costing",

  inputs: [
    {
      id: "purchasePrice",
      label: "Purchase price of forklift/transpalet",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 25000,
      validation: { min: 0, max: 500000 },
      helper: "Non-negative currency amount",
      expertMeaning: "Purchase price of forklift/transpalet",
    },
    {
      id: "residualValue",
      label: "Residual value at end of life",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2500,
      validation: { min: 0, max: 500000 },
      helper: "Non-negative, must be less than purchase price",
      expertMeaning: "Residual value at end of life",
    },
    {
      id: "usefulLifeYears",
      label: "Useful life in years",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 30 },
      helper: "Positive integer",
      expertMeaning: "Useful life in years",
    },
    {
      id: "operatingHoursPerYear",
      label: "Operating hours per year",
      type: "number",
      unit: "hours/year",
      required: true,
      smartDefault: 2000,
      validation: { min: 1, max: 8760 },
      helper: "Positive, max 8760 (24/7)",
      expertMeaning: "Operating hours per year",
    },
    {
      id: "energyConsumptionPerHour",
      label: "Energy consumption per hour",
      type: "number",
      unit: "kWh/h",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100 },
      helper: "Non-negative",
      expertMeaning: "Energy consumption per hour",
    },
    {
      id: "energyUnitCost",
      label: "Energy unit cost",
      type: "number",
      unit: "USD/kWh",
      required: true,
      smartDefault: 0.12,
      validation: { min: 0, max: 10 },
      helper: "Non-negative",
      expertMeaning: "Energy unit cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "purchasePrice",
        "b": "residualValue",
        "c": "usefulLifeYears"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "purchasePrice",
        "target": "residualValue"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual depreciation",
      unit: "USD/year",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Annual energy cost",
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
      "Straight-line depreciation method",
      "Energy consumption constant per hour",
      "Maintenance cost constant per year",
    ],
  },
};
