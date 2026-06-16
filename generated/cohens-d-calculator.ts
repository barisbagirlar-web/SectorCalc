// Auto-generated from cohens-d-calculator-schema.json
import * as z from 'zod';

export interface Cohens_d_calculatorInput {
  mean1: number;
  mean2: number;
  sd1: number;
  sd2: number;
  n1: number;
  n2: number;
}

export const Cohens_d_calculatorInputSchema = z.object({
  mean1: z.number().default(0),
  mean2: z.number().default(0),
  sd1: z.number().default(1),
  sd2: z.number().default(1),
  n1: z.number().default(30),
  n2: z.number().default(30),
});

function evaluateAllFormulas(input: Cohens_d_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.sqrt(((input.n1-1)*input.sd1*input.sd1 + (input.n2-1)*input.sd2*input.sd2) / (input.n1+input.n2-2)); results["pooledSD"] = Number.isFinite(v) ? v : 0; } catch { results["pooledSD"] = 0; }
  try { const v = (input.mean1 - input.mean2) / (results["pooledSD"] ?? 0); results["cohensD"] = Number.isFinite(v) ? v : 0; } catch { results["cohensD"] = 0; }
  try { const v = Math.abs((results["cohensD"] ?? 0)); results["effectSize"] = Number.isFinite(v) ? v : 0; } catch { results["effectSize"] = 0; }
  try { const v = (results["cohensD"] ?? 0) >= 0.8 ? 'Large' : ((results["cohensD"] ?? 0) >= 0.5 ? 'Medium' : ((results["cohensD"] ?? 0) >= 0.2 ? 'Small' : 'Negligible')); results["interpretation"] = Number.isFinite(v) ? v : 0; } catch { results["interpretation"] = 0; }
  return results;
}


export function calculateCohens_d_calculator(input: Cohens_d_calculatorInput): Cohens_d_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cohensD"] ?? 0;
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


export interface Cohens_d_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
