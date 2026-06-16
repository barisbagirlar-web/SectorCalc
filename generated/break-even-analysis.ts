// Auto-generated from break-even-analysis-schema.json
import * as z from 'zod';

export interface Break_even_analysisInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  expectedSalesVolume: number;
}

export const Break_even_analysisInputSchema = z.object({
  fixedCosts: z.number().default(100000),
  variableCostPerUnit: z.number().default(50),
  sellingPricePerUnit: z.number().default(100),
  expectedSalesVolume: z.number().default(3000),
});

function evaluateAllFormulas(input: Break_even_analysisInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fixedCosts / (input.sellingPricePerUnit - input.variableCostPerUnit); results["breakEvenUnits"] = Number.isFinite(v) ? v : 0; } catch { results["breakEvenUnits"] = 0; }
  try { const v = (results["breakEvenUnits"] ?? 0) * input.sellingPricePerUnit; results["breakEvenRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["breakEvenRevenue"] = 0; }
  try { const v = (input.sellingPricePerUnit - input.variableCostPerUnit) * input.expectedSalesVolume - input.fixedCosts; results["profit"] = Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = input.sellingPricePerUnit - input.variableCostPerUnit; results["contributionMargin"] = Number.isFinite(v) ? v : 0; } catch { results["contributionMargin"] = 0; }
  try { const v = (results["contributionMargin"] ?? 0) / input.sellingPricePerUnit; results["marginRatio"] = Number.isFinite(v) ? v : 0; } catch { results["marginRatio"] = 0; }
  return results;
}


export function calculateBreak_even_analysis(input: Break_even_analysisInput): Break_even_analysisOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["breakEvenUnits"] ?? 0;
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


export interface Break_even_analysisOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
