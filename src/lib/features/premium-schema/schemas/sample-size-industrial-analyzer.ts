/**
 * Tool #32 — Örneklem Büyüklüğü Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SAMPLE_SIZE_INDUSTRIAL_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "sample-size-industrial-analyzer", legacyPaidSlug: "sample-size-industrial-analyzer",
  name: "Örneklem Büyüklüğü Hesaplama", name_i18n: {"en":"Sample Size Calculation","tr":"Örneklem Büyüklüğü Hesaplama"}, sectorSlug: "quality", category: "measurement",
  painStatement: "Yanlış örneklem büyüklüğü ya gereksiz maliyet yaratır ya da istatistiksel anlamlılığı kaybettirir.", painStatement_i18n: {"en":"Wrong sample size either creates unnecessary cost or loses statistical significance.","tr":"Yanlış örneklem büyüklüğü ya gereksiz maliyet yaratır ya da istatistiksel anlamlılığı kaybettirir."},
  inputs: [
    { id: "populationSize", label: "Ana Kütle Büyüklüğü", label_i18n: {"en":"Population Size","tr":"Ana Kütle Büyüklüğü"}, type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Population size", expertMeaning_i18n: {"en":"Population size","tr":"Ana kütle büyüklüğü"} },
    { id: "confidenceLevel", label: "Güven Düzeyi", label_i18n: {"en":"Confidence Level","tr":"Güven Düzeyi"}, type: "number", unit: "%", required: true, smartDefault: 95, validation: { min: 50, max: 99.9 }, helper: "", expertMeaning: "Confidence level", expertMeaning_i18n: {"en":"Confidence level","tr":"Güven düzeyi"} },
    { id: "marginError", label: "Hata Payı", label_i18n: {"en":"Margin of Error","tr":"Hata Payı"}, type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.1, max: 20 }, helper: "", expertMeaning: "Margin of error", expertMeaning_i18n: {"en":"Margin of error","tr":"Hata payı"} },
    { id: "estimatedProportion", label: "Tahmini Oran", label_i18n: {"en":"Estimated Proportion","tr":"Tahmini Oran"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Expected proportion (50% = max variance)", expertMeaning_i18n: {"en":"Expected proportion (50% = max variance)","tr":"Beklenen oran (%50 = maks. varyans)"} },
    { id: "designEffect", label: "Tasarım Etkisi", label_i18n: {"en":"Design Effect","tr":"Tasarım Etkisi"}, type: "number", unit: "", required: false, smartDefault: 1.0, validation: { min: 0.5, max: 5 }, helper: "", expertMeaning: "Design effect (1.0 = simple random)", expertMeaning_i18n: {"en":"Design effect (1.0 = simple random)","tr":"Tasarım etkisi (1.0 = basit rastgele)"} },
    { id: "power", label: "Test Gücü", label_i18n: {"en":"Statistical Power","tr":"Test Gücü"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 50, max: 99 }, helper: "", expertMeaning: "Statistical power", expertMeaning_i18n: {"en":"Statistical power","tr":"İstatistiksel güç"} },
    { id: "samplingCostPerUnit", label: "Birim Örneklem Maliyeti", label_i18n: {"en":"Sampling Cost per Unit","tr":"Birim Örneklem Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per sample unit", expertMeaning_i18n: {"en":"Cost per sample unit","tr":"Birim örneklem maliyeti"} },
  ],
  outputs: [
    { id: "sampleInfinite", label: "Sonsuz Kütle Örneklemi", label_i18n: {"en":"Infinite Population Sample","tr":"Sonsuz Kütle Örneklemi"}, unit: "adet", format: "number" },
    { id: "sampleFinite", label: "Sonlu Kütle Örneklemi", label_i18n: {"en":"Finite Population Sample","tr":"Sonlu Kütle Örneklemi"}, unit: "adet", format: "number" },
    { id: "sampleContinuous", label: "Sürekli Değişken Örneklemi", label_i18n: {"en":"Continuous Variable Sample","tr":"Sürekli Değişken Örneklemi"}, unit: "adet", format: "number" },
    { id: "samplePowerAdj", label: "Güç Ayarlı Örneklem", label_i18n: {"en":"Power Adjusted Sample","tr":"Güç Ayarlı Örneklem"}, unit: "adet", format: "number" },
    { id: "sampleDesignEffect", label: "Tasarım Etkili Örneklem", label_i18n: {"en":"Design Effect Sample","tr":"Tasarım Etkili Örneklem"}, unit: "adet", format: "number" },
    { id: "sampleFinalN", label: "Nihai Örneklem Büyüklüğü", label_i18n: {"en":"Final Sample Size","tr":"Nihai Örneklem Büyüklüğü"}, unit: "adet", format: "number", isBigNumber: true },
    { id: "samplingTotalCost", label: "Toplam Örneklem Maliyeti", label_i18n: {"en":"Total Sampling Cost","tr":"Toplam Örneklem Maliyeti"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "sampleFinalN", warning: 500, critical: 1000, direction: "higher_is_bad", warningMessage: "Örneklem > 500 — maliyet etkinliği değerlendirilmeli.", warningMessage_i18n: {"en":"Sample > 500 — evaluate cost effectiveness.","tr":"Örneklem > 500 — maliyet etkinliği değerlendirilmeli."}, criticalMessage: "Örneklem > 1000 — alternatif yöntem düşünülmeli.", criticalMessage_i18n: {"en":"Sample > 1000 — consider alternative method.","tr":"Örneklem > 1000 — alternatif yöntem düşünülmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.sample_infinite", inputMap: { confidenceLevel: "confidenceLevel", marginError: "marginError", estimatedProportion: "estimatedProportion" }, outputId: "sampleInfinite" },
    { formulaId: "measurement.sample_finite", inputMap: { sampleInfinite: "sampleInfinite", populationSize: "populationSize" }, outputId: "sampleFinite" },
    { formulaId: "measurement.sample_continuous", inputMap: {
        confidenceLevel: "confidenceLevel",
        marginError: "marginError"
      }, outputId: "sampleContinuous" },
    { formulaId: "measurement.sample_power_adj", inputMap: {
        sampleFinite: "sampleFinite",
        power: "power"
      }, outputId: "samplePowerAdj" },
    { formulaId: "measurement.sample_design_effect", inputMap: {
        designEffect: "designEffect",
        clusterSize: "samplePowerAdj"
      }, outputId: "sampleDesignEffect" },
    { formulaId: "measurement.sample_final_n", inputMap: {
        sampleDesignEffect: "sampleDesignEffect"
      }, outputId: "sampleFinalN" },
    { formulaId: "cost.sampling_total_cost", inputMap: {
        sampleFinalN: "sampleFinalN",
        costPerSample: "samplingCostPerUnit"
      }, outputId: "samplingTotalCost" },
  ],
  reportTemplate: { title: "Sample Size Analysis Report", title_i18n: {"en":"Sample Size Analysis Report","tr":"Sample Size Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Sonsuz = Z² × p(1-p) / e².", "Sonlu = n0 / (1 + (n0-1)/N).", "Güç ayarı = n × f(power).", "Tasarım etkisi = n × DEFF."],assumptionNotes_i18n:[{"en":"Infinite = Z² × p(1-p) / e².","tr":"Sonsuz = Z² × p(1-p) / e²."},{"en":"Finite = n0 / (1 + (n0-1)/N).","tr":"Sonlu = n0 / (1 + (n0-1)/N)."},{"en":"Power adjustment = n × f(power).","tr":"Güç ayarı = n × f(power)."},{"en":"Design effect = n × DEFF.","tr":"Tasarım etkisi = n × DEFF."}] },
};
