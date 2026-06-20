// Auto-generated from barrel-to-liter-calculator-schema.json
import * as z from 'zod';

export interface Barrel_to_liter_calculatorInput {
  barrelCount: number;
  conversionRate: number;
  temperature: number;
  correctionFactor: number;
  dataConfidence?: number;
}

export const Barrel_to_liter_calculatorInputSchema = z.object({
  barrelCount: z.number().default(1),
  conversionRate: z.number().default(158.9873),
  temperature: z.number().default(15),
  correctionFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Barrel_to_liter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.barrelCount * input.conversionRate * input.correctionFactor; results["totalLiters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLiters"] = Number.NaN; }
  try { const v = input.barrelCount * input.conversionRate; results["baseLiters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseLiters"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalLiters"])) - (toNumericFormulaValue(results["baseLiters"])); results["correctionDelta"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["correctionDelta"] = Number.NaN; }
  return results;
}


export function calculateBarrel_to_liter_calculator(input: Barrel_to_liter_calculatorInput): Barrel_to_liter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLiters"]);
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


export interface Barrel_to_liter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
