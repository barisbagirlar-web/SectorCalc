// Auto-generated from age-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AgeCalculatorInput {
  birthYear: number;
  currentYear: number;
}

export const AgeCalculatorInputSchema = z.object({
  birthYear: z.number().min(1900).max(2024).default(1990),
  currentYear: z.number().min(1900).max(2100).default(2024),
});

export interface AgeCalculatorOutput {
  ageYears: number;
  breakdown: {
    ageYears: number;
    recommendedPrice: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AgeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.ageYears = input.currentYear - input.birthYear;
  results.recommendedPrice = results.ageYears * 0.5;
  return results;
}

export function calculateAgeCalculator(input: AgeCalculatorInput): AgeCalculatorOutput {
  const results = evaluateFormulas(input);
  const ageYears = results.ageYears;
  const breakdown = {
    ageYears: results.ageYears,
    recommendedPrice: results.recommendedPrice,
  };

  // rule: birthYear must be a finite number
  // rule: currentYear must be a finite number
  // rule: birthYear must be >= 1900
  // rule: currentYear must be >= 1900
  // rule: currentYear must be >= birthYear
  // threshold ageYears: If ageYears < 0, invalid input; if ageYears > 120, unlikely but possible.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted = results.ageYears;

  return {
    ageYears,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with sector averages"],
  };
}
