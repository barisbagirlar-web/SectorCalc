import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CONSTRUCTION_PROJECT_OVERRUN_SCHEMA: PremiumCalculatorSchema = {
  id: "construction-project-overrun",
  name: "Construction Project Overrun Calculator",
  sectorSlug: "construction",
  category: "time",
  legacyPaidSlug: "change-order-impact-analyzer",
  painStatement:
    "Construction projects lose money when labor drift, delay days and material overrun are not priced before execution.",

  inputs: [
    {
      id: "dailySiteCost",
      label: "Daily site cost",
      type: "number",
      unit: "USD/day",
      required: true,
      smartDefault: 1250,
      validation: { min: 0 },
      helper: "Crew, equipment and overhead per day on site.",
      expertMeaning: "Fully loaded daily burn for delay exposure.",
    },
    {
      id: "delayDays",
      label: "Delay days",
      type: "number",
      unit: "days",
      required: true,
      smartDefault: 6,
      validation: { min: 0 },
      helper: "Expected schedule slip beyond baseline.",
      expertMeaning: "Calendar days of delay priced at site cost.",
    },
    {
      id: "laborBudget",
      label: "Labor budget",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 28000,
      validation: { min: 0 },
      helper: "Planned labor spend for the scope.",
      expertMeaning: "Baseline labor envelope before overrun.",
    },
    {
      id: "laborOverrunPercent",
      label: "Labor overrun",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 100 },
      helper: "Expected labor cost drift above budget.",
      expertMeaning: "Labor variance as percent of budget.",
    },
    {
      id: "materialBudget",
      label: "Material budget",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 46000,
      validation: { min: 0 },
      helper: "Planned material spend for the scope.",
      expertMeaning: "Baseline material envelope before overrun.",
    },
    {
      id: "materialOverrunPercent",
      label: "Material overrun",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 5,
      validation: { min: 0, max: 100 },
      helper: "Expected material cost drift above budget.",
      expertMeaning: "Material variance as percent of budget.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "time.delay_cost",
      inputMap: {
        dailySiteCost: "dailySiteCost",
        delayDays: "delayDays",
      },
      outputId: "delayCost",
    },
    {
      formulaId: "cost.overrun_cost",
      inputMap: {
        budget: "laborBudget",
        overrunPercent: "laborOverrunPercent",
      },
      outputId: "laborOverrunCost",
    },
    {
      formulaId: "cost.overrun_cost",
      inputMap: {
        budget: "materialBudget",
        overrunPercent: "materialOverrunPercent",
      },
      outputId: "materialOverrunCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        a: "delayCost",
        b: "laborOverrunCost",
        c: "materialOverrunCost",
      },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total overrun exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "delayCost",
      label: "Delay cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "laborOverrunCost",
      label: "Labor overrun cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "materialOverrunCost",
      label: "Material overrun cost",
      unit: "$",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "delayDays",
      warning: 3,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage:
        "Schedule slip is building — delay cost may erase contingency before closeout.",
      criticalMessage:
        "Critical delay exposure — reprice or resequence before accepting similar change scope.",
    },
    {
      fieldId: "laborOverrunPercent",
      warning: 5,
      critical: 15,
      direction: "higher_is_bad",
      warningMessage: "Labor drift is above typical band — verify crew productivity assumptions.",
      criticalMessage:
        "Labor overrun is critical — margin may disappear before project completion.",
    },
    {
      fieldId: "materialOverrunPercent",
      warning: 4,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Material variance is elevated — check lead times and substitution risk.",
      criticalMessage:
        "Material overrun is critical — audit procurement before signing similar work.",
    },
  ],

  reportTemplate: {
    title: "Construction Overrun Decision Report",
    sections: [
      "executive_summary",
      "loss_breakdown",
      "thresholds",
      "sensitivity",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.12,
    volatilityPercent: 20,
    targetMarginPercent: 12,
    assumptionNotes: [
      "Delay cost = daily site cost × delay days.",
      "Overrun costs apply percent drift to labor and material budgets separately.",
      "Total exposure sums delay, labor overrun and material overrun — no double-count with change-order fees.",
    ],
  },
};
