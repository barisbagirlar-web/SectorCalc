// Auto-generated from retaining-wall-drainage-calculator-schema.json
import * as z from 'zod';

export interface Retaining_wall_drainage_calculatorInput {
  wallHeight: number;
  wallLength: number;
  soilPermeability: number;
  pipeDiameter: number;
  pipeSlope: number;
  manningN: number;
}

export const Retaining_wall_drainage_calculatorInputSchema = z.object({
  wallHeight: z.number().default(3),
  wallLength: z.number().default(10),
  soilPermeability: z.number().default(0.00001),
  pipeDiameter: z.number().default(100),
  pipeSlope: z.number().default(1),
  manningN: z.number().default(0.013),
});

function evaluateAllFormulas(input: Retaining_wall_drainage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.soilPermeability * input.wallHeight * input.wallLength; results["inflowRate"] = Number.isFinite(v) ? v : 0; } catch { results["inflowRate"] = 0; }
  try { const v = input.pipeDiameter / 1000; results["pipeDiameterM"] = Number.isFinite(v) ? v : 0; } catch { results["pipeDiameterM"] = 0; }
  try { const v = input.pipeSlope / 100; results["pipeSlopeDec"] = Number.isFinite(v) ? v : 0; } catch { results["pipeSlopeDec"] = 0; }
  try { const v = Math.PI * Math.pow((results["pipeDiameterM"] ?? 0)/2, 2); results["pipeArea"] = Number.isFinite(v) ? v : 0; } catch { results["pipeArea"] = 0; }
  try { const v = (results["pipeDiameterM"] ?? 0) / 4; results["hydraulicRadius"] = Number.isFinite(v) ? v : 0; } catch { results["hydraulicRadius"] = 0; }
  try { const v = (1 / input.manningN) * (results["pipeArea"] ?? 0) * Math.pow((results["hydraulicRadius"] ?? 0), 2/3) * Math.pow((results["pipeSlopeDec"] ?? 0), 0.5); results["pipeCapacity"] = Number.isFinite(v) ? v : 0; } catch { results["pipeCapacity"] = 0; }
  try { const v = (results["pipeCapacity"] ?? 0) / (results["inflowRate"] ?? 0); results["safetyFactor"] = Number.isFinite(v) ? v : 0; } catch { results["safetyFactor"] = 0; }
  return results;
}


export function calculateRetaining_wall_drainage_calculator(input: Retaining_wall_drainage_calculatorInput): Retaining_wall_drainage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safetyFactor"] ?? 0;
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


export interface Retaining_wall_drainage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
