// Auto-generated from thick-wall-vessel-calculator-schema.json
import * as z from 'zod';

export interface Thick_wall_vessel_calculatorInput {
  insideDiameter: number;
  outsideDiameter: number;
  internalPressure: number;
  externalPressure: number;
  yieldStrength: number;
  dataConfidence?: number;
}

export const Thick_wall_vessel_calculatorInputSchema = z.object({
  insideDiameter: z.number().default(100),
  outsideDiameter: z.number().default(200),
  internalPressure: z.number().default(10),
  externalPressure: z.number().default(0),
  yieldStrength: z.number().default(250),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Thick_wall_vessel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.insideDiameter / 2; results["ri"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ri"] = Number.NaN; }
  try { const v = input.outsideDiameter / 2; results["ro"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ro"] = Number.NaN; }
  try { const v = ((input.internalPressure * (toNumericFormulaValue(results["ri"])) ** 2 - input.externalPressure * (toNumericFormulaValue(results["ro"])) ** 2) / ((toNumericFormulaValue(results["ro"])) ** 2 - (toNumericFormulaValue(results["ri"])) ** 2)) + ((input.internalPressure - input.externalPressure) * (toNumericFormulaValue(results["ro"])) ** 2 / ((toNumericFormulaValue(results["ro"])) ** 2 - (toNumericFormulaValue(results["ri"])) ** 2)); results["hoopStressInner"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hoopStressInner"] = Number.NaN; }
  try { const v = -input.internalPressure; results["radialStressInner"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["radialStressInner"] = Number.NaN; }
  try { const v = (input.internalPressure * (toNumericFormulaValue(results["ri"])) ** 2 - input.externalPressure * (toNumericFormulaValue(results["ro"])) ** 2) / ((toNumericFormulaValue(results["ro"])) ** 2 - (toNumericFormulaValue(results["ri"])) ** 2); results["longitudinalStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["longitudinalStress"] = Number.NaN; }
  return results;
}


export function calculateThick_wall_vessel_calculator(input: Thick_wall_vessel_calculatorInput): Thick_wall_vessel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hoopStressInner"]);
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


export interface Thick_wall_vessel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
