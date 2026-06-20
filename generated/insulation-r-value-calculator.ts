// Auto-generated from insulation-r-value-calculator-schema.json
import * as z from 'zod';

export interface Insulation_r_value_calculatorInput {
  thickness1: number;
  conductivity1: number;
  thickness2: number;
  conductivity2: number;
  thickness3: number;
  conductivity3: number;
  area: number;
  deltaT: number;
  dataConfidence?: number;
}

export const Insulation_r_value_calculatorInputSchema = z.object({
  thickness1: z.number().default(0.1),
  conductivity1: z.number().default(0.04),
  thickness2: z.number().default(0),
  conductivity2: z.number().default(0),
  thickness3: z.number().default(0),
  conductivity3: z.number().default(0),
  area: z.number().default(1),
  deltaT: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Insulation_r_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.thickness1 * input.conductivity1 * input.thickness2 * input.conductivity2; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.thickness1 * input.conductivity1 * input.thickness2 * input.conductivity2 * (input.thickness3 * input.conductivity3 * input.area * input.deltaT); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.thickness3 * input.conductivity3 * input.area * input.deltaT; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateInsulation_r_value_calculator(input: Insulation_r_value_calculatorInput): Insulation_r_value_calculatorOutput {
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


export interface Insulation_r_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
