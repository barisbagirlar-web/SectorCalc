// Auto-generated from reliability-calculator-schema.json
import * as z from 'zod';

export interface Reliability_calculatorInput {
  failureRate: number;
  missionTime: number;
  seriesCount: number;
  parallelCount: number;
  dataConfidence?: number;
}

export const Reliability_calculatorInputSchema = z.object({
  failureRate: z.number().default(0.0001),
  missionTime: z.number().default(1000),
  seriesCount: z.number().default(1),
  parallelCount: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reliability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.failureRate * input.missionTime * input.seriesCount * input.parallelCount; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.failureRate * input.missionTime * input.seriesCount * input.parallelCount; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReliability_calculator(input: Reliability_calculatorInput): Reliability_calculatorOutput {
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


export interface Reliability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
