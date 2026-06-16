// Auto-generated from wood-siding-calculator-schema.json
import * as z from 'zod';

export interface Wood_siding_calculatorInput {
  wallWidth: number;
  wallHeight: number;
  exposedFace: number;
  boardLength: number;
  wasteFactor: number;
  pricePerBoard: number;
}

export const Wood_siding_calculatorInputSchema = z.object({
  wallWidth: z.number().default(20),
  wallHeight: z.number().default(10),
  exposedFace: z.number().default(4),
  boardLength: z.number().default(12),
  wasteFactor: z.number().default(10),
  pricePerBoard: z.number().default(8.5),
});

function evaluateAllFormulas(input: Wood_siding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.wallWidth / input.boardLength) * Math.ceil(input.wallHeight / (input.exposedFace / 12)) + Math.ceil(Math.ceil(input.wallWidth / input.boardLength) * Math.ceil(input.wallHeight / (input.exposedFace / 12)) * (input.wasteFactor / 100)); results["totalBoardsWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["totalBoardsWithWaste"] = 0; }
  try { const v = Math.ceil(Math.ceil(input.wallWidth / input.boardLength) * Math.ceil(input.wallHeight / (input.exposedFace / 12)) * (input.wasteFactor / 100)); results["wasteBoards"] = Number.isFinite(v) ? v : 0; } catch { results["wasteBoards"] = 0; }
  try { const v = input.wallWidth * input.wallHeight; results["wallArea"] = Number.isFinite(v) ? v : 0; } catch { results["wallArea"] = 0; }
  try { const v = (Math.ceil(input.wallWidth / input.boardLength) * Math.ceil(input.wallHeight / (input.exposedFace / 12)) + Math.ceil(Math.ceil(input.wallWidth / input.boardLength) * Math.ceil(input.wallHeight / (input.exposedFace / 12)) * (input.wasteFactor / 100))) * input.pricePerBoard; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateWood_siding_calculator(input: Wood_siding_calculatorInput): Wood_siding_calculatorOutput {
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


export interface Wood_siding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
