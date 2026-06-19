// Auto-generated from c1v1-equals-c2v2-calculator-schema.json
import * as z from 'zod';

export interface C1v1_equals_c2v2_calculatorInput {
  c1: number;
  v1: number;
  c2: number;
  fire: number;
  dataConfidence?: number;
}

export const C1v1_equals_c2v2_calculatorInputSchema = z.object({
  c1: z.number().default(100),
  v1: z.number().default(10),
  c2: z.number().default(20),
  fire: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: C1v1_equals_c2v2_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.c1 * input.v1) / input.c2; results["v2_ideal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["v2_ideal"] = 0; }
  try { const v = ((input.c1 * input.v1) / input.c2) * (1 + input.fire / 100); results["v2_actual"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["v2_actual"] = 0; }
  try { const v = (input.c1 * input.v1) / input.c2; results["_c1___v1____c2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["_c1___v1____c2"] = 0; }
  try { const v = (asFormulaNumber(results["v2_ideal"])) * (1 + input.fire/100); results["v2_ideal____1___fire_100_"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["v2_ideal____1___fire_100_"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateC1v1_equals_c2v2_calculator(input: C1v1_equals_c2v2_calculatorInput): C1v1_equals_c2v2_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["v2_actual"]);
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


export interface C1v1_equals_c2v2_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
