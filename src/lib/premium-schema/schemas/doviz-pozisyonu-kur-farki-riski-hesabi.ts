import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_SCHEMA: PremiumCalculatorSchema = {
  id: "doviz-pozisyonu-kur-farki-riski-hesabi",
  name: "FX Position Exchange Rate Risk (FX Exposure)",
  sectorSlug: "finance-hr",
  category: "cost",
  legacyPaidSlug: "doviz-pozisyonu-kur-farki-riski-hesabi",
  painStatement:
    "Analyze hidden FX losses in your company balance sheet caused by unexpected currency shocks.",

  inputs: [
    {
      id: "foreignAssets",
      label: "Foreign currency assets",
      type: "number",
      unit: "USD/EUR",
      required: true,
      smartDefault: 150000,
      validation: { min: 0 },
      helper: "Your foreign-currency denominated assets (Cash, Receivables, etc.)",
      expertMeaning: "Total value of liquid and non-liquid foreign denominated assets.",
    },
    {
      id: "foreignLiabilities",
      label: "Foreign currency liabilities",
      type: "number",
      unit: "USD/EUR",
      required: true,
      smartDefault: 200000,
      validation: { min: 0 },
      helper: "Your foreign-currency denominated liabilities (Debts, Payables, etc.)",
      expertMeaning: "Total value of foreign denominated debts and payables.",
    },
    {
      id: "currentExchangeRate",
      label: "Current exchange rate",
      type: "number",
      unit: "Rate",
      required: true,
      smartDefault: 35.5,
      validation: { min: 0.0001, step: 0.0001 },
      helper: "Current exchange rate (e.g., 1 USD = 35.50 TRY)",
      expertMeaning: "Spot exchange rate applied to translation.",
    },
    {
      id: "expectedExchangeRate",
      label: "Expected / Shock exchange rate",
      type: "number",
      unit: "Rate",
      required: true,
      smartDefault: 42.0,
      validation: { min: 0.0001, step: 0.0001 },
      helper: "Expected or shock exchange rate for stress testing",
      expertMeaning: "Stressed or forward exchange rate for scenario analysis.",
    },
    {
      id: "hedgingRatio",
      label: "Hedging ratio",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100 },
      helper: "Foreign exchange position hedging ratio",
      expertMeaning: "Percentage of the net exposure covered by financial derivatives (forwards/options).",
    }
  ],

  formulaPipeline: [
    {
      formulaId: "finance.net_position",
      inputMap: {
        assets: "foreignAssets",
        liabilities: "foreignLiabilities",
      },
      outputId: "netPosition",
    },
    {
      formulaId: "finance.fx_exposure_loss",
      inputMap: {
        netPosition: "netPosition",
        currentRate: "currentExchangeRate",
        shockRate: "expectedExchangeRate",
        hedgeRatio: "hedgingRatio",
      },
      outputId: "fxLossExposure",
    },
    {
      formulaId: "finance.hedge_savings",
      inputMap: {
        netPosition: "netPosition",
        currentRate: "currentExchangeRate",
        shockRate: "expectedExchangeRate",
        hedgeRatio: "hedgingRatio",
      },
      outputId: "hedgeSavings",
    }
  ],

  outputs: [
    {
      id: "fxLossExposure",
      label: "Net FX Loss Risk (Unhedged)",
      unit: "Local",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "netPosition",
      label: "Net FX Position",
      unit: "USD/EUR",
      format: "number",
    },
    {
      id: "hedgeSavings",
      label: "Amount Protected by Hedge",
      unit: "Local",
      format: "currency",
    },
  ],

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
