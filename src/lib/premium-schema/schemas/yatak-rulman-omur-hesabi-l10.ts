import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const YatakRulmanOmurHesabiL10_SCHEMA: PremiumCalculatorSchema = {
  id: "yatak-rulman-omur-hesabi-l10",
  name: "Yatak — Rulman Ömür Calculation (L10)",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "ISO 281:2007 rolling bearing life standard",

  inputs: [
    {
      id: "dynamicLoadRatingC",
      label: "Dynamic load rating C",
      type: "number",
      unit: "N",
      required: true,
      smartDefault: 10000,
      validation: { min: 1, max: 10000000 },
      helper: "Must be positive",
      expertMeaning: "Dynamic load rating C",
    },
    {
      id: "equivalentDynamicLoadP",
      label: "Equivalent dynamic load P",
      type: "number",
      unit: "N",
      required: true,
      smartDefault: 5000,
      validation: { min: 1, max: 10000000 },
      helper: "Must be positive",
      expertMeaning: "Equivalent dynamic load P",
    },
    {
      id: "rotationalSpeedN",
      label: "Rotational speed n",
      type: "number",
      unit: "rpm",
      required: true,
      smartDefault: 1500,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Rotational speed n",
    },
    {
      id: "reliabilityFactorA1",
      label: "Reliability factor a1",
      type: "number",
      unit: "-",
      required: true,
      smartDefault: 1,
      validation: { min: 0.1, max: 1 },
      helper: "Between 0.1 and 1",
      expertMeaning: "Reliability factor a1",
    },
    {
      id: "materialFactorA2",
      label: "Material/lubrication factor a2",
      type: "number",
      unit: "-",
      required: false,
      smartDefault: 1,
      validation: { min: 0.1, max: 3 },
      helper: "Between 0.1 and 3",
      expertMeaning: "Material/lubrication factor a2",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "dynamicLoadRatingC",
        "b": "equivalentDynamicLoadP",
        "c": "rotationalSpeedN"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "dynamicLoadRatingC",
        "target": "equivalentDynamicLoadP"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Adjusted L10h life",
      unit: "hours",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "L10 life in revolutions",
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
      "Load is constant and radial",
      "Operating temperature within normal range",
      "Lubrication conditions are adequate",
    ],
  },
};
