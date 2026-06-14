import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const AgvAmrOtonomTasimaGeriDonusCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "agv-amr-otonom-tasima-geri-donus-calculator",
  name: "agv-amr-otonom-tasima-geri-donus-calculator",
  sectorSlug: "manufacturing",
  category: "cost",
  painStatement: "Industrial engineering cost-benefit analysis for automated material handling systems",

  inputs: [
    {
      id: "manualLaborCostPerHour",
      label: "Manual labor cost per hour",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 25,
      validation: { min: 0, max: 1000 },
      helper: "Non-negative currency per hour",
      expertMeaning: "Manual labor cost per hour",
    },
    {
      id: "manualHoursPerDay",
      label: "Manual handling hours per day",
      type: "number",
      unit: "hours/day",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 24 },
      helper: "Hours per day between 0 and 24",
      expertMeaning: "Manual handling hours per day",
    },
    {
      id: "workingDaysPerYear",
      label: "Working days per year",
      type: "number",
      unit: "days/year",
      required: true,
      smartDefault: 250,
      validation: { min: 1, max: 365 },
      helper: "Positive integer up to 365",
      expertMeaning: "Working days per year",
    },
    {
      id: "agvAmrUnitCost",
      label: "AGV/AMR unit purchase cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0, max: 1000000 },
      helper: "Non-negative currency",
      expertMeaning: "AGV/AMR unit purchase cost",
    },
    {
      id: "numberOfVehicles",
      label: "Number of AGV/AMR vehicles",
      type: "number",
      unit: "vehicles",
      required: true,
      smartDefault: 2,
      validation: { min: 1, max: 1000 },
      helper: "Positive integer",
      expertMeaning: "Number of AGV/AMR vehicles",
    },
    {
      id: "maintenanceFactor",
      label: "Annual maintenance factor (as % of purchase cost)",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 10,
      validation: { min: 0, max: 100, step: 0.1 },
      helper: "Percent between 0 and 100",
      expertMeaning: "Annual maintenance factor (as % of purchase cost)",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "manualLaborCostPerHour",
        "b": "manualHoursPerDay",
        "c": "workingDaysPerYear"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "manualLaborCostPerHour",
        "target": "manualHoursPerDay"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Annual savings",
      unit: "USD/year",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Payback period",
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
    title: "agv-amr-otonom-tasima-geri-donus-calculator Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "Manual handling cost includes only direct labor, no overhead",
      "AGV/AMR operating cost includes maintenance and energy only",
      "No inflation or currency fluctuation",
    ],
  },
};
