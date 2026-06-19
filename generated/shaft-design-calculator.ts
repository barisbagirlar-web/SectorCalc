// Auto-generated from shaft-design-calculator-schema.json
import * as z from 'zod';

export interface Shaft_design_calculatorInput {
  torque: number;
  bendingMoment: number;
  diameter: number;
  yieldStrength: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Shaft_design_calculatorInputSchema = z.object({
  torque: z.number().default(100),
  bendingMoment: z.number().default(50),
  diameter: z.number().default(30),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Shaft_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yieldStrength / input.safetyFactor; results["allowable"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["allowable"] = 0; }
  try { const v = input.yieldStrength / input.safetyFactor; results["allowable_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["allowable_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateShaft_design_calculator(input: Shaft_design_calculatorInput): Shaft_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["allowable_aux"]);
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


export interface Shaft_design_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
