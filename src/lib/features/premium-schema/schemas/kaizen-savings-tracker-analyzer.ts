/**
 * Tool #60 — Kaizen Tasarruf Takipçisi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const KAIZEN_SAVINGS_SCHEMA: PremiumCalculatorSchema = {
  id: "kaizen-savings-tracker-analyzer", legacyPaidSlug: "kaizen-savings-tracker-analyzer",
  name: "Kaizen Savings Tracker & ROI Analyzer", name_i18n: {"en":"Kaizen Savings Tracker & ROI Analyzer"}, sectorSlug: "cnc-manufacturing", category: "cost",
  painStatement: "Kaizen projelerinin hard/soft tasarrufu, ROI ve sürdürülebilirlik oranı takip edilmezse iyileştirme çabalarının etkisi ölçülemez.", painStatement_i18n: {"en":"Kaizen projelerinin hard/soft tasarrufu, ROI ve sürdürülebilirlik rate tracking edilmezse improvement çabalarının etkisi ölçülemez."},
  inputs: [
    { id: "baselineCost", label: "Baz Maliyet (Önce)", label_i18n: {"en":"Baseline cost per unit"}, type: "number", unit: "USD", required: true, smartDefault: 5.00, validation: { min: 0 }, helper: "", expertMeaning: "Baseline cost per unit", expertMeaning_i18n: {"en":"Baseline cost per unit"} },
    { id: "actualCost", label: "Actual cost per unit after kaizen", label_i18n: {"en":"Actual cost per unit after kaizen"}, type: "number", unit: "USD", required: true, smartDefault: 4.20, validation: { min: 0 }, helper: "", expertMeaning: "Actual cost per unit after kaizen", expertMeaning_i18n: {"en":"Actual cost per unit after kaizen"} },
    { id: "productionVolume", label: "Annual production volume", label_i18n: {"en":"Annual production volume"}, type: "number", unit: "adet", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Annual production volume", expertMeaning_i18n: {"en":"Annual production volume"} },
    { id: "timeSaved", label: "Zaman Tasarrufu", label_i18n: {"en":"Zaman Tasarrufu"}, type: "number", unit: "saat/yıl", required: false, smartDefault: 200, validation: { min: 0 }, helper: "", expertMeaning: "Time saved per year", expertMeaning_i18n: {"en":"Time saved per year"} },
    { id: "laborRate", label: "Labor hourly rate", label_i18n: {"en":"Labor hourly rate"}, type: "number", unit: "USD/saat", required: false, smartDefault: 25, validation: { min: 0 }, helper: "", expertMeaning: "Labor hourly rate", expertMeaning_i18n: {"en":"Labor hourly rate"} },
    { id: "conversionFactor", label: "Time-to-cost conversion factor", label_i18n: {"en":"Time-to-cost conversion factor"}, type: "number", unit: "%", required: false, smartDefault: 70, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Time-to-cost conversion factor", expertMeaning_i18n: {"en":"Time-to-cost conversion factor"} },
    { id: "implementationCost", label: "Uygulama Maliyeti", label_i18n: {"en":"application Cost"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Kaizen implementation cost", expertMeaning_i18n: {"en":"Kaizen implementation cost"} },
    { id: "savingsMonth1", label: "1. Ay Tasarruf", label_i18n: {"en":"1. Ay Tasarruf"}, type: "number", unit: "USD", required: false, smartDefault: 3000, validation: { min: 0 }, helper: "", expertMeaning: "First month savings", expertMeaning_i18n: {"en":"First month savings"} },
    { id: "savingsMonth6", label: "6. Ay Tasarruf", label_i18n: {"en":"6. Ay Tasarruf"}, type: "number", unit: "USD", required: false, smartDefault: 2500, validation: { min: 0 }, helper: "", expertMeaning: "Sixth month savings", expertMeaning_i18n: {"en":"Sixth month savings"} },
    { id: "monthlySavings", label: "Average monthly savings", label_i18n: {"en":"Average monthly savings"}, type: "number", unit: "USD", required: false, smartDefault: 2800, validation: { min: 0 }, helper: "", expertMeaning: "Average monthly savings", expertMeaning_i18n: {"en":"Average monthly savings"} },
  ],
  outputs: [
    { id: "hardSavings", label: "Hard Tasarruf (Yllk)", label_i18n: {"en":"Hard Tasarruf (Annual)"}, unit: "USD/yıl", format: "currency" },
    { id: "softSavings", label: "Soft Tasarruf (Yllk)", label_i18n: {"en":"Soft Tasarruf (Annual)"}, unit: "USD/yıl", format: "currency" },
    { id: "roi", label: "Kaizen ROI", label_i18n: {"en":"Kaizen ROI"}, unit: "%", format: "percentage" },
    { id: "payback", label: "Geri Ödeme Süresi", label_i18n: {"en":"Payback Period"}, unit: "ay", format: "number" },
    { id: "sustainment", label: "Surdurulebilirlik Oran", label_i18n: {"en":"Surdurulebilirlik Rate"}, unit: "%", format: "percentage", isBigNumber: true },
  ],
  thresholds: [{ fieldId: "sustainment", warning: 70, critical: 50, direction: "lower_is_bad", warningMessage: "Sürdürülebilirlik < %70 — kalıcılık sağlanamamış.", warningMessage_i18n: {"en":"Sürdürülebilirlik < %70 — kalıcılık sağlanamamış."}, criticalMessage: "Sürdürülebilirlik < %50 — düzeltici faaliyet gerekli.", criticalMessage_i18n: {"en":"Sürdürülebilirlik < %50 — corrective activity gerekli."} }],
  formulaPipeline: [
    { formulaId: "cost.kaizen_hard_savings", inputMap: {
        baseline: "baselineCost",
        actual: "actualCost",
        volume: "productionVolume"
      }, outputId: "hardSavings" },
    { formulaId: "cost.kaizen_soft_savings", inputMap: {
        timeSaved: "timeSaved",
        labRate: "laborRate",
        conv: "conversionFactor"
      }, outputId: "softSavings" },
    { formulaId: "cost.kaizen_roi", inputMap: {
        hardSav: "hardSavings",
        softSav: "softSavings",
        impCost: "implementationCost"
      }, outputId: "roi" },
    { formulaId: "cost.kaizen_payback", inputMap: {
        impCost: "implementationCost",
        monthSav: "monthlySavings"
      }, outputId: "payback" },
    { formulaId: "cost.kaizen_sustainability", inputMap: {
        savM6: "savingsMonth6",
        savM1: "savingsMonth1"
      }, outputId: "sustainment" },
  ],
  reportTemplate: { title: "Kaizen Savings Report", title_i18n: {"en":"Kaizen Savings Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["Hard = (Baseline-Actual)×Volume.", "Soft = TimeSaved×LabRate×Conv%.", "ROI = (Hard+Soft-ImpCost)/ImpCost×100.", "Sustain = Sav_M6/Sav_M1×100."],assumptionNotes_i18n:[{"en":"Hard = (Baseline-Actual)×Volume."},{"en":"Soft = TimeSaved×LabRate×Conv%."},{"en":"ROI = (Hard+Soft-ImpCost)/ImpCost×100."},{"en":"Sustain = Sav_M6/Sav_M1×100."}] },
};
