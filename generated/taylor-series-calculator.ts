// Auto-generated from taylor-series-calculator-schema.json
import * as z from 'zod';

export interface Taylor_series_calculatorInput {
  expansionPoint: number;
  evaluationPoint: number;
  degree: number;
  f0: number;
  f1: number;
  f2: number;
  f3: number;
}

export const Taylor_series_calculatorInputSchema = z.object({
  expansionPoint: z.number().default(0),
  evaluationPoint: z.number().default(1),
  degree: z.number().default(3),
  f0: z.number().default(1),
  f1: z.number().default(1),
  f2: z.number().default(1),
  f3: z.number().default(1),
});

function evaluateAllFormulas(input: Taylor_series_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.f0 + (input.degree >= 1 ? input.f1 * (input.evaluationPoint - input.expansionPoint) : 0) + (input.degree >= 2 ? (input.f2 / 2) * Math.pow(input.evaluationPoint - input.expansionPoint, 2) : 0) + (input.degree >= 3 ? (input.f3 / 6) * Math.pow(input.evaluationPoint - input.expansionPoint, 3) : 0); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.f0; results["constTerm"] = Number.isFinite(v) ? v : 0; } catch { results["constTerm"] = 0; }
  try { const v = input.degree >= 1 ? input.f1 * (input.evaluationPoint - input.expansionPoint) : 0; results["linearTerm"] = Number.isFinite(v) ? v : 0; } catch { results["linearTerm"] = 0; }
  try { const v = input.degree >= 2 ? (input.f2 / 2) * Math.pow(input.evaluationPoint - input.expansionPoint, 2) : 0; results["quadraticTerm"] = Number.isFinite(v) ? v : 0; } catch { results["quadraticTerm"] = 0; }
  try { const v = input.degree >= 3 ? (input.f3 / 6) * Math.pow(input.evaluationPoint - input.expansionPoint, 3) : 0; results["cubicTerm"] = Number.isFinite(v) ? v : 0; } catch { results["cubicTerm"] = 0; }
  return results;
}


export function calculateTaylor_series_calculator(input: Taylor_series_calculatorInput): Taylor_series_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primary"] ?? 0;
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


export interface Taylor_series_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
