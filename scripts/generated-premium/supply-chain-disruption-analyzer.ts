/**
 * Tedarik Zinciri Kesintisi Risk Değerlendirmesi — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SUPPLYCHAINDISRUPTION_SCHEMA: PremiumCalculatorSchema = {
  id: "supply-chain-disruption-analyzer",
  legacyPaidSlug: "supply-chain-disruption-analyzer",
  name: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi — premium analysis tool.",
  inputs: [
    { id: "kesinti_olasiligi", label: "Kesinti Olasılığı", type: "number", required: true },
    { id: "gunluk_gelir", label: "Günlük Gelir", type: "number", required: true },
    { id: "tamamlanma_suresi_gun", label: "Tamamlanma Süresi gün", type: "number", required: true },
    { id: "tampon_kapasite", label: "Tampon Kapasite", type: "number", required: true },
    { id: "cift_kaynak_prim_maliyeti", label: "Çift Kaynak Prim Maliyeti", type: "number", required: true },
    { id: "sigorta_primi", label: "Sigorta Primi", type: "number", required: true },
    { id: "guvenlik_stogu_maliyeti", label: "Güvenlik Stoğu Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "risk_exposure", label: "Risk Exposure", unit: "currency", format: "currency" },
    { id: "time_to_recover", label: "Time To Recover", unit: "currency", format: "currency" },
    { id: "revenue_loss", label: "Revenue Loss", unit: "currency", format: "currency" },
    { id: "mitigation_cost", label: "Mitigation Cost", unit: "currency", format: "currency" },
    { id: "risk_adjusted_cost", label: "Risk Adjusted Cost", unit: "currency", format: "currency" },
    { id: "resilience_index", label: "Resilience Index", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.tedarik_zinciri_kesintisi_risk_degerlendirmesi_analyzer_0", inputMap: { ProbabilityOfDisruption: "probability_of_disruption", FinancialImpact: "financial_impact" }, outputId: "risk_exposure" },
    { formulaId: "custom.tedarik_zinciri_kesintisi_risk_degerlendirmesi_analyzer_1", inputMap: { DaysToRestoreFullCapacity: "days_to_restore_full_capacity" }, outputId: "time_to_recover" },
    { formulaId: "custom.tedarik_zinciri_kesintisi_risk_degerlendirmesi_analyzer_2", inputMap: { DailyRevenue: "daily_revenue", TimeToRecover: "time_to_recover", BufferCapacityPct: "buffer_capacity_pct" }, outputId: "revenue_loss" },
    { formulaId: "custom.tedarik_zinciri_kesintisi_risk_degerlendirmesi_analyzer_3", inputMap: { DualSourcingPremium: "dual_sourcing_premium", SafetyStockCarryingCost: "safety_stock_carrying_cost", InsurancePremium: "insurance_premium" }, outputId: "mitigation_cost" },
    { formulaId: "custom.tedarik_zinciri_kesintisi_risk_degerlendirmesi_analyzer_4", inputMap: { ExpectedAnnualLoss: "expected_annual_loss", MitigationCost: "mitigation_cost" }, outputId: "risk_adjusted_cost" },
    { formulaId: "custom.tedarik_zinciri_kesintisi_risk_degerlendirmesi_analyzer_5", inputMap: { TimeToRecover: "time_to_recover", VulnerabilityScore: "vulnerability_score" }, outputId: "resilience_index" },
  ],
  reportTemplate: {
    title: "Tedarik Zinciri Kesintisi Risk Değerlendirmesi Report",
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
