// Auto-generated from u-value-calculator-schema.json
import * as z from 'zod';

export interface U_value_calculatorInput {
  rsi: number;
  thickness1: number;
  conductivity1: number;
  thickness2: number;
  conductivity2: number;
  thickness3: number;
  conductivity3: number;
  rse: number;
  dataConfidence?: number;
}

export const U_value_calculatorInputSchema = z.object({
  rsi: z.number().default(0.13),
  thickness1: z.number().default(0.1),
  conductivity1: z.number().default(0.7),
  thickness2: z.number().default(0.05),
  conductivity2: z.number().default(0.04),
  thickness3: z.number().default(0.02),
  conductivity3: z.number().default(0.5),
  rse: z.number().default(0.04),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: U_value_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.thickness1 / input.conductivity1; results["r1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["r1"] = Number.NaN; }
  try { const v = input.thickness2 / input.conductivity2; results["r2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["r2"] = Number.NaN; }
  try { const v = input.thickness3 / input.conductivity3; results["r3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["r3"] = Number.NaN; }
  try { const v = input.rsi + (toNumericFormulaValue(results["r1"])) + (toNumericFormulaValue(results["r2"])) + (toNumericFormulaValue(results["r3"])) + input.rse; results["totalResistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalResistance"] = Number.NaN; }
  try { const v = 1 / (toNumericFormulaValue(results["totalResistance"])); results["uValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["uValue"] = Number.NaN; }
  return results;
}


export function calculateU_value_calculator(input: U_value_calculatorInput): U_value_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["r1"]);
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


export interface U_value_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
