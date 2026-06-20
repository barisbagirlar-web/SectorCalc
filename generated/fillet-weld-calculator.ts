// Auto-generated from fillet-weld-calculator-schema.json
import * as z from 'zod';

export interface Fillet_weld_calculatorInput {
  legSize: number;
  weldLength: number;
  yieldStrength: number;
  safetyFactor: number;
  designLoad: number;
  dataConfidence?: number;
}

export const Fillet_weld_calculatorInputSchema = z.object({
  legSize: z.number().default(6),
  weldLength: z.number().default(100),
  yieldStrength: z.number().default(235),
  safetyFactor: z.number().default(1.5),
  designLoad: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fillet_weld_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.legSize * 0.707; results["throatThickness"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["throatThickness"] = Number.NaN; }
  try { const v = input.yieldStrength / input.safetyFactor; results["allowableStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowableStress"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["throatThickness"])) * (toNumericFormulaValue(results["allowableStress"])); results["weldCapacityPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weldCapacityPerUnit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weldCapacityPerUnit"])) * input.weldLength; results["totalWeldCapacity_N"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeldCapacity_N"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWeldCapacity_N"])) / 1000; results["totalWeldCapacity_kN"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeldCapacity_kN"] = Number.NaN; }
  try { const v = input.designLoad / (toNumericFormulaValue(results["totalWeldCapacity_kN"])); results["utilizationRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilizationRatio"] = Number.NaN; }
  try { const v = input.designLoad * 1000 / (toNumericFormulaValue(results["weldCapacityPerUnit"])); results["requiredWeldLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredWeldLength"] = Number.NaN; }
  try { const v = 0.5 * input.legSize * input.legSize; results["weldArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weldArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weldArea"])) * input.weldLength; results["weldVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weldVolume"] = Number.NaN; }
  return results;
}


export function calculateFillet_weld_calculator(input: Fillet_weld_calculatorInput): Fillet_weld_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeldCapacity_kN"]);
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


export interface Fillet_weld_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
