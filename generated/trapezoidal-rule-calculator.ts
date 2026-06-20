// Auto-generated from trapezoidal-rule-calculator-schema.json
import * as z from 'zod';

export interface Trapezoidal_rule_calculatorInput {
  lowerLimit: number;
  upperLimit: number;
  intervals: number;
  fa: number;
  fb: number;
  sumMid: number;
  dataConfidence?: number;
}

export const Trapezoidal_rule_calculatorInputSchema = z.object({
  lowerLimit: z.number().default(0),
  upperLimit: z.number().default(1),
  intervals: z.number().default(10),
  fa: z.number().default(0),
  fb: z.number().default(0),
  sumMid: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Trapezoidal_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.upperLimit - input.lowerLimit) / input.intervals) / 2 * (input.fa + 2 * input.sumMid + input.fb); results["integralValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["integralValue"] = Number.NaN; }
  try { const v = (input.upperLimit - input.lowerLimit) / input.intervals; results["stepSize"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stepSize"] = Number.NaN; }
  try { const v = input.fa + input.fb; results["sumOfEnds"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sumOfEnds"] = Number.NaN; }
  try { const v = 2 * input.sumMid; results["sumOfInterior"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sumOfInterior"] = Number.NaN; }
  return results;
}


export function calculateTrapezoidal_rule_calculator(input: Trapezoidal_rule_calculatorInput): Trapezoidal_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["integralValue"]);
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


export interface Trapezoidal_rule_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
