// Auto-generated from shed-roof-calculator-schema.json
import * as z from 'zod';

export interface Shed_roof_calculatorInput {
  roofLength: number;
  roofWidth: number;
  slopeAngle: number;
  overhang: number;
}

export const Shed_roof_calculatorInputSchema = z.object({
  roofLength: z.number().default(10),
  roofWidth: z.number().default(6),
  slopeAngle: z.number().default(15),
  overhang: z.number().default(0.5),
});

function evaluateAllFormulas(input: Shed_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.slopeAngle * Math.PI / 180; results["rad"] = Number.isFinite(v) ? v : 0; } catch { results["rad"] = 0; }
  try { const v = input.roofWidth + 2 * input.overhang; results["totalWidth"] = Number.isFinite(v) ? v : 0; } catch { results["totalWidth"] = 0; }
  try { const v = input.roofLength + 2 * input.overhang; results["totalLength"] = Number.isFinite(v) ? v : 0; } catch { results["totalLength"] = 0; }
  try { const v = (results["totalWidth"] ?? 0) / Math.cos((results["rad"] ?? 0)); results["rafterLength"] = Number.isFinite(v) ? v : 0; } catch { results["rafterLength"] = 0; }
  try { const v = (results["totalWidth"] ?? 0) * Math.tan((results["rad"] ?? 0)); results["rise"] = Number.isFinite(v) ? v : 0; } catch { results["rise"] = 0; }
  try { const v = (results["totalLength"] ?? 0) * (results["rafterLength"] ?? 0); results["totalRoofArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalRoofArea"] = 0; }
  return results;
}


export function calculateShed_roof_calculator(input: Shed_roof_calculatorInput): Shed_roof_calculatorOutput {
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


export interface Shed_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
