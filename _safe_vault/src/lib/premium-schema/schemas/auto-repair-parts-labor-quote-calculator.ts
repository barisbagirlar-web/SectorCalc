import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AUTO_REPAIR_PARTS_LABOR_QUOTE_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "auto-repair-parts-labor-quote-calculator",
  name: "Auto Repair Parts and Labor Quote Calculator",
  sectorSlug: "auto-repair",
  category: "cost",
  painStatement:
    "Repair quotes vary by technician and format, making price consistency hard.",

  inputs: [],

  outputs: [],

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
