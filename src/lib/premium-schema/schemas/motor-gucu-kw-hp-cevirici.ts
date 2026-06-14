import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const MotorGucuKwHpCevirici_SCHEMA: PremiumCalculatorSchema = {
  id: "motor-gucu-kw-hp-cevirici",
  name: "Motor Gücü (KW — HP) Converter",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "IEEE 112 / IEC 60034-1 motor efficiency standards",

  inputs: [
    {
      id: "powerValue",
      label: "Power value",
      type: "number",
      unit: "kW or hp",
      required: true,
      smartDefault: 100,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative power value",
      expertMeaning: "Power value",
    },
    {
      id: "inputUnit",
      label: "Input unit",
      type: "number",
      unit: "",
      required: true,
      smartDefault: 1,
      validation: { min: 0 },
      helper: "Must be 'kW' or 'hp'",
      expertMeaning: "Input unit",
    },
    {
      id: "motorEfficiencyPercent",
      label: "Motor efficiency",
      type: "number",
      unit: "%",
      required: false,
      smartDefault: 100,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100; if 0, treated as 100%",
      expertMeaning: "Motor efficiency",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "powerValue",
        "b": "inputUnit",
        "c": "motorEfficiencyPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "powerValue",
        "target": "inputUnit"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Converted power",
      unit: "hp or kW",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Power loss due to efficiency",
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
      "Conversion factor is constant (1 hp = 0.745699872 kW)",
      "Efficiency is constant across load",
      "No mechanical losses considered",
    ],
  },
};
