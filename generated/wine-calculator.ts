// Auto-generated from wine-calculator-schema.json
import * as z from 'zod';

export interface Wine_calculatorInput {
  grapeWeight: number;
  sugarContent: number;
  yieldPercent: number;
  alcoholConversion: number;
  fermentationLoss: number;
  bottleVolume: number;
}

export const Wine_calculatorInputSchema = z.object({
  grapeWeight: z.number().default(1000),
  sugarContent: z.number().default(220),
  yieldPercent: z.number().default(70),
  alcoholConversion: z.number().default(0.55),
  fermentationLoss: z.number().default(5),
  bottleVolume: z.number().default(0.75),
});

function evaluateAllFormulas(input: Wine_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grapeWeight * input.yieldPercent / 100; results["mustVolume"] = Number.isFinite(v) ? v : 0; } catch { results["mustVolume"] = 0; }
  try { const v = (results["mustVolume"] ?? 0) * input.sugarContent; results["totalSugar"] = Number.isFinite(v) ? v : 0; } catch { results["totalSugar"] = 0; }
  try { const v = (results["totalSugar"] ?? 0) * input.alcoholConversion / 10; results["alcoholPercent"] = Number.isFinite(v) ? v : 0; } catch { results["alcoholPercent"] = 0; }
  try { const v = (results["mustVolume"] ?? 0) * (1 - input.fermentationLoss / 100); results["finalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["finalVolume"] = 0; }
  try { const v = Math.floor((results["finalVolume"] ?? 0) / input.bottleVolume); results["bottleCount"] = Number.isFinite(v) ? v : 0; } catch { results["bottleCount"] = 0; }
  results["_mustVolume__L"] = 0;
  results["_totalSugar__g"] = 0;
  results["_alcoholPercent___"] = 0;
  results["_finalVolume__L"] = 0;
  return results;
}


export function calculateWine_calculator(input: Wine_calculatorInput): Wine_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["mustVolume"] ?? 0;
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


export interface Wine_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
