import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const RadyatorPetekBoyuHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "radyator-petek-boyu-hesaplama",
  name: "Radyatör — Petek Boyu Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "TS EN 442 standard heat output per meter panel length",

  inputs: [
    {
      id: "roomLength",
      label: "Room length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 5,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive length",
      expertMeaning: "Room length",
    },
    {
      id: "roomWidth",
      label: "Room width",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 4,
      validation: { min: 0.1, max: 100 },
      helper: "Must be positive length",
      expertMeaning: "Room width",
    },
    {
      id: "roomHeight",
      label: "Room height",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 2.5,
      validation: { min: 0.1, max: 10 },
      helper: "Must be positive length",
      expertMeaning: "Room height",
    },
    {
      id: "heatDemandPerVolume",
      label: "Heat demand per volume",
      type: "number",
      unit: "W/m³",
      required: true,
      smartDefault: 40,
      validation: { min: 10, max: 200 },
      helper: "Typical range 30-60 W/m³ for insulated rooms",
      expertMeaning: "Heat demand per volume",
    },
    {
      id: "panelType",
      label: "Panel type",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Select from predefined types",
      expertMeaning: "Panel type",
    },
    {
      id: "flowTemperature",
      label: "Flow temperature",
      type: "number",
      unit: "°C",
      required: true,
      smartDefault: 75,
      validation: { min: 30, max: 90 },
      helper: "Must be between 30 and 90 °C",
      expertMeaning: "Flow temperature",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "roomLength",
        "b": "roomWidth",
        "c": "roomHeight"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "roomLength",
        "target": "roomWidth"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Required panel length",
      unit: "m",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Recommended standard panel length",
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
      "Room is well insulated (heat demand per volume 30-60 W/m³ typical)",
      "Panel type correction factors are based on EN 442",
      "Temperature correction exponent 1.3 is standard for steel panel radiators",
    ],
  },
};
