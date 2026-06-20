/**
 * Tool #21 — Tedarik Zinciri Risk
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const SUPPLY_CHAIN_DISRUPTION_SCHEMA: PremiumCalculatorSchema = {
  id: "supply-chain-disruption-analyzer", legacyPaidSlug: "supply-chain-disruption-analyzer",
  name: "Tedarik Zinciri Kesinti Risk Analizi", sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Tedarik zinciri kesintileri gelir kaybına yol açar ancak risk bazlı maliyet hesaplanmadığında önlem bütçesi yetersiz kalır.",
  inputs: [
    { id: "annualRevenue", label: "Yıllık Gelir", type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Annual revenue" },
    { id: "disruptionProbability", label: "Kesinti Olasılığı", type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Probability of disruption event" },
    { id: "revenueAtRisk", label: "Risk Altındaki Gelir Oranı", type: "number", unit: "%", required: true, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Revenue at risk per disruption" },
    { id: "recoveryDays", label: "Toparlanma Süresi", type: "number", unit: "gün", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Recovery time in days" },
    { id: "mitigationCost", label: "Hafifletme Maliyeti", type: "number", unit: "USD", required: false, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Annual mitigation investment" },
    { id: "downtimeCostPerDay", label: "Günlük Kesinti Maliyeti", type: "number", unit: "USD/gün", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Cost per disruption day" },
  ],
  outputs: [
    { id: "riskExposureSc", label: "Risk Bazlı Maruziyet", unit: "USD/yıl", format: "currency" },
    { id: "revenueLossSc", label: "Tahmini Gelir Kaybı", unit: "USD/yıl", format: "currency" },
    { id: "riskAdjustedCostSc", label: "Risk Ayarlı Toplam Maliyet", unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "resilienceIndex", label: "Dayanıklılık Endeksi", unit: "", format: "score" },
  ],
  thresholds: [{ fieldId: "resilienceIndex", warning: 60, critical: 30, direction: "lower_is_bad", warningMessage: "Dayanıklılık endeksi < 60 — risk azaltma planı önerilir.", criticalMessage: "Dayanıklılık endeksi < 30 — tedarik zinciri kırılgan." }],
  formulaPipeline: [
    { formulaId: "cost.risk_exposure_sc", inputMap: { annualRevenue: "annualRevenue", disruptionProbability: "disruptionProbability", revenueAtRisk: "revenueAtRisk" }, outputId: "riskExposureSc" },
    { formulaId: "cost.revenue_loss_sc", inputMap: { annualRevenue: "annualRevenue", revenueAtRisk: "revenueAtRisk", recoveryDays: "recoveryDays" }, outputId: "revenueLossSc" },
    { formulaId: "cost.risk_adjusted_cost_sc", inputMap: { riskExposureSc: "riskExposureSc", revenueLossSc: "revenueLossSc", mitigationCost: "mitigationCost" }, outputId: "riskAdjustedCostSc" },
    { formulaId: "measurement.resilience_index", inputMap: { riskExposureSc: "riskExposureSc", mitigationCost: "mitigationCost", downtimeCostPerDay: "downtimeCostPerDay" }, outputId: "resilienceIndex" },
  ],
  reportTemplate: { title: "Supply Chain Disruption Risk Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.25, volatilityPercent: 15, targetMarginPercent: 15, assumptionNotes: ["Risk exposure = Revenue × Probability × AtRisk%.", "Revenue loss = annual × (recovery/365).", "Resilience index weighted from multiple factors."] },
};
