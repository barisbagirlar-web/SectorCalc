import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HVAC_PROJECT_MARGIN_GUARD_SCHEMA: PremiumCalculatorSchema = {
  id: "hvac-502",
  name: "HVAC Project Margin Guard",
  sectorSlug: "hvac",
  category: "cost",
  legacyPaidSlug: "hvac-project-margin-guard",
  painStatement:
    "Find minimum HVAC project price with equipment, ductwork, callback and commissioning risk included.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "callbackRiskPercent",
      warning: 3,
      critical: 7,
      direction: "higher_is_bad",
      warningMessage: "Callback risk is elevated — verify commissioning and duct assumptions.",
      criticalMessage: "Critical callback exposure — reprice before accepting similar HVAC work.",
    },
    {
      fieldId: "marginPressure",
      warning: 5,
      critical: 10,
      direction: "higher_is_bad",
      warningMessage: "Margin pressure is building on this project envelope.",
      criticalMessage: "Critical margin pressure — hidden callback cost may erase profit.",
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
