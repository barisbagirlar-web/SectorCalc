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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fillet_weld_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.legSize * 0.707; results["throatThickness"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["throatThickness"] = 0; }
  try { const v = input.yieldStrength / input.safetyFactor; results["allowableStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["allowableStress"] = 0; }
  try { const v = (asFormulaNumber(results["throatThickness"])) * (asFormulaNumber(results["allowableStress"])); results["weldCapacityPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weldCapacityPerUnit"] = 0; }
  try { const v = (asFormulaNumber(results["weldCapacityPerUnit"])) * input.weldLength; results["totalWeldCapacity_N"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeldCapacity_N"] = 0; }
  try { const v = (asFormulaNumber(results["totalWeldCapacity_N"])) / 1000; results["totalWeldCapacity_kN"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWeldCapacity_kN"] = 0; }
  try { const v = input.designLoad / (asFormulaNumber(results["totalWeldCapacity_kN"])); results["utilizationRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["utilizationRatio"] = 0; }
  try { const v = input.designLoad * 1000 / (asFormulaNumber(results["weldCapacityPerUnit"])); results["requiredWeldLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredWeldLength"] = 0; }
  try { const v = 0.5 * input.legSize * input.legSize; results["weldArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weldArea"] = 0; }
  try { const v = (asFormulaNumber(results["weldArea"])) * input.weldLength; results["weldVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weldVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
