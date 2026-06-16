// Auto-generated from caulk-calculator-schema.json
import * as z from 'zod';

export interface Caulk_calculatorInput {
  jointLength: number;
  jointWidth: number;
  jointDepth: number;
  wasteFactor: number;
  tubeVolume: number;
  numberOfJoints: number;
}

export const Caulk_calculatorInputSchema = z.object({
  jointLength: z.number().default(1),
  jointWidth: z.number().default(6),
  jointDepth: z.number().default(6),
  wasteFactor: z.number().default(10),
  tubeVolume: z.number().default(310),
  numberOfJoints: z.number().default(1),
});

function evaluateAllFormulas(input: Caulk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.jointLength * input.jointWidth * input.jointDepth * input.numberOfJoints * (1 + input.wasteFactor/100); results["volumeWithWaste"] = Number.isFinite(v) ? v : 0; } catch { results["volumeWithWaste"] = 0; }
  try { const v = input.jointLength * input.jointWidth * input.jointDepth * input.numberOfJoints; results["theoreticalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["theoreticalVolume"] = 0; }
  try { const v = Math.ceil( (input.jointLength * input.jointWidth * input.jointDepth * input.numberOfJoints * (1 + input.wasteFactor/100)) / input.tubeVolume ); results["tubesRequired"] = Number.isFinite(v) ? v : 0; } catch { results["tubesRequired"] = 0; }
  return results;
}


export function calculateCaulk_calculator(input: Caulk_calculatorInput): Caulk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["volumeWithWaste"] ?? 0;
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


export interface Caulk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
