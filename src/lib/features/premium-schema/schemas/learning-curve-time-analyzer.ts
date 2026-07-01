/**
 * Tool #31 — Öğrenme Eğrisi Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const LEARNING_CURVE_TIME_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "learning-curve-time-analyzer", legacyPaidSlug: "learning-curve-time-analyzer",
  name: "Learning Curve Time Analyzer", name_i18n: {"en":"Learning Curve Time Analyzer"}, sectorSlug: "cnc-manufacturing", category: "time",
  painStatement: "Tekrarlı üretimde öğrenme etkisi hesaplanmazsa işçilik süreleri ve maliyetler olduğundan yüksek tahmin edilir.", painStatement_i18n: {"en":"In repetitive production, if the learning effect is not calculated, labor times and costs are overestimated."},
  inputs: [
    { id: "firstUnitTime", label: "Time for first unit in hours", label_i18n: {"en":"Time for first unit in hours"}, type: "number", unit: "saat", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Time for first unit in hours", expertMeaning_i18n: {"en":"Time for first unit in hours"} },
    { id: "learningRate", label: "Learning curve percentage", label_i18n: {"en":"Learning curve percentage"}, type: "number", unit: "%", required: true, smartDefault: 85, validation: { min: 50, max: 100 }, helper: "", expertMeaning: "Learning curve percentage", expertMeaning_i18n: {"en":"Learning curve percentage"} },
    { id: "targetUnit", label: "Target Unit Number", label_i18n: {"en":"Target Unit Number"}, type: "number", unit: "adet", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Target unit number", expertMeaning_i18n: {"en":"Target unit number"} },
    { id: "hourlyRate", label: "Labor cost per hour", label_i18n: {"en":"Labor cost per hour"}, type: "number", unit: "USD/saat", required: false, smartDefault: 35, validation: { min: 1 }, helper: "", expertMeaning: "Labor cost per hour", expertMeaning_i18n: {"en":"Labor cost per hour"} },
  ],
  outputs: [
    { id: "learningRate", label: "Learning Rate", label_i18n: {"en":"Learning Rate"}, unit: "%", format: "number" },
    { id: "learningSlope", label: "Ogrenme Egimi", label_i18n: {"en":"Ogrenme Egimi"}, unit: "", format: "number" },
    { id: "timeN", label: "n. Birim Süresi", label_i18n: {"en":"Nth Unit Time"}, unit: "saat", format: "number" },
    { id: "cumulativeTimeN", label: "Kümülatif Toplam Süre", label_i18n: {"en":"Cumulative Total Time"}, unit: "saat", format: "number", isBigNumber: true },
    { id: "averageTimeN", label: "Ortalama Birim Süresi", label_i18n: {"en":"Average Unit Duration"}, unit: "saat", format: "number" },
    { id: "learningCostN", label: "n. Birim Maliyeti", label_i18n: {"en":"n. Unit Cost"}, unit: "USD", format: "currency" },
    { id: "breakevenUnit", label: "Basabas Birimi", label_i18n: {"en":"Break-Even Birimi"}, unit: "adet", format: "number" },
  ],
  thresholds: [{ fieldId: "timeN", warning: 20, critical: 10, direction: "lower_is_bad", warningMessage: "Birim süre < 20 saat — öğrenme etkisi düşük.", warningMessage_i18n: {"en":"Unit time < 20 hours — learning effect is low."}, criticalMessage: "Birim süre < 10 saat — süreç iyileştirme gerekli.", criticalMessage_i18n: {"en":"Unit time < 10 hours — process improvement required."} }],
  formulaPipeline: [
    { formulaId: "measurement.learning_rate", inputMap: { learningRate: "learningRate" ,
        pctOfPrevious: "pctOfPrevious"}, outputId: "learningRate" },
    { formulaId: "measurement.learning_slope", inputMap: { learningRate: "learningRate" }, outputId: "learningSlope" },
    { formulaId: "measurement.time_n", inputMap: { firstUnitTime: "firstUnitTime", targetUnit: "targetUnit", learningRate: "learningRate" ,
        cumulativeUnits: "cumulativeUnits",
        learningSlope: "learningSlope"}, outputId: "timeN" },
    { formulaId: "measurement.cumulative_time_n", inputMap: { firstUnitTime: "firstUnitTime", targetUnit: "targetUnit", learningRate: "learningRate" ,
        cumulativeUnits: "cumulativeUnits",
        learningSlope: "learningSlope"}, outputId: "cumulativeTimeN" },
    { formulaId: "measurement.average_time_n", inputMap: { cumulativeTimeN: "cumulativeTimeN", targetUnit: "targetUnit" ,
        cumulativeTime: "cumulativeTime",
        cumulativeUnits: "cumulativeUnits"}, outputId: "averageTimeN" },
    { formulaId: "cost.learning_cost_n", inputMap: { timeN: "timeN", hourlyRate: "hourlyRate" ,
        laborRate: "laborRate"}, outputId: "learningCostN" },
    { formulaId: "measurement.breakeven_unit", inputMap: { firstUnitTime: "firstUnitTime", learningRate: "learningRate", targetUnit: "targetUnit" ,
        fixedCost: "fixedCost",
        unitPrice: "unitPrice",
        variableCost: "variableCost"}, outputId: "breakevenUnit" },
  ],
  reportTemplate: { title: "Learning Curve Analysis Report", title_i18n: {"en":"Learning Curve Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Öğrenme eğrisi: Yx = K × x^b, b = log(r)/log(2).", "%85 öğrenme = her iki katında %15 süre azalışı.", "Kümülatif süre = integral yaklaşımı.", "Maliyet = süre × saat ücreti."],assumptionNotes_i18n:[{"en":"Learning curve: Yx = K × x^b, b = log(r)/log(2)."},{"en":"85% learning = 15% time reduction per doubling."},{"en":"Cumulative time = integral approach."},{"en":"Cost = time × hourly rate."}] },
};
