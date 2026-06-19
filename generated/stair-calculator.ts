// Auto-generated from stair-calculator-schema.json
import * as z from 'zod';

export interface Stair_calculatorInput {
  totalRise: number;
  numberOfRisers: number;
  treadDepth: number;
  stairWidth: number;
  dataConfidence?: number;
}

export const Stair_calculatorInputSchema = z.object({
  totalRise: z.number().default(280),
  numberOfRisers: z.number().default(15),
  treadDepth: z.number().default(28),
  stairWidth: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stair_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRise * input.numberOfRisers * input.treadDepth * input.stairWidth; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.totalRise * input.numberOfRisers * input.treadDepth * input.stairWidth; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStair_calculator(input: Stair_calculatorInput): Stair_calculatorOutput {
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


export interface Stair_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
