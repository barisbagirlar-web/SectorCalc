// Auto-generated from crown-molding-calculator-schema.json
import * as z from 'zod';

export interface Crown_molding_calculatorInput {
  springAngle: number;
  cornerAngle: number;
  wallLength: number;
  wasteFactor: number;
}

export const Crown_molding_calculatorInputSchema = z.object({
  springAngle: z.number().default(38),
  cornerAngle: z.number().default(90),
  wallLength: z.number().default(10),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Crown_molding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.atan( Math.sin(input.springAngle * Math.PI/180) / Math.tan(input.cornerAngle/2 * Math.PI/180) ) * 180/Math.PI; results["miterAngle"] = Number.isFinite(v) ? v : 0; } catch { results["miterAngle"] = 0; }
  try { const v = Math.asin( Math.cos(input.springAngle * Math.PI/180) * Math.cos(input.cornerAngle/2 * Math.PI/180) ) * 180/Math.PI; results["bevelAngle"] = Number.isFinite(v) ? v : 0; } catch { results["bevelAngle"] = 0; }
  try { const v = input.wallLength * 2 * (1 + input.wasteFactor/100); results["totalMoldingLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalMoldingLength"] = 0; }
  return results;
}


export function calculateCrown_molding_calculator(input: Crown_molding_calculatorInput): Crown_molding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["miterAngle"] ?? 0;
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


export interface Crown_molding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
