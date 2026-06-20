/**
 * Tool #60 — Kaizen Tasarruf Takipçisi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const KAIZEN_SAVINGS_SCHEMA: PremiumCalculatorSchema = {
  id: "kaizen-savings-tracker-analyzer", legacyPaidSlug: "kaizen-savings-tracker-analyzer",
  name: "Kaizen Tasarruf Takipçisi & ROI Analizi", sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Kaizen projelerinin hard/soft tasarrufu, ROI ve sürdürülebilirlik oranı takip edilmezse iyileştirme çabalarının etkisi ölçülemez.",
  inputs: [
    { id: "baselineCost", label: "Baz Maliyet (Önce)", type: "number", unit: "USD", required: true, smartDefault: 5.00, validation: { min: 0 }, helper: "", expertMeaning: "Baseline cost per unit" },
    { id: "actualCost", label: "Gerçek Maliyet (Sonra)", type: "number", unit: "USD", required: true, smartDefault: 4.20, validation: { min: 0 }, helper: "", expertMeaning: "Actual cost per unit after kaizen" },
    { id: "productionVolume", label: "Yıllık Üretim Hacmi", type: "number", unit: "adet", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume" },
    { id: "timeSaved", label: "Zaman Tasarrufu", type: "number", unit: "saat/yıl", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Time saved per year" },
    { id: "laborRate", label: "İşçilik Saat Ücreti", type: "number", unit: "USD/saat", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Labor hourly rate" },
    { id: "conversionFactor", label: "Dönüşüm Faktörü", type: "number", unit: "%", required: false, smartDefault: 70, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Time-to-cost conversion factor" },
    { id: "implementationCost", label: "Uygulama Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Kaizen implementation cost" },
    { id: "savingsMonth1", label: "1. Ay Tasarruf", type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "First month savings" },
    { id: "savingsMonth6", label: "6. Ay Tasarruf", type: "number", unit: "USD", required: false, smartDefault: 2500, validation: { min: 0 }, helper: "", expertMeaning: "Sixth month savings" },
    { id: "monthlySavings", label: "Aylık Ortalama Tasarruf", type: "number", unit: "USD", required: false, smartDefault: 2800, validation: { min: 0 }, helper: "", expertMeaning: "Average monthly savings" },
  ],
  outputs: [
    { id: "hardSavings", label: "Hard Tasarruf (Yıllık)", unit: "USD/yıl", format: "currency" },
    { id: "softSavings", label: "Soft Tasarruf (Yıllık)", unit: "USD/yıl", format: "currency" },
    { id: "roi", label: "Kaizen ROI", unit: "%", format: "percentage" },
    { id: "payback", label: "Geri Ödeme Süresi", unit: "ay", format: "number" },
    { id: "sustainment", label: "Sürdürülebilirlik Oranı", unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "sustainment", warning: 70, critical: 50, direction: "lower_is_bad", warningMessage: "Sürdürülebilirlik < %70 — kalıcılık sağlanamamış.", criticalMessage: "Sürdürülebilirlik < %50 — düzeltici faaliyet gerekli." }],
  formulaPipeline: [
    { formulaId: "cost.kaizen_hard_savings", inputMap: { baselineCost: "baselineCost", actualCost: "actualCost", productionVolume: "productionVolume" }, outputId: "hardSavings" },
    { formulaId: "cost.kaizen_soft_savings", inputMap: { timeSaved: "timeSaved", laborRate: "laborRate", conversionFactor: "conversionFactor" }, outputId: "softSavings" },
    { formulaId: "cost.kaizen_roi", inputMap: { hardSavings: "hardSavings", softSavings: "softSavings", implementationCost: "implementationCost" }, outputId: "roi" },
    { formulaId: "cost.kaizen_payback", inputMap: { implementationCost: "implementationCost", monthlySavings: "monthlySavings" }, outputId: "payback" },
    { formulaId: "cost.kaizen_sustainability", inputMap: { savingsMonth6: "savingsMonth6", savingsMonth1: "savingsMonth1" }, outputId: "sustainment" },
  ],
  reportTemplate: { title: "Kaizen Savings Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Hard = (Baseline-Actual)×Volume.", "Soft = TimeSaved×LabRate×Conv%.", "ROI = (Hard+Soft-ImpCost)/ImpCost×100.", "Sustain = Sav_M6/Sav_M1×100."] },
};
