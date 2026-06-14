// Auto-generated from employee-total-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EmployeeTotalCostCalculatorInput {
  annualSalary: number;
  bonusPercentage: number;
  benefitsCost: number;
  payrollTaxRate: number;
  trainingCost: number;
  equipmentCost: number;
  overheadRate: number;
  workingDaysPerYear: number;
  hoursPerDay: number;
  productivityRate: number;
}

export const EmployeeTotalCostCalculatorInputSchema = z.object({
  annualSalary: z.number().min(0).default(50000),
  bonusPercentage: z.number().min(0).max(100).default(10),
  benefitsCost: z.number().min(0).default(15000),
  payrollTaxRate: z.number().min(0).max(100).default(7.65),
  trainingCost: z.number().min(0).default(2000),
  equipmentCost: z.number().min(0).default(1000),
  overheadRate: z.number().min(0).max(100).default(20),
  workingDaysPerYear: z.number().min(1).max(365).default(260),
  hoursPerDay: z.number().min(1).max(24).default(8),
  productivityRate: z.number().min(0).max(100).default(85),
});

export interface EmployeeTotalCostCalculatorOutput {
  totalAnnualCost: number;
  breakdown: {
    baseSalary: number;
    bonus: number;
    benefits: number;
    payrollTax: number;
    training: number;
    equipment: number;
    overhead: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EmployeeTotalCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalAnnualCost = ((): number => { try { const __v = input.annualSalary + (input.annualSalary * input.bonusPercentage / 100) + input.benefitsCost + (input.annualSalary * input.payrollTaxRate / 100) + input.trainingCost + input.equipmentCost + (input.annualSalary * input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalHourlyCost = ((): number => { try { const __v = results.totalAnnualCost / (input.workingDaysPerYear * input.hoursPerDay); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveHourlyCost = ((): number => { try { const __v = results.totalHourlyCost / (input.productivityRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerProductiveHour = ((): number => { try { const __v = results.totalAnnualCost / (input.workingDaysPerYear * input.hoursPerDay * input.productivityRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateEmployeeTotalCostCalculator(input: EmployeeTotalCostCalculatorInput): EmployeeTotalCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalAnnualCost = results.totalAnnualCost ?? 0;
  const breakdown = {
    baseSalary: results.baseSalary,
    bonus: results.bonus,
    benefits: results.benefits,
    payrollTax: results.payrollTax,
    training: results.training,
    equipment: results.equipment,
    overhead: results.overhead,
  };

  // rule: annualSalary > 0
  // rule: bonusPercentage >= 0
  // rule: benefitsCost >= 0
  // rule: payrollTaxRate >= 0
  // rule: trainingCost >= 0
  // rule: equipmentCost >= 0
  // rule: overheadRate >= 0
  // rule: workingDaysPerYear > 0
  // rule: hoursPerDay > 0
  // rule: productivityRate > 0 && productivityRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low productivity warning: consider process improvement.
  // threshold skipped (non-JS): High overhead: review allocation or reduce costs.
  // threshold skipped (non-JS): Benefits cost exceeds 40% of salary: benchmark against industry.

  const dataConfidenceAdjusted = (() => { try { return results.totalAnnualCost * (1 - (1 - dataConfidence) * 0.1); } catch { return totalAnnualCost; } })();

  return {
    totalAnnualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
