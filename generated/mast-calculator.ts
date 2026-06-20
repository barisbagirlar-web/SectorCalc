// Auto-generated from mast-calculator-schema.json
import * as z from 'zod';

export interface Mast_calculatorInput {
  mastHeight: number;
  mastDiameter: number;
  windSpeed: number;
  materialYieldStrength: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Mast_calculatorInputSchema = z.object({
  mastHeight: z.number().default(10),
  mastDiameter: z.number().default(0.3),
  windSpeed: z.number().default(30),
  materialYieldStrength: z.number().default(250),
  safetyFactor: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mast_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * 1.225 * input.windSpeed ** 2; results["windPressure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["windPressure"] = Number.NaN; }
  try { const v = 0.7 * (toNumericFormulaValue(results["windPressure"])) * (input.mastDiameter * input.mastHeight); results["dragForce"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dragForce"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dragForce"])) * (input.mastHeight / 2); results["bendingMoment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingMoment"] = Number.NaN; }
  try { const v = Math.PI * input.mastDiameter ** 3 / 32; results["sectionModulus"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sectionModulus"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bendingMoment"])) / (toNumericFormulaValue(results["sectionModulus"])); results["bendingStressPa"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingStressPa"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bendingStressPa"])) / 1e6; results["bendingStressMPa"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bendingStressMPa"] = Number.NaN; }
  try { const v = input.materialYieldStrength / input.safetyFactor; results["allowableStress"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["allowableStress"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bendingStressMPa"])) / (toNumericFormulaValue(results["allowableStress"])); results["utilizationRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilizationRatio"] = Number.NaN; }
  return results;
}


export function calculateMast_calculator(input: Mast_calculatorInput): Mast_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["utilizationRatio"]);
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


export interface Mast_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
