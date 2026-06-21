/**
 * AQL SAMPLING RİSK & MALİYET — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const AQLSAMPLINGRISK_SCHEMA: PremiumCalculatorSchema = {
  id: "aql-sampling-risk-analyzer",
  legacyPaidSlug: "aql-sampling-risk-analyzer",
  name: "AQL SAMPLING RİSK & MALİYET",
  sectorSlug: "general",
  category: "cost",
  painStatement: "AQL SAMPLING RİSK & MALİYET — premium analysis tool.",
  inputs: [
    { id: "parti_buyuklugu_n", label: "Parti Büyüklüğü N", type: "number", required: true },
    { id: "muayene_seviyesi", label: "Muayene Seviyesi", type: "text", required: true },
    { id: "aql", label: "AQL", type: "number", required: true },
    { id: "ltpd", label: "LTPD", type: "number", required: true },
    { id: "birim_muayene_maliyeti", label: "Birim Muayene Maliyeti", type: "number", required: true },
    { id: "kacan_hata_maliyeti", label: "Kaçan Hata Maliyeti", type: "number", required: true },
  ],
  outputs: [
    { id: "code_letter", label: "Code Letter", unit: "currency", format: "currency" },
    { id: "n", label: "n", unit: "currency", format: "currency" },
    { id: "ac", label: "Ac", unit: "currency", format: "currency" },
    { id: "pa_producer", label: "Pa_producer", unit: "currency", format: "currency" },
    { id: "alpha", label: "Alpha", unit: "currency", format: "currency" },
    { id: "pa_consumer", label: "Pa_consumer", unit: "currency", format: "currency" },
    { id: "beta", label: "Beta", unit: "currency", format: "currency" },
    { id: "a_t_i", label: "A T I", unit: "currency", format: "currency" },
    { id: "total_risk_cost", label: "Total Risk Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_0", inputMap: { LookupCodeLetter: "lookup_code_letter", LotSize: "lot_size", InspectionLevel: "inspection_level" }, outputId: "code_letter" },
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_1", inputMap: { SampleSize: "sample_size", CodeLetter: "code_letter", AQL: "aql" }, outputId: "n" },
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_2", inputMap: { AcceptanceNumber: "acceptance_number", CodeLetter: "code_letter", AQL: "aql" }, outputId: "ac" },
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_3", inputMap: { Ac: "kacan_hata_maliyeti", p_AQL: "aql" }, outputId: "pa_producer" },
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_4", inputMap: { Pa_producer: "pa_producer" }, outputId: "alpha" },
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_5", inputMap: { Ac: "kacan_hata_maliyeti", p_LTPD: "ltpd" }, outputId: "pa_consumer" },
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_6", inputMap: { Pa_consumer: "pa_consumer" }, outputId: "beta" },
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_7", inputMap: { Pa: "parti_buyuklugu_n" }, outputId: "a_t_i" },
    { formulaId: "custom.aql_sampling_risk_ve_maliyet_analyzer_8", inputMap: { Pa: "parti_buyuklugu_n", DetectionRate: "detection_rate", CostPerDefect: "cost_per_defect" }, outputId: "total_risk_cost" },
  ],
  reportTemplate: {
    title: "AQL SAMPLING RİSK & MALİYET Report",
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
