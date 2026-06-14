import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const BoilerEfficiencyCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "boiler-efficiency-calculator",
  name: "Boiler Efficiency Calculator",
  sectorSlug: "general-industrial",
  category: "energy",
  painStatement: "ASME PTC 4.1 standard for boiler efficiency",

  inputs: [
    {
      id: "steamFlow",
      label: "Steam flow rate",
      type: "number",
      unit: "kg/h",
      required: true,
      smartDefault: 10000,
      validation: { min: 0.1, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "Steam flow rate",
    },
    {
      id: "steamEnthalpy",
      label: "Steam enthalpy",
      type: "number",
      unit: "kJ/kg",
      required: true,
      smartDefault: 2800,
      validation: { min: 100, max: 4000 },
      helper: "Typical range 100-4000 kJ/kg",
      expertMeaning: "Steam enthalpy",
    },
    {
      id: "feedwaterEnthalpy",
      label: "Feedwater enthalpy",
      type: "number",
      unit: "kJ/kg",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative, less than steam enthalpy",
      expertMeaning: "Feedwater enthalpy",
    },
    {
      id: "fuelFlow",
      label: "Fuel flow rate",
      type: "number",
      unit: "kg/h",
      required: true,
      smartDefault: 1000,
      validation: { min: 0.1, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Fuel flow rate",
    },
    {
      id: "fuelHeatingValue",
      label: "Fuel heating value (LHV)",
      type: "number",
      unit: "kJ/kg",
      required: true,
      smartDefault: 42000,
      validation: { min: 1000, max: 50000 },
      helper: "Typical range 1000-50000 kJ/kg",
      expertMeaning: "Fuel heating value (LHV)",
    },
    {
      id: "blowdownRate",
      label: "Blowdown rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 2,
      validation: { min: 0, max: 20, step: 0.1 },
      helper: "Percent between 0 and 20",
      expertMeaning: "Blowdown rate",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "steamFlow",
        "b": "steamEnthalpy",
        "c": "feedwaterEnthalpy"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "steamFlow",
        "target": "steamEnthalpy"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Boiler efficiency",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Efficiency band",
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
      "Steady-state operation",
      "No heat losses other than blowdown considered",
      "Fuel heating value is lower heating value (LHV)",
    ],
  },
};
