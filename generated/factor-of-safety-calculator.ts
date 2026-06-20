// Auto-generated from factor-of-safety-calculator-schema.json
import * as z from 'zod';

export interface Factor_of_safety_calculatorInput {
  appliedForce: number;
  crossSectionArea: number;
  yieldStrength: number;
  ultimateTensileStrength: number;
  designFactor: number;
  stressConcentrationFactor: number;
  dataConfidence?: number;
}

export const Factor_of_safety_calculatorInputSchema = z.object({
  appliedForce: z.number().default(10000),
  crossSectionArea: z.number().default(50),
  yieldStrength: z.number().default(250),
  ultimateTensileStrength: z.number().default(400),
  designFactor: z.number().default(1.5),
  stressConcentrationFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Factor_of_safety_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.appliedForce / input.crossSectionArea * input.stressConcentrationFactor; results["workingStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["workingStress"] = Number.NaN; }
  try { const v = input.yieldStrength / (toNumericFormulaValue(results["workingStress"])); results["fosYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fosYield"] = Number.NaN; }
  try { const v = input.ultimateTensileStrength / (toNumericFormulaValue(results["workingStress"])); results["fosUltimate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fosUltimate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["fosYield"])) - 1; results["marginYield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginYield"] = Number.NaN; }
  return results;
}


export function calculateFactor_of_safety_calculator(input: Factor_of_safety_calculatorInput): Factor_of_safety_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["marginYield"]);
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


export interface Factor_of_safety_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
