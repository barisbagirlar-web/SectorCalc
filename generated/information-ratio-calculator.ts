// Auto-generated from information-ratio-calculator-schema.json
import * as z from 'zod';

export interface Information_ratio_calculatorInput {
  portfolioReturn: number;
  benchmarkReturn: number;
  trackingError: number;
  periodsPerYear: number;
  dataConfidence?: number;
}

export const Information_ratio_calculatorInputSchema = z.object({
  portfolioReturn: z.number().default(10),
  benchmarkReturn: z.number().default(8),
  trackingError: z.number().default(5),
  periodsPerYear: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Information_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.portfolioReturn / 100) * (input.benchmarkReturn / 100) * (input.trackingError / 100) * input.periodsPerYear; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = (input.portfolioReturn / 100) * (input.benchmarkReturn / 100) * (input.trackingError / 100) * input.periodsPerYear; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateInformation_ratio_calculator(input: Information_ratio_calculatorInput): Information_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Information_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
