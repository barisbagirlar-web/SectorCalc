// Auto-generated from mansard-roof-calculator-schema.json
import * as z from 'zod';

export interface Mansard_roof_calculatorInput {
  buildingWidth: number;
  buildingLength: number;
  lowerAngle: number;
  upperAngle: number;
  lowerHeight: number;
}

export const Mansard_roof_calculatorInputSchema = z.object({
  buildingWidth: z.number().default(10),
  buildingLength: z.number().default(15),
  lowerAngle: z.number().default(70),
  upperAngle: z.number().default(30),
  lowerHeight: z.number().default(2.5),
});

function evaluateAllFormulas(input: Mansard_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.buildingWidth / 2; results["halfSpan"] = Number.isFinite(v) ? v : 0; } catch { results["halfSpan"] = 0; }
  try { const v = input.lowerHeight / Math.tan(input.lowerAngle * Math.PI/180); results["x1"] = Number.isFinite(v) ? v : 0; } catch { results["x1"] = 0; }
  try { const v = ((results["halfSpan"] ?? 0) - (results["x1"] ?? 0)) * Math.tan(input.upperAngle * Math.PI/180); results["h2"] = Number.isFinite(v) ? v : 0; } catch { results["h2"] = 0; }
  try { const v = Math.sqrt(input.lowerHeight**2 + (results["x1"] ?? 0)**2); results["lowerSlopeLength"] = Number.isFinite(v) ? v : 0; } catch { results["lowerSlopeLength"] = 0; }
  try { const v = Math.sqrt((results["h2"] ?? 0)**2 + ((results["halfSpan"] ?? 0) - (results["x1"] ?? 0))**2); results["upperSlopeLength"] = Number.isFinite(v) ? v : 0; } catch { results["upperSlopeLength"] = 0; }
  try { const v = 2 * input.buildingLength * (results["lowerSlopeLength"] ?? 0); results["lowerRoofArea"] = Number.isFinite(v) ? v : 0; } catch { results["lowerRoofArea"] = 0; }
  try { const v = 2 * input.buildingLength * (results["upperSlopeLength"] ?? 0); results["upperRoofArea"] = Number.isFinite(v) ? v : 0; } catch { results["upperRoofArea"] = 0; }
  try { const v = (results["lowerRoofArea"] ?? 0) + (results["upperRoofArea"] ?? 0); results["totalRoofArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalRoofArea"] = 0; }
  try { const v = input.lowerHeight + (results["h2"] ?? 0); results["ridgeHeight"] = Number.isFinite(v) ? v : 0; } catch { results["ridgeHeight"] = 0; }
  return results;
}


export function calculateMansard_roof_calculator(input: Mansard_roof_calculatorInput): Mansard_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalRoofArea"] ?? 0;
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


export interface Mansard_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
