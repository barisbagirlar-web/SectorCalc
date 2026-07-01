/**
 * Tool #17 — Cıvata Tork (Bolt Torque & Preload)
 * d2 → d3 → A_t → Preload → Torque → YieldCheck
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";

const GRADE_OPTIONS = [
  { value: "8.8", label: "8.8 (Medium carbon steel)", label_i18n: {"en":"8.8 (Medium carbon steel)"} },
  { value: "10.9", label: "10.9 (Alloy steel)", label_i18n: {"en":"10.9 (Alloy steel)"} },
  { value: "12.9", label: "12.9 (Alloy steel)", label_i18n: {"en":"12.9 (Alloy steel)"} },
  { value: "A2_70", label: "A2-70 (Stainless 304)", label_i18n: {"en":"A2-70 (Stainless 304)"} },
  { value: "A4_80", label: "A4-80 (Stainless 316)", label_i18n: {"en":"A4-80 (Stainless 316)"} },
] as const;

export const BOLT_TORQUE_SCHEMA: PremiumCalculatorSchema = {
  id: "bolt-torque-preload-analyzer", legacyPaidSlug: "bolt-torque-preload-analyzer",
  name: "Bolt Torque & Preload Analysis", name_i18n: {"en":"Bolt Torque & Preload Analysis"}, sectorSlug: "cnc-manufacturing", category: "measurement",
  painStatement: "Cıvata bağlantılarında yanlış tork değeri ya yetersiz sıkma (gevşeme) ya da aşırı sıkma (kopma) riski doğurur. Bu araç ISO 898 standartlarına göre tork, öngerilme ve akma kontrolü yapar.", painStatement_i18n: {"en":"Incorrect torque value in bolt connections creates risk of either insufficient tightening (loosening) or excessive tightening (fracture). This tool performs torque, preload, and yield check per ISO 898 standards."},
  inputs: [
    { id: "nominalDiameter", label: "Nominal Diameter (d)", label_i18n: {"en":"Nominal Diameter (d)"}, type: "number", unit: "mm", required: true, smartDefault: 12, validation: { min: 1 }, helper: "", expertMeaning: "Bolt nominal diameter", expertMeaning_i18n: {"en":"Bolt nominal diameter"} },
    { id: "pitch", label: "Hatve (p)", label_i18n: {"en":"Pitch (p)"}, type: "number", unit: "mm", required: true, smartDefault: 1.75, validation: { min: 0.1 }, helper: "", expertMeaning: "Thread pitch", expertMeaning_i18n: {"en":"Thread pitch"} },
    { id: "torqueCoefficient", label: "Friction Coefficient (K)", label_i18n: {"en":"Friction Coefficient (K)"}, type: "number", unit: "", required: true, smartDefault: 0.2, validation: { min: 0.05, max: 0.5 }, helper: "", expertMeaning: "Nut factor (typically 0.15-0.25)", expertMeaning_i18n: {"en":"Nut factor (typically 0.15-0.25)"} },
    { id: "grade", label: "Material Grade", label_i18n: {"en":"Material Grade"}, type: "select", unit: "", required: true, smartDefault: "8.8", options: [...GRADE_OPTIONS], helper: "", expertMeaning: "Bolt grade per ISO 898", expertMeaning_i18n: {"en":"Bolt grade per ISO 898"} },
    { id: "yieldStrength", label: "Yield Strength", label_i18n: {"en":"Yield Strength"}, type: "number", unit: "MPa", required: true, smartDefault: 660, validation: { min: 100 }, helper: "", expertMeaning: "Yield strength of bolt material", expertMeaning_i18n: {"en":"Yield strength of bolt material"} },
    { id: "targetPreloadPercent", label: "Hedef Öngerilme (%)", label_i18n: {"en":"Target Preload (%)"}, type: "number", unit: "%", required: false, smartDefault: 70, validation: { min: 10, max: 100 }, helper: "", expertMeaning: "Target preload as % of yield", expertMeaning_i18n: {"en":"Target preload as % of yield"} },
    { id: "calibrationError", label: "Torque Wrench Calibration Error", label_i18n: {"en":"Torque Wrench Calibration Error"}, type: "number", unit: "%", required: false, smartDefault: 5, validation: { min: 0, max: 50 }, helper: "", expertMeaning: "Wrench calibration uncertainty", expertMeaning_i18n: {"en":"Wrench calibration uncertainty"} },
  ],
  outputs: [
    { id: "pitchDiameter", label: "Kavrama Cap (d2)", label_i18n: {"en":"Kavrama Cap (d2)"}, unit: "mm", format: "number" },
    { id: "rootDiameter", label: "Kok Cap (d3)", label_i18n: {"en":"Kok Cap (d3)"}, unit: "mm", format: "number" },
    { id: "tensileArea", label: "Cekme Gerilme Alan (A_t)", label_i18n: {"en":"Cekme Gerilme Alan (A_t)"}, unit: "mm²", format: "number" },
    { id: "preloadForce", label: "Öngerilme Kuvveti (F)", label_i18n: {"en":"Ongerilme Kuvveti (F)"}, unit: "kN", format: "number" },
    { id: "torque", label: "Skma Torku (T)", label_i18n: {"en":"Skma Torku (T)"}, unit: "Nm", format: "number" },
    { id: "yieldCheck", label: "Akma Kontrolü", label_i18n: {"en":"Akma Kontrolu"}, unit: "", format: "score", isBigNumber: true },
  ],
  thresholds: [
    { fieldId: "yieldCheck", warning: 0.8, critical: 1, direction: "higher_is_bad", warningMessage: "Öngerilme akma dayanımının %80'ine yaklaşıyor.", warningMessage_i18n: {"en":"Preload is approaching 80% of yield strength."}, criticalMessage: "Öngerilme akma dayanımını aşıyor — bağlantı risk altında.", criticalMessage_i18n: {"en":"Preload exceeds yield strength — connection is at risk."} },
  ],
  formulaPipeline: [
    { formulaId: "measurement.bolt_d2", inputMap: { nominalDiameter: "nominalDiameter", pitch: "pitch" }, outputId: "pitchDiameter" },
    { formulaId: "measurement.bolt_d3", inputMap: { nominalDiameter: "nominalDiameter", pitch: "pitch" }, outputId: "rootDiameter" },
    { formulaId: "measurement.bolt_tensile_area", inputMap: { d2: "pitchDiameter", d3: "rootDiameter" }, outputId: "tensileArea" },
    { formulaId: "measurement.bolt_preload", inputMap: { proofStrength: "yieldStrength", tensileArea: "tensileArea" }, outputId: "preloadForce" },
    { formulaId: "measurement.bolt_torque", inputMap: { torqueCoefficient: "torqueCoefficient", nominalDiameter: "nominalDiameter", preload: "preloadForce" }, outputId: "torque" },
  ],
  reportTemplate: { title: "Bolt Torque & Preload Report", title_i18n: {"en":"Bolt Torque & Preload Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.1, volatilityPercent: 10, targetMarginPercent: 15, assumptionNotes: ["d2 = d - 0.649519 × p. d3 = d - 1.226869 × p.", "At = π/4 × ((d2 + d3)/2)². Preload F = 0.7 × Proof × At.", "Torque T = K × D × F. K = nut factor (0.15-0.25 typical).", "Proof strength ≈ 0.9 × Yield for most grades.", "Yield check: sigma_p (F/At) vs Yield Strength. PASS if < 100%."],assumptionNotes_i18n:[{"en":"d2 = d - 0.649519 × p. d3 = d - 1.226869 × p."},{"en":"At = π/4 × ((d2 + d3)/2)². Preload F = 0.7 × Proof × At."},{"en":"Torque T = K × D × F. K = nut factor (0.15-0.25 typical)."},{"en":"Proof strength ≈ 0.9 × Yield for most grades."},{"en":"Yield check: sigma_p (F/At) vs Yield Strength. PASS if < 100%."}]},
};
