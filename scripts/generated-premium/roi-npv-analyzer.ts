/**
 * YG ve NBD — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ROINPV_SCHEMA: PremiumCalculatorSchema = {
  id: "roi-npv-analyzer",
  legacyPaidSlug: "roi-npv-analyzer",
  name: "YG ve NBD",
  sectorSlug: "general",
  category: "cost",
  painStatement: "YG ve NBD — premium analysis tool.",
  inputs: [
    { id: "ilk_yatirim", label: "İlk Yatırım", type: "number", required: true },
    { id: "yillik_nakit_akislari_array", label: "Yıllık Nakit Akışları array", type: "number", required: true },
    { id: "proje_omru_yil", label: "Proje Ömrü yıl", type: "number", required: true },
    { id: "iskonto_oraniwacc", label: "İskonto Oranı/WACC", type: "number", required: true },
    { id: "hedef_roi", label: "Hedef ROI", type: "number", required: true },
  ],
  outputs: [
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
    { id: "n_p_v", label: "N P V", unit: "currency", format: "currency" },
    { id: "i_r_r", label: "I R R", unit: "currency", format: "currency" },
    { id: "payback_period", label: "Payback Period", unit: "currency", format: "currency" },
    { id: "profitability_index", label: "Profitability Index", unit: "currency", format: "currency" },
    { id: "discounted_payback", label: "Discounted Payback", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.yg_ve_nbd_analyzer_0", inputMap: { TotalNetProfit: "total_net_profit", TotalInvestment: "total_investment" }, outputId: "r_o_i" },
    { formulaId: "custom.yg_ve_nbd_analyzer_1", inputMap: { CashFlow_t: "cash_flow_t", DiscountRate: "discount_rate", InitialInvestment: "initial_investment" }, outputId: "n_p_v" },
    { formulaId: "custom.yg_ve_nbd_analyzer_2", inputMap: { Rate: "rate", where: "where", NPV: "n_p_v" }, outputId: "i_r_r" },
    { formulaId: "custom.yg_ve_nbd_analyzer_3", inputMap: { Year: "year", before: "before", full: "full", recovery: "recovery", UnrecoveredCost: "unrecovered_cost", CashFlow_RecoveryYear: "cash_flow__recovery_year" }, outputId: "payback_period" },
    { formulaId: "custom.yg_ve_nbd_analyzer_4", inputMap: { PV_FutureCashFlows: "p_v__future_cash_flows", InitialInvestment: "initial_investment" }, outputId: "profitability_index" },
    { formulaId: "custom.yg_ve_nbd_analyzer_5", inputMap: { Year: "year", where: "where", CumulativeDiscountedCashFlow: "cumulative_discounted_cash_flow" }, outputId: "discounted_payback" },
  ],
  reportTemplate: {
    title: "YG ve NBD Report",
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
