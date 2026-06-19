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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mast_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.5 * 1.225 * input.windSpeed ** 2; results["windPressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["windPressure"] = 0; }
  try { const v = 0.7 * (asFormulaNumber(results["windPressure"])) * (input.mastDiameter * input.mastHeight); results["dragForce"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dragForce"] = 0; }
  try { const v = (asFormulaNumber(results["dragForce"])) * (input.mastHeight / 2); results["bendingMoment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bendingMoment"] = 0; }
  try { const v = Math.PI * input.mastDiameter ** 3 / 32; results["sectionModulus"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sectionModulus"] = 0; }
  try { const v = (asFormulaNumber(results["bendingMoment"])) / (asFormulaNumber(results["sectionModulus"])); results["bendingStressPa"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bendingStressPa"] = 0; }
  try { const v = (asFormulaNumber(results["bendingStressPa"])) / 1e6; results["bendingStressMPa"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bendingStressMPa"] = 0; }
  try { const v = input.materialYieldStrength / input.safetyFactor; results["allowableStress"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["allowableStress"] = 0; }
  try { const v = (asFormulaNumber(results["bendingStressMPa"])) / (asFormulaNumber(results["allowableStress"])); results["utilizationRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["utilizationRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
