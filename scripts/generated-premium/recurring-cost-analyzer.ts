/**
 * Tekrarlayan Maliyet (RCA) — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const RECURRINGCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "recurring-cost-analyzer",
  legacyPaidSlug: "recurring-cost-analyzer",
  name: "Tekrarlayan Maliyet (RCA)",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Tekrarlayan Maliyet (RCA) — premium analysis tool.",
  inputs: [
    { id: "yillik_frekans", label: "Yıllık Frekans", type: "number", required: true },
    { id: "olay_basina_maliyet", label: "Olay Başına Maliyet", type: "number", required: true },
    { id: "duzeltici_aksiyon_yatirimi", label: "Düzeltici Aksiyon Yatırımı", type: "number", required: true },
    { id: "iskonto_orani_r", label: "İskonto Oranı r", type: "number", required: true },
    { id: "analiz_omru_n_yil", label: "Analiz Ömrü n yıl", type: "number", required: true },
  ],
  outputs: [
    { id: "recurring_cost__annual", label: "Recurring Cost_ Annual", unit: "currency", format: "currency" },
    { id: "present_value__recurring", label: "Present Value_ Recurring", unit: "currency", format: "currency" },
    { id: "root_cause_investment", label: "Root Cause Investment", unit: "currency", format: "currency" },
    { id: "payback_period", label: "Payback Period", unit: "currency", format: "currency" },
    { id: "n_p_v__elimination", label: "N P V_ Elimination", unit: "currency", format: "currency" },
    { id: "breakeven_frequency", label: "Breakeven Frequency", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.tekrarlayan_maliyet_rca_analyzer_0", inputMap: { Frequency: "frequency", CostPerEvent: "cost_per_event" }, outputId: "recurring_cost__annual" },
    { formulaId: "custom.tekrarlayan_maliyet_rca_analyzer_1", inputMap: { RecurringCost_Annual: "recurring_cost__annual" }, outputId: "present_value__recurring" },
    { formulaId: "custom.tekrarlayan_maliyet_rca_analyzer_2", inputMap: { CorrectiveActionCost: "corrective_action_cost", ImplementationCost: "implementation_cost" }, outputId: "root_cause_investment" },
    { formulaId: "custom.tekrarlayan_maliyet_rca_analyzer_3", inputMap: { RootCauseInvestment: "root_cause_investment", RecurringCost_Annual: "recurring_cost__annual" }, outputId: "payback_period" },
    { formulaId: "custom.tekrarlayan_maliyet_rca_analyzer_4", inputMap: { PresentValue_Recurring: "present_value__recurring", RootCauseInvestment: "root_cause_investment" }, outputId: "n_p_v__elimination" },
    { formulaId: "custom.tekrarlayan_maliyet_rca_analyzer_5", inputMap: { RootCauseInvestment: "root_cause_investment", CostPerEvent: "cost_per_event" }, outputId: "breakeven_frequency" },
  ],
  reportTemplate: {
    title: "Tekrarlayan Maliyet (RCA) Report",
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
