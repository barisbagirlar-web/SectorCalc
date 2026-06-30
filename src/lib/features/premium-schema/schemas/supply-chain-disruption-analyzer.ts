/**
 * Tool #21 — Tedarik Zinciri Risk
 */
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SUPPLY_CHAIN_DISRUPTION_SCHEMA: PremiumCalculatorSchema = {
  id: "supply-chain-disruption-analyzer", legacyPaidSlug: "supply-chain-disruption-analyzer",
  name: "Tedarik Zinciri Kesinti Risk Analizi", name_i18n: {"en":"Supply Chain Disruption Risk Analysis","tr":"Tedarik Zinciri Kesinti Risk Analizi"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Tedarik zinciri kesintileri gelir kaybına yol açar ancak risk bazlı maliyet hesaplanmadığında önlem bütçesi yetersiz kalır.", painStatement_i18n: {"en":"Supply chain disruptions cause revenue loss, but without risk-based cost calculation, mitigation budgets remain inadequate.","tr":"Tedarik zinciri kesintileri gelir kaybına yol açar ancak risk bazlı maliyet hesaplanmadığında önlem bütçesi yetersiz kalır."},
  inputs: [
    { id: "annualRevenue", label: "Yıllık Gelir", label_i18n: {"en":"Annual Revenue","tr":"Yıllık Gelir"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Annual revenue", expertMeaning_i18n: {"en":"Annual revenue","tr":"Yıllık gelir"} },
    { id: "disruptionProbability", label: "Kesinti Olasılığı", label_i18n: {"en":"Disruption Probability","tr":"Kesinti Olasılığı"}, type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Probability of disruption event", expertMeaning_i18n: {"en":"Probability of disruption event","tr":"Kesinti olayı olasılığı"} },
    { id: "revenueAtRisk", label: "Risk Altındaki Gelir Oranı", label_i18n: {"en":"Revenue at Risk Rate","tr":"Risk Altındaki Gelir Oranı"}, type: "number", unit: "%", required: true, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Revenue at risk per disruption", expertMeaning_i18n: {"en":"Revenue at risk per disruption","tr":"Kesinti başına risk altındaki gelir"} },
    { id: "recoveryDays", label: "Toparlanma Süresi", label_i18n: {"en":"Recovery Time","tr":"Toparlanma Süresi"}, type: "number", unit: "gün", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Recovery time in days", expertMeaning_i18n: {"en":"Recovery time in days","tr":"Gün cinsinden toparlanma süresi"} },
    { id: "mitigationCost", label: "Hafifletme Maliyeti", label_i18n: {"en":"Mitigation Cost","tr":"Hafifletme Maliyeti"}, type: "number", unit: "USD", required: false, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Annual mitigation investment", expertMeaning_i18n: {"en":"Annual mitigation investment","tr":"Yıllık hafifletme yatırımı"} },
    { id: "downtimeCostPerDay", label: "Günlük Kesinti Maliyeti", label_i18n: {"en":"Daily Disruption Cost","tr":"Günlük Kesinti Maliyeti"}, type: "number", unit: "USD/gün", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Cost per disruption day", expertMeaning_i18n: {"en":"Cost per disruption day","tr":"Kesinti günü başına maliyet"} },
  ],
  outputs: [
    { id: "riskExposureSc", label: "Risk Bazlı Maruziyet", label_i18n: {"en":"Risk-Based Exposure","tr":"Risk Bazlı Maruziyet"}, unit: "USD/yıl", format: "currency" },
    { id: "revenueLossSc", label: "Tahmini Gelir Kaybı", label_i18n: {"en":"Estimated Revenue Loss","tr":"Tahmini Gelir Kaybı"}, unit: "USD/yıl", format: "currency" },
    { id: "riskAdjustedCostSc", label: "Risk Ayarlı Toplam Maliyet", label_i18n: {"en":"Risk-Adjusted Total Cost","tr":"Risk Ayarlı Toplam Maliyet"}, unit: "USD/yıl", format: "currency", isBigNumber: true },
    { id: "resilienceIndex", label: "Dayanıklılık Endeksi", label_i18n: {"en":"Resilience Index","tr":"Dayanıklılık Endeksi"}, unit: "", format: "score" },
  ],
  thresholds: [{ fieldId: "resilienceIndex", warning: 60, critical: 30, direction: "lower_is_bad", warningMessage: "Dayanıklılık endeksi < 60 — risk azaltma planı önerilir.", warningMessage_i18n: {"en":"Resilience index < 60 — risk mitigation plan recommended.","tr":"Dayanıklılık endeksi < 60 — risk azaltma planı önerilir."}, criticalMessage: "Dayanıklılık endeksi < 30 — tedarik zinciri kırılgan.", criticalMessage_i18n: {"en":"Resilience index < 30 — supply chain is fragile.","tr":"Dayanıklılık endeksi < 30 — tedarik zinciri kırılgan."} }],
  formulaPipeline: [
    { formulaId: "cost.risk_exposure_sc", inputMap: { annualRevenue: "annualRevenue", disruptionProbability: "disruptionProbability", revenueAtRisk: "revenueAtRisk" }, outputId: "riskExposureSc" },
    { formulaId: "cost.revenue_loss_sc", inputMap: { annualRevenue: "annualRevenue", revenueAtRisk: "revenueAtRisk", recoveryDays: "recoveryDays" }, outputId: "revenueLossSc" },
    { formulaId: "cost.risk_adjusted_cost_sc", inputMap: { riskExposureSc: "riskExposureSc", revenueLossSc: "revenueLossSc", mitigationCost: "mitigationCost" }, outputId: "riskAdjustedCostSc" },
    { formulaId: "measurement.resilience_index", inputMap: {
        recoveryCapacity: "riskExposureSc",
        normalDemand: "mitigationCost",
        downtimeCostPerDay: "downtimeCostPerDay"
      }, outputId: "resilienceIndex" },
  ],
  reportTemplate: { title: "Supply Chain Disruption Risk Report", title_i18n: {"en":"Supply Chain Disruption Risk Report","tr":"Tedarik Zinciri Kesinti Risk Raporu"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.25, volatilityPercent: 15, targetMarginPercent: 15, assumptionNotes: ["Risk exposure = Revenue × Probability × AtRisk%.", "Revenue loss = annual × (recovery/365).", "Resilience index weighted from multiple factors."],assumptionNotes_i18n:[{"en":"Risk exposure = Revenue × Probability × AtRisk%.","tr":"Risk maruziyeti = Gelir × Olasılık × RiskAltındaki%."},{"en":"Revenue loss = annual × (recovery/365).","tr":"Gelir kaybı = yıllık × (toparlanma/365)."},{"en":"Resilience index weighted from multiple factors.","tr":"Dayanıklılık endeksi birden çok faktörden ağırlıklandırılır."}] },
};
