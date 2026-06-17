// @ts-nocheck
// Auto-generated from fatigue-calculator-schema.json
import * as z from 'zod';

export interface Fatigue_calculatorInput {
  alternatingStress: number;
  meanStress: number;
  enduranceLimit: number;
  ultimateTensileStrength: number;
}

export const Fatigue_calculatorInputSchema = z.object({
  alternatingStress: z.number().default(100),
  meanStress: z.number().default(50),
  enduranceLimit: z.number().default(200),
  ultimateTensileStrength: z.number().default(400),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fatigue_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 / (input.alternatingStress / input.enduranceLimit + input.meanStress / input.ultimateTensileStrength); results["safetyFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safetyFactor"] = 0; }
  try { const v = input.enduranceLimit * (1 - input.meanStress / input.ultimateTensileStrength); results["maxAllowableAlternatingStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxAllowableAlternatingStress"] = 0; }
  try { const v = input.alternatingStress / input.enduranceLimit; results["alternatingStressRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["alternatingStressRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFatigue_calculator(input: Fatigue_calculatorInput): Fatigue_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["safetyFactor"]);
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


export interface Fatigue_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
