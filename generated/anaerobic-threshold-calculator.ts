// Auto-generated from anaerobic-threshold-calculator-schema.json
import * as z from 'zod';

export interface Anaerobic_threshold_calculatorInput {
  age: number;
  restingHeartRate: number;
  maxHeartRate: number;
  intensity: number;
  dataConfidence?: number;
}

export const Anaerobic_threshold_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(60),
  maxHeartRate: z.number().default(0),
  intensity: z.number().default(85),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Anaerobic_threshold_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age * input.restingHeartRate * input.maxHeartRate * (input.intensity / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.age * input.restingHeartRate * input.maxHeartRate * (input.intensity / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAnaerobic_threshold_calculator(input: Anaerobic_threshold_calculatorInput): Anaerobic_threshold_calculatorOutput {
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


export interface Anaerobic_threshold_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
