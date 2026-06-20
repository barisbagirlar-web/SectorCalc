/**
 * Tool #29 — Toplam Çalışan Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TOTAL_EMPLOYEE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "total-employee-cost-analyzer", legacyPaidSlug: "total-employee-cost-analyzer",
  name: "Toplam Çalışan Maliyeti Analizi", sectorSlug: "financial-planning", category: "cost",
  painStatement: "Çalışan başına brüt maaş, yan haklar ve işveren payı toplamı hesaplanmazsa gerçek işgücü maliyeti gizli kalır.",
  inputs: [
    { id: "numEmployees", label: "Çalışan Sayısı", type: "number", unit: "kişi", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Number of employees" },
    { id: "avgGrossSalary", label: "Ortalama Brüt Maaş", type: "number", unit: "USD/ay", required: true, smartDefault: 2500, validation: { min: 1 }, helper: "", expertMeaning: "Average monthly gross salary" },
    { id: "employerPayrollTax", label: "İşveren Payı Oranı", type: "number", unit: "%", required: true, smartDefault: 22, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Employer payroll tax rate" },
    { id: "benefitsCostPerEmployee", label: "Yan Haklar (Çalışan Başına)", type: "number", unit: "USD/ay", required: true, smartDefault: 400, validation: { min: 0 }, helper: "", expertMeaning: "Monthly benefits per employee" },
    { id: "trainingCostPerEmployee", label: "Eğitim Maliyeti (Çalışan Başına)", type: "number", unit: "USD/yıl", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Annual training cost per employee" },
    { id: "avgWorkHoursPerMonth", label: "Aylık Çalışma Saati", type: "number", unit: "saat/ay", required: false, smartDefault: 176, validation: { min: 1 }, helper: "", expertMeaning: "Average monthly work hours" },
  ],
  outputs: [
    { id: "totalEmployeeCost", label: "Toplam Çalışan Maliyeti", unit: "USD/ay", format: "currency", isBigNumber: true },
    { id: "employeeCostPerHour", label: "Çalışan Saatlik Maliyeti", unit: "USD/saat", format: "currency" },
  ],
  thresholds: [{ fieldId: "employeeCostPerHour", warning: 30, critical: 50, direction: "higher_is_bad", warningMessage: "Saatlik maliyet > $30 — verimlilik analizi önerilir.", criticalMessage: "Saatlik maliyet > $50 — maliyet yapısı optimize edilmeli." }],
  formulaPipeline: [
    { formulaId: "cost.total_employee_cost", inputMap: { numEmployees: "numEmployees", avgGrossSalary: "avgGrossSalary", employerPayrollTax: "employerPayrollTax", benefitsCostPerEmployee: "benefitsCostPerEmployee", trainingCostPerEmployee: "trainingCostPerEmployee" }, outputId: "totalEmployeeCost" },
    { formulaId: "cost.employee_cost_per_hour", inputMap: { totalEmployeeCost: "totalEmployeeCost", numEmployees: "numEmployees", avgWorkHoursPerMonth: "avgWorkHoursPerMonth" }, outputId: "employeeCostPerHour" },
  ],
  reportTemplate: { title: "Total Employee Cost Report", sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["Total = N × (Salary × (1+Tax) + Benefits + Training/12).", "Hourly cost = Total / (N × Hours).", "Includes all statutory employer contributions."] },
};
