// Auto-generated from paper-size-calculator-schema.json
import * as z from 'zod';

export interface Paper_size_calculatorInput {
  width: number;
  height: number;
  scalingPercent: number;
  gsm: number;
  quantity: number;
}

export const Paper_size_calculatorInputSchema = z.object({
  width: z.number().default(210),
  height: z.number().default(297),
  scalingPercent: z.number().default(100),
  gsm: z.number().default(80),
  quantity: z.number().default(1),
});

function evaluateAllFormulas(input: Paper_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.width * (input.scalingPercent / 100); results["newWidth"] = Number.isFinite(v) ? v : 0; } catch { results["newWidth"] = 0; }
  try { const v = input.height * (input.scalingPercent / 100); results["newHeight"] = Number.isFinite(v) ? v : 0; } catch { results["newHeight"] = 0; }
  try { const v = ((results["newWidth"] ?? 0) * (results["newHeight"] ?? 0)) / 1000000; results["area"] = Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = (results["area"] ?? 0) * input.gsm * input.quantity; results["weight"] = Number.isFinite(v) ? v : 0; } catch { results["weight"] = 0; }
  return results;
}


export function calculatePaper_size_calculator(input: Paper_size_calculatorInput): Paper_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weight"] ?? 0;
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


export interface Paper_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
