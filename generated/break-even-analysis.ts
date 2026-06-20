// Auto-generated from break-even-analysis-schema.json
import * as z from 'zod';

export interface Break_even_analysisInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  expectedSalesVolume: number;
  dataConfidence?: number;
}

export const Break_even_analysisInputSchema = z.object({
  fixedCosts: z.number().default(100000),
  variableCostPerUnit: z.number().default(50),
  sellingPricePerUnit: z.number().default(100),
  expectedSalesVolume: z.number().default(3000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Break_even_analysisInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fixedCosts / (input.sellingPricePerUnit - input.variableCostPerUnit); results["breakEvenUnits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakEvenUnits"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["breakEvenUnits"])) * input.sellingPricePerUnit; results["breakEvenRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakEvenRevenue"] = Number.NaN; }
  try { const v = (input.sellingPricePerUnit - input.variableCostPerUnit) * input.expectedSalesVolume - input.fixedCosts; results["profit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profit"] = Number.NaN; }
  try { const v = input.sellingPricePerUnit - input.variableCostPerUnit; results["contributionMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contributionMargin"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["contributionMargin"])) / input.sellingPricePerUnit; results["marginRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginRatio"] = Number.NaN; }
  return results;
}


export function calculateBreak_even_analysis(input: Break_even_analysisInput): Break_even_analysisOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakEvenUnits"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
