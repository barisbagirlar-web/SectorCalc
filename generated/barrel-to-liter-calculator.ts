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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Barrel_to_liter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.barrelCount * input.conversionRate * input.correctionFactor; results["totalLiters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLiters"] = 0; }
  try { const v = input.barrelCount * input.conversionRate; results["baseLiters"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseLiters"] = 0; }
  try { const v = (asFormulaNumber(results["totalLiters"])) - (asFormulaNumber(results["baseLiters"])); results["correctionDelta"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctionDelta"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBarrel_to_liter_calculator(input: Barrel_to_liter_calculatorInput): Barrel_to_liter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalLiters"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
