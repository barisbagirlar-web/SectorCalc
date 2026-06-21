/**
 * ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SIXSIGMAPROJECTPRIORITIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "six-sigma-project-prioritizer",
  legacyPaidSlug: "six-sigma-project-prioritizer",
  name: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ — premium analysis tool.",
  inputs: [
    { id: "uretim_hacmi", label: "Üretim Hacmi", type: "number", required: true },
    { id: "hatali_birim", label: "Hatalı Birim", type: "number", required: true },
    { id: "hata_firsati", label: "Hata Fırsatı", type: "number", required: true },
    { id: "icdis_basarisizlik_maliyeti", label: "İç/Dış Başarısızlık Maliyeti", type: "number", required: true },
    { id: "mevcut_zbench", label: "Mevcut Z_bench", type: "number", required: true },
    { id: "hedef_sigma", label: "Hedef Sigma", type: "number", required: true },
    { id: "kurtarma_olasiligi", label: "Kurtarma Olasılığı", type: "number", required: true },
  ],
  outputs: [
    { id: "d_p_m_o", label: "D P M O", unit: "currency", format: "currency" },
    { id: "yield", label: "Yield", unit: "currency", format: "currency" },
    { id: "z_bench", label: "Z_bench", unit: "currency", format: "currency" },
    { id: "sigma_level", label: "Sigma Level", unit: "currency", format: "currency" },
    { id: "c_o_p_q", label: "C O P Q", unit: "currency", format: "currency" },
    { id: "project_score", label: "Project Score", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.alti_sigma_proje_onceliklendirici_analyzer_0", inputMap: { Defects: "defects", Units: "units", Opportunities: "opportunities" }, outputId: "d_p_m_o" },
    { formulaId: "custom.alti_sigma_proje_onceliklendirici_analyzer_1", inputMap: { Defects: "defects", Units: "units", Opportunities: "opportunities" }, outputId: "yield" },
    { formulaId: "custom.alti_sigma_proje_onceliklendirici_analyzer_2", inputMap: { Yield: "yield" }, outputId: "z_bench" },
    { formulaId: "custom.alti_sigma_proje_onceliklendirici_analyzer_3", inputMap: { Z_bench: "z_bench" }, outputId: "sigma_level" },
    { formulaId: "custom.alti_sigma_proje_onceliklendirici_analyzer_4", inputMap: { InternalFailure: "internal_failure", ExternalFailure: "external_failure", Appraisal: "appraisal", Prevention: "prevention" }, outputId: "c_o_p_q" },
    { formulaId: "custom.alti_sigma_proje_onceliklendirici_analyzer_5", inputMap: { COPQ: "c_o_p_q", RecoveryProb: "recovery_prob", SigmaGap: "sigma_gap", StrategicAlignment: "strategic_alignment", Ease: "ease" }, outputId: "project_score" },
  ],
  reportTemplate: {
    title: "ALTI SİGMA PROJE ÖNCELİKLENDİRİCİ Report",
    sections: ["executive_summary", "loss_breakdown", "thresholds", "action_plan"],
    exportFormats: ["pdf"],
  },
  assumptions: {
    hiddenLossMultiplier: 1.0,
    volatilityPercent: 10,
    targetMarginPercent: 20,
    assumptionNotes: ["Based on user-provided formulas.", "Verify constants periodically."],
  },
};
