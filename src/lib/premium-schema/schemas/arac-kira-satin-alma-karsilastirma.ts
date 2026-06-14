import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AracKiraSatinAlmaKarsilastirma_SCHEMA: PremiumCalculatorSchema = {
  id: "arac-kira-satin-alma-karsilastirma",
  name: "Araç Kira — Satın Alma Karşılaştırma",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting and fleet management best practices",

  inputs: [
    {
      id: "purchasePrice",
      label: "Vehicle purchase price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 30000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "Vehicle purchase price",
    },
    {
      id: "monthlyLeasePayment",
      label: "Monthly lease payment",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Monthly lease payment",
    },
    {
      id: "leaseTermMonths",
      label: "Lease term (months)",
      type: "number",
      unit: "months",
      required: true,
      smartDefault: 36,
      validation: { min: 1, max: 120 },
      helper: "Positive integer",
      expertMeaning: "Lease term (months)",
    },
    {
      id: "leaseDownPayment",
      label: "Lease down payment",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2000,
      validation: { min: 0, max: 100000 },
      helper: "Non-negative currency",
      expertMeaning: "Lease down payment",
    },
    {
      id: "leaseEndFees",
      label: "Lease end fees",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 500,
      validation: { min: 0, max: 10000 },
      helper: "Non-negative currency",
      expertMeaning: "Lease end fees",
    },
    {
      id: "ownershipYears",
      label: "Ownership period (years)",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 5,
      validation: { min: 1, max: 30 },
      helper: "Positive integer",
      expertMeaning: "Ownership period (years)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "purchasePrice",
        "b": "monthlyLeasePayment",
        "c": "leaseTermMonths"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "purchasePrice",
        "target": "monthlyLeasePayment"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total lease cost",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Total purchase cost",
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
      "Fuel and maintenance costs are constant over ownership period",
      "Resale value is realized at end of ownership",
    ],
  },
};
