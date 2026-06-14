// Auto-generated from percentage-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PercentageCalculatorInput {
  value: number;
  percentage: number;
  mode: 'percentageOf' | 'percentageChange' | 'valueFromPercentage';
  baseValue: number;
  resultValue: number;
}

export const PercentageCalculatorInputSchema = z.object({
  value: z.number().default(0),
  percentage: z.number().min(0).max(100).default(0),
  mode: z.enum(['percentageOf', 'percentageChange', 'valueFromPercentage']).default('percentageOf'),
  baseValue: z.number().default(0),
  resultValue: z.number().default(0),
});

export interface PercentageCalculatorOutput {
  result: number;
  breakdown: {
    inputValue: number;
    inputPercentage: number;
    mode: number;
    intermediate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PercentageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.percentageOf = ((): number => { try { const __v = input.value * (input.percentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.percentageChange = ((): number => { try { const __v = ((input.value - input.baseValue) / input.baseValue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.valueFromPercentage = ((): number => { try { const __v = (input.resultValue * 100) / input.percentage; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePercentageCalculator(input: PercentageCalculatorInput): PercentageCalculatorOutput {
  const results = evaluateFormulas(input);
  const result = results.result ?? 0;
  const breakdown = {
    inputValue: results.inputValue,
    inputPercentage: results.inputPercentage,
    mode: results.mode,
    intermediate: results.intermediate,
  };

  // rule: If mode == 'percentageChange' then baseValue must be non-zero.
  // rule: If mode == 'valueFromPercentage' then resultValue must be non-zero and percentage must be non-zero.
  // rule: percentage must be between 0 and 100 inclusive.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.percentage > 100) hiddenLossDrivers.push("percentage");

  const dataConfidenceAdjusted = (() => { try { return result; } catch { return result; } })();

  return {
    result,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison","Detailed Report"],
  };
}
