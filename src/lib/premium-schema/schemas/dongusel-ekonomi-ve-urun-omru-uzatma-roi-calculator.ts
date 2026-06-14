import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const DonguselEkonomiVeUrunOmruUzatmaRoiCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "dongusel-ekonomi-ve-urun-omru-uzatma-roi-calculator",
  name: "Dongusel Ekonomi Ve Urun Omru Uzatma Roi",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Lifecycle cost analysis with extended product life",

  inputs: [
    {
      id: "initialProductCost",
      label: "Initial product cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative currency",
      expertMeaning: "Initial product cost",
    },
    {
      id: "originalLifespan",
      label: "Original lifespan",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 5,
      validation: { min: 1, max: 100 },
      helper: "Must be positive integer",
      expertMeaning: "Original lifespan",
    },
    {
      id: "annualOperatingCost",
      label: "Annual operating cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Annual operating cost",
    },
    {
      id: "refurbishmentCost",
      label: "Refurbishment cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 200,
      validation: { min: 0.01, max: 10000000 },
      helper: "Must be positive (minimum 0.01)",
      expertMeaning: "Refurbishment cost",
    },
    {
      id: "extendedLifespan",
      label: "Extended lifespan after refurbishment",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 8,
      validation: { min: 1, max: 100 },
      helper: "Must be greater than original lifespan",
      expertMeaning: "Extended lifespan after refurbishment",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "initialProductCost",
        "b": "originalLifespan",
        "c": "annualOperatingCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "initialProductCost",
        "target": "originalLifespan"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Return on Investment (ROI)",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Payback period",
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
      "Operating costs remain constant over time",
      "No inflation or discounting applied",
      "Refurbishment restores product to like-new condition",
    ],
  },
};
