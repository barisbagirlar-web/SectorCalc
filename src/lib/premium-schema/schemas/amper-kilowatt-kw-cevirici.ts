import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AmperKilowattKwCevirici_SCHEMA: PremiumCalculatorSchema = {
  id: "amper-kilowatt-kw-cevirici",
  name: "Amper — Kilowatt (KW) Converter",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "IEEE 141-1993, IEC 60038",

  inputs: [
    {
      id: "currentAmperes",
      label: "Current (Amperes)",
      type: "number",
      unit: "A",
      required: true,
      smartDefault: 10,
      validation: { min: 0.001, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Current (Amperes)",
    },
    {
      id: "voltageVolts",
      label: "Voltage (Volts)",
      type: "number",
      unit: "V",
      required: true,
      smartDefault: 230,
      validation: { min: 0.1, max: 1000000 },
      helper: "Must be positive",
      expertMeaning: "Voltage (Volts)",
    },
    {
      id: "powerFactor",
      label: "Power Factor (for AC, 1 for DC)",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.95,
      validation: { min: 0.1, max: 1 },
      helper: "Between 0.1 and 1",
      expertMeaning: "Power Factor (for AC, 1 for DC)",
    },
    {
      id: "phaseType",
      label: "Phase Type",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Select single or three",
      expertMeaning: "Phase Type",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "currentAmperes",
        "b": "voltageVolts",
        "c": "powerFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "currentAmperes",
        "target": "voltageVolts"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Power (kW)",
      unit: "kW",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Apparent Power (kVA)",
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
      "For DC, power factor is set to 1",
      "Voltage is line-to-neutral for single-phase, line-to-line for three-phase",
      "Power factor is constant and lagging",
    ],
  },
};
