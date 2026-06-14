import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const CobotVsManuelIscilikKarsilastirmaCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "cobot-vs-manuel-iscilik-karsilastirma-calculator",
  name: "Cobot Vs Manuel Iscilik Karsilastirma",
  sectorSlug: "general-industrial",
  category: "cost",
  painStatement: "Industrial engineering cost accounting",

  inputs: [
    {
      id: "manualLaborHourlyRate",
      label: "Manual labor hourly rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 200 },
      helper: "Non-negative currency",
      expertMeaning: "Manual labor hourly rate",
    },
    {
      id: "manualHoursPerYear",
      label: "Manual labor hours per year per worker",
      type: "number",
      unit: "hours/year",
      required: true,
      smartDefault: 2080,
      validation: { min: 1, max: 8760 },
      helper: "Must be positive, typical full-time is 2080",
      expertMeaning: "Manual labor hours per year per worker",
    },
    {
      id: "numberOfWorkers",
      label: "Number of workers replaced",
      type: "number",
      unit: "workers",
      required: true,
      smartDefault: 2,
      validation: { min: 1, max: 100 },
      helper: "Positive integer",
      expertMeaning: "Number of workers replaced",
    },
    {
      id: "cobotPurchasePrice",
      label: "Cobot purchase price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 500000 },
      helper: "Non-negative currency",
      expertMeaning: "Cobot purchase price",
    },
    {
      id: "cobotDepreciationYears",
      label: "Cobot depreciation period",
      type: "number",
      unit: "years",
      required: true,
      smartDefault: 5,
      validation: { min: 1, max: 20 },
      helper: "Positive integer",
      expertMeaning: "Cobot depreciation period",
    },
    {
      id: "cobotMaintenanceAnnual",
      label: "Annual cobot maintenance cost",
      type: "number",
      unit: "USD/year",
      required: true,
      smartDefault: 2000,
      validation: { min: 0, max: 50000 },
      helper: "Non-negative currency",
      expertMeaning: "Annual cobot maintenance cost",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "manualLaborHourlyRate",
        "b": "manualHoursPerYear",
        "c": "numberOfWorkers"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "manualLaborHourlyRate",
        "target": "manualHoursPerYear"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual manual labor cost",
      unit: "USD/year",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Annual cobot cost",
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
      "All costs are in constant USD, no inflation",
      "Cobot operates at full capacity throughout the year",
      "Manual labor cost includes only direct wages, no overhead",
    ],
  },
};
