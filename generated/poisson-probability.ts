// Auto-generated from poisson-probability-schema.json
import * as z from 'zod';

export interface Poisson_probabilityInput {
  lambda: number;
  k: number;
  kumulatif: number;
}

export const Poisson_probabilityInputSchema = z.object({
  lambda: z.number().default(5),
  k: z.number().default(3),
  kumulatif: z.number().default(3),
});

function evaluateAllFormulas(input: Poisson_probabilityInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { Math.exp(-lambda) * Math.pow(lambda, k) / (k === 0 ? 1 : (() => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; })()) })(); results["tamOlasilik"] = Number.isFinite(v) ? v : 0; } catch { results["tamOlasilik"] = 0; }
  try { const v = (() => { let sum = 0; for (let i = 0; i <= kumulatif; i++) { sum += Math.exp(-lambda) * Math.pow(lambda, i) / (i === 0 ? 1 : (() => { let f = 1; for (let j = 2; j <= i; j++) f *= j; return f; })()); } return sum; })(); results["kumulatifOlasilik"] = Number.isFinite(v) ? v : 0; } catch { results["kumulatifOlasilik"] = 0; }
  return results;
}


export function calculatePoisson_probability(input: Poisson_probabilityInput): Poisson_probabilityOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["tamOlasilik"] ?? 0;
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


export interface Poisson_probabilityOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
