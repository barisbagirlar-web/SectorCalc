// Auto-generated from block-wall-calculator-schema.json
import * as z from 'zod';

export interface Block_wall_calculatorInput {
  wallLength: number;
  wallHeight: number;
  blockLength: number;
  blockHeight: number;
  mortarJoint: number;
  pricePerBlock: number;
  wasteFactor: number;
}

export const Block_wall_calculatorInputSchema = z.object({
  wallLength: z.number().default(10),
  wallHeight: z.number().default(3),
  blockLength: z.number().default(400),
  blockHeight: z.number().default(200),
  mortarJoint: z.number().default(10),
  pricePerBlock: z.number().default(1.5),
  wasteFactor: z.number().default(5),
});

function evaluateAllFormulas(input: Block_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight / ((input.blockLength/1000 + input.mortarJoint/1000) * (input.blockHeight/1000 + input.mortarJoint/1000)); results["exactBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["exactBlocks"] = 0; }
  try { const v = Math.ceil((results["exactBlocks"] ?? 0) * (1 + input.wasteFactor/100)); results["totalBlocks"] = Number.isFinite(v) ? v : 0; } catch { results["totalBlocks"] = 0; }
  try { const v = (results["totalBlocks"] ?? 0) * input.pricePerBlock; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateBlock_wall_calculator(input: Block_wall_calculatorInput): Block_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBlocks"] ?? 0;
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


export interface Block_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
