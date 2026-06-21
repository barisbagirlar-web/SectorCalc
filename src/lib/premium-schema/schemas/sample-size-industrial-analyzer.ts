/**
 * Tool #32 — Örneklem Büyüklüğü Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SAMPLE_SIZE_INDUSTRIAL_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "sample-size-industrial-analyzer", legacyPaidSlug: "sample-size-industrial-analyzer",
  name: "Örneklem Büyüklüğü Hesaplama", name_i18n: {"en":"Örneklem Büyüklüğü Hesaplama","tr":"Örneklem Büyüklüğü Hesaplama"}, sectorSlug: "quality", category: "measurement",
  painStatement: "Yanlış örneklem büyüklüğü ya gereksiz maliyet yaratır ya da istatistiksel anlamlılığı kaybettirir.", painStatement_i18n: {"en":"Yanlış örneklem büyüklüğü ya gereksiz maliyet yaratır ya da istatistiksel anlamlılığı kaybettirir.","tr":"Yanlış örneklem büyüklüğü ya gereksiz maliyet yaratır ya da istatistiksel anlamlılığı kaybettirir."},
  inputs: [
    { id: "populationSize", label: "Ana Kütle Büyüklüğü", label_i18n: {"en":"Ana Kütle Büyüklüğü","tr":"Ana Kütle Büyüklüğü"}, type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Population size", expertMeaning_i18n: {"en":"Population size","tr":"Population size"} },
    { id: "confidenceLevel", label: "Güven Düzeyi", label_i18n: {"en":"Güven Düzeyi","tr":"Güven Düzeyi"}, type: "number", unit: "%", required: true, smartDefault: 95, validation: { min: 50, max: 99.9 }, helper: "", expertMeaning: "Confidence level", expertMeaning_i18n: {"en":"Confidence level","tr":"Confidence level"} },
    { id: "marginError", label: "Hata Payı", label_i18n: {"en":"Hata Payı","tr":"Hata Payı"}, type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.1, max: 20 }, helper: "", expertMeaning: "Margin of error", expertMeaning_i18n: {"en":"Margin of error","tr":"Margin of error"} },
    { id: "estimatedProportion", label: "Tahmini Oran", label_i18n: {"en":"Tahmini Oran","tr":"Tahmini Oran"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Expected proportion (50% = max variance)", expertMeaning_i18n: {"en":"Expected proportion (50% = max variance)","tr":"Expected proportion (50% = max variance)"} },
    { id: "designEffect", label: "Tasarım Etkisi", label_i18n: {"en":"Tasarım Etkisi","tr":"Tasarım Etkisi"}, type: "number", unit: "", required: false, smartDefault: 1.0, validation: { min: 0.5, max: 5 }, helper: "", expertMeaning: "Design effect (1.0 = simple random)", expertMeaning_i18n: {"en":"Design effect (1.0 = simple random)","tr":"Design effect (1.0 = simple random)"} },
    { id: "power", label: "Test Gücü", label_i18n: {"en":"Test Gücü","tr":"Test Gücü"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 50, max: 99 }, helper: "", expertMeaning: "Statistical power", expertMeaning_i18n: {"en":"Statistical power","tr":"Statistical power"} },
    { id: "samplingCostPerUnit", label: "Birim Örneklem Maliyeti", label_i18n: {"en":"Birim Örneklem Maliyeti","tr":"Birim Örneklem Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per sample unit", expertMeaning_i18n: {"en":"Cost per sample unit","tr":"Cost per sample unit"} },
  ],
  outputs: [
    { id: "sampleInfinite", label: "Sonsuz Kütle Örneklemi", label_i18n: {"en":"Sonsuz Kütle Örneklemi","tr":"Sonsuz Kütle Örneklemi"}, unit: "adet", format: "number" },
    { id: "sampleFinite", label: "Sonlu Kütle Örneklemi", label_i18n: {"en":"Sonlu Kütle Örneklemi","tr":"Sonlu Kütle Örneklemi"}, unit: "adet", format: "number" },
    { id: "sampleContinuous", label: "Sürekli Değişken Örneklemi", label_i18n: {"en":"Sürekli Değişken Örneklemi","tr":"Sürekli Değişken Örneklemi"}, unit: "adet", format: "number" },
    { id: "samplePowerAdj", label: "Güç Ayarlı Örneklem", label_i18n: {"en":"Güç Ayarlı Örneklem","tr":"Güç Ayarlı Örneklem"}, unit: "adet", format: "number" },
    { id: "sampleDesignEffect", label: "Tasarım Etkili Örneklem", label_i18n: {"en":"Tasarım Etkili Örneklem","tr":"Tasarım Etkili Örneklem"}, unit: "adet", format: "number" },
    { id: "sampleFinalN", label: "Nihai Örneklem Büyüklüğü", label_i18n: {"en":"Nihai Örneklem Büyüklüğü","tr":"Nihai Örneklem Büyüklüğü"}, unit: "adet", format: "number", isBigNumber: true },
    { id: "samplingTotalCost", label: "Toplam Örneklem Maliyeti", label_i18n: {"en":"Toplam Örneklem Maliyeti","tr":"Toplam Örneklem Maliyeti"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "sampleFinalN", warning: 500, critical: 1000, direction: "higher_is_bad", warningMessage: "Örneklem > 500 — maliyet etkinliği değerlendirilmeli.", warningMessage_i18n: {"en":"Örneklem > 500 — maliyet etkinliği değerlendirilmeli.","tr":"Örneklem > 500 — maliyet etkinliği değerlendirilmeli."}, criticalMessage: "Örneklem > 1000 — alternatif yöntem düşünülmeli.", criticalMessage_i18n: {"en":"Örneklem > 1000 — alternatif yöntem düşünülmeli.","tr":"Örneklem > 1000 — alternatif yöntem düşünülmeli."} }],
  formulaPipeline: [
    { formulaId: "measurement.sample_infinite", inputMap: { confidenceLevel: "confidenceLevel", marginError: "marginError", estimatedProportion: "estimatedProportion" }, outputId: "sampleInfinite" },
    { formulaId: "measurement.sample_finite", inputMap: { sampleInfinite: "sampleInfinite", populationSize: "populationSize" }, outputId: "sampleFinite" },
    { formulaId: "measurement.sample_continuous", inputMap: { confidenceLevel: "confidenceLevel", marginError: "marginError" }, outputId: "sampleContinuous" },
    { formulaId: "measurement.sample_power_adj", inputMap: { sampleFinite: "sampleFinite", power: "power" }, outputId: "samplePowerAdj" },
    { formulaId: "measurement.sample_design_effect", inputMap: { samplePowerAdj: "samplePowerAdj", designEffect: "designEffect" }, outputId: "sampleDesignEffect" },
    { formulaId: "measurement.sample_final_n", inputMap: { sampleDesignEffect: "sampleDesignEffect" }, outputId: "sampleFinalN" },
    { formulaId: "cost.sampling_total_cost", inputMap: { sampleFinalN: "sampleFinalN", samplingCostPerUnit: "samplingCostPerUnit" }, outputId: "samplingTotalCost" },
  ],
  reportTemplate: { title: "Sample Size Analysis Report", title_i18n: {"en":"Sample Size Analysis Report","tr":"Sample Size Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Sonsuz = Z² × p(1-p) / e².", "Sonlu = n0 / (1 + (n0-1)/N).", "Güç ayarı = n × f(power).", "Tasarım etkisi = n × DEFF."],assumptionNotes_i18n:[{"en":"Sonsuz = Z² × p(1-p) / e².","tr":"Sonsuz = Z² × p(1-p) / e²."},{"en":"Sonlu = n0 / (1 + (n0-1)/N).","tr":"Sonlu = n0 / (1 + (n0-1)/N)."},{"en":"Güç ayarı = n × f(power).","tr":"Güç ayarı = n × f(power)."},{"en":"Tasarım etkisi = n × DEFF.","tr":"Tasarım etkisi = n × DEFF."}] },
};
