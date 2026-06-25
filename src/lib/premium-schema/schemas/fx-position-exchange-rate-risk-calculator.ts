import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_SCHEMA: PremiumCalculatorSchema = {
  id: "fx-position-exchange-rate-risk-calculator",
  name: "FX Position Exchange Rate Risk",
  sectorSlug: "finance-hr",
  category: "cost",
  legacyPaidSlug: "fx-position-exchange-rate-risk-calculator",
  painStatement:
    "Analyze hidden exchange rate losses (FX Exposure) on the company balance sheet in advance due to unexpected currency shocks.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "fxLossExposure",
      warning: 100000,
      critical: 500000,
      direction: "higher_is_bad",
      warningMessage: "Your exchange rate risk is at a warning level, increase operational hedging mechanisms.",
      criticalMessage: "Critical foreign exchange position deficit! A currency shock can severely deplete your equity, use financial derivatives (forward etc.).",
    },
  ],

  reportTemplate: {
    title: "FX Shock Analysis Report",
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
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 15,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Net Position = Foreign Assets - Foreign Liabilities.",
      "Exchange Rate Difference = Net Position × (Expected Rate - Current Rate).",
      "In case of a short position (debt-heavy), exchange rate increases result in losses, hedging neutralizes the corresponding percentage of this loss.",
    ],
  },
};
