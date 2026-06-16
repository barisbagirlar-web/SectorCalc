// Auto-generated from tanning-calculator-schema.json
import * as z from 'zod';

export interface Tanning_calculatorInput {
  hideWeight: number;
  desiredCr2O3Offer: number;
  bcsCr2O3Content: number;
  floatVolume: number;
}

export const Tanning_calculatorInputSchema = z.object({
  hideWeight: z.number().default(1000),
  desiredCr2O3Offer: z.number().default(6),
  bcsCr2O3Content: z.number().default(25),
  floatVolume: z.number().default(2000),
});

function evaluateAllFormulas(input: Tanning_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hideWeight * input.desiredCr2O3Offer / 100; results["pureCr2O3Weight"] = Number.isFinite(v) ? v : 0; } catch { results["pureCr2O3Weight"] = 0; }
  try { const v = (results["pureCr2O3Weight"] ?? 0) / (input.bcsCr2O3Content / 100); results["bcsWeight"] = Number.isFinite(v) ? v : 0; } catch { results["bcsWeight"] = 0; }
  try { const v = (results["bcsWeight"] ?? 0) * 1000 / input.floatVolume; results["concentrationInFloat"] = Number.isFinite(v) ? v : 0; } catch { results["concentrationInFloat"] = 0; }
  return results;
}


export function calculateTanning_calculator(input: Tanning_calculatorInput): Tanning_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bcsWeight"] ?? 0;
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


export interface Tanning_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
