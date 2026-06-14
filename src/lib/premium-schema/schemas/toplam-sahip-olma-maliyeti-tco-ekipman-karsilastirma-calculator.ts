import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const ToplamSahipOlmaMaliyetiTcoEkipmanKarsilastirmaCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "toplam-sahip-olma-maliyeti-tco-ekipman-karsilastirma-calculator",
  name: "Toplam Sahip Olma Maliyeti Tco Ekipman Karsilastirma",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Standard industrial engineering cost accounting and lifecycle costing",

  inputs: [
    {
      id: "purchasePrice",
      label: "Purchase price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative currency",
      expertMeaning: "Purchase price",
    },
    {
      id: "installationCost",
      label: "Installation cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 5000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative currency",
      expertMeaning: "Installation cost",
    },
    {
      id: "trainingCost",
      label: "Training cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative currency",
      expertMeaning: "Training cost",
    },
    {
      id: "expectedLifeYears",
      label: "Expected life",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 10,
      validation: { min: 1, max: 50 },
      helper: "Must be positive integer",
      expertMeaning: "Expected life",
    },
    {
      id: "annualEnergyCost",
      label: "Annual energy cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 10000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative currency",
      expertMeaning: "Annual energy cost",
    },
    {
      id: "annualConsumablesCost",
      label: "Annual consumables cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3000,
      validation: { min: 0, max: 100000000 },
      helper: "Non-negative currency",
      expertMeaning: "Annual consumables cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "purchasePrice",
        "b": "installationCost",
        "c": "trainingCost"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "purchasePrice",
        "target": "installationCost"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total Cost of Ownership",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Annualized cost",
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
      "All costs are in constant dollars (no inflation)",
      "No salvage value at end of life",
      "Annual costs are constant over equipment life",
    ],
  },
};
