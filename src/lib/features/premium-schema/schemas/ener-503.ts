import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

export const CBAM_EXPOSURE_QUICK_CHECK_SCHEMA: PremiumCalculatorSchema = {
  id: "ener-503",
  name: "CBAM Exposure Quick Check",
  sectorSlug: "energy-carbon",
  category: "carbon",
  painStatement:
    "Importers can underestimate CBAM certificate cost when embedded emissions, certificate price and FX are not combined.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "totalExposure",
      warning: 250000,
      critical: 500000,
      direction: "higher_is_bad",
      warningMessage: "CBAM exposure is elevated - verify certificate price and FX assumptions.",
      criticalMessage: "Critical exposure band - review embedded emissions data before shipment.",
    },
  ],

  reportTemplate: {
    title: "CBAM Exposure Quick Check Report",
    sections: ["executive_summary", "thresholds", "sensitivity", "assumptions"],
    exportFormats: ["pdf", "csv"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.05,
    volatilityPercent: 12,
    targetMarginPercent: 0,
    assumptionNotes: [
      "CBAM cost = embeddedEmissionsTon × cbamCertificatePrice × eurTryRate.",
      "Unit CBAM cost = cbamCost ÷ productQuantity.",
      "Not a CBAM compliance obligation decision - financial exposure preview only.",
    ],
  },
};
