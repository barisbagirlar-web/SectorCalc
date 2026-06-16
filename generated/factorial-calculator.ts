// Auto-generated from factorial-calculator-schema.json
import * as z from 'zod';

export interface Factorial_calculatorInput {
  n: number;
  reserved1: number;
  reserved2: number;
  reserved3: number;
}

export const Factorial_calculatorInputSchema = z.object({
  n: z.number().default(5),
  reserved1: z.number().default(0),
  reserved2: z.number().default(0),
  reserved3: z.number().default(0),
});

function evaluateAllFormulas(input: Factorial_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { input.n < 0 ? NaN : (function f(n) { return n<=1 ? 1 : n * f(n-1); })(Math.floor(input.n)) })(); results["factorial"] = Number.isFinite(v) ? v : 0; } catch { results["factorial"] = 0; }
  try { const v = (() => { input.n < 0 ? 'Invalid input for factorial' : (input.n < 2 ? '1! = 1' : (Math.floor(input.n) + '! = ' + Array.from({length: Math.floor(input.n)}, (_, i) => Math.floor(input.n) - i).join(' × ') + ' = ' + (function f(n) { return n<=1 ? 1 : n * f(n-1); })(Math.floor(input.n)))) })(); results["steps"] = Number.isFinite(v) ? v : 0; } catch { results["steps"] = 0; }
  return results;
}


export function calculateFactorial_calculator(input: Factorial_calculatorInput): Factorial_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["factorial"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Factorial_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
