// Auto-generated from nitrox-calculator-schema.json
import * as z from 'zod';

export interface Nitrox_calculatorInput {
  fo2: number;
  po2_work: number;
  po2_deco: number;
  depth: number;
}

export const Nitrox_calculatorInputSchema = z.object({
  fo2: z.number().default(32),
  po2_work: z.number().default(1.4),
  po2_deco: z.number().default(1.6),
  depth: z.number().default(30),
});

function evaluateAllFormulas(input: Nitrox_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.po2_work / (input.fo2/100)) - 1) * 10; results["modWorking"] = Number.isFinite(v) ? v : 0; } catch { results["modWorking"] = 0; }
  try { const v = ((input.po2_deco / (input.fo2/100)) - 1) * 10; results["modDeco"] = Number.isFinite(v) ? v : 0; } catch { results["modDeco"] = 0; }
  try { const v = (((1 - input.fo2/100) / 0.79) * (input.depth/10 + 1) - 1) * 10; results["ead"] = Number.isFinite(v) ? v : 0; } catch { results["ead"] = 0; }
  return results;
}


export function calculateNitrox_calculator(input: Nitrox_calculatorInput): Nitrox_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["modWorking"] ?? 0;
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


export interface Nitrox_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
