import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_SCHEMA: PremiumCalculatorSchema = {
  id: "fina-502",
  name: "FX Position Exchange Rate Risk (FX Exposure)",
  sectorSlug: "finance-hr",
  category: "cost",
  legacyPaidSlug: "fx-position-exchange-rate-risk-calculator",
  painStatement:
    "Analyze hidden FX losses in your company balance sheet caused by unexpected currency shocks.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "fxLossExposure",
      warning: 100000,
      critical: 500000,
      direction: "higher_is_bad",
      warningMessage: "Your FX risk is at a warning level. Increase operational hedging mechanisms.",
      criticalMessage: "Critical FX position gap! Currency shock could severely erode your equity. Use financial derivatives (forwards, etc.).",
    },
  ],

  reportTemplate: {
    title: "FX Position Currency Shock (FX Shock) Analysis Report",
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
      "FX Loss = Net Position × (Expected Rate - Current Rate).",
      "In a short position (liability-heavy), rate increases cause losses; hedging offsets the corresponding percentage of this loss.",
    ],
  },
};
