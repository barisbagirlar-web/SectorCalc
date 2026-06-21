/**
 * DARBOĞAZ YATIRIM — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const BOTTLENECKINVESTMENT_SCHEMA: PremiumCalculatorSchema = {
  id: "bottleneck-investment-analyzer",
  legacyPaidSlug: "bottleneck-investment-analyzer",
  name: "DARBOĞAZ YATIRIM",
  sectorSlug: "general",
  category: "cost",
  painStatement: "DARBOĞAZ YATIRIM — premium analysis tool.",
  inputs: [
    { id: "tasarimgercek_kapasite", label: "Tasarım/Gerçek Kapasite", type: "number", required: true },
    { id: "talep", label: "Talep", type: "number", required: true },
    { id: "darbogaz_suresi", label: "Darboğaz Süresi", type: "number", required: true },
    { id: "takt_time", label: "Takt Time", type: "number", required: true },
    { id: "oee", label: "OEE", type: "number", required: true },
    { id: "yatirim_bedeli", label: "Yatırım Bedeli", type: "number", required: true },
    { id: "marj", label: "Marj", type: "number", required: true },
  ],
  outputs: [
    { id: "utilization", label: "Utilization", unit: "currency", format: "currency" },
    { id: "throughput", label: "Throughput", unit: "currency", format: "currency" },
    { id: "takt_time", label: "Takt Time", unit: "currency", format: "currency" },
    { id: "cycle_time__gap", label: "Cycle Time_ Gap", unit: "currency", format: "currency" },
    { id: "cost_of_constraint", label: "Cost Of Constraint", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
    { id: "payback", label: "Payback", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.darbogaz_yatirim_analyzer_0", inputMap: { ActualOutput: "actual_output", DesignCapacity: "design_capacity" }, outputId: "utilization" },
    { formulaId: "custom.darbogaz_yatirim_analyzer_1", inputMap: { Demand: "demand", DefectRate: "defect_rate" }, outputId: "throughput" },
    { formulaId: "custom.darbogaz_yatirim_analyzer_2", inputMap: { AvailableTime: "available_time", Demand: "demand" }, outputId: "takt_time" },
    { formulaId: "custom.darbogaz_yatirim_analyzer_3", inputMap: { BottleneckCycle: "bottleneck_cycle", TaktTime: "takt_time" }, outputId: "cycle_time__gap" },
    { formulaId: "custom.darbogaz_yatirim_analyzer_4", inputMap: { CycleTime_Gap: "cycle_time__gap", Demand: "demand", UnitMargin: "unit_margin" }, outputId: "cost_of_constraint" },
    { formulaId: "custom.darbogaz_yatirim_analyzer_5", inputMap: { ThroughputIncrease: "throughput_increase", Margin: "margin", Days: "days", UpgradeCost: "upgrade_cost" }, outputId: "r_o_i" },
    { formulaId: "custom.darbogaz_yatirim_analyzer_6", inputMap: { UpgradeCost: "upgrade_cost", MonthlyGain: "monthly_gain" }, outputId: "payback" },
  ],
  reportTemplate: {
    title: "DARBOĞAZ YATIRIM Report",
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
