// Auto-generated from smoothie-calculator-schema.json
import * as z from 'zod';

export interface Smoothie_calculatorInput {
  servings: number;
  baseVolumeML: number;
  fruitGrams: number;
  iceGrams: number;
  baseCostPerLiter: number;
  fruitCostPerKg: number;
  iceCostPerKg: number;
  dataConfidence?: number;
}

export const Smoothie_calculatorInputSchema = z.object({
  servings: z.number().default(1),
  baseVolumeML: z.number().default(200),
  fruitGrams: z.number().default(150),
  iceGrams: z.number().default(80),
  baseCostPerLiter: z.number().default(1.5),
  fruitCostPerKg: z.number().default(4),
  iceCostPerKg: z.number().default(0.1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Smoothie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseVolumeML * input.servings; results["totalVolumeML"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVolumeML"] = Number.NaN; }
  try { const v = (input.baseVolumeML / 1000) * input.baseCostPerLiter * input.servings; results["baseCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseCost"] = Number.NaN; }
  try { const v = (input.fruitGrams / 1000) * input.fruitCostPerKg * input.servings; results["fruitCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fruitCost"] = Number.NaN; }
  try { const v = (input.iceGrams / 1000) * input.iceCostPerKg * input.servings; results["iceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["iceCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseCost"])) + (toNumericFormulaValue(results["fruitCost"])) + (toNumericFormulaValue(results["iceCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.servings; results["costPerSmoothie"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerSmoothie"] = Number.NaN; }
  return results;
}


export function calculateSmoothie_calculator(input: Smoothie_calculatorInput): Smoothie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerSmoothie"]);
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


export interface Smoothie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
