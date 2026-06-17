// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Smoothie_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.baseVolumeML * input.servings; results["totalVolumeML"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalVolumeML"] = 0; }
  try { const v = (input.baseVolumeML / 1000) * input.baseCostPerLiter * input.servings; results["baseCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseCost"] = 0; }
  try { const v = (input.fruitGrams / 1000) * input.fruitCostPerKg * input.servings; results["fruitCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["fruitCost"] = 0; }
  try { const v = (input.iceGrams / 1000) * input.iceCostPerKg * input.servings; results["iceCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["iceCost"] = 0; }
  try { const v = (asFormulaNumber(results["baseCost"])) + (asFormulaNumber(results["fruitCost"])) + (asFormulaNumber(results["iceCost"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.servings; results["costPerSmoothie"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerSmoothie"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSmoothie_calculator(input: Smoothie_calculatorInput): Smoothie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerSmoothie"]);
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


export interface Smoothie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
