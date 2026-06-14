import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator",
  name: "Enjeksiyon Sogutma Suresi Ve Cevrim Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Heat transfer and injection molding process engineering",

  inputs: [
    {
      id: "partThickness",
      label: "Part thickness",
      type: "number",
      unit: "mm",
      required: true,
      smartDefault: 3,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Part thickness",
    },
    {
      id: "thermalDiffusivity",
      label: "Thermal diffusivity of material",
      type: "number",
      unit: "mm²/s",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0.01, max: 100 },
      helper: "Must be positive",
      expertMeaning: "Thermal diffusivity of material",
    },
    {
      id: "meltTemperature",
      label: "Melt temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 230,
      validation: { min: 100, max: 400 },
      helper: "Must be above mold temperature",
      expertMeaning: "Melt temperature",
    },
    {
      id: "moldTemperature",
      label: "Mold temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 50,
      validation: { min: 10, max: 150 },
      helper: "Must be below melt temperature",
      expertMeaning: "Mold temperature",
    },
    {
      id: "ejectionTemperature",
      label: "Ejection temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 90,
      validation: { min: 20, max: 200 },
      helper: "Must be between mold and melt temperature",
      expertMeaning: "Ejection temperature",
    },
    {
      id: "moldCorrectionFactor",
      label: "Mold material correction factor",
      type: "number",
      unit: "-",
      required: true,
      smartDefault: 1,
      validation: { min: 0.5, max: 2 },
      helper: "Between 0.5 and 2",
      expertMeaning: "Mold material correction factor",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "partThickness",
        "b": "thermalDiffusivity",
        "c": "meltTemperature"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "partThickness",
        "target": "thermalDiffusivity"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Cooling time (adjusted)",
      unit: "s",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cycle time",
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
      "One-dimensional heat transfer",
      "Constant thermal diffusivity",
      "Uniform part thickness",
    ],
  },
};
