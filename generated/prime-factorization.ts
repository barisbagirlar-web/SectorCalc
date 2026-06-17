// Auto-generated from prime-factorization-schema.json
import * as z from 'zod';

export interface Prime_factorizationInput {
  number: number;
  maxIterations: number;
  auto_input_3: number;
}

export const Prime_factorizationInputSchema = z.object({
  number: z.number().default(60),
  maxIterations: z.number().default(10000),
  auto_input_3: z.number().default(1),
});

function evaluateAllFormulas(input: Prime_factorizationInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { function primeFactors(n) { let factors = []; let d = 2; while (n > 1 && d <= Math.sqrt(n) + 1) { while (n % d === 0) { factors.push(d); n = n / d; } d++; } if (n > 1) factors.push(n); return factors; } })(); results["primeFactors"] = Number.isFinite(v) ? v : 0; } catch { results["primeFactors"] = 0; }
  try { const v = (() => { function exponentForm(factors) { let map = {}; factors.forEach(f => map[f] = (map[f] || 0) + 1); return Object.entries(map).map(([p, e]) => p + (e > 1 ? '^' + e : '')).join(' × '); } })(); results["exponentForm"] = Number.isFinite(v) ? v : 0; } catch { results["exponentForm"] = 0; }
  try { const v = (() => { function isPrime(num) { if (num < 2) return false; for (let i = 2; i <= Math.sqrt(num); i++) { if (num % i === 0) return false; } return true; } })(); results["isPrime"] = Number.isFinite(v) ? v : 0; } catch { results["isPrime"] = 0; }
  try { const v = (results["primeFactors"] ?? 0); results["_primeFactors_"] = Number.isFinite(v) ? v : 0; } catch { results["_primeFactors_"] = 0; }
  try { const v = {distinctCount}; results["_distinctCount_"] = Number.isFinite(v) ? v : 0; } catch { results["_distinctCount_"] = 0; }
  try { const v = {totalCount}; results["_totalCount_"] = Number.isFinite(v) ? v : 0; } catch { results["_totalCount_"] = 0; }
  results["Is_the_original_number_prime___isPrime_"] = 0;
  return results;
}


export function calculatePrime_factorization(input: Prime_factorizationInput): Prime_factorizationOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primeFactors"] ?? 0;
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


export interface Prime_factorizationOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
