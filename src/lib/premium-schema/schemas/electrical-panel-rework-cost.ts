import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ELECTRICAL_PANEL_REWORK_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "electrical-panel-rework-cost",
  name: "Electrical Panel Rework Cost Analyzer",
  sectorSlug: "electrical",
  category: "cost",
  legacyPaidSlug: "panel-shop-margin-verdict",
  painStatement:
    "Electrical contractors lose money when panel wiring, testing, inspection fail and rework hours are not priced.",

  inputs: [
    {
      id: "panelRevenue",
      label: "Panel revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 28000,
      validation: { min: 0 },
      helper: "Quoted or contract revenue for the panel job.",
      expertMeaning: "Revenue denominator for margin pressure.",
    },
    {
      id: "wiringHours",
      label: "Wiring hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 120,
      validation: { min: 0 },
      helper: "Actual wiring and terminations hours.",
      expertMeaning: "Observed labor versus estimate.",
    },
    {
      id: "estimatedHours",
      label: "Estimated hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 96,
      validation: { min: 0 },
      helper: "Original labor estimate for the panel.",
      expertMeaning: "Planned hours in the bid.",
    },
    {
      id: "laborRate",
      label: "Labor rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 48,
      validation: { min: 0 },
      helper: "Fully loaded electrician rate.",
      expertMeaning: "Hourly burden on overrun hours.",
    },
    {
      id: "inspectionFailCost",
      label: "Inspection fail cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1800,
      validation: { min: 0 },
      helper: "Re-inspection, corrections and delay cost.",
      expertMeaning: "Inspection failure stack not in base quote.",
    },
    {
      id: "testEquipmentCost",
      label: "Test equipment cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 650,
      validation: { min: 0 },
      helper: "Testing gear, labels and documentation spend.",
      expertMeaning: "Test and compliance overhead.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "time.hour_overrun_cost",
      inputMap: {
        actualHours: "wiringHours",
        plannedHours: "estimatedHours",
        hourlyCost: "laborRate",
      },
      outputId: "wiringOverrunCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "wiringOverrunCost", b: "inspectionFailCost", c: "testEquipmentCost" },
      outputId: "totalExposure",
    },
    {
      formulaId: "cost.margin_pressure",
      inputMap: { excessCost: "totalExposure", monthlyRevenue: "panelRevenue" },
      outputId: "marginPressure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total panel rework exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    { id: "wiringOverrunCost", label: "Wiring overrun cost", unit: "$", format: "currency" },
    { id: "marginPressure", label: "Margin pressure", unit: "%", format: "percentage" },
  ],

  thresholds: [
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is elevated — verify wiring and inspection assumptions.",
      criticalMessage: "Critical margin pressure — reprice panel work before accepting.",
    },
  ],

  reportTemplate: {
    title: "Electrical Panel Rework Cost Decision Report",
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
    hiddenLossMultiplier: 1.1,
    volatilityPercent: 15,
    targetMarginPercent: 20,
    assumptionNotes: [
      "Wiring overrun = max(actual − planned hours, 0) × labor rate.",
      "Total exposure sums overrun, inspection fail and test equipment.",
      "Margin pressure = total exposure ÷ panel revenue.",
    ],
  },
};
