// Auto-generated from break-even-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BreakEvenCalculatorInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  periodDays: number;
}

export const BreakEvenCalculatorInputSchema = z.object({
  fixedCosts: z.number().min(0).default(0),
  variableCostPerUnit: z.number().min(0).default(0),
  sellingPricePerUnit: z.number().min(0).default(0),
  periodDays: z.number().min(1).max(3650).default(365),
});

export interface BreakEvenCalculatorOutput {
  breakEvenUnits: number;
  breakdown: {
    contributionMargin: number;
    breakEvenRevenue: number;
    annualizedBreakEvenUnits: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BreakEvenCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.contributionMargin = input.sellingPricePerUnit - input.variableCostPerUnit;
  results.breakEvenUnits = input.fixedCosts / results.contributionMargin;
  results.breakEvenRevenue = results.breakEvenUnits * input.sellingPricePerUnit;
  results.annualizedBreakEvenUnits = results.breakEvenUnits * (365 / input.periodDays);
  return results;
}

export function calculateBreakEvenCalculator(input: BreakEvenCalculatorInput): BreakEvenCalculatorOutput {
  const results = evaluateFormulas(input);
  const breakEvenUnits = results.breakEvenUnits;
  const breakdown = {
    contributionMargin: results.contributionMargin,
    breakEvenRevenue: results.breakEvenRevenue,
    annualizedBreakEvenUnits: results.annualizedBreakEvenUnits,
  };

  // rule: fixedCosts must be >= 0
  // rule: variableCostPerUnit must be >= 0
  // rule: sellingPricePerUnit must be > 0
  // rule: periodDays must be between 1 and 3650
  // rule: sellingPricePerUnit must be > variableCostPerUnit to have a positive contribution margin
  // threshold contributionMargin: If contributionMargin <= 0, break-even is impossible (infinite units).
  // threshold breakEvenUnits: If breakEvenUnits > 1e6, consider reducing fixed costs or increasing price.
  const hiddenLossDrivers: string[] = ["If contributionMargin <= 0: 'Negative or zero contribution margin; break-even not achievable.'","If breakEvenUnits > 1e6: 'Break-even point exceeds 1 million units; review cost structure.'"];
  const suggestedActions: string[] = ["If contributionMargin is low: 'Consider reducing variable costs or increasing selling price.'","If breakEvenUnits is high: 'Evaluate reducing fixed costs or improving operational efficiency.'"];
  const dataConfidenceAdjusted = results.breakEvenUnits * (1 + (1 - dataConfidence) * 0.1) if dataConfidence provided;

  return {
    breakEvenUnits,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of break-even chart","CSV export of scenario analysis","Trend analysis over multiple periods","Comparison with industry benchmarks","Detailed report with sensitivity analysis"],
  };
}
