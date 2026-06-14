import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const OfisKirtasiyeSarfiyatHesabi_SCHEMA: PremiumCalculatorSchema = {
  id: "ofis-kirtasiye-sarfiyat-hesabi",
  name: "Ofis Kırtasiye Sarfiyat Calculation",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting for consumables",

  inputs: [
    {
      id: "monthlyConsumption",
      label: "Monthly consumption quantity",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 500,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Monthly consumption quantity",
    },
    {
      id: "unitPrice",
      label: "Unit price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2.5,
      validation: { min: 0.01, max: 1000 },
      helper: "Non-negative currency",
      expertMeaning: "Unit price",
    },
    {
      id: "wasteRate",
      label: "Waste rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Waste rate",
    },
    {
      id: "overheadRate",
      label: "Overhead rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Overhead rate",
    },
    {
      id: "employeeCount",
      label: "Number of employees",
      type: "number",
      unit: "employees",
      required: true,
      smartDefault: 50,
      validation: { min: 1, max: 100000 },
      helper: "Must be positive integer",
      expertMeaning: "Number of employees",
    },
    {
      id: "monthlyBudget",
      label: "Monthly budget",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2000,
      validation: { min: 0, max: 10000000 },
      helper: "Non-negative currency",
      expertMeaning: "Monthly budget",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "monthlyConsumption",
        "b": "unitPrice",
        "c": "wasteRate"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "monthlyConsumption",
        "target": "unitPrice"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total monthly cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Cost per employee",
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
      "All stationery items are homogeneous in unit price",
      "Waste rate is constant across all items",
      "Overhead rate includes indirect costs (storage, procurement)",
    ],
  },
};
