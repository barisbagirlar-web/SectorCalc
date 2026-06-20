// Auto-generated from intermediate-value-theorem-schema.json
import * as z from 'zod';

export interface Intermediate_value_theoremInput {
  a: number;
  b: number;
  fa: number;
  fb: number;
  k: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Intermediate_value_theoremInputSchema = z.object({
  a: z.number().default(0),
  b: z.number().default(1),
  fa: z.number().default(-1),
  fb: z.number().default(1),
  k: z.number().default(0),
  tolerance: z.number().default(0.001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Intermediate_value_theoremInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? 1 : 0; results["exists"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exists"] = Number.NaN; }
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? (input.a + input.b) / 2 : null; results["c"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["c"] = Number.NaN; }
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? ((input.fb - input.fa) / (input.b - input.a)) * ((toNumericFormulaValue(results["c"])) - input.a) + input.fa : null; results["fc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fc"] = Number.NaN; }
  return results;
}


export function calculateIntermediate_value_theorem(input: Intermediate_value_theoremInput): Intermediate_value_theoremOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["c"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
