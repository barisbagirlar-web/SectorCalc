import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PAINTING_REWORK_COVERAGE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "painting-rework-coverage-risk",
  name: "Painting Rework and Coverage Risk Analyzer",
  sectorSlug: "painting",
  category: "cost",
  legacyPaidSlug: "painting-job-profit-verdict",
  painStatement:
    "Painting jobs lose margin when prep time, coverage drift, scaffold time and touch-up work are underestimated.",

  inputs: [
    {
      id: "jobRevenue",
      label: "Job revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 18500,
      validation: { min: 0 },
      helper: "Quoted revenue for the painting contract.",
      expertMeaning: "Revenue denominator for margin pressure.",
    },
    {
      id: "paintMaterialCost",
      label: "Paint material cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 3800,
      validation: { min: 0 },
      helper: "Paint, primer and consumables spend.",
      expertMeaning: "Material base before coverage drift.",
    },
    {
      id: "coverageDriftPercent",
      label: "Coverage drift",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 6,
      validation: { min: 0, max: 100 },
      helper: "Extra material from coverage drift as percent of paint cost.",
      expertMeaning: "Spread rate variance versus estimate.",
    },
    {
      id: "prepReworkHours",
      label: "Prep rework hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 32,
      validation: { min: 0 },
      helper: "Surface prep and rework labor hours.",
      expertMeaning: "Prep overrun not in square-meter quote.",
    },
    {
      id: "laborRate",
      label: "Labor rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 42,
      validation: { min: 0 },
      helper: "Fully loaded painter labor rate.",
      expertMeaning: "Hourly burden on prep rework.",
    },
    {
      id: "scaffoldCost",
      label: "Scaffold cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1200,
      validation: { min: 0 },
      helper: "Scaffold rental and setup spend.",
      expertMeaning: "Access cost often under-quoted.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "loss.waste_exposure",
      inputMap: { monthlyIngredientCost: "paintMaterialCost", wasteRate: "coverageDriftPercent" },
      outputId: "coverageDriftCost",
    },
    {
      formulaId: "time.rework_cost",
      inputMap: { reworkHours: "prepReworkHours", laborRate: "laborRate" },
      outputId: "prepReworkCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "coverageDriftCost", b: "prepReworkCost", c: "scaffoldCost" },
      outputId: "totalExposure",
    },
    {
      formulaId: "cost.margin_pressure",
      inputMap: { excessCost: "totalExposure", monthlyRevenue: "jobRevenue" },
      outputId: "marginPressure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total painting rework exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "coverageDriftCost", label: "Coverage drift cost", unit: "$", format: "currency" },
    { id: "prepReworkCost", label: "Prep rework cost", unit: "$", format: "currency" },
    { id: "marginPressure", label: "Margin pressure", unit: "%", format: "percentage" },
  ],

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
