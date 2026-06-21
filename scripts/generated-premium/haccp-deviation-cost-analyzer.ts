/**
 * HACCP DEVIATION — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HACCPDEVIATIONCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "haccp-deviation-cost-analyzer",
  legacyPaidSlug: "haccp-deviation-cost-analyzer",
  name: "HACCP DEVIATION",
  sectorSlug: "general",
  category: "cost",
  painStatement: "HACCP DEVIATION — premium analysis tool.",
  inputs: [
    { id: "karantina_hacim", label: "Karantina Hacim", type: "number", required: true },
    { id: "bekletme", label: "Bekletme", type: "number", required: true },
    { id: "test", label: "Test", type: "number", required: true },
    { id: "reworkimha", label: "Rework/İmha", type: "currency/kg", required: true },
    { id: "geri_cagirma", label: "Geri Çağırma", type: "number", required: true },
    { id: "ceza", label: "Ceza", type: "number", required: true },
  ],
  outputs: [
    { id: "cost__hold", label: "Cost_ Hold", unit: "currency", format: "currency" },
    { id: "cost__test", label: "Cost_ Test", unit: "currency", format: "currency" },
    { id: "cost__rework", label: "Cost_ Rework", unit: "currency", format: "currency" },
    { id: "cost__disp", label: "Cost_ Disp", unit: "currency", format: "currency" },
    { id: "cost__recall", label: "Cost_ Recall", unit: "currency", format: "currency" },
    { id: "fine", label: "Fine", unit: "currency", format: "currency" },
    { id: "total", label: "Total", unit: "currency", format: "currency" },
    { id: "r_p_n", label: "R P N", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.haccp_deviation_analyzer_0", inputMap: { QuarVol: "quar_vol", HoldCost: "hold_cost", Days: "days" }, outputId: "cost__hold" },
    { formulaId: "custom.haccp_deviation_analyzer_1", inputMap: { Samples: "samples", LabCost: "lab_cost" }, outputId: "cost__test" },
    { formulaId: "custom.haccp_deviation_analyzer_2", inputMap: { DevVol: "dev_vol", ReworkCost: "rework_cost" }, outputId: "cost__rework" },
    { formulaId: "custom.haccp_deviation_analyzer_3", inputMap: { CondVol: "cond_vol", DispCost: "disp_cost", LostMat: "lost_mat" }, outputId: "cost__disp" },
    { formulaId: "custom.haccp_deviation_analyzer_4", inputMap: { Notif: "notif", Log_Rev: "log__rev", RetailPen: "retail_pen", Brand: "brand" }, outputId: "cost__recall" },
    { formulaId: "custom.haccp_deviation_analyzer_5", inputMap: { ProbDet: "prob_det", FineAmt: "fine_amt" }, outputId: "fine" },
    { formulaId: "custom.haccp_deviation_analyzer_6", inputMap: { Hold: "hold", Test: "test", Rework: "reworkimha", Disp: "disp", Recall: "recall", Fine: "fine" }, outputId: "total" },
    { formulaId: "custom.haccp_deviation_analyzer_7", inputMap: { Sev: "sev", Occ: "occ", Det: "det" }, outputId: "r_p_n" },
  ],
  reportTemplate: {
    title: "HACCP DEVIATION Report",
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
