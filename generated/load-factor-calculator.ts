// Auto-generated from load-factor-calculator-schema.json
import * as z from 'zod';

export interface Load_factor_calculatorInput {
  totalEnergy: number;
  peakDemand: number;
  numberOfDays: number;
  dailyOperatingHours: number;
  dataConfidence?: number;
}

export const Load_factor_calculatorInputSchema = z.object({
  totalEnergy: z.number().default(1000),
  peakDemand: z.number().default(200),
  numberOfDays: z.number().default(30),
  dailyOperatingHours: z.number().default(24),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Load_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalEnergy * input.peakDemand * input.numberOfDays * input.dailyOperatingHours; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.totalEnergy * input.peakDemand * input.numberOfDays * input.dailyOperatingHours; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLoad_factor_calculator(input: Load_factor_calculatorInput): Load_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Load_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
