import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KazaMaliyetiDogrudanVeDolayliToplamKayipCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "kaza-maliyeti-dogrudan-ve-dolayli-toplam-kayip-calculator",
  name: "Kaza Maliyeti Dogrudan Ve Dolayli Toplam Kayip",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial safety cost accounting (Heinrich ratio)",

  inputs: [
    {
      id: "numberOfAccidents",
      label: "Number of accidents",
      type: "number",
      unit: "accidents",
      required: true,
      smartDefault: 1,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Number of accidents",
    },
    {
      id: "medicalCostPerAccident",
      label: "Medical cost per accident",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Medical cost per accident",
    },
    {
      id: "propertyDamageCostPerAccident",
      label: "Property damage cost per accident",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Property damage cost per accident",
    },
    {
      id: "lostTimeCostPerAccident",
      label: "Lost time cost per accident",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Lost time cost per accident",
    },
    {
      id: "indirectMultiplier",
      label: "Indirect cost multiplier",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 4,
      validation: { min: 1, max: 10 },
      helper: "Must be between 1 and 10",
      expertMeaning: "Indirect cost multiplier",
    },
    {
      id: "annualRevenue",
      label: "Annual revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1000000,
      validation: { min: 1, max: 10000000000 },
      helper: "Must be positive currency",
      expertMeaning: "Annual revenue",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "numberOfAccidents",
        "b": "medicalCostPerAccident",
        "c": "propertyDamageCostPerAccident"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "numberOfAccidents",
        "target": "medicalCostPerAccident"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total direct cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total indirect cost",
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
      "Indirect costs are proportional to direct costs via multiplier",
      "All accidents have similar cost structure",
      "Annual revenue is stable and representative",
    ],
  },
};
