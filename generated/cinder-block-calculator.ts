// Auto-generated from cinder-block-calculator-schema.json
import * as z from 'zod';

export interface Cinder_block_calculatorInput {
  wallLength: number;
  wallHeight: number;
  blockLength: number;
  blockHeight: number;
  mortarJointThickness: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Cinder_block_calculatorInputSchema = z.object({
  wallLength: z.number().default(10),
  wallHeight: z.number().default(3),
  blockLength: z.number().default(0.4),
  blockHeight: z.number().default(0.2),
  mortarJointThickness: z.number().default(10),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cinder_block_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallLength * input.wallHeight; results["netWallArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netWallArea"] = 0; }
  try { const v = input.blockLength + (input.mortarJointThickness / 1000); results["effectiveBlockLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveBlockLength"] = 0; }
  try { const v = input.blockHeight + (input.mortarJointThickness / 1000); results["effectiveBlockHeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveBlockHeight"] = 0; }
  try { const v = (asFormulaNumber(results["effectiveBlockLength"])) * (asFormulaNumber(results["effectiveBlockHeight"])); results["blockFaceArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["blockFaceArea"] = 0; }
  try { const v = (asFormulaNumber(results["netWallArea"])) / (asFormulaNumber(results["blockFaceArea"])); results["netBlocksExact"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netBlocksExact"] = 0; }
  try { const v = (asFormulaNumber(results["netBlocksExact"])) * (1 + input.wasteFactor / 100); results["totalBlocksExact"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBlocksExact"] = 0; }
  try { const v = (asFormulaNumber(results["totalBlocksExact"])) - (asFormulaNumber(results["netBlocksExact"])); results["wasteBlocksExact"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wasteBlocksExact"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCinder_block_calculator(input: Cinder_block_calculatorInput): Cinder_block_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalBlocksExact"]));
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


export interface Cinder_block_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
