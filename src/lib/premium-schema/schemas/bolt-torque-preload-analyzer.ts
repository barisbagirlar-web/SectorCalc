/**
 * Tool #17 — Cıvata Tork (Bolt Torque & Preload)
 * d2 → d3 → A_t → Preload → Torque → YieldCheck
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

const GRADE_OPTIONS = [
  { value: "8.8", label: "8.8 (Medium carbon steel)" },
  { value: "10.9", label: "10.9 (Alloy steel)" },
  { value: "12.9", label: "12.9 (Alloy steel)" },
  { value: "A2_70", label: "A2-70 (Stainless 304)" },
  { value: "A4_80", label: "A4-80 (Stainless 316)" },
] as const;

export const BOLT_TORQUE_SCHEMA: PremiumCalculatorSchema = {
  id: "bolt-torque-preload-analyzer", legacyPaidSlug: "bolt-torque-preload-analyzer",
  name: "Cıvata Tork & Öngerilme Analizi", sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Cıvata bağlantılarında yanlış tork değeri ya yetersiz sıkma (gevşeme) ya da aşırı sıkma (kopma) riski doğurur. Bu araç ISO 898 standartlarına göre tork, öngerilme ve akma kontrolü yapar.",
  inputs: [
    { id: "nominalDiameter", label: "Nominal Çap (d)", type: "number", unit: "mm", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Bolt nominal diameter" },
    { id: "pitch", label: "Hatve (p)", type: "number", unit: "mm", required: true, smartDefault: 1.75, validation: { min: 0.1 }, helper: "", expertMeaning: "Thread pitch" },
    { id: "torqueCoefficient", label: "Sürtünme Katsayısı (K)", type: "number", unit: "", required: true, smartDefault: 0.2, validation: { min: 0.05, max: 0.5 }, helper: "", expertMeaning: "Nut factor (typically 0.15-0.25)" },
    { id: "grade", label: "Malzeme Sınıfı", type: "select", unit: "", required: true, smartDefault: "8.8", options: [...GRADE_OPTIONS], helper: "", expertMeaning: "Bolt grade per ISO 898" },
    { id: "yieldStrength", label: "Akma Dayanımı", type: "number", unit: "MPa", required: true, smartDefault: 660, validation: { min: 100 }, helper: "", expertMeaning: "Yield strength of bolt material" },
    { id: "targetPreloadPercent", label: "Hedef Öngerilme (%)", type: "number", unit: "%", required: false, smartDefault: 70, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Target preload as % of yield" },
    { id: "calibrationError", label: "Tork Anahtarı Kalibrasyon Hatası", type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Wrench calibration uncertainty" },
  ],
  outputs: [
    { id: "pitchDiameter", label: "Kavrama Çapı (d₂)", unit: "mm", format: "number" },
    { id: "rootDiameter", label: "Kök Çapı (d₃)", unit: "mm", format: "number" },
    { id: "tensileArea", label: "Çekme Gerilme Alanı (A_t)", unit: "mm²", format: "number" },
    { id: "preloadForce", label: "Öngerilme Kuvveti (F)", unit: "kN", format: "number" },
    { id: "torque", label: "Sıkma Torku (T)", unit: "Nm", format: "number" },
    { id: "yieldCheck", label: "Akma Kontrolü", unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "yieldCheck", warning: 0.8, critical: 1, direction: "higher_is_bad", warningMessage: "Öngerilme akma dayanımının %80'ine yaklaşıyor.", criticalMessage: "Öngerilme akma dayanımını aşıyor — bağlantı risk altında." },
  ],
  formulaPipeline: [
    { formulaId: "measurement.bolt_d2", inputMap: { nominalDiameter: "nominalDiameter", pitch: "pitch" }, outputId: "pitchDiameter" },
    { formulaId: "measurement.bolt_d3", inputMap: { nominalDiameter: "nominalDiameter", pitch: "pitch" }, outputId: "rootDiameter" },
    { formulaId: "measurement.bolt_tensile_area", inputMap: { d2: "pitchDiameter", d3: "rootDiameter" }, outputId: "tensileArea" },
    { formulaId: "measurement.bolt_preload", inputMap: { proofStrength: "yieldStrength", tensileArea: "tensileArea" }, outputId: "preloadForce" },
    { formulaId: "measurement.bolt_torque", inputMap: { torqueCoefficient: "torqueCoefficient", nominalDiameter: "nominalDiameter", preload: "preloadForce" }, outputId: "torque" },
  ],
  reportTemplate: { title: "Bolt Torque & Preload Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["d2 = d - 0.649519 × p. d3 = d - 1.226869 × p.", "At = π/4 × ((d2 + d3)/2)². Preload F = 0.7 × Proof × At.", "Torque T = K × D × F. K = nut factor (0.15-0.25 typical).", "Proof strength ≈ 0.9 × Yield for most grades.", "Yield check: sigma_p (F/At) vs Yield Strength. PASS if < 100%."] },
};
