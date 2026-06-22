import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SIX_SIGMA_PROJECT_PRIORITIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "six-sigma-project-prioritizer",
  name: "Altı Sigma Proje Seçimi ve Yatırım Önceliklendirme Hesaplayıcı",
  sectorSlug: "manufacturing",
  category: "oee",
  legacyPaidSlug: "alti-sigma-proje-secimi-ve-yatirim-onceliklendirme-calculator",
  painStatement:
    "Altı Sigma projelerinin tahmini getiri, başarı olasılığı, süre ve maliyet bazında değerlendirilerek önceliklendirilmesini sağlar.",

  inputs: [
    {
      id: "estimatedAnnualSavings",
      label: "Tahmini Yıllık Tasarruf",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 50000,
      validation: { min: 0 },
      helper: "Projenin başarıya ulaşması durumunda yıllık olarak sağlanacak finansal getiri.",
      expertMeaning: "Projected annual financial benefit from the Six Sigma project.",
    },
    {
      id: "probabilityOfSuccess",
      label: "Başarı Olasılığı",
      type: "number",
      unit: "%",
      required: true,
      smartDefault: 75,
      validation: { min: 1, max: 100 },
      helper: "Projenin hedeflerine başarıyla ulaşma ihtimali.",
      expertMeaning: "Estimated likelihood of achieving the project goals.",
    },
    {
      id: "projectDurationMonths",
      label: "Proje Süresi",
      type: "number",
      unit: "Ay",
      required: true,
      smartDefault: 6,
      validation: { min: 1 },
      helper: "Projenin tamamlanması için öngörülen süre (Ay cinsinden).",
      expertMeaning: "Time required to complete the project.",
    },
    {
      id: "resourceCost",
      label: "Kaynak Maliyeti",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 15000,
      validation: { min: 1 },
      helper: "Eğitim, donanım, personel gibi projeye harcanacak toplam kaynak maliyeti.",
      expertMeaning: "Total investment required for the project resources.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "quality.six_sigma_project_score",
      inputMap: {
        savings: "estimatedAnnualSavings",
        probability: "probabilityOfSuccess",
        duration: "projectDurationMonths",
        cost: "resourceCost",
      },
      outputId: "projectScore",
    },
  ],

  outputs: [
    {
      id: "projectScore",
      label: "Proje Öncelik Skoru",
      unit: "Puan",
      format: "number",
      isBigNumber: true,
    },
  ],

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
