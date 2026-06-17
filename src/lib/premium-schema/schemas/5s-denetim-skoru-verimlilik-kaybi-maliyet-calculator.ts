import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const FIVE_S_AUDIT_EFFICIENCY_LOSS_SCHEMA: PremiumCalculatorSchema = {
  id: "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  legacyPaidSlug: "5s-denetim-skoru-verimlilik-kaybi-maliyet-calculator",
  name: "5S Audit Score Efficiency Loss Cost Converter",
  sectorSlug: "lean-production",
  category: "cost",
  painStatement:
    "5S audit scores are tracked, but the monetary impact of disorganization and search time stays invisible.",

  inputs: [
    {
      id: "current5sScore",
      label: "Current 5S score",
      type: "number",
      unit: "/100",
      required: true,
      smartDefault: 38,
      validation: { min: 0, max: 100 },
      helper: "Latest audit score on a 0–100 scale.",
      expertMeaning: "Lower scores increase modeled efficiency loss percent.",
    },
    {
      id: "target5sScore",
      label: "Target 5S score",
      type: "number",
      unit: "/100",
      required: true,
      smartDefault: 87,
      validation: { min: 0, max: 100 },
      helper: "Target score after improvement program.",
      expertMeaning: "Used to estimate recoverable monthly cost potential.",
    },
    {
      id: "totalEmployees",
      label: "Affected employees",
      type: "number",
      unit: "people",
      required: true,
      smartDefault: 50,
      validation: { min: 1 },
      helper: "Operators and staff impacted by workplace organization losses.",
      expertMeaning: "Multiplied by monthly hours and hourly cost.",
    },
    {
      id: "avgHourlyCost",
      label: "Average hourly cost",
      type: "number",
      unit: "currency/hour",
      required: true,
      smartDefault: 35,
      validation: { min: 0 },
      helper: "Fully loaded labor cost per hour.",
      expertMeaning: "Applied to lost productive hours.",
    },
    {
      id: "monthlyWorkingHours",
      label: "Monthly working hours",
      type: "number",
      unit: "hours/person",
      required: true,
      smartDefault: 176,
      validation: { min: 1 },
      helper: "Paid productive hours per person per month.",
      expertMeaning: "Capacity base before efficiency loss factor.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "lean.efficiency_gap_percent",
      inputMap: { currentScore: "current5sScore" },
      outputId: "efficiencyLossPct",
    },
    {
      formulaId: "cost.labor_capacity_cost",
      inputMap: {
        headcount: "totalEmployees",
        hours: "monthlyWorkingHours",
        hourlyCost: "avgHourlyCost",
        lossFactor: "efficiencyLossPct",
      },
      outputId: "monthlyLossCost",
    },
    {
      formulaId: "lean.score_gap_percent",
      inputMap: { currentScore: "current5sScore", targetScore: "target5sScore" },
      outputId: "improvementGapPct",
    },
    {
      formulaId: "cost.labor_capacity_cost",
      inputMap: {
        headcount: "totalEmployees",
        hours: "monthlyWorkingHours",
        hourlyCost: "avgHourlyCost",
        lossFactor: "improvementGapPct",
      },
      outputId: "improvementPotentialCost",
    },
  ],

  outputs: [
    {
      id: "monthlyLossCost",
      label: "Monthly efficiency loss cost",
      unit: "currency",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "efficiencyLossPct",
      label: "Efficiency loss percent",
      unit: "%",
      format: "percentage",
    },
    {
      id: "improvementPotentialCost",
      label: "Improvement potential cost",
      unit: "currency",
      format: "currency",
    },
    {
      id: "improvementGapPct",
      label: "Score gap percent",
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "monthlyLossCost",
      warning: 10000,
      critical: 50000,
      direction: "higher_is_bad",
      warningMessage: "Monthly 5S-related loss is material — prioritize workplace organization.",
      criticalMessage: "Monthly loss is severe — launch a focused 5S recovery sprint.",
    },
  ],

  reportTemplate: {
    title: "5S Efficiency Loss Cost Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1,
    volatilityPercent: 10,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Efficiency loss is modeled as (100 − current score) / 100 of paid capacity.",
      "Improvement potential uses the gap between current and target score.",
      "This is an operational estimate — not payroll, accounting, or audited financial advice.",
    ],
  },
};
