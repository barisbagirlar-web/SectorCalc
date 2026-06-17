// @ts-nocheck
// Auto-generated from margin-of-safety-calculator-schema.json
import * as z from 'zod';

export interface Margin_of_safety_calculatorInput {
  materialUltimateStrength: number;
  crossSectionArea: number;
  appliedForce: number;
  safetyFactor: number;
}

export const Margin_of_safety_calculatorInputSchema = z.object({
  materialUltimateStrength: z.number().default(400),
  crossSectionArea: z.number().default(100),
  appliedForce: z.number().default(10000),
  safetyFactor: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Margin_of_safety_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.appliedForce / input.crossSectionArea; results["actualStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualStress"] = 0; }
  try { const v = input.materialUltimateStrength / input.safetyFactor; results["allowableStress"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["allowableStress"] = 0; }
  try { const v = ((asFormulaNumber(results["allowableStress"])) / (asFormulaNumber(results["actualStress"]))) - 1; results["marginOfSafety"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["marginOfSafety"] = 0; }
  try { const v = (asFormulaNumber(results["allowableStress"])) / (asFormulaNumber(results["actualStress"])); results["stressRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["stressRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMargin_of_safety_calculator(input: Margin_of_safety_calculatorInput): Margin_of_safety_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["marginOfSafety"]);
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


export interface Margin_of_safety_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
