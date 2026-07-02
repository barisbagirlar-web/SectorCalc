import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const HVAC_CALLBACK_MARGIN_RISK_SCHEMA: PremiumCalculatorSchema = {
  id: "hvac-501",
  name: "HVAC Callback Margin Risk Calculator",
  sectorSlug: "hvac",
  category: "cost",
  legacyPaidSlug: "hvac-project-margin-guard",
  painStatement:
    "HVAC projects lose margin when ductwork drift, commissioning time and call-back risk are not priced.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "callbackRiskPercent",
      warning: 3,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage: "Callback risk is elevated - verify commissioning and duct assumptions.",
      criticalMessage: "Critical callback exposure - reprice before accepting similar HVAC work.",
    },
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is building on this project envelope.",
      criticalMessage: "Critical margin pressure - hidden callback cost may erase profit.",
    },
  ],

  reportTemplate: {
    title: "HVAC Callback Margin Risk Decision Report",
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
    hiddenLossMultiplier: 1.11,
    volatilityPercent: 17,
    targetMarginPercent: 18,
    assumptionNotes: [
      "Commissioning cost = commissioning hours × labor rate.",
      "Callback risk = project revenue × callback risk percent.",
      "Margin pressure = total exposure ÷ project revenue.",
    ],
  },
};
