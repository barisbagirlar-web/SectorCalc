import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BREAK_EVEN_SAFETY_MARGIN_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "break-even-safety-margin-calculator",
  name: "Break-Even and Safety Margin Calculator",
  sectorSlug: "finance",
  category: "cost",
  painStatement:
    "Owners often learn profit or loss only after month-end statements arrive.",

  inputs: [
    {
      id: "fixedCost",
      label: "Fixed cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 42000,
      validation: { min: 0 },
      helper: "Monthly fixed overhead for the period.",
      expertMeaning: "Rent, payroll base and fixed overhead envelope.",
    },
    {
      id: "unitPrice",
      label: "Unit price",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 85,
      validation: { min: 0.01 },
      helper: "Average selling price per unit.",
      expertMeaning: "Revenue per unit before discounts.",
    },
    {
      id: "variableCostPerUnit",
      label: "Variable cost per unit",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 52,
      validation: { min: 0 },
      helper: "Direct variable cost per unit sold.",
      expertMeaning: "Material, freight and direct labor per unit.",
    },
    {
      id: "currentVolume",
      label: "Current volume",
      type: "number",
      unit: "units",
      required: true,
      smartDefault: 1200,
      validation: { min: 0 },
      helper: "Units sold or produced in the period.",
      expertMeaning: "Actual volume used for safety margin check.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "cost.break_even_units",
      inputMap: {
        fixedCost: "fixedCost",
        unitPrice: "unitPrice",
        variableCostPerUnit: "variableCostPerUnit",
      },
      outputId: "breakEvenUnits",
    },
    {
      formulaId: "cost.safety_margin_rate",
      inputMap: { breakEvenUnits: "breakEvenUnits", currentVolume: "currentVolume" },
      outputId: "safetyMarginRate",
    },
    {
      formulaId: "cost.difference",
      inputMap: { a: "currentVolume", b: "breakEvenUnits" },
      outputId: "volumeCushionUnits",
    },
  ],

  outputs: [
    {
      id: "breakEvenUnits",
      label: "Break-even units",
      unit: "units",
      format: "number",
      isBigNumber: true,
    },
    {
      id: "safetyMarginRate",
      label: "Safety margin rate",
      unit: "%",
      format: "percentage",
    },
    {
      id: "volumeCushionUnits",
      label: "Volume cushion",
      unit: "units",
      format: "number",
    },
  ],

  thresholds: [
    {
      fieldId: "safetyMarginRate",
      warning: 10,
      critical: 0,
      direction: "lower_is_bad",
      warningMessage: "Safety margin is thin — volume drop could erase profit quickly.",
      criticalMessage: "Volume is at or below break-even — review pricing or cost stack.",
    },
  ],

  reportTemplate: {
    title: "Break-Even and Safety Margin Decision Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.02,
    volatilityPercent: 10,
    targetMarginPercent: 12,
    assumptionNotes: [
      "Break-even units = fixed cost ÷ (unit price − variable cost per unit).",
      "Safety margin = (current volume − break-even units) ÷ current volume.",
      "Informational simulation only — not financial advice.",
    ],
  },
};
