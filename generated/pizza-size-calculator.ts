// Auto-generated from pizza-size-calculator-schema.json
import * as z from 'zod';

export interface Pizza_size_calculatorInput {
  diameter1: number;
  price1: number;
  diameter2: number;
  price2: number;
  dataConfidence?: number;
}

export const Pizza_size_calculatorInputSchema = z.object({
  diameter1: z.number().default(30),
  price1: z.number().default(10),
  diameter2: z.number().default(40),
  price2: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pizza_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.PI * (input.diameter1/2)**2; results["area1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area1"] = Number.NaN; }
  try { const v = Math.PI * (input.diameter2/2)**2; results["area2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area2"] = Number.NaN; }
  try { const v = input.price1 / (toNumericFormulaValue(results["area1"])); results["pricePerArea1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pricePerArea1"] = Number.NaN; }
  try { const v = input.price2 / (toNumericFormulaValue(results["area2"])); results["pricePerArea2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pricePerArea2"] = Number.NaN; }
  try { const v = (input.price2 * input.diameter1**2) / (input.price1 * input.diameter2**2); results["valueRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["valueRatio"] = Number.NaN; }
  return results;
}


export function calculatePizza_size_calculator(input: Pizza_size_calculatorInput): Pizza_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["valueRatio"]);
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


export interface Pizza_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
