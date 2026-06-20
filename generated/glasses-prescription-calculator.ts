// Auto-generated from glasses-prescription-calculator-schema.json
import * as z from 'zod';

export interface Glasses_prescription_calculatorInput {
  sphere: number;
  cylinder: number;
  axis: number;
  vertexDistance: number;
  dataConfidence?: number;
}

export const Glasses_prescription_calculatorInputSchema = z.object({
  sphere: z.number().default(0),
  cylinder: z.number().default(0),
  axis: z.number().default(0),
  vertexDistance: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Glasses_prescription_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vertexDistance / 1000; results["d"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d"] = Number.NaN; }
  try { const v = input.sphere; results["S1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["S1"] = Number.NaN; }
  try { const v = input.sphere + input.cylinder; results["S2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["S2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["S1"])) / (1 - (toNumericFormulaValue(results["d"])) * (toNumericFormulaValue(results["S1"]))); results["S1_eff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["S1_eff"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["S2"])) / (1 - (toNumericFormulaValue(results["d"])) * (toNumericFormulaValue(results["S2"]))); results["S2_eff"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["S2_eff"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["S1_eff"])); results["newSphere"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newSphere"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["S2_eff"])) - (toNumericFormulaValue(results["S1_eff"])); results["newCylinder"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newCylinder"] = Number.NaN; }
  try { const v = input.axis; results["newAxis"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["newAxis"] = Number.NaN; }
  return results;
}


export function calculateGlasses_prescription_calculator(input: Glasses_prescription_calculatorInput): Glasses_prescription_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["newAxis"]);
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


export interface Glasses_prescription_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
