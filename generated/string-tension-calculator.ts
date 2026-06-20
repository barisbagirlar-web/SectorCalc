// Auto-generated from string-tension-calculator-schema.json
import * as z from 'zod';

export interface String_tension_calculatorInput {
  materialDensity: number;
  stringDiameter: number;
  stringLength: number;
  frequency: number;
  dataConfidence?: number;
}

export const String_tension_calculatorInputSchema = z.object({
  materialDensity: z.number().default(7850),
  stringDiameter: z.number().default(1),
  stringLength: z.number().default(65),
  frequency: z.number().default(440),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: String_tension_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialDensity * Math.PI * (input.stringDiameter / 1000) ** 2 / 4; results["linearDensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["linearDensity"] = Number.NaN; }
  try { const v = input.stringLength / 100; results["lengthM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lengthM"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["linearDensity"])) * (2 * (toNumericFormulaValue(results["lengthM"])) * input.frequency) ** 2; results["tension"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tension"] = Number.NaN; }
  return results;
}


export function calculateString_tension_calculator(input: String_tension_calculatorInput): String_tension_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tension"]);
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


export interface String_tension_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
