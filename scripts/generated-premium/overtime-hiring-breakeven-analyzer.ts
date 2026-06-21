/**
 * Overtime vs. Hiring Breakeven — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const OVERTIMEHIRINGBREAKEVEN_SCHEMA: PremiumCalculatorSchema = {
  id: "overtime-hiring-breakeven-analyzer",
  legacyPaidSlug: "overtime-hiring-breakeven-analyzer",
  name: "Overtime vs. Hiring Breakeven",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Overtime vs. Hiring Breakeven — premium analysis tool.",
  inputs: [
    { id: "ise_alimegitim_maliyeti", label: "İşe Alım/Eğitim Maliyeti", type: "number", required: true },
    { id: "yan_haklar", label: "Yan Haklar", type: "number", required: true },
    { id: "normalfazla_mesai_ucreti", label: "Normal/Fazla Mesai Ücreti", type: "number", required: true },
    { id: "mesai_carpani", label: "Mesai Çarpanı", type: "number", required: true },
    { id: "yorgunluk_hata_orani", label: "Yorgunluk Hata Oranı", type: "number", required: true },
    { id: "hata_maliyeti", label: "Hata Maliyeti", type: "number", required: true },
    { id: "beklenen_mesai_saati", label: "Beklenen Mesai Saati", type: "number", required: true },
  ],
  outputs: [
    { id: "overtime_cost__hour", label: "Overtime Cost_ Hour", unit: "currency", format: "currency" },
    { id: "hiring_cost__total", label: "Hiring Cost_ Total", unit: "currency", format: "currency" },
    { id: "annual_new_hire_cost", label: "Annual New Hire Cost", unit: "currency", format: "currency" },
    { id: "breakeven_hours", label: "Breakeven Hours", unit: "currency", format: "currency" },
    { id: "decision", label: "Decision", unit: "currency", format: "currency" },
    { id: "quality_cost__o_t", label: "Quality Cost_ O T", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.overtime_vs_hiring_breakeven_analyzer_0", inputMap: { RegularRate: "regular_rate", OvertimeMultiplier: "overtime_multiplier", BurdenRate: "burden_rate" }, outputId: "overtime_cost__hour" },
    { formulaId: "custom.overtime_vs_hiring_breakeven_analyzer_1", inputMap: { Recruitment: "recruitment", Onboarding: "onboarding", Training: "training", RampUpProductivityLoss: "ramp_up_productivity_loss" }, outputId: "hiring_cost__total" },
    { formulaId: "custom.overtime_vs_hiring_breakeven_analyzer_2", inputMap: { RegularRate: "regular_rate", AnnualHours: "annual_hours", BurdenRate: "burden_rate", Benefits: "benefits" }, outputId: "annual_new_hire_cost" },
    { formulaId: "custom.overtime_vs_hiring_breakeven_analyzer_3", inputMap: { HiringCost_Total: "hiring_cost__total", AnnualNewHireCost: "annual_new_hire_cost", AnnualHours: "annual_hours", OvertimeCost_Hour: "overtime_cost__hour" }, outputId: "breakeven_hours" },
    { formulaId: "custom.overtime_vs_hiring_breakeven_analyzer_4", inputMap: { ExpectedOvertimeHours: "expected_overtime_hours", BreakevenHours: "breakeven_hours", Hire: "hire", Overtime: "overtime" }, outputId: "decision" },
    { formulaId: "custom.overtime_vs_hiring_breakeven_analyzer_5", inputMap: { OvertimeHours: "overtime_hours", FatigueDefectRate: "fatigue_defect_rate", DefectCost: "defect_cost" }, outputId: "quality_cost__o_t" },
  ],
  reportTemplate: {
    title: "Overtime vs. Hiring Breakeven Report",
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
