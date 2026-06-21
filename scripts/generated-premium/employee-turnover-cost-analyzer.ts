/**
 * CİRO MALİYETİ — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const EMPLOYEETURNOVERCOST_SCHEMA: PremiumCalculatorSchema = {
  id: "employee-turnover-cost-analyzer",
  legacyPaidSlug: "employee-turnover-cost-analyzer",
  name: "CİRO MALİYETİ",
  sectorSlug: "general",
  category: "cost",
  painStatement: "CİRO MALİYETİ — premium analysis tool.",
  inputs: [
    { id: "ayrilan_sayisi", label: "Ayrılan Sayısı", type: "number", required: true },
    { id: "tazminat", label: "Tazminat", type: "number", required: true },
    { id: "ise_alim_suresi", label: "İşe Alım Süresi", type: "number", required: true },
    { id: "mulakategitim_suresi", label: "Mülakat/Eğitim Süresi", type: "number", required: true },
    { id: "tam_verim_suresi", label: "Tam Verim Süresi", type: "number", required: true },
    { id: "gunluk_ciro", label: "Günlük Ciro", type: "number", required: true },
  ],
  outputs: [
    { id: "separation_cost", label: "Separation Cost", unit: "currency", format: "currency" },
    { id: "vacancy_cost", label: "Vacancy Cost", unit: "currency", format: "currency" },
    { id: "replacement_cost", label: "Replacement Cost", unit: "currency", format: "currency" },
    { id: "training_cost", label: "Training Cost", unit: "currency", format: "currency" },
    { id: "productivity_loss", label: "Productivity Loss", unit: "currency", format: "currency" },
    { id: "total_turnover_cost", label: "Total Turnover Cost", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.ciro_maliyeti_analyzer_0", inputMap: { ExitInterview: "exit_interview", HRRate: "h_r_rate", Severance: "severance", Admin: "admin" }, outputId: "separation_cost" },
    { formulaId: "custom.ciro_maliyeti_analyzer_1", inputMap: { TimeToFill: "time_to_fill", DailyRevenue: "daily_revenue", TempCost: "temp_cost" }, outputId: "vacancy_cost" },
    { formulaId: "custom.ciro_maliyeti_analyzer_2", inputMap: { Ads: "ads", Agency: "agency", InterviewTime: "interview_time", Rate: "rate" }, outputId: "replacement_cost" },
    { formulaId: "custom.ciro_maliyeti_analyzer_3", inputMap: { TrainHours: "train_hours", TrainerRate: "trainer_rate", OnboardHours: "onboard_hours", NewHireRate: "new_hire_rate" }, outputId: "training_cost" },
    { formulaId: "custom.ciro_maliyeti_analyzer_4", inputMap: { TimeToFull: "time_to_full", AvgOutput: "avg_output", RampUp: "ramp_up", Margin: "margin" }, outputId: "productivity_loss" },
    { formulaId: "custom.ciro_maliyeti_analyzer_5", inputMap: { Separation: "separation", Vacancy: "vacancy", Replacement: "replacement", Training: "training", Productivity: "productivity" }, outputId: "total_turnover_cost" },
  ],
  reportTemplate: {
    title: "CİRO MALİYETİ Report",
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
