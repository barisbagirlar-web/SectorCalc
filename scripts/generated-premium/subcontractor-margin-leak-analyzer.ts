/**
 * Taşeron Marj Sızıntı Dedektörü — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SUBCONTRACTORMARGINLEAK_SCHEMA: PremiumCalculatorSchema = {
  id: "subcontractor-margin-leak-analyzer",
  legacyPaidSlug: "subcontractor-margin-leak-analyzer",
  name: "Taşeron Marj Sızıntı Dedektörü",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Taşeron Marj Sızıntı Dedektörü — premium analysis tool.",
  inputs: [
    { id: "sozlesme_bedeli", label: "Sözleşme Bedeli", type: "number", required: true },
    { id: "taseron_teklif_bedeli", label: "Taşeron Teklif Bedeli", type: "number", required: true },
    { id: "gerceklesen_taseron_hakedisi", label: "Gerçekleşen Taşeron Hakedişi", type: "number", required: true },
    { id: "change_order_tutarlari", label: "Change Order Tutarları", type: "array", required: true },
    { id: "rework_maliyeti", label: "Rework Maliyeti", type: "number", required: true },
    { id: "gecikme_cezalari", label: "Gecikme Cezaları", type: "number", required: true },
  ],
  outputs: [
    { id: "quoted_margin", label: "Quoted Margin", unit: "currency", format: "currency" },
    { id: "actual_margin", label: "Actual Margin", unit: "currency", format: "currency" },
    { id: "margin_leak", label: "Margin Leak", unit: "currency", format: "currency" },
    { id: "change_order_cost", label: "Change Order Cost", unit: "currency", format: "currency" },
    { id: "unbilled_work", label: "Unbilled Work", unit: "currency", format: "currency" },
    { id: "leakage_pct", label: "Leakage Pct", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.taseron_marj_sizinti_dedektoru_analyzer_0", inputMap: { ContractValue: "contract_value", EstimatedSubcontractorCost: "estimated_subcontractor_cost" }, outputId: "quoted_margin" },
    { formulaId: "custom.taseron_marj_sizinti_dedektoru_analyzer_1", inputMap: { ContractValue: "contract_value", ActualSubcontractorCost: "actual_subcontractor_cost", ReworkCost: "rework_cost", DelayPenalties: "delay_penalties" }, outputId: "actual_margin" },
    { formulaId: "custom.taseron_marj_sizinti_dedektoru_analyzer_2", inputMap: { QuotedMargin: "quoted_margin", ActualMargin: "actual_margin" }, outputId: "margin_leak" },
    { formulaId: "custom.taseron_marj_sizinti_dedektoru_analyzer_3", inputMap: { ChangeOrderAmount_i: "change_order_amount_i" }, outputId: "change_order_cost" },
    { formulaId: "custom.taseron_marj_sizinti_dedektoru_analyzer_4", inputMap: { ActualWorkCompleted: "actual_work_completed", BilledAmount: "billed_amount" }, outputId: "unbilled_work" },
    { formulaId: "custom.taseron_marj_sizinti_dedektoru_analyzer_5", inputMap: { MarginLeak: "margin_leak", QuotedMargin: "quoted_margin" }, outputId: "leakage_pct" },
  ],
  reportTemplate: {
    title: "Taşeron Marj Sızıntı Dedektörü Report",
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
