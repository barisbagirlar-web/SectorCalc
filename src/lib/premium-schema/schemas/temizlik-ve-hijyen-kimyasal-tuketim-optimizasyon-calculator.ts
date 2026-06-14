import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const TemizlikVeHijyenKimyasalTuketimOptimizasyonCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "temizlik-ve-hijyen-kimyasal-tuketim-optimizasyon-calculator",
  name: "Temizlik Ve Hijyen Kimyasal Tuketim Optimizasyon",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial cleaning process engineering and cost accounting",

  inputs: [
    {
      id: "areaPerCycle",
      label: "Area cleaned per cycle",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 100,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive area",
      expertMeaning: "Area cleaned per cycle",
    },
    {
      id: "doseRatePerArea",
      label: "Dose rate per area",
      type: "number",
      unit: "L/m²",
      required: true,
      smartDefault: 0.1,
      validation: { min: 0.001, max: 10 },
      helper: "Must be positive dose rate",
      expertMeaning: "Dose rate per area",
    },
    {
      id: "dilutionFactor",
      label: "Dilution factor",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 1000 },
      helper: "Must be >= 1",
      expertMeaning: "Dilution factor",
    },
    {
      id: "wasteFactorPercent",
      label: "Waste factor",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Waste factor",
    },
    {
      id: "numberOfCycles",
      label: "Number of cleaning cycles",
      type: "number",
      unit: "cycles",
      required: true,
      smartDefault: 1,
      validation: { min: 1, max: 10000 },
      helper: "Must be positive integer",
      expertMeaning: "Number of cleaning cycles",
    },
    {
      id: "unitCost",
      label: "Unit cost of chemical",
      type: "number",
      unit: "USD/L",
      required: true,
      smartDefault: 5,
      validation: { min: 0.01, max: 1000 },
      helper: "Must be positive currency",
      expertMeaning: "Unit cost of chemical",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "areaPerCycle",
        "b": "doseRatePerArea",
        "c": "dilutionFactor"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "areaPerCycle",
        "target": "doseRatePerArea"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total chemical consumption",
      unit: "L",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total chemical cost",
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
      "Dose rate is constant per area",
      "Dilution factor is applied uniformly",
      "Waste factor accounts for spillage and overuse",
    ],
  },
};
