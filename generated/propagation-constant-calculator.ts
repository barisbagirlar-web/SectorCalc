// Auto-generated from propagation-constant-calculator-schema.json
import * as z from 'zod';

export interface Propagation_constant_calculatorInput {
  r: number;
  l: number;
  g: number;
  c: number;
  f: number;
  dataConfidence?: number;
}

export const Propagation_constant_calculatorInputSchema = z.object({
  r: z.number().default(0.1),
  l: z.number().default(2e-7),
  g: z.number().default(0),
  c: z.number().default(3e-11),
  f: z.number().default(1000000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Propagation_constant_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.r * input.l * input.g * input.c; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.r * input.l * input.g * input.c * (input.f); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.f; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculatePropagation_constant_calculator(input: Propagation_constant_calculatorInput): Propagation_constant_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Propagation_constant_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
