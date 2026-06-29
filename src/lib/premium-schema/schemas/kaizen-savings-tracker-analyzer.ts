/**
 * Tool #60 — Kaizen Tasarruf Takipçisi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const KAIZEN_SAVINGS_SCHEMA: PremiumCalculatorSchema = {
  id: "kaizen-savings-tracker-analyzer", legacyPaidSlug: "kaizen-savings-tracker-analyzer",
  name: "Kaizen Tasarruf Takipçisi & ROI Analizi", name_i18n: {"en":"Kaizen Savings Tracker & ROI Analysis","tr":"Kaizen Tasarruf Takipçisi & ROI Analizi"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Kaizen projelerinin hard/soft tasarrufu, ROI ve sürdürülebilirlik oranı takip edilmezse iyileştirme çabalarının etkisi ölçülemez.", painStatement_i18n: {"en":"Without tracking hard/soft savings, ROI, and sustainment rates of Kaizen projects, the impact of improvement efforts cannot be measured.","tr":"Kaizen projelerinin hard/soft tasarrufu, ROI ve sürdürülebilirlik oranı takip edilmezse iyileştirme çabalarının etkisi ölçülemez."},
  inputs: [
    { id: "baselineCost", label: "Baz Maliyet (Önce)", label_i18n: {"en":"Baseline cost per unit","tr":"Baz Maliyet (Önce)"}, type: "number", unit: "USD", required: true, smartDefault: 5.00, validation: { min: 0 }, helper: "", expertMeaning: "Baseline cost per unit", expertMeaning_i18n: {"en":"Baseline cost per unit","tr":"Baz Maliyet (Önce)"} },
    { id: "actualCost", label: "Gerçek Maliyet (Sonra)", label_i18n: {"en":"Actual cost per unit after kaizen","tr":"Gerçek Maliyet (Sonra)"}, type: "number", unit: "USD", required: true, smartDefault: 4.20, validation: { min: 0 }, helper: "", expertMeaning: "Actual cost per unit after kaizen", expertMeaning_i18n: {"en":"Actual cost per unit after kaizen","tr":"Gerçek Maliyet (Sonra)"} },
    { id: "productionVolume", label: "Yıllık Üretim Hacmi", label_i18n: {"en":"Annual production volume","tr":"Yıllık Üretim Hacmi"}, type: "number", unit: "adet", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume","tr":"Yıllık Üretim Hacmi"} },
    { id: "timeSaved", label: "Zaman Tasarrufu", label_i18n: {"en":"Time saved per year","tr":"Zaman Tasarrufu"}, type: "number", unit: "saat/yıl", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Time saved per year", expertMeaning_i18n: {"en":"Time saved per year","tr":"Zaman Tasarrufu"} },
    { id: "laborRate", label: "İşçilik Saat Ücreti", label_i18n: {"en":"Labor hourly rate","tr":"İşçilik Saat Ücreti"}, type: "number", unit: "USD/saat", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Labor hourly rate", expertMeaning_i18n: {"en":"Labor hourly rate","tr":"İşçilik Saat Ücreti"} },
    { id: "conversionFactor", label: "Dönüşüm Faktörü", label_i18n: {"en":"Time-to-cost conversion factor","tr":"Dönüşüm Faktörü"}, type: "number", unit: "%", required: false, smartDefault: 70, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Time-to-cost conversion factor", expertMeaning_i18n: {"en":"Time-to-cost conversion factor","tr":"Dönüşüm Faktörü"} },
    { id: "implementationCost", label: "Uygulama Maliyeti", label_i18n: {"en":"Kaizen implementation cost","tr":"Uygulama Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Kaizen implementation cost", expertMeaning_i18n: {"en":"Kaizen implementation cost","tr":"Uygulama Maliyeti"} },
    { id: "savingsMonth1", label: "1. Ay Tasarruf", label_i18n: {"en":"First month savings","tr":"1. Ay Tasarruf"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "First month savings", expertMeaning_i18n: {"en":"First month savings","tr":"1. Ay Tasarruf"} },
    { id: "savingsMonth6", label: "6. Ay Tasarruf", label_i18n: {"en":"Sixth month savings","tr":"6. Ay Tasarruf"}, type: "number", unit: "USD", required: false, smartDefault: 2500, validation: { min: 0 }, helper: "", expertMeaning: "Sixth month savings", expertMeaning_i18n: {"en":"Sixth month savings","tr":"6. Ay Tasarruf"} },
    { id: "monthlySavings", label: "Aylık Ortalama Tasarruf", label_i18n: {"en":"Average monthly savings","tr":"Aylık Ortalama Tasarruf"}, type: "number", unit: "USD", required: false, smartDefault: 2800, validation: { min: 0 }, helper: "", expertMeaning: "Average monthly savings", expertMeaning_i18n: {"en":"Average monthly savings","tr":"Aylık Ortalama Tasarruf"} },
  ],
  outputs:  [
    { id: "hardSavings", label: "Hard Tasarruf (Yıllık)", label_i18n: {"en":"Hard Savings (Annual)","tr":"Hard Tasarruf (Yıllık)"}, unit: "USD/yıl", format: "currency" },
    { id: "softSavings", label: "Soft Tasarruf (Yıllık)", label_i18n: {"en":"Soft Savings (Annual)","tr":"Soft Tasarruf (Yıllık)"}, unit: "USD/yıl", format: "currency" },
    { id: "roi", label: "Kaizen ROI", label_i18n: {"en":"Kaizen ROI","tr":"Kaizen ROI"}, unit: "%", format: "percentage" },
    { id: "payback", label: "Geri Ödeme Süresi", label_i18n: {"en":"Payback Period","tr":"Geri Ödeme Süresi"}, unit: "ay", format: "number" },
    { id: "sustainment", label: "Sürdürülebilirlik Oranı", label_i18n: {"en":"Sustainment Rate","tr":"Sürdürülebilirlik Oranı"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "sustainment", warning: 70, critical: 50, direction: "lower_is_bad", warningMessage: "Sürdürülebilirlik < %70 — kalıcılık sağlanamamış.", warningMessage_i18n: {"en":"Sustainment < 70% — permanence not achieved.","tr":"Sürdürülebilirlik < %70 — kalıcılık sağlanamamış."}, criticalMessage: "Sürdürülebilirlik < %50 — düzeltici faaliyet gerekli.", criticalMessage_i18n: {"en":"Sustainment < 50% — corrective action required.","tr":"Sürdürülebilirlik < %50 — düzeltici faaliyet gerekli."} }],
  formulaPipeline: [
    { formulaId: "cost.kaizen_hard_savings", inputMap: { baselineCost: "baselineCost", actualCost: "actualCost", productionVolume: "productionVolume" }, outputId: "hardSavings" },
    { formulaId: "cost.kaizen_soft_savings", inputMap: { timeSaved: "timeSaved", laborRate: "laborRate", conversionFactor: "conversionFactor" }, outputId: "softSavings" },
    { formulaId: "cost.kaizen_roi", inputMap: { hardSavings: "hardSavings", softSavings: "softSavings", implementationCost: "implementationCost" }, outputId: "roi" },
    { formulaId: "cost.kaizen_payback", inputMap: { implementationCost: "implementationCost", monthlySavings: "monthlySavings" }, outputId: "payback" },
    { formulaId: "cost.kaizen_sustainability", inputMap: { savingsMonth6: "savingsMonth6", savingsMonth1: "savingsMonth1" }, outputId: "sustainment" },
  ],
  reportTemplate: { title: "Kaizen Savings Report", title_i18n: {"en":"Kaizen Savings Report","tr":"Kaizen Savings Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Hard = (Baseline-Actual)×Volume.", "Soft = TimeSaved×LabRate×Conv%.", "ROI = (Hard+Soft-ImpCost)/ImpCost×100.", "Sustain = Sav_M6/Sav_M1×100."],assumptionNotes_i18n:[{"en":"Hard = (Baseline-Actual)×Volume.","tr":"Hard = (Baseline-Actual)×Volume."},{"en":"Soft = TimeSaved×LabRate×Conv%.","tr":"Soft = TimeSaved×LabRate×Conv%."},{"en":"ROI = (Hard+Soft-ImpCost)/ImpCost×100.","tr":"ROI = (Hard+Soft-ImpCost)/ImpCost×100."},{"en":"Sustain = Sav_M6/Sav_M1×100.","tr":"Sustain = Sav_M6/Sav_M1×100."}] },
};
