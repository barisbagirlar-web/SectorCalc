/**
 * EOQ ENVANTER — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const EOQINVENTORYOPTIMIZER_SCHEMA: PremiumCalculatorSchema = {
  id: "eoq-inventory-optimizer-analyzer",
  legacyPaidSlug: "eoq-inventory-optimizer-analyzer",
  name: "EOQ ENVANTER",
  sectorSlug: "general",
  category: "cost",
  painStatement: "EOQ ENVANTER — premium analysis tool.",
  inputs: [
    { id: "yillik_talep", label: "Yıllık Talep", type: "number", required: true },
    { id: "siparis_maliyet", label: "Sipariş Maliyet", type: "number", required: true },
    { id: "lead_time", label: "Lead Time", type: "number", required: true },
    { id: "tasima_maliyet", label: "Taşıma Maliyet", type: "number", required: true },
    { id: "stddev", label: "StdDev", type: "number", required: true },
    { id: "hizmet_seviyesi", label: "Hizmet Seviyesi", type: "number", required: true },
    { id: "stoksuz_maliyet", label: "Stoksuz Maliyet", type: "number", required: true },
  ],
  outputs: [
    { id: "e_o_q", label: "E O Q", unit: "currency", format: "currency" },
    { id: "r_o_p", label: "R O P", unit: "currency", format: "currency" },
    { id: "safety_stock", label: "Safety Stock", unit: "currency", format: "currency" },
    { id: "total_cost", label: "Total Cost", unit: "currency", format: "currency" },
    { id: "cycle_stock", label: "Cycle Stock", unit: "currency", format: "currency" },
    { id: "turnover", label: "Turnover", unit: "currency", format: "currency" },
    { id: "days_sales", label: "Days Sales", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.eoq_envanter_analyzer_0", inputMap: { Demand: "demand", OrderCost: "order_cost", HoldingCost: "holding_cost" }, outputId: "e_o_q" },
    { formulaId: "custom.eoq_envanter_analyzer_1", inputMap: { LeadTime: "lead_time", DailyDemand: "daily_demand", SafetyStock: "safety_stock" }, outputId: "r_o_p" },
    { formulaId: "custom.eoq_envanter_analyzer_2", inputMap: { StdDev: "stddev", LeadTime: "lead_time" }, outputId: "safety_stock" },
    { formulaId: "custom.eoq_envanter_analyzer_3", inputMap: { Demand: "demand", EOQ: "e_o_q", OrderCost: "order_cost", Safety: "safety", HoldingCost: "holding_cost" }, outputId: "total_cost" },
    { formulaId: "custom.eoq_envanter_analyzer_4", inputMap: { EOQ: "e_o_q" }, outputId: "cycle_stock" },
    { formulaId: "custom.eoq_envanter_analyzer_5", inputMap: { Demand: "demand", AvgInv: "avg_inv" }, outputId: "turnover" },
    { formulaId: "custom.eoq_envanter_analyzer_6", inputMap: { Turnover: "turnover" }, outputId: "days_sales" },
  ],
  reportTemplate: {
    title: "EOQ ENVANTER Report",
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
