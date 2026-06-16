// Auto-generated from grout-calculator-schema.json
import * as z from 'zod';

export interface Grout_calculatorInput {
  tileLength: number;
  tileWidth: number;
  gapWidth: number;
  gapDepth: number;
  totalArea: number;
  wasteFactor: number;
  bagYield: number;
}

export const Grout_calculatorInputSchema = z.object({
  tileLength: z.number().default(300),
  tileWidth: z.number().default(300),
  gapWidth: z.number().default(5),
  gapDepth: z.number().default(10),
  totalArea: z.number().default(10),
  wasteFactor: z.number().default(5),
  bagYield: z.number().default(0.012),
});

function evaluateAllFormulas(input: Grout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalArea * input.gapDepth * input.gapWidth * (input.tileLength + input.tileWidth)) / (1000 * input.tileLength * input.tileWidth); results["groutVolume"] = Number.isFinite(v) ? v : 0; } catch { results["groutVolume"] = 0; }
  try { const v = (results["groutVolume"] ?? 0) * input.wasteFactor / 100; results["wasteVolume"] = Number.isFinite(v) ? v : 0; } catch { results["wasteVolume"] = 0; }
  try { const v = (results["groutVolume"] ?? 0) * (1 + input.wasteFactor / 100); results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (results["totalVolume"] ?? 0) / input.bagYield; results["exactBags"] = Number.isFinite(v) ? v : 0; } catch { results["exactBags"] = 0; }
  try { const v = Math.ceil((results["totalVolume"] ?? 0) / input.bagYield); results["numberOfBags"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfBags"] = 0; }
  return results;
}


export function calculateGrout_calculator(input: Grout_calculatorInput): Grout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["numberOfBags"] ?? 0;
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


export interface Grout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
