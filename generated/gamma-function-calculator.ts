// Auto-generated from gamma-function-calculator-schema.json
import * as z from 'zod';

export interface Gamma_function_calculatorInput {
  x: number;
  tolerance: number;
  maxIterations: number;
  useStirling: number;
}

export const Gamma_function_calculatorInputSchema = z.object({
  x: z.number().default(1),
  tolerance: z.number().default(1e-10),
  maxIterations: z.number().default(100),
  useStirling: z.number().default(0),
});

function evaluateAllFormulas(input: Gamma_function_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { function gammaLanczos(x, tol, maxIter) { if (x < 0.5) { return Math.PI / (Math.sin(Math.PI * x) * gammaLanczos(1 - x, tol, maxIter)); } x -= 1; const p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; let g = 7; let z = x + 0.5; let sum = p[0]; for (let i = 1; i < p.length; i++) { sum += p[i] / (x + i); } const t = x + g + 0.5; return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * sum; } })(); results["gammaLanczos"] = Number.isFinite(v) ? v : 0; } catch { results["gammaLanczos"] = 0; }
  try { const v = (() => { function gammaStirling(x) { return Math.sqrt(2 * Math.PI / x) * Math.pow(x / Math.E, x); } })(); results["gammaStirling"] = Number.isFinite(v) ? v : 0; } catch { results["gammaStirling"] = 0; }
  try { const v = (() => { function gamma(x, tol, maxIter, useStirling) { if (x <= 0 && Number.isInteger(x)) { return NaN; } if (useStirling && x > 10) { return gammaStirling(x); } return gammaLanczos(x, tol, maxIter); } })(); results["gamma"] = Number.isFinite(v) ? v : 0; } catch { results["gamma"] = 0; }
  results["Gamma_x__value"] = 0;
  results["Natural_log_of_Gamma_x_"] = 0;
  results["Factorial_equivalent__x_1___if_x_is_inte"] = 0;
  try { const v = Gamma(input.x); results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateGamma_function_calculator(input: Gamma_function_calculatorInput): Gamma_function_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Gamma_function_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
