/**
 * Noise & Vibration Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const NOISEVIBRATIONCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "noise-vibration-cost-analyzer",
  legacyPaidSlug: "noise-vibration-cost-analyzer",
  name: "Noise & Vibration Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Noise & Vibration Maliyet — premium analysis tool.",
  inputs: [
    { id: "gurultu_seviyeleri_ve_sureler", label: "Gürültü Seviyeleri ve Süreler", type: "array", required: true },
    { id: "titresim_ivmeleri", label: "Titreşim İvmeleri", type: "array", required: true },
    { id: "titresim_kaynakli_hata_orani", label: "Titreşim Kaynaklı Hata Oranı", type: "number", required: true },
    { id: "cikti_farki", label: "Çıktı Farkı", type: "number", required: true },
    { id: "taramakkdsigorta_maliyeti", label: "Tarama/KKD/Sigorta Maliyeti", type: "number", required: true },
    { id: "yalitim_yatirimi", label: "Yalıtım Yatırımı", type: "number", required: true },
  ],
  outputs: [
    { id: "noise_exposure_d_b_a", label: "Noise Exposure_d B A", unit: "currency", format: "currency" },
    { id: "vibration__r_m_s", label: "Vibration_ R M S", unit: "currency", format: "currency" },
    { id: "health_cost", label: "Health Cost", unit: "currency", format: "currency" },
    { id: "productivity_loss", label: "Productivity Loss", unit: "currency", format: "currency" },
    { id: "rework_cost", label: "Rework Cost", unit: "currency", format: "currency" },
    { id: "mitigation_r_o_i", label: "Mitigation R O I", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.noise_ve_vibration_maliyet_analyzer_0", inputMap: { t_i: "t_i", L_i: "l_i" }, outputId: "noise_exposure_d_b_a" },
    { formulaId: "custom.noise_ve_vibration_maliyet_analyzer_1", inputMap: { a_i: "a_i", t_i: "t_i" }, outputId: "vibration__r_m_s" },
    { formulaId: "custom.noise_ve_vibration_maliyet_analyzer_2", inputMap: { Noise: "noise", Vibration: "vibration", Limit: "limit", MedicalScreening: "medical_screening", PPE_Cost: "p_p_e__cost", InsurancePremiumHike: "insurance_premium_hike" }, outputId: "health_cost" },
    { formulaId: "custom.noise_ve_vibration_maliyet_analyzer_3", inputMap: { ActualOutput: "actual_output", BaselineOutput: "baseline_output", UnitMargin: "unit_margin" }, outputId: "productivity_loss" },
    { formulaId: "custom.noise_ve_vibration_maliyet_analyzer_4", inputMap: { VibrationDefectRate: "vibration_defect_rate", TotalUnits: "total_units", ReworkCostPerUnit: "rework_cost_per_unit" }, outputId: "rework_cost" },
    { formulaId: "custom.noise_ve_vibration_maliyet_analyzer_5", inputMap: { HealthCost: "health_cost", ProdLoss: "prod_loss", ReworkCost: "rework_cost", MitigationInvestment: "mitigation_investment" }, outputId: "mitigation_r_o_i" },
  ],
  reportTemplate: {
    title: "Noise & Vibration Maliyet Report",
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
