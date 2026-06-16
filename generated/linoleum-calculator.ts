// Auto-generated from linoleum-calculator-schema.json
import * as z from 'zod';

export interface Linoleum_calculatorInput {
  roomLength: number;
  roomWidth: number;
  rollWidth: number;
  wastePercentage: number;
  pricePerSqM: number;
}

export const Linoleum_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  rollWidth: z.number().default(2),
  wastePercentage: z.number().default(10),
  pricePerSqM: z.number().default(20),
});

function evaluateAllFormulas(input: Linoleum_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.roomWidth / input.rollWidth); results["numberOfStrips"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfStrips"] = 0; }
  try { const v = input.roomLength * (results["numberOfStrips"] ?? 0); results["totalLinearMeters"] = Number.isFinite(v) ? v : 0; } catch { results["totalLinearMeters"] = 0; }
  try { const v = (results["totalLinearMeters"] ?? 0) * input.rollWidth; results["areaBeforeWaste"] = Number.isFinite(v) ? v : 0; } catch { results["areaBeforeWaste"] = 0; }
  try { const v = 1 + input.wastePercentage / 100; results["wasteFactor"] = Number.isFinite(v) ? v : 0; } catch { results["wasteFactor"] = 0; }
  try { const v = (results["areaBeforeWaste"] ?? 0) * (results["wasteFactor"] ?? 0); results["finalArea"] = Number.isFinite(v) ? v : 0; } catch { results["finalArea"] = 0; }
  try { const v = (results["finalArea"] ?? 0) * input.pricePerSqM; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateLinoleum_calculator(input: Linoleum_calculatorInput): Linoleum_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Total"] ?? 0;
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


export interface Linoleum_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
