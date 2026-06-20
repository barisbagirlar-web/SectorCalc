/**
 * Tool #32 — Örneklem Büyüklüğü Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SAMPLE_SIZE_INDUSTRIAL_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "sample-size-industrial-analyzer", legacyPaidSlug: "sample-size-industrial-analyzer",
  name: "Örneklem Büyüklüğü Hesaplama", sectorSlug: "quality", category: "measurement",
  painStatement: "Yanlış örneklem büyüklüğü ya gereksiz maliyet yaratır ya da istatistiksel anlamlılığı kaybettirir.",
  inputs: [
    { id: "populationSize", label: "Ana Kütle Büyüklüğü", type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Population size" },
    { id: "confidenceLevel", label: "Güven Düzeyi", type: "number", unit: "%", required: true, smartDefault: 95, validation: { min: 50, max: 99.9 }, helper: "", expertMeaning: "Confidence level" },
    { id: "marginError", label: "Hata Payı", type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.1, max: 20 }, helper: "", expertMeaning: "Margin of error" },
    { id: "estimatedProportion", label: "Tahmini Oran", type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Expected proportion (50% = max variance)" },
    { id: "designEffect", label: "Tasarım Etkisi", type: "number", unit: "", required: false, smartDefault: 1.0, validation: { min: 0.5, max: 5 }, helper: "", expertMeaning: "Design effect (1.0 = simple random)" },
    { id: "power", label: "Test Gücü", type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 50, max: 99 }, helper: "", expertMeaning: "Statistical power" },
    { id: "samplingCostPerUnit", label: "Birim Örneklem Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per sample unit" },
  ],
  outputs: [
    { id: "sampleInfinite", label: "Sonsuz Kütle Örneklemi", unit: "adet", format: "number" },
    { id: "sampleFinite", label: "Sonlu Kütle Örneklemi", unit: "adet", format: "number" },
    { id: "sampleContinuous", label: "Sürekli Değişken Örneklemi", unit: "adet", format: "number" },
    { id: "samplePowerAdj", label: "Güç Ayarlı Örneklem", unit: "adet", format: "number" },
    { id: "sampleDesignEffect", label: "Tasarım Etkili Örneklem", unit: "adet", format: "number" },
    { id: "sampleFinalN", label: "Nihai Örneklem Büyüklüğü", unit: "adet", format: "number", isBigNumber: true },
    { id: "samplingTotalCost", label: "Toplam Örneklem Maliyeti", unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "sampleFinalN", warning: 500, critical: 1000, direction: "higher_is_bad", warningMessage: "Örneklem > 500 — maliyet etkinliği değerlendirilmeli.", criticalMessage: "Örneklem > 1000 — alternatif yöntem düşünülmeli." }],
  formulaPipeline: [
    { formulaId: "measurement.sample_infinite", inputMap: { confidenceLevel: "confidenceLevel", marginError: "marginError", estimatedProportion: "estimatedProportion" }, outputId: "sampleInfinite" },
    { formulaId: "measurement.sample_finite", inputMap: { sampleInfinite: "sampleInfinite", populationSize: "populationSize" }, outputId: "sampleFinite" },
    { formulaId: "measurement.sample_continuous", inputMap: { confidenceLevel: "confidenceLevel", marginError: "marginError" }, outputId: "sampleContinuous" },
    { formulaId: "measurement.sample_power_adj", inputMap: { sampleFinite: "sampleFinite", power: "power" }, outputId: "samplePowerAdj" },
    { formulaId: "measurement.sample_design_effect", inputMap: { samplePowerAdj: "samplePowerAdj", designEffect: "designEffect" }, outputId: "sampleDesignEffect" },
    { formulaId: "measurement.sample_final_n", inputMap: { sampleDesignEffect: "sampleDesignEffect" }, outputId: "sampleFinalN" },
    { formulaId: "cost.sampling_total_cost", inputMap: { sampleFinalN: "sampleFinalN", samplingCostPerUnit: "samplingCostPerUnit" }, outputId: "samplingTotalCost" },
  ],
  reportTemplate: { title: "Sample Size Analysis Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Sonsuz = Z² × p(1-p) / e².", "Sonlu = n0 / (1 + (n0-1)/N).", "Güç ayarı = n × f(power).", "Tasarım etkisi = n × DEFF."] },
};
