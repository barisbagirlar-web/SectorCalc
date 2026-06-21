/**
 * Project Overrun risk — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PROJECTOVERRUN_SCHEMA: PremiumCalculatorSchema = {
  id: "project-overrun-analyzer",
  legacyPaidSlug: "project-overrun-analyzer",
  name: "Project Overrun risk",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Project Overrun risk — premium analysis tool.",
  inputs: [
    { id: "pv", label: "PV", type: "number", required: true },
    { id: "planligercek_sure_gun", label: "Planlı/Gerçek Süre gün", type: "number", required: true },
    { id: "gecikme_cezasi_currencygun", label: "Gecikme Cezası currency/gün", type: "number", required: true },
    { id: "gecikmemaliyet_asim_olasiligi", label: "Gecikme/Maliyet Aşım Olasılığı", type: "number", required: true },
    { id: "hizlandirma_maliyeti", label: "Hızlandırma Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "s_p_i", label: "S P I", unit: "currency", format: "currency" },
    { id: "c_p_i", label: "C P I", unit: "currency", format: "currency" },
    { id: "e_a_c", label: "E A C", unit: "currency", format: "currency" },
    { id: "expected_overrun", label: "Expected Overrun", unit: "currency", format: "currency" },
    { id: "schedule_delay", label: "Schedule Delay", unit: "currency", format: "currency" },
    { id: "risk_exposure", label: "Risk Exposure", unit: "currency", format: "currency" },
    { id: "mitigation_cost", label: "Mitigation Cost", unit: "currency", format: "currency" },
    { id: "net_risk", label: "Net Risk", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.project_overrun_risk_analyzer_0", inputMap: { EarnedValue: "earned_value", PlannedValue: "planned_value" }, outputId: "s_p_i" },
    { formulaId: "custom.project_overrun_risk_analyzer_1", inputMap: { EarnedValue: "earned_value", ActualCost: "actual_cost" }, outputId: "c_p_i" },
    { formulaId: "custom.project_overrun_risk_analyzer_2", inputMap: { BudgetAtCompletion: "budget_at_completion", CPI: "c_p_i" }, outputId: "e_a_c" },
    { formulaId: "custom.project_overrun_risk_analyzer_3", inputMap: { EAC: "e_a_c", BudgetAtCompletion: "budget_at_completion" }, outputId: "expected_overrun" },
    { formulaId: "custom.project_overrun_risk_analyzer_4", inputMap: { ActualDuration: "actual_duration", PlannedDuration: "planned_duration" }, outputId: "schedule_delay" },
    { formulaId: "custom.project_overrun_risk_analyzer_5", inputMap: { ProbabilityOfDelay: "probability_of_delay", DelayDays: "delay_days", DailyPenalty: "daily_penalty", ProbabilityOfCostOverrun: "probability_of_cost_overrun", ExpectedOverrun: "expected_overrun" }, outputId: "risk_exposure" },
    { formulaId: "custom.project_overrun_risk_analyzer_6", inputMap: { CrashingCost: "crashing_cost", FastTrackingCost: "fast_tracking_cost" }, outputId: "mitigation_cost" },
    { formulaId: "custom.project_overrun_risk_analyzer_7", inputMap: { RiskExposure: "risk_exposure", MitigationCost: "mitigation_cost" }, outputId: "net_risk" },
  ],
  reportTemplate: {
    title: "Project Overrun risk Report",
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
