import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AUTO_REPAIR_PARTS_LABOR_QUOTE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-repair-parts-labor-quote-calculator",
  name: "Auto Repair Parts and Labor Quote Calculator",
  sectorSlug: "auto-repair",
  category: "cost",
  painStatement:
    "Repair quotes vary by technician and format, making price consistency hard.",

  inputs: [
    {
      id: "partsCost",
      label: "Parts cost",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 420,
      validation: { min: 0 },
      helper: "Wholesale parts cost for the repair order.",
      expertMeaning: "Direct parts envelope before markup.",
    },
    {
      id: "laborHours",
      label: "Labor hours",
      type: "number",
      unit: "hours",
      required: true,
      smartDefault: 2.5,
      validation: { min: 0 },
      helper: "Book time or estimated labor hours.",
      expertMeaning: "Flat-rate or actual labor time on the job.",
    },
    {
      id: "laborRate",
      label: "Labor rate",
      type: "number",
      unit: "USD/h",
      required: true,
      smartDefault: 68,
      validation: { min: 0 },
      helper: "Shop labor rate charged to customer.",
      expertMeaning: "Loaded technician hourly rate.",
    },
    {
      id: "shopSuppliesPercent",
      label: "Shop supplies percent",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 8,
      validation: { min: 0, max: 50 },
      helper: "Shop supplies and consumables on parts subtotal.",
      expertMeaning: "Fluids, fasteners and shop supply load.",
    },
    {
      id: "targetMarginRate",
      label: "Target margin rate",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 22,
      validation: { min: 1, max: 90 },
      helper: "Target gross margin on the quoted price.",
      expertMeaning: "Margin objective for customer quote.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "time.labor_cost",
      inputMap: { hourlyCost: "laborRate", lossHours: "laborHours" },
      outputId: "laborLineCost",
    },
    {
      formulaId: "cost.percent_of_amount",
      inputMap: { amount: "partsCost", percent: "shopSuppliesPercent" },
      outputId: "suppliesCost",
    },
    {
      formulaId: "cost.total_exposure",
      inputMap: { a: "partsCost", b: "laborLineCost", c: "suppliesCost" },
      outputId: "directSubtotal",
    },
    {
      formulaId: "cost.quote_target_price",
      inputMap: { totalCost: "directSubtotal", targetMarginPercent: "targetMarginRate" },
      outputId: "quotePrice",
    },
    {
      formulaId: "cost.margin_rate_on_price",
      inputMap: { price: "quotePrice", cost: "directSubtotal" },
      outputId: "grossMarginRate",
    },
  ],

  outputs: [
    {
      id: "quotePrice",
      label: "Customer quote price",
      unit: "$",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "directSubtotal",
      label: "Direct subtotal",
      unit: "$",
      format: "currency",
    },
    {
      id: "laborLineCost",
      label: "Labor line cost",
      unit: "$",
      format: "currency",
    },
    {
      id: "grossMarginRate",
      label: "Gross margin rate",
      unit: "%",
      format: "percentage",
    },
  ],

  thresholds: [
    {
      fieldId: "grossMarginRate",
      warning: 15,
      critical: 8,
      direction: "lower_is_bad",
      warningMessage: "Quote margin is below typical shop band — review parts markup and labor time.",
      criticalMessage: "Margin is critically thin — reprice before issuing the quote.",
    },
  ],

  reportTemplate: {
    title: "Auto Repair Quote Decision Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.04,
    volatilityPercent: 8,
    targetMarginPercent: 22,
    assumptionNotes: [
      "Labor line = labor hours × labor rate.",
      "Shop supplies = parts cost × supplies percent.",
      "Quote price = direct subtotal ÷ (1 − target margin rate).",
    ],
  },
};
