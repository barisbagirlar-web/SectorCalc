import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const DOVIZ_POZISYONU_KUR_FARKI_RISKI_HESABI_SCHEMA: PremiumCalculatorSchema = {
  id: "fina-502",
  name: "Döviz Pozisyonu Kur Farkı Riski (FX Exposure)",
  sectorSlug: "finance-hr",
  category: "cost",
  legacyPaidSlug: "fx-position-exchange-rate-risk-calculator",
  painStatement:
    "Beklenmedik kur şokları nedeniyle şirket bilançosundaki gizli kur farkı zararlarını (FX Exposure) önceden analiz edin.",

  inputs: [],

  outputs: [],

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
