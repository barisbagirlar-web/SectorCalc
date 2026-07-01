/**
 * Tool #16 — Chatter Yüzey Kalite Kaybı
 * V_c → f_z → SurfaceRoughness → QualityLossCost
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const CHATTER_SCHEMA: PremiumCalculatorSchema = {
  id: "chatter-surface-quality-analyzer", legacyPaidSlug: "chatter-surface-quality-analyzer",
  name: "Chatter Surface Quality Loss Analyzer", name_i18n: {"en":"Chatter Surface Quality Loss Analyzer"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "CNC işlemede chatter (titreşim) yüzey pürüzlülüğünü artırır, tolerans dışı parça ve hurda oranını yükseltir. Bu araç kesme parametrelerinden yola çıkarak yüzey kalitesi kaybını hesaplar.", painStatement_i18n: {"en":"Chatter (vibration) in CNC machining increases surface roughness, raising out-of-tolerance Parts and Scrap rate. This tool calculates surface quality loss based on cutting parameters."},
  inputs: [
    { id: "cuttingSpeed", label: "Cutting speed", label_i18n: {"en":"Cutting speed"}, type: "number", unit: "m/dak", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed", expertMeaning_i18n: {"en":"Cutting speed"} },
    { id: "spindleRpm", label: "Devir (n)", label_i18n: {"en":"Rotation (n)"}, type: "number", unit: "rpm", required: true, smartDefault: 3000, validation: { min: 1 }, helper: "", expertMeaning: "Spindle speed", expertMeaning_i18n: {"en":"Spindle speed"} },
    { id: "feedRate", label: "Feed rate", label_i18n: {"en":"Feed rate"}, type: "number", unit: "mm/dak", required: true, smartDefault: 600, validation: { min: 0.1 }, helper: "", expertMeaning: "Feed rate", expertMeaning_i18n: {"en":"Feed rate"} },
    { id: "toothCount", label: "Number of cutting teeth", label_i18n: {"en":"Number of cutting teeth"}, type: "number", unit: "", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of cutting teeth", expertMeaning_i18n: {"en":"Number of cutting teeth"} },
    { id: "toolNoseRadius", label: "Insert nose radius", label_i18n: {"en":"Insert nose radius"}, type: "number", unit: "mm", required: true, smartDefault: 0.8, validation: { min: 0.01 }, helper: "", expertMeaning: "Insert nose radius", expertMeaning_i18n: {"en":"Insert nose radius"} },
    { id: "chatterAmplification", label: "Chatter amplification over theoretical Ra", label_i18n: {"en":"Chatter amplification over theoretical Ra"}, type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 500 }, helper: "", expertMeaning: "Chatter amplification over theoretical Ra", expertMeaning_i18n: {"en":"Chatter amplification over theoretical Ra"} },
    { id: "surfaceRoughnessLimitRa", label: "Maximum allowed Ra per spec", label_i18n: {"en":"Maximum allowed Ra per spec"}, type: "number", unit: "µm", required: true, smartDefault: 1.6, validation: { min: 0.01 }, helper: "", expertMeaning: "Maximum allowed Ra per spec", expertMeaning_i18n: {"en":"Maximum allowed Ra per spec"} },
    { id: "maxToleranceRa", label: "Maksimum Tolerans (Ra_max)", label_i18n: {"en":"Maksimum tolerance (Ra_max)"}, type: "number", unit: "µm", required: false, smartDefault: 3.2, validation: { min: 0.01 }, helper: "", expertMeaning: "Absolute max Ra — beyond = scrap", expertMeaning_i18n: {"en":"Absolute max Ra — beyond = scrap"} },
    { id: "batchSize", label: "Batch size for scrap calculation", label_i18n: {"en":"Batch size for scrap calculation"}, type: "number", unit: "adet", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Batch size for scrap calculation", expertMeaning_i18n: {"en":"Batch size for scrap calculation"} },
    { id: "reworkCostPerMicron", label: "Rework cost per micron overshoot", label_i18n: {"en":"Rework cost per micron overshoot"}, type: "number", unit: "USD/µm", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Rework cost per micron overshoot", expertMeaning_i18n: {"en":"Rework cost per micron overshoot"} },
  ],
  outputs: [
    { id: "cuttingSpeedResult", label: "Kesme Hz (V_c)", label_i18n: {"en":"Kesme Hz (V_c)"}, unit: "m/dak", format: "number" },
    { id: "chipLoad", label: "Talas Kalnlg (f_z)", label_i18n: {"en":"Talas Kalnlg (f_z)"}, unit: "mm/diş", format: "number" },
    { id: "theoreticalRa", label: "Teorik Yuzey Puruzlulugu (Ra)", label_i18n: {"en":"Teorik Yuzey Puruzlulugu (Ra)"}, unit: "µm", format: "number" },
    { id: "actualRa", label: "Gercek Yuzey Puruzlulugu (Ra)", label_i18n: {"en":"Actual Yuzey Puruzlulugu (Ra)"}, unit: "µm", format: "number" },
    { id: "qualityLossCost", label: "Kalite Kayb Maliyeti", label_i18n: {"en":"Quality Loss Cost"}, unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "actualRa", warning: 1.6, critical: 3.2, direction: "higher_is_bad", warningMessage: "Ra > 1.6 µm — yeniden işleme riski var.", warningMessage_i18n: {"en":"Ra > 1.6 µm — rework risk present."}, criticalMessage: "Ra > 3.2 µm — hurda riski yüksek, kesme parametreleri düzeltilmeli.", criticalMessage_i18n: {"en":"Ra > 3.2 µm — Scrap risk high, cutting parameters must be corrected."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cutting_speed", inputMap: { diameter: "cuttingSpeed", rpm: "spindleRpm" }, outputId: "cuttingSpeedResult" },
    { formulaId: "measurement.chip_load", inputMap: { feedRate: "feedRate", toothCount: "toothCount", rpm: "spindleRpm" }, outputId: "chipLoad" },
    { formulaId: "measurement.surface_roughness_theoretical", inputMap: { chipLoad: "chipLoad", noseRadius: "toolNoseRadius" }, outputId: "theoreticalRa" },
    { formulaId: "measurement.surface_roughness_actual", inputMap: { theoreticalRa: "theoreticalRa", chatterAmplification: "chatterAmplification" }, outputId: "actualRa" },
    { formulaId: "cost.chatter_quality_loss", inputMap: { actualRa: "actualRa", toleranceLimit: "surfaceRoughnessLimitRa", reworkCostPerMicron: "reworkCostPerMicron" }, outputId: "qualityLossCost" },
  ],
  reportTemplate: { title: "Chatter Surface Quality Report", title_i18n: {"en":"Chatter Surface Quality Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["V_c = π × D × n / 1000 (m/min). f_z = V_f / (z × n) (mm/tooth).", "Ra_theoretical = f_z² / (8 × r_epsilon) (µm).", "Ra_actual = Ra_theoretical × (1 + chatter/100).", "Quality loss = (Ra_actual - Ra_limit) × rework cost per micron.", "Scrap if Ra_actual > Ra_max: batch × unit cost."],assumptionNotes_i18n:[{"en":"V_c = π × D × n / 1000 (m/min). f_z = V_f / (z × n) (mm/tooth)."},{"en":"Ra_theoretical = f_z² / (8 × r_epsilon) (µm)."},{"en":"Ra_actual = Ra_theoretical × (1 + chatter/100)."},{"en":"Quality loss = (Ra_actual - Ra_limit) × rework cost per micron."},{"en":"Scrap if Ra_actual > Ra_max: batch × unit cost."}] },
};
