// Auto-generated from sod-calculator-schema.json
import * as z from 'zod';

export interface Sod_calculatorInput {
  length: number;
  width: number;
  wasteFactor: number;
  rollCoverage: number;
  pricePerRoll: number;
}

export const Sod_calculatorInputSchema = z.object({
  length: z.number().default(0),
  width: z.number().default(0),
  wasteFactor: z.number().default(5),
  rollCoverage: z.number().default(10),
  pricePerRoll: z.number().default(0),
});

function evaluateAllFormulas(input: Sod_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = (results["area"] ?? 0) * input.wasteFactor / 100; results["wasteArea"] = Number.isFinite(v) ? v : 0; } catch { results["wasteArea"] = 0; }
  try { const v = (results["area"] ?? 0) + (results["wasteArea"] ?? 0); results["netArea"] = Number.isFinite(v) ? v : 0; } catch { results["netArea"] = 0; }
  try { const v = Math.ceil((results["netArea"] ?? 0) / input.rollCoverage); results["rollsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["rollsNeeded"] = 0; }
  try { const v = (results["rollsNeeded"] ?? 0) * input.pricePerRoll; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateSod_calculator(input: Sod_calculatorInput): Sod_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Sod_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
