// Auto-generated from radian-calculator-schema.json
import * as z from 'zod';

export interface Radian_calculatorInput {
  initialAngleDeg: number;
  finalAngleDeg: number;
  time: number;
  radius: number;
  dataConfidence?: number;
}

export const Radian_calculatorInputSchema = z.object({
  initialAngleDeg: z.number().default(0),
  finalAngleDeg: z.number().default(0),
  time: z.number().default(1),
  radius: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Radian_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.finalAngleDeg - input.initialAngleDeg) * Math.PI / 180; results["angularDisplacementRad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["angularDisplacementRad"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["angularDisplacementRad"])) / input.time; results["angularVelocityRadPerSec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["angularVelocityRadPerSec"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["angularVelocityRadPerSec"])) * input.radius; results["linearVelocity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["linearVelocity"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["angularDisplacementRad"])) * input.radius; results["arcLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["arcLength"] = Number.NaN; }
  return results;
}


export function calculateRadian_calculator(input: Radian_calculatorInput): Radian_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["angularDisplacementRad"]);
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


export interface Radian_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
