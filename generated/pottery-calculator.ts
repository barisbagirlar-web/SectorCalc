// Auto-generated from pottery-calculator-schema.json
import * as z from 'zod';

export interface Pottery_calculatorInput {
  numberOfPieces: number;
  clayWeightPerPiece: number;
  clayCostPerKg: number;
  glazeUsagePerPiece: number;
  glazeCostPerLiter: number;
  firingCostPerPiece: number;
  overheadPercentage: number;
}

export const Pottery_calculatorInputSchema = z.object({
  numberOfPieces: z.number().default(10),
  clayWeightPerPiece: z.number().default(500),
  clayCostPerKg: z.number().default(2.5),
  glazeUsagePerPiece: z.number().default(30),
  glazeCostPerLiter: z.number().default(15),
  firingCostPerPiece: z.number().default(1.2),
  overheadPercentage: z.number().default(20),
});

function evaluateAllFormulas(input: Pottery_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.numberOfPieces * input.clayWeightPerPiece) / 1000; results["totalClayKg"] = Number.isFinite(v) ? v : 0; } catch { results["totalClayKg"] = 0; }
  try { const v = (results["totalClayKg"] ?? 0) * input.clayCostPerKg; results["totalClayCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalClayCost"] = 0; }
  try { const v = (input.numberOfPieces * input.glazeUsagePerPiece) / 1000; results["totalGlazeLiters"] = Number.isFinite(v) ? v : 0; } catch { results["totalGlazeLiters"] = 0; }
  try { const v = (results["totalGlazeLiters"] ?? 0) * input.glazeCostPerLiter; results["totalGlazeCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalGlazeCost"] = 0; }
  try { const v = (results["totalClayCost"] ?? 0) + (results["totalGlazeCost"] ?? 0); results["materialCost"] = Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.numberOfPieces * input.firingCostPerPiece; results["firingCost"] = Number.isFinite(v) ? v : 0; } catch { results["firingCost"] = 0; }
  try { const v = (results["materialCost"] ?? 0) + (results["firingCost"] ?? 0); results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = 1 + (input.overheadPercentage / 100); results["overheadMultiplier"] = Number.isFinite(v) ? v : 0; } catch { results["overheadMultiplier"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * (results["overheadMultiplier"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.numberOfPieces; results["costPerPiece"] = Number.isFinite(v) ? v : 0; } catch { results["costPerPiece"] = 0; }
  return results;
}


export function calculatePottery_calculator(input: Pottery_calculatorInput): Pottery_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerPiece"] ?? 0;
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


export interface Pottery_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
