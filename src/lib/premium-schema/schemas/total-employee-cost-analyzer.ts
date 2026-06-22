/**
 * Tool #29 — Toplam Çalışan Maliyeti
 */
import type { PremiumCalculatorSchema } from "@/lib/premium-schema/premium-calculator-schema";
export const TOTAL_EMPLOYEE_COST_SCHEMA: PremiumCalculatorSchema = {
  id: "total-employee-cost-analyzer", legacyPaidSlug: "total-employee-cost-analyzer",
  name: "Toplam Çalışan Maliyeti Analizi", name_i18n: {"en":"Toplam calisan Maliyeti Analizi","tr":"Toplam Çalışan Maliyeti Analizi"}, sectorSlug: "financial-planning", category: "cost",
  painStatement: "Çalışan başına brüt maaş, yan haklar ve işveren payı toplamı hesaplanmazsa gerçek işgücü maliyeti gizli kalır.", painStatement_i18n: {"en":"Çalışan başına brüt maaş, yan haklar ve işveren payı toplamı hesaplanmazsa gerçek işgücü maliyeti gizli kalır.","tr":"Çalışan başına brüt maaş, yan haklar ve işveren payı toplamı hesaplanmazsa gerçek işgücü maliyeti gizli kalır."},
  inputs: [
    { id: "numEmployees", label: "Çalışan Sayısı", label_i18n: {"en":"Number of employees","tr":"Çalışan Sayısı"}, type: "number", unit: "kişi", required: true, smartDefault: 50, validation: { min: 1 }, helper: "", expertMeaning: "Number of employees", expertMeaning_i18n: {"en":"Number of employees","tr":"çalışan sayısı"} },
    { id: "avgGrossSalary", label: "Ortalama Brüt Maaş", label_i18n: {"en":"Average monthly gross salary","tr":"Ortalama Brüt Maaş"}, type: "number", unit: "USD/ay", required: true, smartDefault: 2500, validation: { min: 1 }, helper: "", expertMeaning: "Average monthly gross salary", expertMeaning_i18n: {"en":"Average monthly gross salary","tr":"ortalama brüt maaş"} },
    { id: "employerPayrollTax", label: "İşveren Payı Oranı", label_i18n: {"en":"Employer payroll tax rate","tr":"İşveren Payı Oranı"}, type: "number", unit: "%", required: true, smartDefault: 22, validation: { min: 0, max: 100 }, helper: "", expertMeaning: "Employer payroll tax rate", expertMeaning_i18n: {"en":"Employer payroll tax rate","tr":"i̇şveren payı oranı"} },
    { id: "benefitsCostPerEmployee", label: "Yan Haklar (Çalışan Başına)", label_i18n: {"en":"Monthly benefits per employee","tr":"Yan Haklar (Çalışan Başına)"}, type: "number", unit: "USD/ay", required: true, smartDefault: 400, validation: { min: 0 }, helper: "", expertMeaning: "Monthly benefits per employee", expertMeaning_i18n: {"en":"Monthly benefits per employee","tr":"yan haklar (çalışan başına)"} },
    { id: "trainingCostPerEmployee", label: "Eğitim Maliyeti (Çalışan Başına)", label_i18n: {"en":"Annual training cost per employee","tr":"Eğitim Maliyeti (Çalışan Başına)"}, type: "number", unit: "USD/yıl", required: false, smartDefault: 500, validation: { min: 0 }, helper: "", expertMeaning: "Annual training cost per employee", expertMeaning_i18n: {"en":"Annual training cost per employee","tr":"eğitim maliyeti (çalışan başına)"} },
    { id: "avgWorkHoursPerMonth", label: "Aylık Çalışma Saati", label_i18n: {"en":"Average monthly work hours","tr":"Aylık Çalışma Saati"}, type: "number", unit: "saat/ay", required: false, smartDefault: 176, validation: { min: 1 }, helper: "", expertMeaning: "Average monthly work hours", expertMeaning_i18n: {"en":"Average monthly work hours","tr":"aylık çalışma saati"} },
  ],
  outputs: [
    { id: "totalEmployeeCost", label: "Toplam Çalışan Maliyeti", label_i18n: {"en":"Toplam Calsan Maliyeti","tr":"Toplam Çalışan Maliyeti"}, unit: "USD/ay", format: "currency", isBigNumber: true },
    { id: "employeeCostPerHour", label: "Çalışan Saatlik Maliyeti", label_i18n: {"en":"Calsan Saatlik Maliyeti","tr":"Çalışan Saatlik Maliyeti"}, unit: "USD/saat", format: "currency" },
  ],
  thresholds: [{ fieldId: "employeeCostPerHour", warning: 30, critical: 50, direction: "higher_is_bad", warningMessage: "Saatlik maliyet > $30 — verimlilik analizi önerilir.", warningMessage_i18n: {"en":"Saatlik maliyet > $30 — verimlilik analizi önerilir.","tr":"Saatlik maliyet > $30 — verimlilik analizi önerilir."}, criticalMessage: "Saatlik maliyet > $50 — maliyet yapısı optimize edilmeli.", criticalMessage_i18n: {"en":"Saatlik maliyet > $50 — maliyet yapısı optimize edilmeli.","tr":"Saatlik maliyet > $50 — maliyet yapısı optimize edilmeli."} }],
  formulaPipeline: [
    { formulaId: "cost.total_employee_cost", inputMap: { numEmployees: "numEmployees", avgGrossSalary: "avgGrossSalary", employerPayrollTax: "employerPayrollTax", benefitsCostPerEmployee: "benefitsCostPerEmployee", trainingCostPerEmployee: "trainingCostPerEmployee" }, outputId: "totalEmployeeCost" },
    { formulaId: "cost.employee_cost_per_hour", inputMap: { totalEmployeeCost: "totalEmployeeCost", numEmployees: "numEmployees", avgWorkHoursPerMonth: "avgWorkHoursPerMonth" }, outputId: "employeeCostPerHour" },
  ],
  reportTemplate: { title: "Total Employee Cost Report", title_i18n: {"en":"Total Employee Cost Report","tr":"Total Employee Cost Report"}, sections: ["executive_summary", "thresholds", "action_plan", "assumptions"], exportFormats: ["pdf", "excel"] },
  assumptions: { hiddenLossMultiplier: 1.15, volatilityPercent: 5, targetMarginPercent: 15, assumptionNotes: ["Total = N × (Salary × (1+Tax) + Benefits + Training/12).", "Hourly cost = Total / (N × Hours).", "Includes all statutory employer contributions."],assumptionNotes_i18n:[{"en":"Total = N × (Salary × (1+Tax) + Benefits + Training/12).","tr":"Total = N × (Salary × (1+Tax) + Benefits + Training/12)."},{"en":"Hourly cost = Total / (N × Hours).","tr":"Hourly cost = Total / (N × Hours)."},{"en":"Includes all statutory employer contributions.","tr":"Includes all statutory employer contributions."}] },
};
