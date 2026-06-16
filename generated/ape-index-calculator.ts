// Auto-generated from ape-index-calculator-schema.json
import * as z from 'zod';

export interface Ape_index_calculatorInput {
  heightFt: number;
  heightIn: number;
  armspanFt: number;
  armspanIn: number;
}

export const Ape_index_calculatorInputSchema = z.object({
  heightFt: z.number().default(5),
  heightIn: z.number().default(9),
  armspanFt: z.number().default(5),
  armspanIn: z.number().default(9),
});

function evaluateAllFormulas(input: Ape_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.heightFt * 12 + input.heightIn; results["totalHeightInches"] = Number.isFinite(v) ? v : 0; } catch { results["totalHeightInches"] = 0; }
  try { const v = input.armspanFt * 12 + input.armspanIn; results["totalArmspanInches"] = Number.isFinite(v) ? v : 0; } catch { results["totalArmspanInches"] = 0; }
  try { const v = (results["totalArmspanInches"] ?? 0) / (results["totalHeightInches"] ?? 0); results["apeIndexRatio"] = Number.isFinite(v) ? v : 0; } catch { results["apeIndexRatio"] = 0; }
  try { const v = (results["totalArmspanInches"] ?? 0) - (results["totalHeightInches"] ?? 0); results["apeIndexDiff"] = Number.isFinite(v) ? v : 0; } catch { results["apeIndexDiff"] = 0; }
  return results;
}


export function calculateApe_index_calculator(input: Ape_index_calculatorInput): Ape_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Your"] ?? 0;
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


export interface Ape_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
