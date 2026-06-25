import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SIGNAGE_BID_SAFE_PRICE_TOOL_SCHEMA: PremiumCalculatorSchema = {
  id: "signage-bid-safe-price-tool",
  name: "Signage Bid Safe Price Tool",
  sectorSlug: "printing-signage",
  category: "scrap",
  legacyPaidSlug: "signage-bid-safe-price-tool",
  painStatement:
    "Find minimum safe signage price with design, install, ink, RIP/proofing and reprint risk included.",

  inputs: [],

  outputs: [],

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
