// Auto-generated from average-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AverageCalculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
}

export const AverageCalculatorInputSchema = z.object({
  value1: z.number().default(0),
  value2: z.number().default(0),
  value3: z.number().default(0),
  value4: z.number().default(0),
  value5: z.number().default(0),
});

export interface AverageCalculatorOutput {
  average: number;
  breakdown: {
    count: number;
    sum: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AverageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.count = results.count = (input.value1 !== undefined ? 1 : 0) + (input.value2 !== undefined ? 1 : 0) + (input.value3 !== undefined ? 1 : 0) + (input.value4 !== undefined ? 1 : 0) + (input.value5 !== undefined ? 1 : 0);
  results.sum = results.sum = (input.value1 || 0) + (input.value2 || 0) + (input.value3 || 0) + (input.value4 || 0) + (input.value5 || 0);
  results.average = results.average = results.count > 0 ? results.sum / results.count : undefined;
  return results;
}

export function calculateAverageCalculator(input: AverageCalculatorInput): AverageCalculatorOutput {
  const results = evaluateFormulas(input);
  const average = results.average;
  const breakdown = {
    count: results.count,
    sum: results.sum,
  };

  // rule: All input values must be finite numbers.
  // rule: At least one input must be non-zero to compute average (count > 0).
  // threshold countZero: If count is 0, average is undefined.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Ensure all input values are accurate and represent the same unit of measure.","If average is used for benchmarking, compare against industry standards."];
  const dataConfidenceAdjusted = results.average (no confidence adjustment applied);

  return {
    average,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Comparison with historical averages","Detailed report with statistical measures (median, mode, standard deviation)"],
  };
}
