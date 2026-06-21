/**
 * Saatlik Ücret — Premium Calculator Schema
 * Auto-generated from user-provided formulas
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";

export const HOURLYRATE_SCHEMA: PremiumCalculatorSchema = {
  id: "hourly-rate-analyzer",
  legacyPaidSlug: "hourly-rate-analyzer",
  name: "Saatlik Ücret",
  sectorSlug: "general",
  category: "cost",
  painStatement: "Saatlik Ücret — premium analysis tool.",
  inputs: [
    { id: "brut_maas", label: "Brüt Maaş", type: "number", required: true },
    { id: "ikramiye", label: "İkramiye", type: "number", required: true },
    { id: "yan_haklar", label: "Yan Haklar", type: "number", required: true },
    { id: "isveren_vergi_orani", label: "İşveren Vergi Oranı", type: "number", required: true },
    { id: "yillik_haftasaat", label: "Yıllık Hafta/Saat", type: "number", required: true },
    { id: "izin_haftasi", label: "İzin Haftası", type: "number", required: true },
    { id: "atil_zaman", label: "Atıl Zaman", type: "number", required: true },
    { id: "hedef_kr_marji", label: "Hedef Kâr Marjı", type: "number", required: true },
  ],
  outputs: [
    { id: "gross_annual_salary", label: "Gross Annual Salary", unit: "currency", format: "currency" },
    { id: "employer_taxes", label: "Employer Taxes", unit: "currency", format: "currency" },
    { id: "benefits", label: "Benefits", unit: "currency", format: "currency" },
    { id: "total_labor_cost", label: "Total Labor Cost", unit: "currency", format: "currency" },
    { id: "productive_hours", label: "Productive Hours", unit: "currency", format: "currency" },
    { id: "fully_burdened_hourly_rate", label: "Fully Burdened Hourly Rate", unit: "currency", format: "currency" },
    { id: "margin_rate", label: "Margin Rate", unit: "currency", format: "currency" },
  ],
  thresholds: [],
  formulaPipeline: [
    { formulaId: "custom.saatlik_ucret_analyzer_0", inputMap: { BaseSalary: "base_salary", Bonuses: "bonuses" }, outputId: "gross_annual_salary" },
    { formulaId: "custom.saatlik_ucret_analyzer_1", inputMap: { GrossAnnualSalary: "gross_annual_salary", TaxRate: "tax_rate" }, outputId: "employer_taxes" },
    { formulaId: "custom.saatlik_ucret_analyzer_2", inputMap: { HealthInsurance: "health_insurance", RetirementMatch: "retirement_match", PaidTimeOffCost: "paid_time_off_cost" }, outputId: "benefits" },
    { formulaId: "custom.saatlik_ucret_analyzer_3", inputMap: { GrossAnnualSalary: "gross_annual_salary", EmployerTaxes: "employer_taxes", Benefits: "benefits" }, outputId: "total_labor_cost" },
    { formulaId: "custom.saatlik_ucret_analyzer_4", inputMap: { WeeksPerYear: "weeks_per_year", VacationWeeks: "vacation_weeks", HoursPerWeek: "hours_per_week", IdleTimePct: "idle_time_pct" }, outputId: "productive_hours" },
    { formulaId: "custom.saatlik_ucret_analyzer_5", inputMap: { TotalLaborCost: "total_labor_cost", ProductiveHours: "productive_hours" }, outputId: "fully_burdened_hourly_rate" },
    { formulaId: "custom.saatlik_ucret_analyzer_6", inputMap: { FullyBurdenedHourlyRate: "fully_burdened_hourly_rate", TargetMargin: "target_margin" }, outputId: "margin_rate" },
  ],
  reportTemplate: {
    title: "Saatlik Ücret Report",
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
