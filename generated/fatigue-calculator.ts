// Auto-generated from fatigue-calculator-schema.json
import * as z from 'zod';

export interface Fatigue_calculatorInput {
  alternatingStress: number;
  meanStress: number;
  enduranceLimit: number;
  ultimateTensileStrength: number;
  dataConfidence?: number;
}

export const Fatigue_calculatorInputSchema = z.object({
  alternatingStress: z.number().default(100),
  meanStress: z.number().default(50),
  enduranceLimit: z.number().default(200),
  ultimateTensileStrength: z.number().default(400),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fatigue_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / (input.alternatingStress / input.enduranceLimit + input.meanStress / input.ultimateTensileStrength); results["safetyFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["safetyFactor"] = 0; }
  try { const v = input.enduranceLimit * (1 - input.meanStress / input.ultimateTensileStrength); results["maxAllowableAlternatingStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maxAllowableAlternatingStress"] = 0; }
  try { const v = input.alternatingStress / input.enduranceLimit; results["alternatingStressRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["alternatingStressRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFatigue_calculator(input: Fatigue_calculatorInput): Fatigue_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["safetyFactor"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Fatigue_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
