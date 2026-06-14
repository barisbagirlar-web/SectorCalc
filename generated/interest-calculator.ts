// Auto-generated from interest-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface InterestCalculatorInput {
  principal: number;
  annualInterestRate: number;
  timePeriod: number;
  compoundingFrequency: 'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'daily';
  interestType: 'simple' | 'compound';
  dataConfidence: number;
}

export const InterestCalculatorInputSchema = z.object({
  principal: z.number().min(0).default(1000),
  annualInterestRate: z.number().min(0).max(100).default(5),
  timePeriod: z.number().min(0).max(100).default(1),
  compoundingFrequency: z.enum(['annually', 'semi-annually', 'quarterly', 'monthly', 'daily']).default('annually'),
  interestType: z.enum(['simple', 'compound']).default('simple'),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface InterestCalculatorOutput {
  totalInterest: number;
  breakdown: {
    principal: number;
    totalInterest: number;
    totalAmount: number;
    effectiveAnnualRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: InterestCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.simpleInterest = ((): number => { try { const __v = input.principal * (input.annualInterestRate / 100) * input.timePeriod; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAmountSimple = ((): number => { try { const __v = input.principal + results.simpleInterest; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.compoundingFactor = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.compoundInterest = ((): number => { try { const __v = input.principal * (1 + (input.annualInterestRate / 100) / results.compoundingFactor) ^ (results.compoundingFactor * input.timePeriod) - input.principal; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAmountCompound = ((): number => { try { const __v = input.principal + results.compoundInterest; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateInterestCalculator(input: InterestCalculatorInput): InterestCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalInterest = results.totalInterest ?? 0;
  const breakdown = {
    principal: results.principal,
    totalInterest: results.totalInterest,
    totalAmount: results.totalAmountSimple,
    effectiveAnnualRate: results.effectiveAnnualRate,
  };

  // rule: principal must be >= 0
  // rule: annualInterestRate must be between 0 and 100
  // rule: timePeriod must be >= 0
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High interest rate warning
  // threshold skipped (non-JS): Long-term investment warning

  const dataConfidenceAdjusted = (() => { try { return totalInterest * (input.dataConfidence / 100); } catch { return totalInterest; } })();

  return {
    totalInterest,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Market Rates","Detailed Amortization Schedule"],
  };
}
