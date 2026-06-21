/**
 * Toplam Çalışan Maliyeti — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const TOTALEMPLOYEECOST_SCHEMA: PremiumCalculatorSchema = {
  id: "total-employee-cost-analyzer",
  legacyPaidSlug: "total-employee-cost-analyzer",
  name: "Toplam Çalışan Maliyeti",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Toplam Çalışan Maliyeti — premium analysis tool.",
  inputs: [
    { id: "brut_maasikramiyemesai", label: "Brüt Maaş/İkramiye/Mesai", type: "number", required: true },
    { id: "yan_haklar", label: "Yan Haklar", type: "number", required: true },
    { id: "yasal_kesinti_oranlari", label: "Yasal Kesinti Oranları", type: "number", required: true },
    { id: "devamsizlik_saati", label: "Devamsızlık Saati", type: "number", required: true },
    { id: "turnover_orani", label: "Turnover Oranı", type: "number", required: true },
    { id: "ise_alimegitim_maliyeti", label: "İşe Alım/Eğitim Maliyeti", type: "number", required: true },
    { id: "uretken_saat", label: "Üretken Saat", type: "number", required: true },
  ],
  outputs: [
    { id: "gross_salary", label: "Gross Salary", unit: "currency", format: "currency" },
    { id: "statutory_costs", label: "Statutory Costs", unit: "currency", format: "currency" },
    { id: "benefits", label: "Benefits", unit: "currency", format: "currency" },
    { id: "absenteeism_cost", label: "Absenteeism Cost", unit: "currency", format: "currency" },
    { id: "turnover_cost", label: "Turnover Cost", unit: "currency", format: "currency" },
    { id: "total_employee_cost", label: "Total Employee Cost", unit: "currency", format: "currency" },
    { id: "cost_per_hour", label: "Cost Per Hour", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.toplam_calisan_maliyeti_analyzer_0", inputMap: { BasePay: "base_pay", Bonuses: "bonuses", Overtime: "overtime" }, outputId: "gross_salary" },
    { formulaId: "custom.toplam_calisan_maliyeti_analyzer_1", inputMap: { GrossSalary: "gross_salary", SocialSecurity: "social_security", Unemployment: "unemployment", Taxes: "taxes" }, outputId: "statutory_costs" },
    { formulaId: "custom.toplam_calisan_maliyeti_analyzer_2", inputMap: { HealthInsurance: "health_insurance", Retirement: "retirement", Meals: "meals", Transport: "transport" }, outputId: "benefits" },
    { formulaId: "custom.toplam_calisan_maliyeti_analyzer_3", inputMap: { AbsentHours: "absent_hours", FullyBurdenedRate: "fully_burdened_rate" }, outputId: "absenteeism_cost" },
    { formulaId: "custom.toplam_calisan_maliyeti_analyzer_4", inputMap: { Recruitment: "recruitment", Training: "training", TurnoverRate: "turnover_rate" }, outputId: "turnover_cost" },
    { formulaId: "custom.toplam_calisan_maliyeti_analyzer_5", inputMap: { GrossSalary: "gross_salary", StatutoryCosts: "statutory_costs", Benefits: "benefits", AbsenteeismCost: "absenteeism_cost", TurnoverCost: "turnover_cost" }, outputId: "total_employee_cost" },
    { formulaId: "custom.toplam_calisan_maliyeti_analyzer_6", inputMap: { TotalEmployeeCost: "total_employee_cost", ProductiveHours: "productive_hours" }, outputId: "cost_per_hour" },
  ],
  reportTemplate: {
    title: "Toplam Çalışan Maliyeti Report",
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
