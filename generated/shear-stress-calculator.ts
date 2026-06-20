// Auto-generated from shear-stress-calculator-schema.json
import * as z from 'zod';

export interface Shear_stress_calculatorInput {
  force: number;
  area: number;
  planes: number;
  allowStress: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Shear_stress_calculatorInputSchema = z.object({
  force: z.number().default(1000),
  area: z.number().default(100),
  planes: z.number().default(1),
  allowStress: z.number().default(250),
  safetyFactor: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Shear_stress_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.force / (input.planes * input.area); results["shearStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shearStress"] = Number.NaN; }
  try { const v = input.allowStress / input.safetyFactor; results["allowableShear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowableShear"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["shearStress"])) / (toNumericFormulaValue(results["allowableShear"]))) * 100; results["utilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilization"] = Number.NaN; }
  return results;
}


export function calculateShear_stress_calculator(input: Shear_stress_calculatorInput): Shear_stress_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["shearStress"]);
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


export interface Shear_stress_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
