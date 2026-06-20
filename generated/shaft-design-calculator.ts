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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Shaft_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 32 * input.bendingMoment / (Math.PI * input.diameter**3); results["bendingStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingStress"] = Number.NaN; }
  try { const v = 16 * input.torque / (Math.PI * input.diameter**3); results["torsionalShear"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["torsionalShear"] = Number.NaN; }
  try { const v = input.yieldStrength / input.safetyFactor; results["allowable"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowable"] = Number.NaN; }
  return results;
}


export function calculateShaft_design_calculator(input: Shaft_design_calculatorInput): Shaft_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["allowable"]);
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
