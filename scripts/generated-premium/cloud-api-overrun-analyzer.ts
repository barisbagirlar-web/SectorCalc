/**
 * CLOUD API OVERRUN — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CLOUDAPIOVERRUN_SCHEMA: PremiumCalculatorSchema = {
  id: "cloud-api-overrun-analyzer",
  legacyPaidSlug: "cloud-api-overrun-analyzer",
  name: "CLOUD API OVERRUN",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CLOUD API OVERRUN — premium analysis tool.",
  inputs: [
    { id: "aylik_toplamdahil_istek", label: "Aylık Toplam/Dahil İstek", type: "number", required: true },
    { id: "asim_ucreti", label: "Aşım Ücreti", type: "number", required: true },
    { id: "veri_cikisi_gb", label: "Veri Çıkışı GB", type: "number", required: true },
    { id: "egress_fiyat", label: "Egress Fiyat", type: "number", required: true },
    { id: "sla_taahhutgercek_uptime", label: "SLA Taahhüt/Gerçek Uptime", type: "number", required: true },
  ],
  outputs: [
    { id: "overrun_requests", label: "Overrun Requests", unit: "currency", format: "currency" },
    { id: "overrun_cost", label: "Overrun Cost", unit: "currency", format: "currency" },
    { id: "throttling_cost", label: "Throttling Cost", unit: "currency", format: "currency" },
    { id: "data_egress_cost", label: "Data Egress Cost", unit: "currency", format: "currency" },
    { id: "s_l_a_breach_penalty", label: "S L A Breach Penalty", unit: "currency", format: "currency" },
    { id: "total_overrun_cost", label: "Total Overrun Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cloud_api_overrun_analyzer_0", inputMap: { TotalRequests: "total_requests", IncludedRequests: "included_requests" }, outputId: "overrun_requests" },
    { formulaId: "custom.cloud_api_overrun_analyzer_1", inputMap: { OverrunRequests: "overrun_requests", OverageRate: "overage_rate" }, outputId: "overrun_cost" },
    { formulaId: "custom.cloud_api_overrun_analyzer_2", inputMap: { ThrottledRequests: "throttled_requests", RetryCost: "retry_cost", AvgRetries: "avg_retries" }, outputId: "throttling_cost" },
    { formulaId: "custom.cloud_api_overrun_analyzer_3", inputMap: { DataOutGB: "data_out_g_b", EgressRate: "egress_rate" }, outputId: "data_egress_cost" },
    { formulaId: "custom.cloud_api_overrun_analyzer_4", inputMap: { Availability: "availability", SLA: "s_l_a", MonthlyFee: "monthly_fee", CreditPct: "credit_pct" }, outputId: "s_l_a_breach_penalty" },
    { formulaId: "custom.cloud_api_overrun_analyzer_5", inputMap: { OverrunCost: "overrun_cost", ThrottlingCost: "throttling_cost", DataEgressCost: "data_egress_cost", SLABreachPenalty: "s_l_a_breach_penalty" }, outputId: "total_overrun_cost" },
  ],
  reportTemplate: {
    title: "CLOUD API OVERRUN Report",
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
