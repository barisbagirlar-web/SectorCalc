/**
 * Tool #31 — Öğrenme Eğrisi Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const LEARNING_CURVE_TIME_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "learning-curve-time-analyzer", legacyPaidSlug: "learning-curve-time-analyzer",
  name: "Öğrenme Eğrisi ile Süre Analizi", name_i18n: {"en":"Öğrenme Eğrisi ile Süre Analizi","tr":"Öğrenme Eğrisi ile Süre Analizi"}, sectorSlug: "cnc-manufacturing", category: "time",
  painStatement: "Tekrarlı üretimde öğrenme etkisi hesaplanmazsa işçilik süreleri ve maliyetler olduğundan yüksek tahmin edilir.", painStatement_i18n: {"en":"Tekrarlı üretimde öğrenme etkisi hesaplanmazsa işçilik süreleri ve maliyetler olduğundan yüksek tahmin edilir.","tr":"Tekrarlı üretimde öğrenme etkisi hesaplanmazsa işçilik süreleri ve maliyetler olduğundan yüksek tahmin edilir."},
  inputs: [
    { id: "firstUnitTime", label: "İlk Birim Süresi", label_i18n: {"en":"İlk Birim Süresi","tr":"İlk Birim Süresi"}, type: "number", unit: "saat", required: true, smartDefault: 100, validation: { min: 0.1 }, helper: "", expertMeaning: "Time for first unit in hours", expertMeaning_i18n: {"en":"Time for first unit in hours","tr":"Time for first unit in hours"} },
    { id: "learningRate", label: "Öğrenme Oranı", label_i18n: {"en":"Öğrenme Oranı","tr":"Öğrenme Oranı"}, type: "number", unit: "%", required: true, smartDefault: 85, validation: { min: 50, max: 100 }, helper: "", expertMeaning: "Learning curve percentage", expertMeaning_i18n: {"en":"Learning curve percentage","tr":"Learning curve percentage"} },
    { id: "targetUnit", label: "Hedef Birim No", label_i18n: {"en":"Hedef Birim No","tr":"Hedef Birim No"}, type: "number", unit: "adet", required: true, smartDefault: 100, validation: { min: 1 }, helper: "", expertMeaning: "Target unit number", expertMeaning_i18n: {"en":"Target unit number","tr":"Target unit number"} },
    { id: "hourlyRate", label: "Saatlik İşçilik Maliyeti", label_i18n: {"en":"Saatlik İşçilik Maliyeti","tr":"Saatlik İşçilik Maliyeti"}, type: "number", unit: "USD/saat", required: false, smartDefault: 35, validation: { min: 1 }, helper: "", expertMeaning: "Labor cost per hour", expertMeaning_i18n: {"en":"Labor cost per hour","tr":"Labor cost per hour"} },
  ],
  outputs: [
    { id: "learningRate", label: "Öğrenme Oranı", label_i18n: {"en":"Öğrenme Oranı","tr":"Öğrenme Oranı"}, unit: "%", format: "number" },
    { id: "learningSlope", label: "Öğrenme Eğimi", label_i18n: {"en":"Öğrenme Eğimi","tr":"Öğrenme Eğimi"}, unit: "", format: "number" },
    { id: "timeN", label: "n. Birim Süresi", label_i18n: {"en":"n. Birim Süresi","tr":"n. Birim Süresi"}, unit: "saat", format: "number" },
    { id: "cumulativeTimeN", label: "Kümülatif Toplam Süre", label_i18n: {"en":"Kümülatif Toplam Süre","tr":"Kümülatif Toplam Süre"}, unit: "saat", format: "number", isBigNumber: true },
    { id: "averageTimeN", label: "Ortalama Birim Süresi", label_i18n: {"en":"Ortalama Birim Süresi","tr":"Ortalama Birim Süresi"}, unit: "saat", format: "number" },
    { id: "learningCostN", label: "n. Birim Maliyeti", label_i18n: {"en":"n. Birim Maliyeti","tr":"n. Birim Maliyeti"}, unit: "USD", format: "currency" },
    { id: "breakevenUnit", label: "Başabaş Birimi", label_i18n: {"en":"Başabaş Birimi","tr":"Başabaş Birimi"}, unit: "adet", format: "number" },
  ],
  thresholds: [{ fieldId: "timeN", warning: 20, critical: 10, direction: "lower_is_bad", warningMessage: "Birim süre < 20 saat — öğrenme etkisi düşük.", warningMessage_i18n: {"en":"Birim süre < 20 saat — öğrenme etkisi düşük.","tr":"Birim süre < 20 saat — öğrenme etkisi düşük."}, criticalMessage: "Birim süre < 10 saat — süreç iyileştirme gerekli.", criticalMessage_i18n: {"en":"Birim süre < 10 saat — süreç iyileştirme gerekli.","tr":"Birim süre < 10 saat — süreç iyileştirme gerekli."} }],
  formulaPipeline: [
    { formulaId: "measurement.learning_rate", inputMap: { learningRate: "learningRate" }, outputId: "learningRate" },
    { formulaId: "measurement.learning_slope", inputMap: { learningRate: "learningRate" }, outputId: "learningSlope" },
    { formulaId: "measurement.time_n", inputMap: { firstUnitTime: "firstUnitTime", targetUnit: "targetUnit", learningRate: "learningRate" }, outputId: "timeN" },
    { formulaId: "measurement.cumulative_time_n", inputMap: { firstUnitTime: "firstUnitTime", targetUnit: "targetUnit", learningRate: "learningRate" }, outputId: "cumulativeTimeN" },
    { formulaId: "measurement.average_time_n", inputMap: { cumulativeTimeN: "cumulativeTimeN", targetUnit: "targetUnit" }, outputId: "averageTimeN" },
    { formulaId: "cost.learning_cost_n", inputMap: { timeN: "timeN", hourlyRate: "hourlyRate" }, outputId: "learningCostN" },
    { formulaId: "measurement.breakeven_unit", inputMap: { firstUnitTime: "firstUnitTime", learningRate: "learningRate", targetUnit: "targetUnit" }, outputId: "breakevenUnit" },
  ],
  reportTemplate: { title: "Learning Curve Analysis Report", title_i18n: {"en":"Learning Curve Analysis Report","tr":"Learning Curve Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Öğrenme eğrisi: Yx = K × x^b, b = log(r)/log(2).", "%85 öğrenme = her iki katında %15 süre azalışı.", "Kümülatif süre = integral yaklaşımı.", "Maliyet = süre × saat ücreti."],assumptionNotes_i18n:[{"en":"Öğrenme eğrisi: Yx = K × x^b, b = log(r)/log(2).","tr":"Öğrenme eğrisi: Yx = K × x^b, b = log(r)/log(2)."},{"en":"%85 öğrenme = her iki katında %15 süre azalışı.","tr":"%85 öğrenme = her iki katında %15 süre azalışı."},{"en":"Kümülatif süre = integral yaklaşımı.","tr":"Kümülatif süre = integral yaklaşımı."},{"en":"Maliyet = süre × saat ücreti.","tr":"Maliyet = süre × saat ücreti."}] },
};
