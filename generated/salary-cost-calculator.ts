// Auto-generated from salary-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SalaryCostCalculatorInput {
  annualSalary: number;
  bonusPercentage: number;
  employerTaxRate: number;
  benefitsCost: number;
  overheadRate: number;
  workingDaysPerYear: number;
  hoursPerDay: number;
  productiveUtilization: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'TRY' | 'Other';
}

export const SalaryCostCalculatorInputSchema = z.object({
  annualSalary: z.number().min(0).default(50000),
  bonusPercentage: z.number().min(0).max(100).default(10),
  employerTaxRate: z.number().min(0).max(50).default(15),
  benefitsCost: z.number().min(0).default(10000),
  overheadRate: z.number().min(0).max(100).default(20),
  workingDaysPerYear: z.number().min(1).max(365).default(260),
  hoursPerDay: z.number().min(1).max(24).default(8),
  productiveUtilization: z.number().min(0).max(100).default(80),
  currency: z.enum(['USD', 'EUR', 'GBP', 'TRY', 'Other']).default('USD'),
});

export interface SalaryCostCalculatorOutput {
  totalAnnualCost: number;
  breakdown: {
    baseSalary: number;
    bonus: number;
    employerTaxes: number;
    benefits: number;
    overhead: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SalaryCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalAnnualCost = ((): number => { try { const __v = input.annualSalary * (1 + input.bonusPercentage/100) * (1 + input.employerTaxRate/100) + input.benefitsCost + (input.annualSalary * input.overheadRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCostPerEmployee = ((): number => { try { const __v = results.totalAnnualCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerDay = ((): number => { try { const __v = results.totalAnnualCost / input.workingDaysPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerHour = ((): number => { try { const __v = results.costPerDay / input.hoursPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveCostPerProductiveHour = ((): number => { try { const __v = results.costPerHour / (input.productiveUtilization/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.monthlyCost = ((): number => { try { const __v = results.totalAnnualCost / 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSalaryCostCalculator(input: SalaryCostCalculatorInput): SalaryCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalAnnualCost = results.totalAnnualCost ?? 0;
  const breakdown = {
    baseSalary: results.baseSalary,
    bonus: results.bonus,
    employerTaxes: results.employerTaxes,
    benefits: results.benefits,
    overhead: results.overhead,
  };

  // rule: annualSalary > 0
  // rule: bonusPercentage >= 0
  // rule: employerTaxRate >= 0
  // rule: benefitsCost >= 0
  // rule: overheadRate >= 0
  // rule: workingDaysPerYear > 0
  // rule: hoursPerDay > 0
  // rule: productiveUtilization > 0 && productiveUtilization <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low utilization warning: consider process improvement.
  // threshold skipped (non-JS): High tax burden: review tax optimization strategies.
  // threshold skipped (non-JS): High overhead: investigate cost reduction opportunities.

  const dataConfidenceAdjusted = (() => { try { return results.totalAnnualCost * (1 - (100 - input.productiveUtilization)/200); } catch { return totalAnnualCost; } })();

  return {
    totalAnnualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (historical comparison)","Benchmarking against industry averages","Detailed breakdown report with charts"],
  };
}
