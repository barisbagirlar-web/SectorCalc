import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SHEET_METAL_QUOTE_RISK_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "shee-502",
  name: "Sheet Metal Quote Risk Tool",
  sectorSlug: "sheet-metal",
  category: "scrap",
  legacyPaidSlug: "sheet-metal-quote-risk-tool",
  painStatement:
    "Find safe sheet metal quote with programming, setup, scrap, bend labor and finishing included.",

  inputs: [
    {
      id: "materialCost",
      label: "Material cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 9500,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "scrapRate",
      label: "Scrap rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "targetScrapRate",
      label: "Target scrap rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 3,
      validation: { min: 0, max: 100 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "reworkHours",
      label: "Rework hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 14,
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
      smartDefault: 38,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "finishingCost",
      label: "Finishing cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1200,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "loss.excess_waste_cost",
      inputMap: {
        monthlyIngredientCost: "materialCost",
        wasteRate: "scrapRate",
        targetWasteRate: "targetScrapRate",
      },
      outputId: "excessScrapCost",
    },
    {
      formulaId: "time.rework_cost",
      inputMap: {
        reworkHours: "reworkHours",
        laborRate: "laborRate",
      },
      outputId: "reworkCost",
    },
    {
      formulaId: "cost.value",
      inputMap: { value: "finishingCost" },
      outputId: "finishingCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: {
        a: "excessScrapCost",
        b: "reworkCost",
        c: "finishingCost",
      },
      outputId: "totalExposure",
    },
  ],

  outputs: [
    {
      id: "totalExposure",
      label: "Total scrap exposure",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "excessScrapCost",
      label: "Excess scrap cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "reworkCost",
      label: "Rework cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "finishingCost",
      label: "Finishing cost",
      unit: "$",
      format: "currency",
    },
  ],

  thresholds: [
    {
      fieldId: "scrapRate",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage:
        "Scrap rate is above target — nesting or bend tolerance may be eroding quote margin.",
      criticalMessage:
        "Critical scrap band — reprice material and rework before accepting similar fabrication.",
    },
    {
      fieldId: "reworkHours",
      warning: 8,
      critical: 20,
      direction: "higher_is_bad",
      warningMessage: "Rework hours are elevated — verify setup and bend sequence assumptions.",
      criticalMessage:
        "Rework exposure is critical — stop treating bend errors as normal shop time.",
    },
  ],

  reportTemplate: {
    title: "Sheet Metal Scrap Risk Decision Report",
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
    hiddenLossMultiplier: 1.08,
    volatilityPercent: 14,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Excess scrap = max(scrap rate − target, 0) applied to material cost.",
      "Rework cost = rework hours × labor rate.",
      "Total exposure sums excess scrap, rework and finishing cost.",
    ],
  },
};
