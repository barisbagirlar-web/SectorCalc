// Auto-generated from baseboard-calculator-schema.json
import * as z from 'zod';

export interface Baseboard_calculatorInput {
  roomLength: number;
  roomWidth: number;
  numberOfDoors: number;
  doorWidth: number;
  baseboardLengthPerPiece: number;
  pricePerPiece: number;
  wasteFactor: number;
}

export const Baseboard_calculatorInputSchema = z.object({
  roomLength: z.number().default(5),
  roomWidth: z.number().default(4),
  numberOfDoors: z.number().default(1),
  doorWidth: z.number().default(0.9),
  baseboardLengthPerPiece: z.number().default(2.4),
  pricePerPiece: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Baseboard_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.roomLength + input.roomWidth); results["perimeter"] = Number.isFinite(v) ? v : 0; } catch { results["perimeter"] = 0; }
  try { const v = input.numberOfDoors * input.doorWidth; results["doorTotalWidth"] = Number.isFinite(v) ? v : 0; } catch { results["doorTotalWidth"] = 0; }
  try { const v = (results["perimeter"] ?? 0) - (results["doorTotalWidth"] ?? 0); results["netLength"] = Number.isFinite(v) ? v : 0; } catch { results["netLength"] = 0; }
  try { const v = (results["netLength"] ?? 0) * (1 + input.wasteFactor/100); results["withWaste"] = Number.isFinite(v) ? v : 0; } catch { results["withWaste"] = 0; }
  try { const v = Math.ceil((results["withWaste"] ?? 0) / input.baseboardLengthPerPiece); results["piecesNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["piecesNeeded"] = 0; }
  try { const v = (results["piecesNeeded"] ?? 0) * input.pricePerPiece; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["withWaste"] ?? 0) - (results["netLength"] ?? 0); results["wasteLength"] = Number.isFinite(v) ? v : 0; } catch { results["wasteLength"] = 0; }
  return results;
}


export function calculateBaseboard_calculator(input: Baseboard_calculatorInput): Baseboard_calculatorOutput {
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


export interface Baseboard_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
