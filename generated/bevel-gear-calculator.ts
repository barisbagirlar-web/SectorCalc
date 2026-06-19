// Auto-generated from bevel-gear-calculator-schema.json
import * as z from 'zod';

export interface Bevel_gear_calculatorInput {
  module: number;
  z1: number;
  z2: number;
  shaftAngle: number;
  pressureAngle: number;
  faceWidthFactor: number;
  dataConfidence?: number;
}

export const Bevel_gear_calculatorInputSchema = z.object({
  module: z.number().default(4),
  z1: z.number().default(20),
  z2: z.number().default(40),
  shaftAngle: z.number().default(90),
  pressureAngle: z.number().default(20),
  faceWidthFactor: z.number().default(0.3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bevel_gear_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.z2 / input.z1; results["gearRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gearRatio"] = 0; }
  try { const v = input.module * input.z1; results["d1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["d1"] = 0; }
  try { const v = input.module * input.z2; results["d2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["d2"] = 0; }
  try { const v = input.shaftAngle * Math.PI / 180; results["shaftAngleRad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shaftAngleRad"] = 0; }
  try { const v = input.module; results["ha"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ha"] = 0; }
  try { const v = 1.25 * input.module; results["hf"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hf"] = 0; }
  try { const v = (asFormulaNumber(results["ha"])) + (asFormulaNumber(results["hf"])); results["h"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["h"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBevel_gear_calculator(input: Bevel_gear_calculatorInput): Bevel_gear_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["gearRatio"]);
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


export interface Bevel_gear_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
