// Auto-generated from margin-of-safety-calculator-schema.json
import * as z from 'zod';

export interface Margin_of_safety_calculatorInput {
  materialUltimateStrength: number;
  crossSectionArea: number;
  appliedForce: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Margin_of_safety_calculatorInputSchema = z.object({
  materialUltimateStrength: z.number().default(400),
  crossSectionArea: z.number().default(100),
  appliedForce: z.number().default(10000),
  safetyFactor: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Margin_of_safety_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.appliedForce / input.crossSectionArea; results["actualStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualStress"] = Number.NaN; }
  try { const v = input.materialUltimateStrength / input.safetyFactor; results["allowableStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowableStress"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["allowableStress"])) / (toNumericFormulaValue(results["actualStress"]))) - 1; results["marginOfSafety"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginOfSafety"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["allowableStress"])) / (toNumericFormulaValue(results["actualStress"])); results["stressRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stressRatio"] = Number.NaN; }
  return results;
}


export function calculateMargin_of_safety_calculator(input: Margin_of_safety_calculatorInput): Margin_of_safety_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["marginOfSafety"]);
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


export interface Margin_of_safety_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
