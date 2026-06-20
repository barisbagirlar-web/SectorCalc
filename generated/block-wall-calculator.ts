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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Block_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight / ((input.blockLength/1000 + input.mortarJoint/1000) * (input.blockHeight/1000 + input.mortarJoint/1000)); results["exactBlocks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exactBlocks"] = Number.NaN; }
  try { const v = input.wallLength * input.wallHeight / ((input.blockLength/1000 + input.mortarJoint/1000) * (input.blockHeight/1000 + input.mortarJoint/1000)); results["exactBlocks_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exactBlocks_aux"] = Number.NaN; }
  return results;
}


export function calculateBlock_wall_calculator(input: Block_wall_calculatorInput): Block_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["exactBlocks_aux"]);
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


export interface Block_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
