// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Break_even_analysisInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fixedCosts / (input.sellingPricePerUnit - input.variableCostPerUnit); results["breakEvenUnits"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakEvenUnits"] = 0; }
  try { const v = (asFormulaNumber(results["breakEvenUnits"])) * input.sellingPricePerUnit; results["breakEvenRevenue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakEvenRevenue"] = 0; }
  try { const v = (input.sellingPricePerUnit - input.variableCostPerUnit) * input.expectedSalesVolume - input.fixedCosts; results["profit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profit"] = 0; }
  try { const v = input.sellingPricePerUnit - input.variableCostPerUnit; results["contributionMargin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["contributionMargin"] = 0; }
  try { const v = (asFormulaNumber(results["contributionMargin"])) / input.sellingPricePerUnit; results["marginRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["marginRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBreak_even_analysis(input: Break_even_analysisInput): Break_even_analysisOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakEvenUnits"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
