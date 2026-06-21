/**
 * SPC Signal Delay Maliyet — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const SPCSIGNALDELAY_SCHEMA: PremiumCalculatorSchema = {
  id: "spc-signal-delay-analyzer",
  legacyPaidSlug: "spc-signal-delay-analyzer",
  name: "SPC Signal Delay Maliyet",
  sectorSlug: "general",
  category: "cost",
  painStatement: "SPC Signal Delay Maliyet — premium analysis tool.",
  inputs: [
    { id: "alphabeta_riskleri", label: "Alpha/Beta Riskleri", type: "number", required: true },
    { id: "ornekleme_araligi_saat", label: "Örnekleme Aralığı saat", type: "number", required: true },
    { id: "uretim_hizi_adetsaat", label: "Üretim Hızı adet/saat", type: "number", required: true },
    { id: "hata_orani_ooc", label: "Hata Oranı OOC", type: "number", required: true },
    { id: "hata_basina_maliyet", label: "Hata Başına Maliyet", type: "number", required: true },
    { id: "arastirma_isciligi", label: "Araştırma İşçiliği", type: "number", required: true },
  ],
  outputs: [
    { id: "a_r_l__in_control", label: "A R L_ In Control", unit: "currency", format: "currency" },
    { id: "a_r_l__out_of_control", label: "A R L_ Out Of Control", unit: "currency", format: "currency" },
    { id: "detection_delay__hours", label: "Detection Delay_ Hours", unit: "currency", format: "currency" },
    { id: "defects_produced", label: "Defects Produced", unit: "currency", format: "currency" },
    { id: "cost__delay", label: "Cost_ Delay", unit: "currency", format: "currency" },
    { id: "investigation_cost", label: "Investigation Cost", unit: "currency", format: "currency" },
    { id: "optimal_interval", label: "Optimal Interval", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.spc_signal_delay_maliyet_analyzer_0", inputMap: { Alpha: "alphabeta_riskleri" }, outputId: "a_r_l__in_control" },
    { formulaId: "custom.spc_signal_delay_maliyet_analyzer_1", inputMap: { Beta: "alphabeta_riskleri" }, outputId: "a_r_l__out_of_control" },
    { formulaId: "custom.spc_signal_delay_maliyet_analyzer_2", inputMap: { ARL_OutOfControl: "a_r_l__out_of_control", SamplingInterval: "sampling_interval" }, outputId: "detection_delay__hours" },
    { formulaId: "custom.spc_signal_delay_maliyet_analyzer_3", inputMap: { DetectionDelay_Hours: "detection_delay__hours", ProductionRate: "production_rate", DefectRate_OOC: "defect_rate__o_o_c" }, outputId: "defects_produced" },
    { formulaId: "custom.spc_signal_delay_maliyet_analyzer_4", inputMap: { DefectsProduced: "defects_produced", CostPerDefect: "cost_per_defect" }, outputId: "cost__delay" },
    { formulaId: "custom.spc_signal_delay_maliyet_analyzer_5", inputMap: { FalseAlarmRate: "false_alarm_rate", SamplingFrequency: "sampling_frequency", LaborRate: "labor_rate" }, outputId: "investigation_cost" },
    { formulaId: "custom.spc_signal_delay_maliyet_analyzer_6", inputMap: { SamplingCost: "sampling_cost", ProductionRate: "production_rate", Cost_Delay: "cost__delay", ShiftMagnitude: "shift_magnitude" }, outputId: "optimal_interval" },
  ],
  reportTemplate: {
    title: "SPC Signal Delay Maliyet Report",
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
