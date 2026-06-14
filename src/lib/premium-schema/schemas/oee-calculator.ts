import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

/** P7 nightrun — DeepSeek Chief Engineer schema (factory generated). */
export const OeeCalculator_SCHEMA: PremiumCalculatorSchema = {
  id: "oee-calculator",
  name: "OEE",
  sectorSlug: "manufacturing",
  category: "oee",
  painStatement: "Lean manufacturing OEE standard (availability * performance * quality) and waste cost accounting per 7 Muda",

  inputs: [
    {
      id: "totalShiftTime",
      label: "Total shift time",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 8,
      validation: { min: 0.01, max: 24 },
      helper: "Must be positive",
      expertMeaning: "Total shift time",
    },
    {
      id: "plannedDowntime",
      label: "Planned downtime",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 24 },
      helper: "Non-negative, less than shift time",
      expertMeaning: "Planned downtime",
    },
    {
      id: "unplannedDowntime",
      label: "Unplanned downtime",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0.5,
      validation: { min: 0, max: 24 },
      helper: "Non-negative",
      expertMeaning: "Unplanned downtime",
    },
    {
      id: "waitingTime",
      label: "Waiting time (material/labor)",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0.2,
      validation: { min: 0, max: 24 },
      helper: "Non-negative",
      expertMeaning: "Waiting time (material/labor)",
    },
    {
      id: "idealCycleTime",
      label: "Ideal cycle time per unit",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 0.01,
      validation: { min: 0.0001, max: 1 },
      helper: "Must be positive",
      expertMeaning: "Ideal cycle time per unit",
    },
    {
      id: "totalUnitsProduced",
      label: "Total units produced",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 500,
      validation: { min: 1, max: 1000000 },
      helper: "Must be positive integer",
      expertMeaning: "Total units produced",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        "a": "totalShiftTime",
        "b": "plannedDowntime",
        "c": "unplannedDowntime"
      },
      outputId: "totalExposure",
    },
    {
      formulaId: "benchmark.variance_percent",
      inputMap: {
        "actual": "totalShiftTime",
        "target": "plannedDowntime"
      },
      outputId: "variancePercent",
    }
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Overall Equipment Effectiveness (OEE)",
      unit: "%",
      format: "percentage",
      isBigNumber: true,
    },
    {
      id: "variancePercent",
      label: "Availability",
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
    title: "OEE Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 8,
    targetMarginPercent: 15,
    assumptionNotes: [
      "All downtime is measured in hours",
      "Ideal cycle time is constant per unit",
      "Labor and machine rates are constant",
    ],
  },
};
