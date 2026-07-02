
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const SUPPLY_CHAIN_DISRUPTION_SCHEMA: PremiumCalculatorSchema = {
  id: "supply-chain-disruption-analyzer", legacyPaidSlug: "supply-chain-disruption-analyzer",
  name: "Supply Chain Disruption Risk Analysis", name_i18n: {"en":"Supply Chain Disruption Risk Analysis"}, sectorSlug: "logistics-transport", category: "cost",
  painStatement: "Supply chain disruptions cause revenue loss, but without risk-based cost calculation, mitigation budgets remain inadequate.", painStatement_i18n: {"en":"Supply chain disruptions cause revenue loss, but without risk-based cost calculation, mitigation budgets remain inadequate."},
  inputs: [
    { id: "annualRevenue", label: "Annual Revenue", label_i18n: {"en":"Annual Revenue"}, type: "number", unit: "USD", required: true, smartDefault: 5000000, validation: { min: 1 }, helper: "", expertMeaning: "Annual revenue", expertMeaning_i18n: {"en":"Annual revenue"} },
    { id: "disruptionProbability", label: "Disruption Probability", label_i18n: {"en":"Disruption Probability"}, type: "number", unit: "%", required: true, smartDefault: 5, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Probability of disruption event", expertMeaning_i18n: {"en":"Probability of disruption event"} },
    { id: "revenueAtRisk", label: "Revenue at Risk Rate", label_i18n: {"en":"Revenue at Risk Rate"}, type: "number", unit: "%", required: true, smartDefault: 20, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Revenue at risk per disruption", expertMeaning_i18n: {"en":"Revenue at risk per disruption"} },
    { id: "recoveryDays", label: "Recovery Time", label_i18n: {"en":"Recovery Time"}, type: "number", unit: "days", required: true, smartDefault: 30, validation: { min: 1 }, helper: "", expertMeaning: "Recovery time in days", expertMeaning_i18n: {"en":"Recovery time in days"} },
    { id: "mitigationCost", label: "Mitigation Cost", label_i18n: {"en":"Mitigation Cost"}, type: "number", unit: "USD", required: false, smartDefault: 25000, validation: { min: 0 }, helper: "", expertMeaning: "Annual mitigation investment", expertMeaning_i18n: {"en":"Annual mitigation investment"} },
    { id: "downtimeCostPerDay", label: "Daily Disruption Cost", label_i18n: {"en":"Daily Disruption Cost"}, type: "number", unit: "USD/day", required: false, smartDefault: 5000, validation: { min: 0 }, helper: "", expertMeaning: "Cost per disruption day", expertMeaning_i18n: {"en":"Cost per disruption day"} },
  ],
  outputs: [
    { id: "riskExposureSc", label: "Risk-Based Exposure", label_i18n: {"en":"Risk-Based Exposure"}, unit: "USD/year", format: "currency" },
    { id: "revenueLossSc", label: "Estimated Revenue Loss", label_i18n: {"en":"Estimated Revenue Loss"}, unit: "USD/year", format: "currency" },
    { id: "riskAdjustedCostSc", label: "Risk-Adjusted Total Cost", label_i18n: {"en":"Risk-Adjusted Total Cost"}, unit: "USD/year", format: "currency", isBigNumber: true },
    { id: "resilienceIndex", label: "Resilience Index", label_i18n: {"en":"Resilience Index"}, unit: "", format: "score" },
  ],
  thresholds: [{ fieldId: "resilienceIndex", warning: 60, critical: 30, direction: "lower_is_bad", warningMessage: "Resilience index < 60 — risk mitigation plan recommended.", warningMessage_i18n: {"en":"Resilience index < 60 — risk mitigation plan recommended."}, criticalMessage: "Resilience index < 30 — supply chain is fragile.", criticalMessage_i18n: {"en":"Resilience index < 30 — supply chain is fragile."} }],
  formulaPipeline: [
    { formulaId: "cost.risk_exposure_sc", inputMap: { annualRevenue: "annualRevenue", disruptionProbability: "disruptionProbability", revenueAtRisk: "revenueAtRisk" ,
        supplierSpend: "supplierSpend",
        disruptionProb: "disruptionProb"}, outputId: "riskExposureSc" },
    { formulaId: "cost.revenue_loss_sc", inputMap: { annualRevenue: "annualRevenue", revenueAtRisk: "revenueAtRisk", recoveryDays: "recoveryDays" ,
        disruptionDays: "disruptionDays",
        dailyRevenue: "dailyRevenue",
        impactPct: "impactPct"}, outputId: "revenueLossSc" },
    { formulaId: "cost.risk_adjusted_cost_sc", inputMap: { riskExposureSc: "riskExposureSc", revenueLossSc: "revenueLossSc", mitigationCost: "mitigationCost" }, outputId: "riskAdjustedCostSc" },
    { formulaId: "measurement.resilience_index", inputMap: {
        recoveryCapacity: "riskExposureSc",
        normalDemand: "mitigationCost",
        downtimeCostPerDay: "downtimeCostPerDay"
      }, outputId: "resilienceIndex" },
  ],
  reportTemplate: { title: "Supply Chain Disruption Risk Report", title_i18n: {"en":"Supply Chain Disruption Risk Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.25, volatilityPercent: 15, targetMarginPercent: 15, assumptionNotes: ["Risk exposure = Revenue × Probability × AtRisk%.", "Revenue loss = annual × (recovery/365).", "Resilience index weighted from multiple factors."],assumptionNotes_i18n:[{"en":"Risk exposure = Revenue × Probability × AtRisk%."},{"en":"Revenue loss = annual × (recovery/365)."},{"en":"Resilience index weighted from multiple factors."}] },
};
