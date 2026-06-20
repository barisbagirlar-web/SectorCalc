/**
 * Tool #2 — Six Sigma Project Prioritizer
 * DPMO → Yield → Z_bench → SigmaLevel → COPQ → ProjectScore
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SIX_SIGMA_PRIORITIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "six-sigma-project-prioritizer", legacyPaidSlug: "six-sigma-project-prioritizer",
  name: "Altı Sigma Proje Önceliklendirici", sectorSlug: "sheet-metal", category: "scrap",
  painStatement: "Six Sigma projelerini finansal etki, sigma açığı ve stratejik uyuma göre önceliklendirmeden kaynak israfı oluşur. Bu araç DPMO, Sigma Level ve COPQ temelinde objektif proje sıralaması sağlar.",
  inputs: [
    { id: "productionVolume", label: "Toplam Üretim Hacmi", type: "number", unit: "adet", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Units produced" },
    { id: "defectiveUnits", label: "Hatalı Birim", type: "number", unit: "adet", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Defect count" },
    { id: "opportunitiesPerUnit", label: "Birim Başına Hata Fırsatı", type: "number", unit: "", required: true, smartDefault: 1, validation: { min: 1 }, helper: "", expertMeaning: "Opportunities per unit" },
    { id: "internalFailureCost", label: "İç Başarısızlık Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Scrap, rework, downtime" },
    { id: "externalFailureCost", label: "Dış Başarısızlık Maliyeti", type: "number", unit: "USD", required: true, smartDefault: 75000, validation: { min: 0 }, helper: "", expertMeaning: "Warranty, returns, lost sales" },
    { id: "appraisalCost", label: "Değerlendirme Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Inspection, testing" },
    { id: "preventionCost", label: "Önleme Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Training, FMEA, SPC" },
    { id: "currentZBench", label: "Mevcut Z_bench", type: "number", unit: "", required: false, smartDefault: 3, validation: { min: 0, max: 6 }, helper: "", expertMeaning: "Current sigma benchmark" },
    { id: "targetSigmaLevel", label: "Hedef Sigma", type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1, max: 6 }, helper: "", expertMeaning: "Target sigma level" },
    { id: "safetyImpact", label: "Güvenlik Etkisi (1-10)", type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Safety score" },
    { id: "customerImpact", label: "Müşteri Etkisi (1-10)", type: "number", unit: "", required: false, smartDefault: 7, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Customer impact score" },
    { id: "recoveryProbability", label: "Kurtarma Olasılığı", type: "number", unit: "", required: false, smartDefault: 0.5, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Probability of recovery" },
    { id: "implementationEase", label: "Uygulama Kolaylığı (1-10)", type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Ease of implementation" },
  ],
  outputs: [
    { id: "dpmo", label: "DPMO", unit: "", format: "number" },
    { id: "yield", label: "Yield", unit: "%", format: "percentage" },
    { id: "zBench", label: "Z_bench", unit: "", format: "number" },
    { id: "sigmaLevel", label: "Sigma Level", unit: "", format: "number" },
    { id: "copq", label: "COPQ", unit: "USD", format: "currency" },
    { id: "projectScore", label: "Proje Skoru", unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "sigmaLevel", warning: 4, critical: 3, direction: "lower_is_bad", warningMessage: "Sigma level < 4 — iyileştirme fırsatı mevcut.", criticalMessage: "Sigma level < 3 — acil aksiyon gerekiyor." },
  ],
  formulaPipeline: [
    { formulaId: "stats.dpmo", inputMap: { defects: "defectiveUnits", units: "productionVolume", opportunities: "opportunitiesPerUnit" }, outputId: "dpmo" },
    { formulaId: "stats.yield_rate", inputMap: { defects: "defectiveUnits", units: "productionVolume", opportunities: "opportunitiesPerUnit" }, outputId: "yield" },
    { formulaId: "stats.z_bench", inputMap: { yield: "yield" }, outputId: "zBench" },
    { formulaId: "stats.sigma_level", inputMap: { zBench: "zBench" }, outputId: "sigmaLevel" },
    { formulaId: "cost.copq", inputMap: { internalFailure: "internalFailureCost", externalFailure: "externalFailureCost", appraisal: "appraisalCost", prevention: "preventionCost" }, outputId: "copq" },
    { formulaId: "stats.project_score", inputMap: { financialPriority: "copq", sigmaGap: "targetSigmaLevel", strategicAlignment: "customerImpact", ease: "implementationEase" }, outputId: "projectScore" },
  ],
  reportTemplate: { title: "Six Sigma Project Prioritization Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["DPMO formulation assumes defects per opportunity model.", "Z_bench uses Abramowitz & Stegun approximation for NORMSINV.", "Sigma level includes +1.5 shift (long-term dynamic).", "COPQ includes only detection and failure categories."] },
};
