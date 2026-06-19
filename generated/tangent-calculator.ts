// Auto-generated from tangent-calculator-schema.json
import * as z from 'zod';

export interface Tangent_calculatorInput {
  angle: number;
  unitRadians: number;
  precision: number;
  computeDouble: number;
  dataConfidence?: number;
}

export const Tangent_calculatorInputSchema = z.object({
  angle: z.number().default(45),
  unitRadians: z.number().default(0),
  precision: z.number().default(4),
  computeDouble: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tangent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.unitRadians == 1) ? input.angle : input.angle * Math.PI / 180; results["thetaRad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["thetaRad"] = 0; }
  try { const v = (input.computeDouble == 1) ? 2 * (asFormulaNumber(results["thetaRad"])) : (asFormulaNumber(results["thetaRad"])); results["effectiveAngle"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveAngle"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTangent_calculator(input: Tangent_calculatorInput): Tangent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["effectiveAngle"]));
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


export interface Tangent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
