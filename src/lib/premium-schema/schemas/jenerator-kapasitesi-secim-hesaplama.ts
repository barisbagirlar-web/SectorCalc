import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const JeneratorKapasitesiSecimHesaplama_SCHEMA: PremiumCalculatorSchema = {
  id: "jenerator-kapasitesi-secim-hesaplama",
  name: "Jeneratör Kapasitesi Seçim Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "IEEE 446 and NFPA 110 standby power sizing standards",

  inputs: [
    {
      id: "totalConnectedLoad",
      label: "Total connected load",
      type: "number",
      unit: "kW",
      required: true,
      smartDefault: 100,
      validation: { min: 0.1, max: 100000 },
      helper: "Must be positive, sum of all equipment power ratings",
      expertMeaning: "Total connected load",
    },
    {
      id: "demandFactor",
      label: "Demand factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.8,
      validation: { min: 0.1, max: 1 },
      helper: "Between 0.1 and 1, typical 0.5-0.9",
      expertMeaning: "Demand factor",
    },
    {
      id: "expansionMarginPercent",
      label: "Expansion margin",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Expansion margin",
    },
    {
      id: "powerFactor",
      label: "Power factor",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.8,
      validation: { min: 0.5, max: 1 },
      helper: "Between 0.5 and 1, typical 0.8",
      expertMeaning: "Power factor",
    },
    {
      id: "generatorEfficiency",
      label: "Generator efficiency",
      type: "number",
      unit: "dimensionless",
      required: true,
      smartDefault: 0.95,
      validation: { min: 0.7, max: 1 },
      helper: "Between 0.7 and 1, typical 0.9-0.98",
      expertMeaning: "Generator efficiency",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalConnectedLoad",
        "b": "demandFactor",
        "c": "expansionMarginPercent"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalConnectedLoad",
        "target": "demandFactor"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Required generator capacity",
      unit: "kVA",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Recommended standard generator size",
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
      "All loads are linear and balanced",
      "Generator operates at rated efficiency",
      "Standard generator sizes follow typical commercial increments (e.g., 100, 150, 200, 250, 300, 400, 500, 600, 750, 1000 kVA)",
    ],
  },
};
