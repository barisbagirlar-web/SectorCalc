import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PRINTING_REPRINT_MARGIN_LEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "prin-501",
  name: "Printing Reprint Margin Leak Calculator",
  sectorSlug: "printing-signage",
  category: "scrap",
  legacyPaidSlug: "signage-bid-safe-price-tool",
  painStatement:
    "Printing and signage jobs lose profit through reprint, design revision, ink drift and installation rework.",

  inputs: [
    {
      id: "jobRevenue",
      label: "Job revenue",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 8500,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "materialCost",
      label: "Material cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 2600,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "reprintRatePercent",
      label: "Reprint rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 7,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "designRevisionHours",
      label: "Design revision hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 9,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "laborRate",
      label: "Labor rate",
      type: "number",
      unit: "USD/hour",
      required: true,
      smartDefault: 35,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "installReworkCost",
      label: "Install rework cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 750,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "loss.waste_exposure",
      inputMap: { monthlyIngredientCost: "materialCost", wasteRate: "reprintRatePercent" },
      outputId: "reprintCost",
    },
    {
      formulaId: "time.rework_cost",
      inputMap: { reworkHours: "designRevisionHours", laborRate: "laborRate" },
      outputId: "revisionCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "reprintCost", b: "revisionCost", c: "installReworkCost" },
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
      label: "Total reprint exposure",
      unit: "USD",
      format: "currency",
      isBigNumber: true,
    },
    { id: "reprintCost", label: "Reprint cost", unit: "USD", format: "currency" },
    { id: "revisionCost", label: "Revision cost", unit: "USD", format: "currency" },
    { id: "marginPressure", label: "Margin pressure", unit: "%", format: "percentage" },
  ],

  thresholds: [
    {
      fieldId: "reprintRatePercent",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Reprint rate is elevated — verify color proof and material allowance.",
      criticalMessage: "Critical reprint band — reprice before accepting similar print work.",
    },
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 12,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is building — hidden rework may compress profit.",
      criticalMessage: "Critical margin pressure — stop treating reprints as normal overhead.",
    },
  ],

  reportTemplate: {
    title: "Printing Reprint Margin Leak Decision Report",
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
      "Reprint cost = material cost × reprint rate.",
      "Revision cost = design hours × labor rate.",
      "Margin pressure = total exposure ÷ job revenue.",
    ],
  },
};
