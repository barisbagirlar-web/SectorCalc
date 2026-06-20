/**
 * Tool #16 — Chatter Yüzey Kalite Kaybı
 * V_c → f_z → SurfaceRoughness → QualityLossCost
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const CHATTER_SCHEMA: PremiumCalculatorSchema = {
  id: "chatter-surface-quality-analyzer", legacyPaidSlug: "chatter-surface-quality-analyzer",
  name: "Chatter Yüzey Kalite Kaybı Analizi", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "CNC işlemede chatter (titreşim) yüzey pürüzlülüğünü artırır, tolerans dışı parça ve hurda oranını yükseltir. Bu araç kesme parametrelerinden yola çıkarak yüzey kalitesi kaybını hesaplar.",
  inputs: [
    { id: "cuttingSpeed", label: "Kesme Hızı (V_c)", type: "number", unit: "m/dak", required: true, smartDefault: 150, validation: { min: 1 }, helper: "", expertMeaning: "Cutting speed" },
    { id: "spindleRpm", label: "Devir (n)", type: "number", unit: "rpm", required: true, smartDefault: 3000, validation: { min: 1 }, helper: "", expertMeaning: "Spindle speed" },
    { id: "feedRate", label: "İlerleme (V_f)", type: "number", unit: "mm/dak", required: true, smartDefault: 600, validation: { min: 0.1 }, helper: "", expertMeaning: "Feed rate" },
    { id: "toothCount", label: "Diş Sayısı (z)", type: "number", unit: "", required: true, smartDefault: 4, validation: { min: 1 }, helper: "", expertMeaning: "Number of cutting teeth" },
    { id: "toolNoseRadius", label: "Takım Ucu Radyusu (r_epsilon)", type: "number", unit: "mm", required: true, smartDefault: 0.8, validation: { min: 0.01 }, helper: "", expertMeaning: "Insert nose radius" },
    { id: "chatterAmplification", label: "Titreşim Genliği (chatter faktörü)", type: "number", unit: "%", required: false, smartDefault: 30, validation: { min: 0, max: 500 }, helper: "", expertMeaning: "Chatter amplification over theoretical Ra" },
    { id: "surfaceRoughnessLimitRa", label: "Yüzey Pürüzlülüğü Limiti (Ra)", type: "number", unit: "µm", required: true, smartDefault: 1.6, validation: { min: 0.01 }, helper: "", expertMeaning: "Maximum allowed Ra per spec" },
    { id: "maxToleranceRa", label: "Maksimum Tolerans (Ra_max)", type: "number", unit: "µm", required: false, smartDefault: 3.2, validation: { min: 0.01 }, helper: "", expertMeaning: "Absolute max Ra — beyond = scrap" },
    { id: "batchSize", label: "Parti Büyüklüğü", type: "number", unit: "adet", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Batch size for scrap calculation" },
    { id: "reworkCostPerMicron", label: "Yeniden İşleme Maliyeti", type: "number", unit: "USD/µm", required: false, smartDefault: 2, validation: { min: 0 }, helper: "", expertMeaning: "Rework cost per micron overshoot" },
  ],
  outputs: [
    { id: "cuttingSpeedResult", label: "Kesme Hızı (V_c)", unit: "m/dak", format: "number" },
    { id: "chipLoad", label: "Talaş Kalınlığı (f_z)", unit: "mm/diş", format: "number" },
    { id: "theoreticalRa", label: "Teorik Yüzey Pürüzlülüğü (Ra)", unit: "µm", format: "number" },
    { id: "actualRa", label: "Gerçek Yüzey Pürüzlülüğü (Ra)", unit: "µm", format: "number" },
    { id: "qualityLossCost", label: "Kalite Kaybı Maliyeti", unit: "USD", format: "currency", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "actualRa", warning: 1.6, critical: 3.2, direction: "higher_is_bad", warningMessage: "Ra > 1.6 µm — yeniden işleme riski var.", criticalMessage: "Ra > 3.2 µm — hurda riski yüksek, kesme parametreleri düzeltilmeli." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.cutting_speed", inputMap: { diameter: "cuttingSpeed", rpm: "spindleRpm" }, outputId: "cuttingSpeedResult" },
    { formulaId: "measurement.chip_load", inputMap: { feedRate: "feedRate", toothCount: "toothCount", rpm: "spindleRpm" }, outputId: "chipLoad" },
    { formulaId: "measurement.surface_roughness_theoretical", inputMap: { chipLoad: "chipLoad", noseRadius: "toolNoseRadius" }, outputId: "theoreticalRa" },
    { formulaId: "measurement.surface_roughness_actual", inputMap: { theoreticalRa: "theoreticalRa", chatterAmplification: "chatterAmplification" }, outputId: "actualRa" },
    { formulaId: "cost.chatter_quality_loss", inputMap: { actualRa: "actualRa", toleranceLimit: "surfaceRoughnessLimitRa", reworkCostPerMicron: "reworkCostPerMicron" }, outputId: "qualityLossCost" },
  ],
  reportTemplate: { title: "Chatter Surface Quality Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 15, targetMarginPercent: 20, assumptionNotes: ["V_c = π × D × n / 1000 (m/min). f_z = V_f / (z × n) (mm/tooth).", "Ra_theoretical = f_z² / (8 × r_epsilon) (µm).", "Ra_actual = Ra_theoretical × (1 + chatter/100).", "Quality loss = (Ra_actual - Ra_limit) × rework cost per micron.", "Scrap if Ra_actual > Ra_max: batch × unit cost."] },
};
