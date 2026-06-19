// Auto-generated from exposure-calculator-schema.json
import * as z from 'zod';

export interface Exposure_calculatorInput {
  duration: number;
  spl: number;
  exchangeRate: number;
  criterionLevel: number;
  criterionTime: number;
  dataConfidence?: number;
}

export const Exposure_calculatorInputSchema = z.object({
  duration: z.number().default(8),
  spl: z.number().default(85),
  exchangeRate: z.number().default(3),
  criterionLevel: z.number().default(85),
  criterionTime: z.number().default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Exposure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.duration * input.spl * input.exchangeRate * input.criterionLevel; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.duration * input.spl * input.exchangeRate * input.criterionLevel * (input.criterionTime); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.criterionTime; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateExposure_calculator(input: Exposure_calculatorInput): Exposure_calculatorOutput {
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


export interface Exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
