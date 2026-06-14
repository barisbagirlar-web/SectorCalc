import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const SmedSetupSuresiVeEkonomikPartiCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "smed-setup-suresi-ve-ekonomik-parti-calculator",
  name: "Smed Setup Suresi Ve Ekonomik Parti",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Shigeo Shingo's SMED methodology and Wilson's EOQ formula adapted for setup time reduction",

  inputs: [
    {
      id: "annualDemand",
      label: "Annual demand",
      type: "number",
      unit: "units/year",
      required: true,
      smartDefault: 10000,
      validation: { min: 1, max: 10000000 },
      helper: "Must be positive integer",
      expertMeaning: "Annual demand",
    },
    {
      id: "batchQuantity",
      label: "Batch quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 500,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Batch quantity",
    },
    {
      id: "setupCostPerHour",
      label: "Setup cost per hour",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Setup cost per hour",
    },
    {
      id: "unitCost",
      label: "Unit cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Unit cost",
    },
    {
      id: "holdingRatePercent",
      label: "Holding rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Holding rate",
    },
    {
      id: "initialSetupTime",
      label: "Initial setup time",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 60,
      validation: { min: 0.1, max: 1440 },
      helper: "Must be positive",
      expertMeaning: "Initial setup time",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "annualDemand",
        "b": "batchQuantity",
        "c": "setupCostPerHour"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "annualDemand",
        "target": "batchQuantity"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Economic batch quantity (EBQ)",
      unit: "units",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total annual cost",
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
      "Demand is constant and known",
      "Setup cost per hour is constant",
      "Unit cost is constant",
    ],
  },
};
