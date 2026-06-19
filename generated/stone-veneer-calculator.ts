// Auto-generated from stone-veneer-calculator-schema.json
import * as z from 'zod';

export interface Stone_veneer_calculatorInput {
  wallWidth: number;
  wallHeight: number;
  stoneLength: number;
  stoneHeight: number;
  jointGap: number;
  wasteFactor: number;
  costPerSqFt: number;
  dataConfidence?: number;
}

export const Stone_veneer_calculatorInputSchema = z.object({
  wallWidth: z.number().default(10),
  wallHeight: z.number().default(8),
  stoneLength: z.number().default(6),
  stoneHeight: z.number().default(4),
  jointGap: z.number().default(0.5),
  wasteFactor: z.number().default(10),
  costPerSqFt: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stone_veneer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallWidth * input.wallHeight; results["wallAreaSqFt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wallAreaSqFt"] = 0; }
  try { const v = ((input.stoneLength + input.jointGap) * (input.stoneHeight + input.jointGap)) / 144; results["stoneAreaSqFt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stoneAreaSqFt"] = 0; }
  try { const v = (asFormulaNumber(results["wallAreaSqFt"])) * (1 + input.wasteFactor / 100); results["stoneAreaNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stoneAreaNeeded"] = 0; }
  try { const v = (asFormulaNumber(results["stoneAreaNeeded"])) * input.costPerSqFt; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStone_veneer_calculator(input: Stone_veneer_calculatorInput): Stone_veneer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Stone_veneer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
