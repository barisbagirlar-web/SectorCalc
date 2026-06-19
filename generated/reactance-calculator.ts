// Auto-generated from reactance-calculator-schema.json
import * as z from 'zod';

export interface Reactance_calculatorInput {
  frequency: number;
  capacitance: number;
  inductance: number;
  connectionType: number;
  dataConfidence?: number;
}

export const Reactance_calculatorInputSchema = z.object({
  frequency: z.number().default(50),
  capacitance: z.number().default(0.000001),
  inductance: z.number().default(0.1),
  connectionType: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reactance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / (2 * Math.PI * input.frequency * input.capacitance); results["Xc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Xc"] = 0; }
  try { const v = 2 * Math.PI * input.frequency * input.inductance; results["Xl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Xl"] = 0; }
  try { const v = ((input.connectionType === 0 ? ((asFormulaNumber(results["Xl"])) - (asFormulaNumber(results["Xc"]))) : (((asFormulaNumber(results["Xc"])) * (asFormulaNumber(results["Xl"]))) / ((asFormulaNumber(results["Xl"])) - (asFormulaNumber(results["Xc"]))))) ? 1 : 0); results["totalReactance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalReactance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReactance_calculator(input: Reactance_calculatorInput): Reactance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalReactance"]));
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


export interface Reactance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
