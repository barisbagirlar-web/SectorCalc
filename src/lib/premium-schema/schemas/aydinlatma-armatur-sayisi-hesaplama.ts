import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AydinlatmaArmaturSayisiHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "aydinlatma-armatur-sayisi-hesaplama",
  name: "Aydınlatma Armatür Sayısı Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "IESNA (Illuminating Engineering Society of North America) recommended practice for interior lighting",

  inputs: [
    {
      id: "illuminanceTarget",
      label: "Target illuminance",
      type: "number",
      unit: "lux",
      required: true,
      smartDefault: 500,
      validation: { min: 50, max: 2000 },
      helper: "Must be between 50 and 2000 lux for typical workspaces",
      expertMeaning: "Target illuminance",
    },
    {
      id: "area",
      label: "Room area",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive area",
      expertMeaning: "Room area",
    },
    {
      id: "lampLumens",
      label: "Lamp luminous flux",
      type: "number",
      unit: "lm",
      required: true,
      smartDefault: 3200,
      validation: { min: 100, max: 10000 },
      helper: "Typical LED lamp range 100-10000 lm",
      expertMeaning: "Lamp luminous flux",
    },
    {
      id: "numberLampsPerFixture",
      label: "Number of lamps per fixture",
      type: "number",
      unit: "lamps",
      required: true,
      smartDefault: 2,
      validation: { min: 1, max: 10 },
      helper: "Must be integer between 1 and 10",
      expertMeaning: "Number of lamps per fixture",
    },
    {
      id: "lightLossFactor",
      label: "Light loss factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.8,
      validation: { min: 0.5, max: 1 },
      helper: "Typical range 0.5-1.0",
      expertMeaning: "Light loss factor",
    },
    {
      id: "utilizationFactor",
      label: "Utilization factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.7,
      validation: { min: 0.3, max: 1 },
      helper: "Typical range 0.3-1.0",
      expertMeaning: "Utilization factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "illuminanceTarget",
        "b": "area",
        "c": "lampLumens"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "illuminanceTarget",
        "target": "area"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Number of fixtures required",
      unit: "fixtures",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total lumens required",
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
      "Uniform illuminance distribution across the room",
      "Lamps are operated at rated lumen output",
      "Light loss factor accounts for dirt, lamp depreciation, and maintenance",
    ],
  },
};
