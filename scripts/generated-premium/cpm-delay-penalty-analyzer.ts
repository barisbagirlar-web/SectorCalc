/**
 * CPM GECİKME CEZASI — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const CPMDELAYPENALTY_SCHEMA: PremiumCalculatorSchema = {
  id: "cpm-delay-penalty-analyzer",
  legacyPaidSlug: "cpm-delay-penalty-analyzer",
  name: "CPM GECİKME CEZASI",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CPM GECİKME CEZASI — premium analysis tool.",
  inputs: [
    { id: "planlanangercek_sure", label: "Planlanan/Gerçek Süre", type: "number", required: true },
    { id: "float", label: "Float", type: "number", required: true },
    { id: "gunluk_ceza", label: "Günlük Ceza", type: "number", required: true },
    { id: "mucbir_sebep", label: "Mücbir Sebep", type: "number", required: true },
    { id: "crashing_maliyeti", label: "Crashing Maliyeti", type: "number", required: true },
    { id: "verimlilik", label: "Verimlilik", type: "number", required: true },
  ],
  outputs: [
    { id: "total_float", label: "Total Float", unit: "currency", format: "currency" },
    { id: "critical_delay", label: "Critical Delay", unit: "currency", format: "currency" },
    { id: "excusable_delay", label: "Excusable Delay", unit: "currency", format: "currency" },
    { id: "non_excusable", label: "Non Excusable", unit: "currency", format: "currency" },
    { id: "liquidated_damages", label: "Liquidated Damages", unit: "currency", format: "currency" },
    { id: "acceleration_cost", label: "Acceleration Cost", unit: "currency", format: "currency" },
    { id: "net_penalty", label: "Net Penalty", unit: "currency", format: "currency" },
    { id: "e_o_t__claim", label: "E O T_ Claim", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.cpm_gecikme_cezasi_analyzer_0", inputMap: { LateStart: "late_start", EarlyStart: "early_start" }, outputId: "total_float" },
    { formulaId: "custom.cpm_gecikme_cezasi_analyzer_1", inputMap: { Actual: "actual", Planned: "planned", TotalFloat: "float" }, outputId: "critical_delay" },
    { formulaId: "custom.cpm_gecikme_cezasi_analyzer_2", inputMap: { ForceMajeure: "force_majeure", OwnerCaused: "owner_caused" }, outputId: "excusable_delay" },
    { formulaId: "custom.cpm_gecikme_cezasi_analyzer_3", inputMap: { CriticalDelay: "critical_delay", Excusable: "excusable" }, outputId: "non_excusable" },
    { formulaId: "custom.cpm_gecikme_cezasi_analyzer_4", inputMap: { NonExcusable: "non_excusable", DailyPenalty: "daily_penalty" }, outputId: "liquidated_damages" },
    { formulaId: "custom.cpm_gecikme_cezasi_analyzer_5", inputMap: { CrashingCost: "crashing_cost", DaysAccelerated: "days_accelerated" }, outputId: "acceleration_cost" },
    { formulaId: "custom.cpm_gecikme_cezasi_analyzer_6", inputMap: { LiquidatedDamages: "liquidated_damages", AccelerationCost: "acceleration_cost" }, outputId: "net_penalty" },
    { formulaId: "custom.cpm_gecikme_cezasi_analyzer_7", inputMap: { Excusable: "excusable", EffFactor: "eff_factor" }, outputId: "e_o_t__claim" },
  ],
  reportTemplate: {
    title: "CPM GECİKME CEZASI Report",
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
