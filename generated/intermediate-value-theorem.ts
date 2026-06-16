// Auto-generated from intermediate-value-theorem-schema.json
import * as z from 'zod';

export interface Intermediate_value_theoremInput {
  a: number;
  b: number;
  fa: number;
  fb: number;
  k: number;
  tolerance: number;
}

export const Intermediate_value_theoremInputSchema = z.object({
  a: z.number().default(0),
  b: z.number().default(1),
  fa: z.number().default(-1),
  fb: z.number().default(1),
  k: z.number().default(0),
  tolerance: z.number().default(0.001),
});

function evaluateAllFormulas(input: Intermediate_value_theoremInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? 1 : 0; results["exists"] = Number.isFinite(v) ? v : 0; } catch { results["exists"] = 0; }
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? (input.a + input.b) / 2 : null; results["c"] = Number.isFinite(v) ? v : 0; } catch { results["c"] = 0; }
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? ((input.fb - input.fa) / (input.b - input.a)) * ((results["c"] ?? 0) - input.a) + input.fa : null; results["fc"] = Number.isFinite(v) ? v : 0; } catch { results["fc"] = 0; }
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? Math.ceil(Math.log((input.b - input.a) / input.tolerance) / Math.log(2)) : 0; results["iterations"] = Number.isFinite(v) ? v : 0; } catch { results["iterations"] = 0; }
  return results;
}


export function calculateIntermediate_value_theorem(input: Intermediate_value_theoremInput): Intermediate_value_theoremOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["c"] ?? 0;
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


export interface Intermediate_value_theoremOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
