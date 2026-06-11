import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOWNTIME_MINUTE_COST_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "downtime-minute-cost-calculator",
  name: "Downtime Minute Cost Calculator",
  sectorSlug: "manufacturing",
  category: "time",
  painStatement:
    "Maintenance budgets ignore opportunity cost of machines not producing.",

  inputs: [
    {
      id: "downtimeMinutes",
      label: "Downtime minutes",
      type: "number",
      unit: "minutes",
      required: true,
      smartDefault: 95,
      validation: { min: 0 },
      helper: "Unplanned or scheduled stop minutes in the period.",
      expertMeaning: "Stop time converted to hourly shop rate.",
    },
    {
      id: "hourlyRate",
      label: "Shop hourly rate",
      type: "number",
      unit: "USD/h",
      required: true,
      smartDefault: 78,
      validation: { min: 0 },
      helper: "Loaded machine or line hourly cost.",
      expertMeaning: "Shop rate applied to lost production time.",
    },
    {
      id: "outputUnitsPerHour",
      label: "Output units per hour",
      type: "number",
      unit: "units/h",
      required: true,
      smartDefault: 42,
      validation: { min: 0 },
      helper: "Typical good units produced per running hour.",
      expertMeaning: "Used for output loss estimate.",
    },
    {
      id: "contributionPerUnit",
      label: "Contribution per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 6.5,
      validation: { min: 0 },
      helper: "Margin contribution per good unit.",
      expertMeaning: "Opportunity value of lost output units.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "time.downtime_minute_cost",
      inputMap: { downtimeMinutes: "downtimeMinutes", hourlyRate: "hourlyRate" },
      outputId: "downtimeCost",
    },
    {
      formulaId: "time.downtime_units_lost",
      inputMap: { downtimeMinutes: "downtimeMinutes", outputUnitsPerHour: "outputUnitsPerHour" },
      outputId: "unitsLost",
    },
    {
      formulaId: "cost.count_cost",
      inputMap: { count: "unitsLost", costEach: "contributionPerUnit" },
      outputId: "outputLossValue",
    },
    {
      formulaId: "cost.total2",
      inputMap: { a: "downtimeCost", b: "outputLossValue" },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total downtime exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "downtimeCost",
      label: "Shop rate downtime cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "outputLossValue",
      label: "Output loss value",
      unit: "$",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 180,
      critical: 450,
      direction: "higher_is_bad",
      warningMessage: "Downtime exposure is material — prioritize root-cause maintenance.",
      criticalMessage: "Downtime exposure is severe — escalate preventive maintenance budget.",
    },
  ],

  reportTemplate: {
    title: "Downtime Minute Cost Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.06,
    volatilityPercent: 10,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Shop downtime cost = downtime minutes ÷ 60 × hourly rate.",
      "Output loss = lost units × contribution per unit.",
      "Total exposure sums shop rate cost and output opportunity loss.",
    ],
  },
};
