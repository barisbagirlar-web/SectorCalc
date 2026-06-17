// Auto-generated from extraction-calculator-schema.json
import * as z from 'zod';

export interface Extraction_calculatorInput {
  totalMaterial: number;
  concentration: number;
  recoveryRate: number;
  targetPurity: number;
}

export const Extraction_calculatorInputSchema = z.object({
  totalMaterial: z.number().default(1000),
  concentration: z.number().default(10),
  recoveryRate: z.number().default(90),
  targetPurity: z.number().default(95),
});

function evaluateAllFormulas(input: Extraction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100; results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = "Theoretical maximum: " + (input.totalMaterial * input.concentration / 100) + " kg"; results["breakdown1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = "Recovered before purification: " + (input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100) + " kg"; results["breakdown2"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown2"] = 0; }
  try { const v = "Final pure product: " + (input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100) + " kg"; results["breakdown3"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown3"] = 0; }
  results["_____totalMaterial___concentration___100"] = 0;
  try { const v = input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateExtraction_calculator(input: Extraction_calculatorInput): Extraction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Extraction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
