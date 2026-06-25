import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PAINTING_REWORK_COVERAGE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "pain-502",
  name: "Painting Rework and Coverage Risk Calculator",
  sectorSlug: "painting",
  category: "cost",
  legacyPaidSlug: "painting-job-profit-verdict",
  painStatement:
    "Painting jobs lose margin when prep time, coverage drift, scaffold time and touch-up work are underestimated.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "coverageDriftPercent",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Coverage drift is elevated — verify spread rate and surface prep.",
      criticalMessage: "Critical coverage drift — reprice before quoting by square meter.",
    },
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is building on this painting envelope.",
      criticalMessage: "Critical margin pressure — touch-up and scaffold cost may erase profit.",
    },
  ],

  reportTemplate: {
    title: "Painting Rework and Coverage Risk Decision Report",
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
    hiddenLossMultiplier: 1.09,
    volatilityPercent: 14,
    targetMarginPercent: 22,
    assumptionNotes: [
      "Coverage drift cost = paint material × coverage drift percent.",
      "Prep rework = prep hours × labor rate.",
      "Margin pressure = total exposure ÷ job revenue.",
    ],
  },
};
