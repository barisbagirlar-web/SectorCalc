// Auto-generated from shingle-calculator-schema.json
import * as z from 'zod';

export interface Shingle_calculatorInput {
  roofFootprintArea: number;
  roofPitchAngle: number;
  wasteFactor: number;
  shingleCoveragePerBundle: number;
  ridgeLength: number;
  capCoveragePerBundle: number;
}

export const Shingle_calculatorInputSchema = z.object({
  roofFootprintArea: z.number().default(100),
  roofPitchAngle: z.number().default(30),
  wasteFactor: z.number().default(10),
  shingleCoveragePerBundle: z.number().default(3.1),
  ridgeLength: z.number().default(15),
  capCoveragePerBundle: z.number().default(10),
});

function evaluateAllFormulas(input: Shingle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofFootprintArea / Math.cos(input.roofPitchAngle * Math.PI / 180); results["actualRoofArea"] = Number.isFinite(v) ? v : 0; } catch { results["actualRoofArea"] = 0; }
  try { const v = (results["actualRoofArea"] ?? 0) * (1 + input.wasteFactor / 100); results["totalFieldArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalFieldArea"] = 0; }
  try { const v = Math.ceil((results["totalFieldArea"] ?? 0) / input.shingleCoveragePerBundle); results["fieldBundles"] = Number.isFinite(v) ? v : 0; } catch { results["fieldBundles"] = 0; }
  try { const v = Math.ceil(input.ridgeLength / input.capCoveragePerBundle); results["ridgeBundles"] = Number.isFinite(v) ? v : 0; } catch { results["ridgeBundles"] = 0; }
  try { const v = (results["fieldBundles"] ?? 0) + (results["ridgeBundles"] ?? 0); results["totalBundles"] = Number.isFinite(v) ? v : 0; } catch { results["totalBundles"] = 0; }
  return results;
}


export function calculateShingle_calculator(input: Shingle_calculatorInput): Shingle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBundles"] ?? 0;
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


export interface Shingle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
