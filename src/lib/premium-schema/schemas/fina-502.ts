import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_SCHEMA: PremiumCalculatorSchema = {
  id: "fina-502",
  name: "Döviz Pozisyonu Kur Farkı Riski (FX Exposure)",
  sectorSlug: "finance-hr",
  category: "cost",
  legacyPaidSlug: "fx-position-exchange-rate-risk-calculator",
  painStatement:
    "Beklenmedik kur şokları nedeniyle şirket bilançosundaki gizli kur farkı zararlarını (FX Exposure) önceden analiz edin.",

  inputs: [
    {
      id: "foreignAssets",
      label: "Foreign currency assets",
      type: "number",
      unit: "USD/EUR",
      required: true,
      smartDefault: 150000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "foreignLiabilities",
      label: "Foreign currency liabilities",
      type: "number",
      unit: "USD/EUR",
      required: true,
      smartDefault: 200000,
      validation: { min: 0 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "currentExchangeRate",
      label: "Current exchange rate",
      type: "number",
      unit: "Rate",
      required: true,
      smartDefault: 35.5,
      validation: { min: 0.0001, step: 0.0001 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "expectedExchangeRate",
      label: "Expected / Shock exchange rate",
      type: "number",
      unit: "Rate",
      required: true,
      smartDefault: 42.0,
      validation: { min: 0.0001, step: 0.0001 },
      helper: "Please enter a valid value.",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
    },
    {
      id: "hedgingRatio",
      label: "Hedging ratio",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 20,
      validation: { min: 0, max: 100 },
      helper: "Döviz pozisyonunun korunma (hedge) oranı",
      expertMeaning: "Parameter value complies with industrial calculation standards.",
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
      label: "Net Kur Farkı Zarar Riski (Unhedged)",
      unit: "Local",
      format: "currency",
      isBigNumber: true,
    },
    {
      id: "netPosition",
      label: "Net Döviz Pozisyonu",
      unit: "USD/EUR",
      format: "number",
    },
    {
      id: "hedgeSavings",
      label: "Hedge Sayesinde Korunan Tutar",
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
      warningMessage: "Kur farkı riskiniz uyarı seviyesinde, operasyonel hedge mekanizmalarını artırın.",
      criticalMessage: "Kritik döviz pozisyonu açığı! Kur şoku özkaynaklarınızı ciddi şekilde eritebilir, finansal türev (forward vb.) kullanın.",
    },
  ],

  reportTemplate: {
    title: "Döviz Pozisyonu Kur Şoku (FX Shock) Analiz Raporu",
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
      "Net Pozisyon = Yabancı Varlıklar - Yabancı Yükümlülükler.",
      "Kur Farkı = Net Pozisyon × (Beklenen Kur - Güncel Kur).",
      "Kısa pozisyon (borç ağırlıklı) durumunda kur artışı zarar yazar, hedge bu zararın ilgili yüzdesini sıfırlar.",
    ],
  },
};
