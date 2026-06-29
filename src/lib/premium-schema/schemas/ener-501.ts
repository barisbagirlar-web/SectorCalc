import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CARBON_FOOTPRINT_COMPLIANCE_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-501",
  name: "Carbon Footprint Compliance Risk Calculator",
  sectorSlug: "energy-carbon",
  category: "carbon",
  legacyPaidSlug: "cbam-compliance-verdict",
  painStatement:
    "Exporters and manufacturers can underestimate carbon exposure when energy, fuel and carbon price assumptions are not connected.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "carbonExposure",
      warning: 5000,
      critical: 20000,
      direction: "higher_is_bad",
      warningMessage: "Carbon exposure is elevated — verify reporting and export assumptions.",
      criticalMessage: "Critical compliance exposure — reprice or hedge before export shipment.",
    },
  ],

  reportTemplate: {
    title: "Carbon Footprint Compliance Risk Decision Report",
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
    volatilityPercent: 25,
    targetMarginPercent: 10,
    assumptionNotes: [
      "Total emissions = energy + fuel tonnage.",
      "Carbon exposure = emissions × carbon price × exposure percent.",
      "Compliance estimates vary by jurisdiction — verify before reporting.",
    ],
  },
};
