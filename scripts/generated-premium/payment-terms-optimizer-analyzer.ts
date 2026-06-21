/**
 * Ödeme Vadesi Optimize Edici — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const PAYMENTTERMSOPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "payment-terms-optimizer-analyzer",
  legacyPaidSlug: "payment-terms-optimizer-analyzer",
  name: "Ödeme Vadesi Optimize Edici",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Ödeme Vadesi Optimize Edici — premium analysis tool.",
  inputs: [
    { id: "yillik_gelir", label: "Yıllık Gelir", type: "number", required: true },
    { id: "ortalama_vade_gun", label: "Ortalama Vade gün", type: "number", required: true },
    { id: "wacc", label: "WACC", type: "number", required: true },
    { id: "erken_odeme_iskontosu", label: "Erken Ödeme İskontosu", type: "number", required: true },
    { id: "iskonto_kullanim_orani", label: "İskonto Kullanım Oranı", type: "number", required: true },
    { id: "temerrutbatma_orani", label: "Temerrüt/Batma Oranı", type: "number", required: true },
    { id: "alacak_bakiyesi", label: "Alacak Bakiyesi", type: "number", required: true },
  ],
  outputs: [
    { id: "d_s_o", label: "D S O", unit: "currency", format: "currency" },
    { id: "carrying_cost__a_r", label: "Carrying Cost_ A R", unit: "currency", format: "currency" },
    { id: "bad_debt_expense", label: "Bad Debt Expense", unit: "currency", format: "currency" },
    { id: "discount_cost", label: "Discount Cost", unit: "currency", format: "currency" },
    { id: "optimal_terms", label: "Optimal Terms", unit: "currency", format: "currency" },
    { id: "cash_flow_impact", label: "Cash Flow Impact", unit: "currency", format: "currency" },
    { id: "n_p_v__terms", label: "N P V_ Terms", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.odeme_vadesi_optimize_edici_analyzer_0", inputMap: { AccountsReceivable: "accounts_receivable", Revenue: "revenue", Days: "days" }, outputId: "d_s_o" },
    { formulaId: "custom.odeme_vadesi_optimize_edici_analyzer_1", inputMap: { AverageAR: "average_a_r", WACC: "wacc" }, outputId: "carrying_cost__a_r" },
    { formulaId: "custom.odeme_vadesi_optimize_edici_analyzer_2", inputMap: { Revenue: "revenue", DefaultRate: "default_rate" }, outputId: "bad_debt_expense" },
    { formulaId: "custom.odeme_vadesi_optimize_edici_analyzer_3", inputMap: { EarlyPaymentDiscountPct: "early_payment_discount_pct", DiscountTakeRate: "discount_take_rate", Revenue: "revenue" }, outputId: "discount_cost" },
    { formulaId: "custom.odeme_vadesi_optimize_edici_analyzer_4", inputMap: { Terms: "terms", where: "where", CarryingCost: "carrying_cost", BadDebt: "bad_debt", DiscountCost: "discount_cost", is: "erken_odeme_iskontosu", MINIMUM: "m_i_n_i_m_u_m" }, outputId: "optimal_terms" },
    { formulaId: "custom.odeme_vadesi_optimize_edici_analyzer_5", inputMap: { NewDSO: "new_d_s_o", OldDSO: "old_d_s_o", Revenue: "revenue" }, outputId: "cash_flow_impact" },
    { formulaId: "custom.odeme_vadesi_optimize_edici_analyzer_6", inputMap: { CashInflow_t: "cash_inflow_t", DailyWACC: "wacc" }, outputId: "n_p_v__terms" },
  ],
  reportTemplate: {
    title: "Ödeme Vadesi Optimize Edici Report",
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
