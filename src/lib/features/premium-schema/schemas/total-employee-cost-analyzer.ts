
import type { PremiumCalculatorSchema } from "@/lib/features/premium-schema/premium-calculator-schema";
export const TOTAL_EMPLOYEE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "total-employee-cost-analyzer", legacyPaidSlug: "total-employee-cost-analyzer",
  name: "Total Employee Cost Analyzer", name_i18n: {"en":"Total Employee Cost Analyzer"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "If the total of employee gross salary, benefits, and employer contribution is not calculated, the actual labor cost remains hidden.", painStatement_i18n: {"en":"If the total of employee gross salary, benefits, and employer contribution is not calculated, the actual labor cost remains hidden."},
  inputs: [
    { id: "numEmployees", label: "Number of employees", label_i18n: {"en":"Number of employees"}, type: "number", unit: "people", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Number of employees", expertMeaning_i18n: {"en":"Number of employees"} },
    { id: "avgGrossSalary", label: "Average monthly gross salary", label_i18n: {"en":"Average monthly gross salary"}, type: "number", unit: "USD/month", required: true, smartDefault: 2500, validation: { min: 1 }, helper: "", expertMeaning: "Average monthly gross salary", expertMeaning_i18n: {"en":"Average monthly gross salary"} },
    { id: "employerPayrollTax", label: "Employer payroll tax rate", label_i18n: {"en":"Employer payroll tax rate"}, type: "number", unit: "%", required: true, smartDefault: 22, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Employer payroll tax rate", expertMeaning_i18n: {"en":"Employer payroll tax rate"} },
    { id: "benefitsCostPerEmployee", label: "Monthly benefits per employee", label_i18n: {"en":"Monthly benefits per employee"}, type: "number", unit: "USD/month", required: true, smartDefault: 400, validation: { min: 0 }, helper: "", expertMeaning: "Monthly benefits per employee", expertMeaning_i18n: {"en":"Monthly benefits per employee"} },
    { id: "trainingCostPerEmployee", label: "Annual training cost per employee", label_i18n: {"en":"Annual training cost per employee"}, type: "number", unit: "USD/year", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Annual training cost per employee", expertMeaning_i18n: {"en":"Annual training cost per employee"} },
    { id: "avgWorkHoursPerMonth", label: "Average monthly work hours", label_i18n: {"en":"Average monthly work hours"}, type: "number", unit: "saat/ay", required: false, smartDefault: 176, validation: { min: 1 }, helper: "", expertMeaning: "Average monthly work hours", expertMeaning_i18n: {"en":"Average monthly work hours"} },
  ],
  outputs: [
    { id: "totalEmployeeCost", label: "Total Employee Cost", label_i18n: {"en":"Total Employee Cost"}, unit: "USD/month", format: "currency", isBigNumber: true },
    { id: "employeeCostPerHour", label: "Employee Hourly Cost", label_i18n: {"en":"Employee Hourly Cost"}, unit: "USD/hour", format: "currency" },
  ],
  thresholds: [{ fieldId: "employeeCostPerHour", warning: 30, critical: 50, direction: "higher_is_bad", warningMessage: "Hourly cost > $30 - productivity analysis is recommended.", warningMessage_i18n: {"en":"Hourly cost > $30 - productivity analysis is recommended."}, criticalMessage: "Hourly cost > $50 - cost structure should be optimized.", criticalMessage_i18n: {"en":"Hourly cost > $50 - cost structure should be optimized."} }],
  formulaPipeline: [
    { formulaId: "cost.total_employee_cost", inputMap: { numEmployees: "numEmployees", avgGrossSalary: "avgGrossSalary", employerPayrollTax: "employerPayrollTax", benefitsCostPerEmployee: "benefitsCostPerEmployee", trainingCostPerEmployee: "trainingCostPerEmployee" ,
        grossSalary: "grossSalary",
        employerCosts: "employerCosts",
        bonus: "bonus",
        training: "training",
        otherBenefits: "otherBenefits"}, outputId: "totalEmployeeCost" },
    { formulaId: "cost.employee_cost_per_hour", inputMap: { totalEmployeeCost: "totalEmployeeCost", numEmployees: "numEmployees", avgWorkHoursPerMonth: "avgWorkHoursPerMonth" ,
        annualWorkHours: "annualWorkHours"}, outputId: "employeeCostPerHour" },
  ],
  reportTemplate: { title: "Total Employee Cost Report", title_i18n: {"en":"Total Employee Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["Total = N × (Salary × (1+Tax) + Benefits + Training/12).", "Hourly cost = Total / (N × Hours).", "Includes all statutory employer contributions."],assumptionNotes_i18n:[{"en":"Total = N × (Salary × (1+Tax) + Benefits + Training/12)."},{"en":"Hourly cost = Total / (N × Hours)."},{"en":"Includes all statutory employer contributions."}] },
};
