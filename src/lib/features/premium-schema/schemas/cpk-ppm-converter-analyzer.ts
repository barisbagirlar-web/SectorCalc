
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CPK_PPM_SCHEMA: PremiumCalculatorSchema = {
  id: "cpk-ppm-converter-analyzer", legacyPaidSlug: "cpk-ppm-converter-analyzer",
  name: "CPK → PPM & Sigma Level Converter", name_i18n: {"en":"CPK → PPM & Sigma Level Converter"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "It is impossible to manage process performance without converting Cpk to PPM and Sigma level. This tool calculates Cpk, PPM, Yield and Sigma level in a single step.", painStatement_i18n: {"en":"It is impossible to manage process performance without converting Cpk to PPM and Sigma level. This tool calculates Cpk, PPM, Yield and Sigma level in a single step."},
  inputs: [
    { id: "usl", label: "Upper specification limit", label_i18n: {"en":"Upper specification limit"}, type: "number", unit: "scalar", required: true, smartDefault: 10.05, validation: { min: 0 }, helper: "", expertMeaning: "Upper specification limit", expertMeaning_i18n: {"en":"Upper specification limit"} },
    { id: "lsl", label: "Alt Spesifikasyon Limiti (LSL)", label_i18n: {"en":"Alt Spesifikasyon Limiti (LSL)"}, type: "number", unit: "scalar", required: true, smartDefault: 9.95, validation: { min: 0 }, helper: "", expertMeaning: "Lower specification limit", expertMeaning_i18n: {"en":"Lower specification limit"} },
    { id: "mean", label: "Process mean", label_i18n: {"en":"Process mean"}, type: "number", unit: "scalar", required: true, smartDefault: 10.0, validation: { min: 0 }, helper: "", expertMeaning: "Process mean", expertMeaning_i18n: {"en":"Process mean"} },
    { id: "stdDev", label: "Standart Deviation", label_i18n: {"en":"Standart Deviation"}, type: "number", unit: "scalar", required: true, smartDefault: 0.015, validation: { min: 0.0001 }, helper: "", expertMeaning: "Process standard deviation", expertMeaning_i18n: {"en":"Process standard deviation"} },
    { id: "targetCpk", label: "Hedef Cpk", label_i18n: {"en":"Hedef Cpk"}, type: "number", unit: "scalar", required: false, smartDefault: 1.67, validation: { min: 0 }, helper: "", expertMeaning: "Target Cpk level", expertMeaning_i18n: {"en":"Target Cpk level"} },
    { id: "dailyVolume", label: "Daily production volume", label_i18n: {"en":"Daily production volume"}, type: "number", unit: "units", required: false, smartDefault: 1000, validation: { min: 0 }, helper: "", expertMeaning: "Daily production volume", expertMeaning_i18n: {"en":"Daily production volume"} },
  ],
  outputs: [
    { id: "zUsl", label: "Z_USL", label_i18n: {"en":"Z_USL"}, unit: "scalar", format: "number" },
    { id: "zLsl", label: "Z_LSL", label_i18n: {"en":"Z_LSL"}, unit: "scalar", format: "number" },
    { id: "cpk", label: "Cpk", label_i18n: {"en":"Cpk"}, unit: "scalar", format: "number" },
    { id: "totalPpm", label: "Total PPM", label_i18n: {"en":"Total PPM"}, unit: "scalar", format: "number" },
    { id: "sigmaShort", label: "Sigma level (Ksa Donem)", label_i18n: {"en":"Sigma level (Ksa Donem)"}, unit: "scalar", format: "number" },
    { id: "expectedDefectsDaily", label: "Estimated Daily Error", label_i18n: {"en":"Estimated Daily Error"}, unit: "units/day", format: "number", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "cpk", warning: 1.33, critical: 1.0, direction: "lower_is_bad", warningMessage: "Cpk < 1.33 - proses improvement gerekiyor.", warningMessage_i18n: {"en":"Cpk < 1.33 - proses improvement gerekiyor."}, criticalMessage: "Cpk < 1.0 - proses insufficient, urgent aksiyon.", criticalMessage_i18n: {"en":"Cpk < 1.0 - proses insufficient, urgent aksiyon."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cpk_z_usl", inputMap: { usl: "usl", mean: "mean", stdDev: "stdDev" }, outputId: "zUsl" },
    { formulaId: "measurement.cpk_z_lsl", inputMap: { mean: "mean", lsl: "lsl", stdDev: "stdDev" }, outputId: "zLsl" },
    { formulaId: "measurement.cpk_index", inputMap: { zUsl: "zUsl", zLsl: "zLsl" }, outputId: "cpk" },
    { formulaId: "measurement.cpk_ppm_total", inputMap: {
        pTotal: "zUsl",
        zLsl: "zLsl"
      }, outputId: "totalPpm" },
    { formulaId: "measurement.cpk_sigma_short", inputMap: { cpk: "cpk" }, outputId: "sigmaShort" },
  ],
  reportTemplate: { title: "Cpk & PPM Report", title_i18n: {"en":"Cpk & PPM Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["Z = (USL-Mean)/StdDev. Cpk = MIN(Z_USL,Z_LSL)/3.", "PPM uses normal CDF approximation.", "Sigma short = (Cpk×3)+1.5 (long-term shift)."],assumptionNotes_i18n:[{"en":"Z = (USL-Mean)/StdDev. Cpk = MIN(Z_USL,Z_LSL)/3."},{"en":"PPM uses normal CDF approximation."},{"en":"Sigma short = (Cpk×3)+1.5 (long-term shift)."}] },
};
