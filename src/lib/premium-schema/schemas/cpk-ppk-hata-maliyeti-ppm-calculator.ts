import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CpkPpkHataMaliyetiPpmCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "cpk-ppk-hata-maliyeti-ppm-calculator",
  name: "Cpk Ppk Hata Maliyeti Ppm",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Quality engineering standard (ISO 22514, AIAG SPC)",

  inputs: [
    {
      id: "cpkValue",
      label: "Cpk value",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1.33,
      validation: { min: 0, max: 3 },
      helper: "Must be non-negative, typically between 0 and 3",
      expertMeaning: "Cpk value",
    },
    {
      id: "ppkValue",
      label: "Ppk value",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 1.33,
      validation: { min: 0, max: 3 },
      helper: "Must be non-negative, typically between 0 and 3",
      expertMeaning: "Ppk value",
    },
    {
      id: "unitCost",
      label: "Unit cost of defect",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit cost of defect",
    },
    {
      id: "productionVolume",
      label: "Production volume",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 1000000000 },
      helper: "Must be positive integer",
      expertMeaning: "Production volume",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "cpkValue",
        "b": "ppkValue",
        "c": "unitCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "cpkValue",
        "target": "ppkValue"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "PPM from Cpk",
      unit: "ppm",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "PPM from Ppk",
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
      "Process is normally distributed",
      "Cpk and Ppk are calculated from stable process data",
      "Defect cost is constant per unit",
    ],
  },
};
