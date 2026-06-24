import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const GURULTU_VE_TITRESIM_MARUZIYET_RISK_MALIYET_CALCULATOR_SCHEMA: PremiumCalculatorSchema = {
  id: "gurultu-ve-titresim-maruziyet-risk-maliyet-calculator",
  name: "Gürültü ve Titreşim Maruziyet Risk Maliyet Hesaplayıcı",
  sectorSlug: "hse-ergonomics",
  category: "measurement",
  legacyPaidSlug: "gurultu-ve-titresim-maruziyet-risk-maliyet-calculator",
  painStatement:
    "Yüksek gürültü seviyesinin çalışan verimliliği ve sağlık maliyetine etkisi ölçülemez.",

  inputs: [
    {
      id: "soundLevelDb",
      label: "Gürültü Seviyesi",
      type: "number",
      unit: "dB",
      required: true,
      smartDefault: 85,
      validation: { min: 40, max: 140 },
      helper: "Çalışma ortamındaki ortalama gürültü seviyesi.",
      expertMeaning: "Decibel rating of the industrial zone.",
    },
    {
      id: "exposureDuration",
      label: "Günlük Maruziyet Süresi",
      type: "number",
      unit: "saat",
      required: true,
      smartDefault: 8,
      validation: { min: 0.1, max: 24 },
      helper: "Çalışanın gürültülü ortama maruz kaldığı süre.",
      expertMeaning: "Total hours exposed per shift.",
    },
    {
      id: "hearingLossCost",
      label: "İşitme Kaybı & Sağlık Maliyeti",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 1200,
      validation: { min: 0 },
      helper: "İşitme kaybı tedavisi ve tazminat risk payı maliyeti.",
      expertMeaning: "Hearing damage and insurance risk liability.",
    },
    {
      id: "efficiencyLossCost",
      label: "Verimlilik Kaybı Maliyeti",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 800,
      validation: { min: 0 },
      helper: "Gürültüye bağlı dikkat dağınıklığı kaynaklı verim kaybı.",
      expertMeaning: "Productivity drop due to noise fatigue.",
    },
    {
      id: "errorRateCost",
      label: "Hata ve Kaza Maliyeti",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 450,
      validation: { min: 0 },
      helper: "Konsantrasyon kaybından doğan hata ve kaza maliyeti.",
      expertMeaning: "Operational errors and safety hazard cost.",
    },
    {
      id: "ppeCost",
      label: "KKD & Önlem Maliyeti",
      type: "number",
      unit: "USD",
      required: true,
      smartDefault: 150,
      validation: { min: 0 },
      helper: "Kişisel koruyucu donanım (kulaklık vb.) maliyeti.",
      expertMeaning: "Personal protective equipment acquisition.",
    },
  ],

  formulaPipeline: [
    {
      formulaId: "measurement.noise_exposure",
      formulaFamily: "measurement",
      inputMap: { soundLevelDb: "soundLevelDb", exposureDuration: "exposureDuration" },
      outputId: "noiseExposureIndex",
    },
    {
      formulaId: "cost.sum4",
      formulaFamily: "cost",
      inputMap: { a: "hearingLossCost", b: "efficiencyLossCost", c: "errorRateCost", d: "ppeCost" },
      outputId: "totalNoiseCost",
    },
  ],

  outputs: [
    {
      id: "noiseExposureIndex",
      label: "Gürültü Maruziyet Endeksi",
      unit: "dB-saat",
      format: "number",
      isBigNumber: true,
    },
    { id: "totalNoiseCost", label: "Toplam Gürültü & Risk Maliyeti", unit: "USD", format: "currency" },
  ],

  thresholds: [
    {
      fieldId: "noiseExposureIndex",
      warning: 680,
      critical: 720,
      direction: "higher_is_bad",
      warningMessage: "Maruziyet seviyesi sınıra yakın. KKD kullanımı ve rotasyon önerilir.",
      criticalMessage: "Kritik gürültü maruziyeti! Acil mühendislik kontrolü ve kulak koruması gerekir.",
    },
  ],

  reportTemplate: {
    title: "Gürültü ve Titreşim Maruziyet Risk Analiz Raporu",
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
    hiddenLossMultiplier: 1.15,
    volatilityPercent: 20,
    targetMarginPercent: 10,
    assumptionNotes: [
      "Maruziyet = Gürültü Seviyesi (dB) × Süre.",
      "Risk Maliyeti = İşitme Kaybı + Verim Düşüşü + Hata + KKD.",
      "Outputs are technical HSE simulations based on standard guidelines.",
    ],
  },
};
