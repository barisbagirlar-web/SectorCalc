/**
 * Tool #32 — Örneklem Büyüklüğü Analizi
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SAMPLE_SIZE_INDUSTRIAL_ANALYZER_SCHEMA: PremiumCalculatorSchema = {
  id: "sample-size-industrial-analyzer", legacyPaidSlug: "sample-size-industrial-analyzer",
  name: "Sample Size Calculation", name_i18n: {"en":"Sample Size Calculation"}, sectorSlug: "quality", category: "measurement",
  painStatement: "Wrong sample size either creates unnecessary cost or loses statistical significance.", painStatement_i18n: {"en":"Wrong sample size either creates unnecessary cost or loses statistical significance."},
  inputs: [
    { id: "populationSize", label: "Population Size", label_i18n: {"en":"Population Size"}, type: "number", unit: "adet", required: true, smartDefault: 10000, validation: { min: 1 }, helper: "", expertMeaning: "Population size", expertMeaning_i18n: {"en":"Population size"} },
    { id: "confidenceLevel", label: "Güven Düzeyi", label_i18n: {"en":"Confidence Level"}, type: "number", unit: "%", required: true, smartDefault: 95, validation: { min: 50, max: 99.9 }, helper: "", expertMeaning: "Confidence level", expertMeaning_i18n: {"en":"Confidence level"} },
    { id: "marginError", label: "Margin of Error", label_i18n: {"en":"Margin of Error"}, type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0.1, max: 20 }, helper: "", expertMeaning: "Margin of error", expertMeaning_i18n: {"en":"Margin of error"} },
    { id: "estimatedProportion", label: "Tahmini Oran", label_i18n: {"en":"Estimated Proportion"}, type: "number", unit: "%", required: false, smartDefault: 50, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Expected proportion (50% = max variance)", expertMeaning_i18n: {"en":"Expected proportion (50% = max variance)"} },
    { id: "designEffect", label: "Design Effect", label_i18n: {"en":"Design Effect"}, type: "number", unit: "", required: false, smartDefault: 1.0, validation: { min: 0.5, max: 5 }, helper: "", expertMeaning: "Design effect (1.0 = simple random)", expertMeaning_i18n: {"en":"Design effect (1.0 = simple random)"} },
    { id: "power", label: "Test Gücü", label_i18n: {"en":"Statistical Power"}, type: "number", unit: "%", required: false, smartDefault: 80, validation: { min: 50, max: 99 }, helper: "", expertMeaning: "Statistical power", expertMeaning_i18n: {"en":"Statistical power"} },
    { id: "samplingCostPerUnit", label: "Birim Örneklem Maliyeti", label_i18n: {"en":"Sampling Cost per Unit"}, type: "number", unit: "USD", required: false, smartDefault: 5, validation: { min: 0.01 }, helper: "", expertMeaning: "Cost per sample unit", expertMeaning_i18n: {"en":"Cost per sample unit"} },
  ],
  outputs: [
    { id: "sampleInfinite", label: "Sonsuz Kütle Örneklemi", label_i18n: {"en":"Infinite Population Sample"}, unit: "adet", format: "number" },
    { id: "sampleFinite", label: "Sonlu Kütle Örneklemi", label_i18n: {"en":"Finite Population Sample"}, unit: "adet", format: "number" },
    { id: "sampleContinuous", label: "Continuous Variable Sample", label_i18n: {"en":"Continuous Variable Sample"}, unit: "adet", format: "number" },
    { id: "samplePowerAdj", label: "Power Adjusted Sample", label_i18n: {"en":"Power Adjusted Sample"}, unit: "adet", format: "number" },
    { id: "sampleDesignEffect", label: "Design Effect Sample", label_i18n: {"en":"Design Effect Sample"}, unit: "adet", format: "number" },
    { id: "sampleFinalN", label: "Final Sample Size", label_i18n: {"en":"Final Sample Size"}, unit: "adet", format: "number", isBigNumber: true },
    { id: "samplingTotalCost", label: "Toplam Örneklem Maliyeti", label_i18n: {"en":"Total Sampling Cost"}, unit: "USD", format: "currency" },
  ],
  thresholds: [{ fieldId: "sampleFinalN", warning: 500, critical: 1000, direction: "higher_is_bad", warningMessage: "Sample > 500 — evaluate cost effectiveness.", warningMessage_i18n: {"en":"Sample > 500 — evaluate cost effectiveness."}, criticalMessage: "Sample > 1000 — consider alternative method.", criticalMessage_i18n: {"en":"Sample > 1000 — consider alternative method."} }],
  formulaPipeline: [
    { formulaId: "measurement.sample_infinite", inputMap: { confidenceLevel: "confidenceLevel", marginError: "marginError", estimatedProportion: "estimatedProportion" ,
        zScore: "zScore",
        stdDev: "stdDev",
        errorMargin: "errorMargin"}, outputId: "sampleInfinite" },
    { formulaId: "measurement.sample_finite", inputMap: { sampleInfinite: "sampleInfinite", populationSize: "populationSize" ,
        population: "population"}, outputId: "sampleFinite" },
    { formulaId: "measurement.sample_continuous", inputMap: {
        confidenceLevel: "confidenceLevel",
        marginError: "marginError"
      ,
        zScore: "zScore",
        estimatedVariance: "estimatedVariance",
        precision: "precision"}, outputId: "sampleContinuous" },
    { formulaId: "measurement.sample_power_adj", inputMap: {
        sampleFinite: "sampleFinite",
        power: "power"
      ,
        sampleInfinite: "sampleInfinite",
        zBeta: "zBeta",
        effectSize: "effectSize"}, outputId: "samplePowerAdj" },
    { formulaId: "measurement.sample_design_effect", inputMap: {
        designEffect: "designEffect",
        clusterSize: "samplePowerAdj"
      ,
        icc: "icc"}, outputId: "sampleDesignEffect" },
    { formulaId: "measurement.sample_final_n", inputMap: {
        sampleDesignEffect: "sampleDesignEffect"
      ,
        sampleFinite: "sampleFinite",
        designEffect: "designEffect"}, outputId: "sampleFinalN" },
    { formulaId: "cost.sampling_total_cost", inputMap: {
        sampleFinalN: "sampleFinalN",
        costPerSample: "samplingCostPerUnit"
      ,
        fixedCost: "fixedCost"}, outputId: "samplingTotalCost" },
  ],
  reportTemplate: { title: "Sample Size Analysis Report", title_i18n: {"en":"Sample Size Analysis Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.0, volatilityPercent: 5, targetMarginPercent: 10, assumptionNotes: ["Sonsuz = Z² × p(1-p) / e².", "Sonlu = n0 / (1 + (n0-1)/N).", "Power adjustment = n × f(power).", "Design effect = n × DEFF."],assumptionNotes_i18n:[{"en":"Infinite = Z² × p(1-p) / e²."},{"en":"Finite = n0 / (1 + (n0-1)/N)."},{"en":"Power adjustment = n × f(power)."},{"en":"Design effect = n × DEFF."}] },
};
