// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Intermediate_value_theoremInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? 1 : 0; results["exists"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exists"] = 0; }
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? (input.a + input.b) / 2 : null; results["c"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["c"] = 0; }
  try { const v = ((input.fa - input.k) * (input.fb - input.k) <= 0) ? ((input.fb - input.fa) / (input.b - input.a)) * ((asFormulaNumber(results["c"])) - input.a) + input.fa : null; results["fc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fc"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIntermediate_value_theorem(input: Intermediate_value_theoremInput): Intermediate_value_theoremOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["c"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
