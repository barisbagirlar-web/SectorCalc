// Auto-generated from cronometer-calculator-schema.json
import * as z from 'zod';

export interface Cronometer_calculatorInput {
  observedTime: number;
  cycles: number;
  ratingFactor: number;
  allowanceFactor: number;
  dataConfidence?: number;
}

export const Cronometer_calculatorInputSchema = z.object({
  observedTime: z.number().default(60),
  cycles: z.number().default(1),
  ratingFactor: z.number().default(100),
  allowanceFactor: z.number().default(15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cronometer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.observedTime * input.cycles; results["totalObservedTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalObservedTime"] = 0; }
  try { const v = input.observedTime * (input.ratingFactor / 100); results["normalTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalTime"] = 0; }
  try { const v = input.observedTime * (input.ratingFactor / 100) * (1 + input.allowanceFactor / 100); results["standardTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["standardTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCronometer_calculator(input: Cronometer_calculatorInput): Cronometer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["standardTime"]);
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


export interface Cronometer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
