/**
 * Nakit Akışı Açığı — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CASHFLOWGAP_SCHEMA: PremiumCalculatorSchema = {
  id: "cash-flow-gap-analyzer",
  legacyPaidSlug: "cash-flow-gap-analyzer",
  name: "Nakit Akışı Açığı",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Nakit Akışı Açığı — premium analysis tool.",
  inputs: [
    { id: "aylik_nakit_giriscikis", label: "Aylık Nakit Giriş/Çıkış", type: "array", required: true },
    { id: "alacakborc_stok_bakiyeleri", label: "Alacak/Borç Stok Bakiyeleri", type: "number", required: true },
    { id: "kredi_satislar", label: "Kredi Satışlar", type: "number", required: true },
    { id: "vade_gun", label: "Vade gün", type: "number", required: true },
    { id: "kredi_alimlar", label: "Kredi Alımlar", type: "number", required: true },
    { id: "vade_gun", label: "Vade gün", type: "number", required: true },
    { id: "gunluk_faiz_orani", label: "Günlük Faiz Oranı", type: "number", required: true },
  ],
  outputs: [
    { id: "cash_inflow", label: "Cash Inflow", unit: "currency", format: "currency" },
    { id: "cash_outflow", label: "Cash Outflow", unit: "currency", format: "currency" },
    { id: "net_cash_flow_t", label: "Net Cash Flow_t", unit: "currency", format: "currency" },
    { id: "cumulative_cash_flow", label: "Cumulative Cash Flow", unit: "currency", format: "currency" },
    { id: "cash_gap", label: "Cash Gap", unit: "currency", format: "currency" },
    { id: "d_s_o", label: "D S O", unit: "currency", format: "currency" },
    { id: "d_p_o", label: "D P O", unit: "currency", format: "currency" },
    { id: "d_i_o", label: "D I O", unit: "currency", format: "currency" },
    { id: "cash_conversion_cycle", label: "Cash Conversion Cycle", unit: "currency", format: "currency" },
    { id: "financing_cost", label: "Financing Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.nakit_akisi_acigi_analyzer_0", inputMap: { Receipts_t: "receipts_t" }, outputId: "cash_inflow" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_1", inputMap: { Payments_t: "payments_t" }, outputId: "cash_outflow" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_2", inputMap: { CashInflow_t: "cash_inflow_t", CashOutflow_t: "cash_outflow_t" }, outputId: "net_cash_flow_t" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_3", inputMap: { NetCashFlow_t: "net_cash_flow_t" }, outputId: "cumulative_cash_flow" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_4", inputMap: { CumulativeCashFlow: "cumulative_cash_flow" }, outputId: "cash_gap" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_5", inputMap: { AccountsReceivable: "accounts_receivable", TotalCreditSales: "total_credit_sales", Days: "days" }, outputId: "d_s_o" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_6", inputMap: { AccountsPayable: "accounts_payable", TotalCreditPurchases: "total_credit_purchases", Days: "days" }, outputId: "d_p_o" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_7", inputMap: { Inventory: "inventory", COGS: "c_o_g_s", Days: "days" }, outputId: "d_i_o" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_8", inputMap: { DSO: "d_s_o", DIO: "d_i_o", DPO: "d_p_o" }, outputId: "cash_conversion_cycle" },
    { formulaId: "custom.nakit_akisi_acigi_analyzer_9", inputMap: { CashGap: "cash_gap", DailyInterestRate: "daily_interest_rate" }, outputId: "financing_cost" },
  ],
  reportTemplate: {
    title: "Nakit Akışı Açığı Report",
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
