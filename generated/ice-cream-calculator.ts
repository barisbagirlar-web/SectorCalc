// Auto-generated from ice-cream-calculator-schema.json
import * as z from 'zod';

export interface Ice_cream_calculatorInput {
  batchMixVolume: number;
  overrunPercent: number;
  mixCostPerLiter: number;
  packagingCostPerLiter: number;
  otherCostsPerBatch: number;
  desiredProfitMarginPercent: number;
}

export const Ice_cream_calculatorInputSchema = z.object({
  batchMixVolume: z.number().default(100),
  overrunPercent: z.number().default(50),
  mixCostPerLiter: z.number().default(2.5),
  packagingCostPerLiter: z.number().default(0.5),
  otherCostsPerBatch: z.number().default(50),
  desiredProfitMarginPercent: z.number().default(30),
});

function evaluateAllFormulas(input: Ice_cream_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = $input.batchMixVolume * (1 + $input.overrunPercent / 100); results["finalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["finalVolume"] = 0; }
  try { const v = $input.batchMixVolume * $input.mixCostPerLiter; results["totalMixCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalMixCost"] = 0; }
  try { const v = $(results["finalVolume"] ?? 0) * $input.packagingCostPerLiter; results["totalPackagingCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalPackagingCost"] = 0; }
  try { const v = $(results["totalMixCost"] ?? 0) + $(results["totalPackagingCost"] ?? 0) + $input.otherCostsPerBatch; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = $(results["totalCost"] ?? 0) / $(results["finalVolume"] ?? 0); results["costPerLiter"] = Number.isFinite(v) ? v : 0; } catch { results["costPerLiter"] = 0; }
  try { const v = $(results["costPerLiter"] ?? 0) / (1 - $input.desiredProfitMarginPercent / 100); results["sellingPricePerLiter"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPricePerLiter"] = 0; }
  return results;
}


export function calculateIce_cream_calculator(input: Ice_cream_calculatorInput): Ice_cream_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sellingPricePerLiter"] ?? 0;
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


export interface Ice_cream_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
