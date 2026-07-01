/**
 * Tool #2 — Six Sigma Project Prioritizer
 * DPMO → Yield → Z_bench → SigmaLevel → COPQ → ProjectScore
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SIX_SIGMA_PRIORITIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "six-sigma-project-prioritizer", legacyPaidSlug: "six-sigma-project-prioritizer",
  name: "Alti Sigma Proje onceliklendirici", name_i18n: {"en":"Alti Sigma Proje onceliklendirici"}, sectorSlug: "sheet-metal", category: "scrap",
  painStatement: "Six Sigma projelerini finansal etki, sigma açığı ve stratejik uyuma göre önceliklendirmeden kaynak israfı oluşur. Bu araç DPMO, Sigma Level ve COPQ temelinde objektif proje sıralaması sağlar.", painStatement_i18n: {"en":"Without prioritizing Six Sigma projects by financial impact, sigma gap, and strategic alignment, resource waste occurs. This tool provides objective project ranking based on DPMO, Sigma Level, and COPQ."},
  inputs: [
    { id: "productionVolume", label: "Toplam Üretim Hacmi", label_i18n: {"en":"Units produced"}, type: "number", unit: "adet", required: true, smartDefault: 100000, validation: { min: 1 }, helper: "", expertMeaning: "Units produced", expertMeaning_i18n: {"en":"Units produced"} },
    { id: "defectiveUnits", label: "Defect count", label_i18n: {"en":"Defect count"}, type: "number", unit: "adet", required: true, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Defect count", expertMeaning_i18n: {"en":"Defect count"} },
    { id: "opportunitiesPerUnit", label: "Opportunities per unit", label_i18n: {"en":"Opportunities per unit"}, type: "number", unit: "", required: true, smartDefault: 1, validation: { min: 1 }, helper: "", expertMeaning: "Opportunities per unit", expertMeaning_i18n: {"en":"Opportunities per unit"} },
    { id: "internalFailureCost", label: "Scrap, rework, downtime", label_i18n: {"en":"Scrap, rework, downtime"}, type: "number", unit: "USD", required: true, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Scrap, rework, downtime", expertMeaning_i18n: {"en":"Scrap, rework, downtime"} },
    { id: "externalFailureCost", label: "Warranty, returns, lost sales", label_i18n: {"en":"Warranty, returns, lost sales"}, type: "number", unit: "USD", required: true, smartDefault: 75000, validation: { min: 0 }, helper: "", expertMeaning: "Warranty, returns, lost sales", expertMeaning_i18n: {"en":"Warranty, returns, lost sales"} },
    { id: "appraisalCost", label: "Inspection, testing", label_i18n: {"en":"Inspection, testing"}, type: "number", unit: "USD", required: false, smartDefault: 15000, validation: { min: 0 }, helper: "", expertMeaning: "Inspection, testing", expertMeaning_i18n: {"en":"Inspection, testing"} },
    { id: "preventionCost", label: "Önleme Maliyeti", label_i18n: {"en":"Training, FMEA, SPC"}, type: "number", unit: "USD", required: false, smartDefault: 10000, validation: { min: 0 }, helper: "", expertMeaning: "Training, FMEA, SPC", expertMeaning_i18n: {"en":"Training, FMEA, SPC"} },
    { id: "currentZBench", label: "Mevcut Z_bench", label_i18n: {"en":"Current Z_bench"}, type: "number", unit: "", required: false, smartDefault: 3, validation: { min: 0, max: 6 }, helper: "", expertMeaning: "Current sigma benchmark", expertMeaning_i18n: {"en":"Current sigma benchmark"} },
    { id: "targetSigmaLevel", label: "Hedef Sigma", label_i18n: {"en":"Hedef Sigma"}, type: "number", unit: "", required: true, smartDefault: 5, validation: { min: 1, max: 6 }, helper: "", expertMeaning: "Target sigma level", expertMeaning_i18n: {"en":"Target sigma level"} },
    { id: "safetyImpact", label: "Güvenlik Etkisi (1-10)", label_i18n: {"en":"Safety score"}, type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Safety score", expertMeaning_i18n: {"en":"Safety score"} },
    { id: "customerImpact", label: "Customer impact score", label_i18n: {"en":"Customer impact score"}, type: "number", unit: "", required: false, smartDefault: 7, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Customer impact score", expertMeaning_i18n: {"en":"Customer impact score"} },
    { id: "recoveryProbability", label: "Probability of recovery", label_i18n: {"en":"Probability of recovery"}, type: "number", unit: "", required: false, smartDefault: 0.5, validation: { min: 0, max: 1 }, helper: "", expertMeaning: "Probability of recovery", expertMeaning_i18n: {"en":"Probability of recovery"} },
    { id: "implementationEase", label: "Ease of implementation", label_i18n: {"en":"Ease of implementation"}, type: "number", unit: "", required: false, smartDefault: 5, validation: { min: 1, max: 10 }, helper: "", expertMeaning: "Ease of implementation", expertMeaning_i18n: {"en":"Ease of implementation"} },
  ],
  outputs: [
    { id: "dpmo", label: "DPMO", label_i18n: {"en":"DPMO"}, unit: "", format: "number" },
    { id: "yield", label: "Yield", label_i18n: {"en":"Yield"}, unit: "%", format: "percentage" },
    { id: "zBench", label: "Z_bench", label_i18n: {"en":"Z_bench"}, unit: "", format: "number" },
    { id: "sigmaLevel", label: "Sigma Level", label_i18n: {"en":"Sigma Level"}, unit: "", format: "number" },
    { id: "copq", label: "COPQ", label_i18n: {"en":"COPQ"}, unit: "USD", format: "currency" },
    { id: "projectScore", label: "Proje Skoru", label_i18n: {"en":"Proje Skoru"}, unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "sigmaLevel", warning: 4, critical: 3, direction: "lower_is_bad", warningMessage: "Sigma level < 4 — iyileştirme fırsatı mevcut.", warningMessage_i18n: {"en":"Sigma level < 4 — improvement opportunity exists."}, criticalMessage: "Sigma level < 3 — acil aksiyon gerekiyor.", criticalMessage_i18n: {"en":"Sigma level < 3 — urgent aksiyon gerekiyor."} },
  ],
  formulaPipeline: [
    { formulaId: "stats.dpmo", inputMap: { defects: "defectiveUnits", units: "productionVolume", opportunities: "opportunitiesPerUnit" }, outputId: "dpmo" },
    { formulaId: "stats.yield_rate", inputMap: { defects: "defectiveUnits", units: "productionVolume", opportunities: "opportunitiesPerUnit" }, outputId: "yield" },
    { formulaId: "stats.z_bench", inputMap: { yield: "yield" }, outputId: "zBench" },
    { formulaId: "stats.sigma_level", inputMap: { zBench: "zBench" }, outputId: "sigmaLevel" },
    { formulaId: "cost.copq", inputMap: { internalFailure: "internalFailureCost", externalFailure: "externalFailureCost", appraisal: "appraisalCost", prevention: "preventionCost" }, outputId: "copq" },
    { formulaId: "stats.project_score", inputMap: { financialPriority: "copq", sigmaGap: "targetSigmaLevel", strategicAlignment: "customerImpact", ease: "implementationEase" }, outputId: "projectScore" },
  ],
  reportTemplate: { title: "Six Sigma Project Prioritization Report", title_i18n: {"en":"Six Sigma Project Prioritization Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["DPMO formulation assumes defects per opportunity model.", "Z_bench uses Abramowitz & Stegun approximation for NORMSINV.", "Sigma level includes +1.5 shift (long-term dynamic).", "COPQ includes only detection and failure categories."],assumptionNotes_i18n:[{"en":"DPMO formulation assumes defects per opportunity model."},{"en":"Z_bench uses Abramowitz & Stegun approximation for NORMSINV."},{"en":"Sigma level includes +1.5 shift (long-term dynamic)."},{"en":"COPQ includes only detection and failure categories."}] },
};
