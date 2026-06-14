import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const KumlamaRaspaKumSarfiyatiHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "kumlama-raspa-kum-sarfiyati-hesabi",
  name: "Kumlama — Raspa Kum Sarfiyatı Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Surface preparation cost accounting and abrasive wear theory",

  inputs: [
    {
      id: "surfaceArea",
      label: "Surface area to blast",
      type: "number",
      unit: "m²",
      required: true,
      smartDefault: 10,
      validation: { min: 0.01, max: 100000 },
      helper: "Must be positive",
      expertMeaning: "Surface area to blast",
    },
    {
      id: "consumptionRatePerUnitArea",
      label: "Abrasive consumption rate per unit area",
      type: "number",
      unit: "kg/m²",
      required: true,
      smartDefault: 2.5,
      validation: { min: 0.1, max: 50 },
      helper: "Typical range 0.5-10 kg/m² for steel",
      expertMeaning: "Abrasive consumption rate per unit area",
    },
    {
      id: "nozzleEfficiency",
      label: "Nozzle efficiency factor",
      type: "number",
      unit: "ratio",
      required: true,
      smartDefault: 0.8,
      validation: { min: 0.1, max: 1 },
      helper: "Between 0 and 1; typical 0.7-0.9",
      expertMeaning: "Nozzle efficiency factor",
    },
    {
      id: "lossFactor",
      label: "Material loss factor (spillage, dust)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 50, step: 0.1 },
      helper: "Percent between 0 and 50",
      expertMeaning: "Material loss factor (spillage, dust)",
    },
    {
      id: "unitCost",
      label: "Unit cost of abrasive",
      type: "number",
      unit: "USD/kg",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 100 },
      helper: "Non-negative currency per kg",
      expertMeaning: "Unit cost of abrasive",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "surfaceArea",
        "b": "consumptionRatePerUnitArea",
        "c": "nozzleEfficiency"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "surfaceArea",
        "target": "consumptionRatePerUnitArea"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total abrasive consumption",
      unit: "kg",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total abrasive cost",
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
      "Abrasive consumption rate is linear with area",
      "Nozzle efficiency is constant across operation",
      "Loss factor includes spillage and dust only",
    ],
  },
};
