// Auto-generated from cagr-calculator-schema.json
import * as z from 'zod';

export interface Cagr_calculatorInput {
  beginningValue: number;
  endingValue: number;
  startYear: number;
  endYear: number;
}

export const Cagr_calculatorInputSchema = z.object({
  beginningValue: z.number().default(1000),
  endingValue: z.number().default(2000),
  startYear: z.number().default(2020),
  endYear: z.number().default(2025),
});

function evaluateAllFormulas(input: Cagr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endYear - input.startYear; results["numberOfPeriods"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfPeriods"] = 0; }
  try { const v = (input.endingValue / input.beginningValue) - 1; results["totalReturn"] = Number.isFinite(v) ? v : 0; } catch { results["totalReturn"] = 0; }
  try { const v = (input.endingValue / input.beginningValue) ** (1 / (input.endYear - input.startYear)) - 1; results["cagr"] = Number.isFinite(v) ? v : 0; } catch { results["cagr"] = 0; }
  return results;
}


export function calculateCagr_calculator(input: Cagr_calculatorInput): Cagr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cagr"] ?? 0;
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


export interface Cagr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
