/**
 * Kalite Maliyeti PAF — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const QUALITYCOSTPAF_SCHEMA: PremiumCalculatorSchema = {
  id: "quality-cost-paf-analyzer",
  legacyPaidSlug: "quality-cost-paf-analyzer",
  name: "Kalite Maliyeti PAF",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Kalite Maliyeti PAF — premium analysis tool.",
  inputs: [
    { id: "egitimplanlama_butcesi", label: "Eğitim/Planlama Bütçesi", type: "number", required: true },
    { id: "muayenetest_maliyeti", label: "Muayene/Test Maliyeti", type: "number", required: true },
    { id: "hurdayeniden_isleme_maliyeti", label: "Hurda/Yeniden İşleme Maliyeti", type: "number", required: true },
    { id: "durus_maliyeti", label: "Duruş Maliyeti", type: "number", required: true },
    { id: "garantiiade_maliyeti", label: "Garanti/İade Maliyeti", type: "number", required: true },
    { id: "kayip_satis_tahmini", label: "Kayıp Satış Tahmini", type: "number", required: true },
    { id: "toplam_gelir", label: "Toplam Gelir", type: "number", required: true },
  ],
  outputs: [
    { id: "prevention_cost", label: "Prevention Cost", unit: "currency", format: "currency" },
    { id: "appraisal_cost", label: "Appraisal Cost", unit: "currency", format: "currency" },
    { id: "internal_failure", label: "Internal Failure", unit: "currency", format: "currency" },
    { id: "external_failure", label: "External Failure", unit: "currency", format: "currency" },
    { id: "total_c_o_q", label: "Total C O Q", unit: "currency", format: "currency" },
    { id: "c_o_q__ratio", label: "C O Q_ Ratio", unit: "currency", format: "currency" },
    { id: "p_a_f__ratio", label: "P A F_ Ratio", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.kalite_maliyeti_paf_analyzer_0", inputMap: { Training: "training", QualityPlanning: "quality_planning", SupplierEvaluation: "supplier_evaluation", DesignReview: "design_review" }, outputId: "prevention_cost" },
    { formulaId: "custom.kalite_maliyeti_paf_analyzer_1", inputMap: { Inspection: "inspection", Testing: "testing", Calibration: "calibration", Audit: "audit" }, outputId: "appraisal_cost" },
    { formulaId: "custom.kalite_maliyeti_paf_analyzer_2", inputMap: { Scrap: "scrap", Rework: "rework", Reinspection: "reinspection", Downtime: "downtime" }, outputId: "internal_failure" },
    { formulaId: "custom.kalite_maliyeti_paf_analyzer_3", inputMap: { Warranty: "warranty", Returns: "returns", Recall: "recall", Liability: "liability", LostSales: "lost_sales" }, outputId: "external_failure" },
    { formulaId: "custom.kalite_maliyeti_paf_analyzer_4", inputMap: { PreventionCost: "prevention_cost", AppraisalCost: "appraisal_cost", InternalFailure: "internal_failure", ExternalFailure: "external_failure" }, outputId: "total_c_o_q" },
    { formulaId: "custom.kalite_maliyeti_paf_analyzer_5", inputMap: { TotalCOQ: "total_c_o_q", TotalRevenue: "total_revenue" }, outputId: "c_o_q__ratio" },
    { formulaId: "custom.kalite_maliyeti_paf_analyzer_6", inputMap: { PreventionCost: "prevention_cost", TotalCOQ: "total_c_o_q" }, outputId: "p_a_f__ratio" },
  ],
  reportTemplate: {
    title: "Kalite Maliyeti PAF Report",
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
