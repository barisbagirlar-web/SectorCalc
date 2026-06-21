/**
 * MTBF/MTTR Finansal Etki — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const MTBFMTTRFINANCIAL_SCHEMA: PremiumCalculatorSchema = {
  id: "mtbf-mttr-financial-analyzer",
  legacyPaidSlug: "mtbf-mttr-financial-analyzer",
  name: "MTBF/MTTR Finansal Etki",
  sectorSlug: "general",
  category: "cost",
  painStatement: "MTBF/MTTR Finansal Etki — premium analysis tool.",
  inputs: [
    { id: "mtbf_saat", label: "MTBF saat", type: "number", required: true },
    { id: "mttr_saat", label: "MTTR saat", type: "number", required: true },
    { id: "ariza_sayisi", label: "Arıza Sayısı", type: "number", required: true },
    { id: "durus_saat_maliyeti", label: "Duruş Saat Maliyeti", type: "number", required: true },
    { id: "ortalama_tamir_iscilikparca", label: "Ortalama Tamir İşçilik/Parça", type: "number", required: true },
    { id: "toplam_calisma_suresi", label: "Toplam Çalışma Süresi", type: "number", required: true },
    { id: "hedef_availability", label: "Hedef Availability", type: "number", required: true },
  ],
  outputs: [
    { id: "availability", label: "Availability", unit: "currency", format: "currency" },
    { id: "expected_downtime", label: "Expected Downtime", unit: "currency", format: "currency" },
    { id: "downtime_cost", label: "Downtime Cost", unit: "currency", format: "currency" },
    { id: "failure_frequency", label: "Failure Frequency", unit: "currency", format: "currency" },
    { id: "repair_cost", label: "Repair Cost", unit: "currency", format: "currency" },
    { id: "total_reliability_cost", label: "Total Reliability Cost", unit: "currency", format: "currency" },
    { id: "r_o_i__improvement", label: "R O I_ Improvement", unit: "currency", format: "currency" },
    { id: "target_m_t_b_f", label: "Target M T B F", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.mtbfmttr_finansal_etki_analyzer_0", inputMap: { MTBF: "m_t_b_f", MTTR: "m_t_t_r" }, outputId: "availability" },
    { formulaId: "custom.mtbfmttr_finansal_etki_analyzer_1", inputMap: { TotalTime: "total_time", Availability: "hedef_availability" }, outputId: "expected_downtime" },
    { formulaId: "custom.mtbfmttr_finansal_etki_analyzer_2", inputMap: { ExpectedDowntime: "expected_downtime", CostPerHour: "cost_per_hour" }, outputId: "downtime_cost" },
    { formulaId: "custom.mtbfmttr_finansal_etki_analyzer_3", inputMap: { TotalTime: "total_time", MTBF: "m_t_b_f" }, outputId: "failure_frequency" },
    { formulaId: "custom.mtbfmttr_finansal_etki_analyzer_4", inputMap: { FailureFrequency: "failure_frequency", MTTR: "m_t_t_r", LaborRate: "labor_rate", PartsCost: "parts_cost" }, outputId: "repair_cost" },
    { formulaId: "custom.mtbfmttr_finansal_etki_analyzer_5", inputMap: { DowntimeCost: "downtime_cost", RepairCost: "repair_cost" }, outputId: "total_reliability_cost" },
    { formulaId: "custom.mtbfmttr_finansal_etki_analyzer_6", inputMap: { OldCost: "old_cost", NewCost: "new_cost", InvestmentCost: "investment_cost" }, outputId: "r_o_i__improvement" },
    { formulaId: "custom.mtbfmttr_finansal_etki_analyzer_7", inputMap: { TotalTime: "total_time", TargetAvailability: "target_availability" }, outputId: "target_m_t_b_f" },
  ],
  reportTemplate: {
    title: "MTBF/MTTR Finansal Etki Report",
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
