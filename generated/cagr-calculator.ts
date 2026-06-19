// Auto-generated from cagr-calculator-schema.json
import * as z from 'zod';

export interface Cagr_calculatorInput {
  beginningValue: number;
  endingValue: number;
  startYear: number;
  endYear: number;
  dataConfidence?: number;
}

export const Cagr_calculatorInputSchema = z.object({
  beginningValue: z.number().default(1000),
  endingValue: z.number().default(2000),
  startYear: z.number().default(2020),
  endYear: z.number().default(2025),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cagr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.endYear - input.startYear; results["numberOfPeriods"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["numberOfPeriods"] = 0; }
  try { const v = (input.endingValue / input.beginningValue) - 1; results["totalReturn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalReturn"] = 0; }
  try { const v = (input.endingValue / input.beginningValue) ** (1 / (input.endYear - input.startYear)) - 1; results["cagr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cagr"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCagr_calculator(input: Cagr_calculatorInput): Cagr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cagr"]);
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


export interface Cagr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
