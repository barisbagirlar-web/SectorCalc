/**
 * Robot Kol vs. Manuel İşçi — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const ROBOTVSMANUAL_SCHEMA: PremiumCalculatorSchema = {
  id: "robot-vs-manual-analyzer",
  legacyPaidSlug: "robot-vs-manual-analyzer",
  name: "Robot Kol vs. Manuel İşçi",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Robot Kol vs. Manuel İşçi — premium analysis tool.",
  inputs: [
    { id: "manuelrobot_cevrim_suresi_sn", label: "Manuel/Robot Çevrim Süresi sn", type: "number", required: true },
    { id: "operator_sayisi", label: "Operatör Sayısı", type: "number", required: true },
    { id: "saatlik_ucret_ve_yan_haklar", label: "Saatlik Ücret ve Yan Haklar", type: "number", required: true },
    { id: "robot_capex", label: "Robot Capex", type: "number", required: true },
    { id: "omur_yil", label: "Ömür yıl", type: "number", required: true },
    { id: "bakimenerji", label: "Bakım/Enerji", type: "number", required: true },
    { id: "robotmanuel_verimlilik", label: "Robot/Manuel Verimlilik", type: "number", required: true },
  ],
  outputs: [
    { id: "manual_cost__annual", label: "Manual Cost_ Annual", unit: "currency", format: "currency" },
    { id: "robot_cost__annual", label: "Robot Cost_ Annual", unit: "currency", format: "currency" },
    { id: "robot_output", label: "Robot Output", unit: "currency", format: "currency" },
    { id: "manual_output", label: "Manual Output", unit: "currency", format: "currency" },
    { id: "cost_per_unit__manual", label: "Cost Per Unit_ Manual", unit: "currency", format: "currency" },
    { id: "cost_per_unit__robot", label: "Cost Per Unit_ Robot", unit: "currency", format: "currency" },
    { id: "r_o_i", label: "R O I", unit: "currency", format: "currency" },
    { id: "payback", label: "Payback", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.robot_kol_vs_manuel_isci_analyzer_0", inputMap: { Operators: "operators", HourlyRate: "hourly_rate", Hours: "hours", Burden: "burden" }, outputId: "manual_cost__annual" },
    { formulaId: "custom.robot_kol_vs_manuel_isci_analyzer_1", inputMap: { RobotCapex: "robot_capex", DepreciationLife: "depreciation_life", Maintenance: "maintenance", Energy: "energy", ProgrammerCost: "programmer_cost" }, outputId: "robot_cost__annual" },
    { formulaId: "custom.robot_kol_vs_manuel_isci_analyzer_2", inputMap: { CycleTime_Robot: "cycle_time__robot", Uptime: "uptime" }, outputId: "robot_output" },
    { formulaId: "custom.robot_kol_vs_manuel_isci_analyzer_3", inputMap: { CycleTime_Manual: "cycle_time__manual", Efficiency: "efficiency" }, outputId: "manual_output" },
    { formulaId: "custom.robot_kol_vs_manuel_isci_analyzer_4", inputMap: { ManualCost_Annual: "manual_cost__annual", ManualOutput: "manual_output" }, outputId: "cost_per_unit__manual" },
    { formulaId: "custom.robot_kol_vs_manuel_isci_analyzer_5", inputMap: { RobotCost_Annual: "robot_cost__annual", RobotOutput: "robot_output" }, outputId: "cost_per_unit__robot" },
    { formulaId: "custom.robot_kol_vs_manuel_isci_analyzer_6", inputMap: { ManualCost: "manual_cost", RobotCost: "robot_cost", RobotCapex: "robot_capex" }, outputId: "r_o_i" },
    { formulaId: "custom.robot_kol_vs_manuel_isci_analyzer_7", inputMap: { RobotCapex: "robot_capex", ManualCost_Annual: "manual_cost__annual", RobotCost_Annual: "robot_cost__annual" }, outputId: "payback" },
  ],
  reportTemplate: {
    title: "Robot Kol vs. Manuel İşçi Report",
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
