import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SIX_SIGMA_PROJECT_PRIORITIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "mfg-513",
  name: "Altı Sigma Proje Seçimi ve Yatırım Önceliklendirme Hesaplayıcı",
  sectorSlug: "manufacturing",
  category: "oee",
  legacyPaidSlug: "alti-sigma-proje-secimi-ve-yatirim-onceliklendirme-calculator",
  painStatement:
    "Altı Sigma projelerinin tahmini getiri, başarı olasılığı, süre ve maliyet bazında değerlendirilerek önceliklendirilmesini sağlar.",

  inputs: [],

  outputs: [],

  thresholds: [
    {
      fieldId: "projectScore",
      warning: 20,
      critical: 10,
      direction: "lower_is_bad",
      warningMessage: "Proje skoru düşük. Yüksek maliyetli veya uzun süreli projeler yerine hızlı kazanımlara (quick wins) odaklanabilirsiniz.",
      criticalMessage: "Kritik derecede düşük skor! Projenin maliyeti ve süresi, beklenen getiriye kıyasla çok yüksek. Proje kapsamını daraltın veya iptal edin.",
    },
  ],

  reportTemplate: {
    title: "Altı Sigma Proje Önceliklendirme Raporu",
    sections: [
      "executive_summary",
      "thresholds",
      "action_plan",
      "assumptions",
    ],
    exportFormats: ["pdf"],
  },

  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 0,
    targetMarginPercent: 0,
    assumptionNotes: [
      "Skor = (Tahmini Yıllık Tasarruf × Başarı Olasılığı) / (Süre × Kaynak Maliyeti).",
      "Başarı olasılığı % olarak girilir ancak hesaplamada ondalık (örn: 0.75) olarak kullanılır.",
      "Yüksek skor, projenin daha yüksek öncelikli olduğunu gösterir.",
    ],
  },
};
