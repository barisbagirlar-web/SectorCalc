import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BoruHattiSurtunmeVePompaEnerjiKayipCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "boru-hatti-surtunme-ve-pompa-enerji-kayip-calculator",
  name: "Boru Hatti Surtunme Ve Pompa Enerji Kayip",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Fluid mechanics and industrial energy accounting",

  inputs: [
    {
      id: "pipeLengthM",
      label: "Pipe length",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 100,
      validation: { min: 0.1, max: 100000 },
      helper: "Must be positive length",
      expertMeaning: "Pipe length",
    },
    {
      id: "pipeDiameterM",
      label: "Pipe inner diameter",
      type: "number",
      unit: "m",
      required: true,
      smartDefault: 0.2,
      validation: { min: 0.01, max: 10 },
      helper: "Must be positive diameter",
      expertMeaning: "Pipe inner diameter",
    },
    {
      id: "flowRateM3PerS",
      label: "Flow rate",
      type: "number",
      unit: "m³/s",
      required: true,
      smartDefault: 0.05,
      validation: { min: 0.001, max: 100 },
      helper: "Must be positive flow rate",
      expertMeaning: "Flow rate",
    },
    {
      id: "frictionFactor",
      label: "Darcy friction factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.02,
      validation: { min: 0.001, max: 0.1 },
      helper: "Must be between 0.001 and 0.1",
      expertMeaning: "Darcy friction factor",
    },
    {
      id: "fluidDensityKgPerM3",
      label: "Fluid density",
      type: "number",
      unit: "kg/m³",
      required: true,
      smartDefault: 1000,
      validation: { min: 1, max: 2000 },
      helper: "Must be positive density",
      expertMeaning: "Fluid density",
    },
    {
      id: "pumpEfficiencyPercent",
      label: "Pump efficiency",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 75,
      validation: { min: 1, max: 100, step: 0.1 },
      helper: "Percent between 1 and 100",
      expertMeaning: "Pump efficiency",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "pipeLengthM",
        "b": "pipeDiameterM",
        "c": "flowRateM3PerS"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "pipeLengthM",
        "target": "pipeDiameterM"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Friction head loss",
      unit: "m",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Pump power required",
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
      "Steady flow, incompressible fluid",
      "Constant friction factor (fully turbulent)",
      "Pump and motor efficiencies constant",
    ],
  },
};
