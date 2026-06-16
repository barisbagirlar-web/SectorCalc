// Auto-generated from skin-type-calculator-schema.json
import * as z from 'zod';

export interface Skin_type_calculatorInput {
  oiliness: number;
  hydration: number;
  sensitivity: number;
  pigmentation: number;
  elasticity: number;
}

export const Skin_type_calculatorInputSchema = z.object({
  oiliness: z.number().default(2),
  hydration: z.number().default(2),
  sensitivity: z.number().default(2),
  pigmentation: z.number().default(2),
  elasticity: z.number().default(2),
});

function evaluateAllFormulas(input: Skin_type_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.oiliness + input.hydration) * 12.5; results["skinIndex"] = Number.isFinite(v) ? v : 0; } catch { results["skinIndex"] = 0; }
  try { const v = input.sensitivity * 25; results["sensitivityIndex"] = Number.isFinite(v) ? v : 0; } catch { results["sensitivityIndex"] = 0; }
  try { const v = input.pigmentation * 25; results["pigmentationIndex"] = Number.isFinite(v) ? v : 0; } catch { results["pigmentationIndex"] = 0; }
  try { const v = (4 - input.elasticity) * 25; results["agingIndex"] = Number.isFinite(v) ? v : 0; } catch { results["agingIndex"] = 0; }
  return results;
}


export function calculateSkin_type_calculator(input: Skin_type_calculatorInput): Skin_type_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Skin"] ?? 0;
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


export interface Skin_type_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
