// Auto-generated from gambrel-roof-calculator-schema.json
import * as z from 'zod';

export interface Gambrel_roof_calculatorInput {
  width: number;
  length: number;
  lowerAngle: number;
  upperAngle: number;
  lowerRun: number;
}

export const Gambrel_roof_calculatorInputSchema = z.object({
  width: z.number().default(10),
  length: z.number().default(20),
  lowerAngle: z.number().default(60),
  upperAngle: z.number().default(30),
  lowerRun: z.number().default(2),
});

function evaluateAllFormulas(input: Gambrel_roof_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lowerAngle * Math.PI / 180; results["radLower"] = Number.isFinite(v) ? v : 0; } catch { results["radLower"] = 0; }
  try { const v = input.upperAngle * Math.PI / 180; results["radUpper"] = Number.isFinite(v) ? v : 0; } catch { results["radUpper"] = 0; }
  try { const v = input.width / 2 - input.lowerRun; results["upperRun"] = Number.isFinite(v) ? v : 0; } catch { results["upperRun"] = 0; }
  try { const v = input.lowerRun / Math.cos((results["radLower"] ?? 0)); results["lowerLength"] = Number.isFinite(v) ? v : 0; } catch { results["lowerLength"] = 0; }
  try { const v = (results["upperRun"] ?? 0) / Math.cos((results["radUpper"] ?? 0)); results["upperLength"] = Number.isFinite(v) ? v : 0; } catch { results["upperLength"] = 0; }
  try { const v = 2 * input.length * (results["lowerLength"] ?? 0); results["lowerArea"] = Number.isFinite(v) ? v : 0; } catch { results["lowerArea"] = 0; }
  try { const v = 2 * input.length * (results["upperLength"] ?? 0); results["upperArea"] = Number.isFinite(v) ? v : 0; } catch { results["upperArea"] = 0; }
  try { const v = (results["lowerArea"] ?? 0) + (results["upperArea"] ?? 0); results["totalArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalArea"] = 0; }
  try { const v = input.length; results["ridgeLength"] = Number.isFinite(v) ? v : 0; } catch { results["ridgeLength"] = 0; }
  try { const v = (results["upperRun"] ?? 0) * Math.tan((results["radUpper"] ?? 0)) + input.lowerRun * Math.tan((results["radLower"] ?? 0)); results["roofHeight"] = Number.isFinite(v) ? v : 0; } catch { results["roofHeight"] = 0; }
  return results;
}


export function calculateGambrel_roof_calculator(input: Gambrel_roof_calculatorInput): Gambrel_roof_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalArea"] ?? 0;
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


export interface Gambrel_roof_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
