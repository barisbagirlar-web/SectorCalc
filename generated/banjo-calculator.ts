// Auto-generated from banjo-calculator-schema.json
import * as z from 'zod';

export interface Banjo_calculatorInput {
  boltInnerDiameter: number;
  holeDiameter: number;
  numberOfHoles: number;
  fluidDensity: number;
  fluidViscosity: number;
  pressureDifference: number;
  dischargeCoefficient: number;
  dataConfidence?: number;
}

export const Banjo_calculatorInputSchema = z.object({
  boltInnerDiameter: z.number().default(10),
  holeDiameter: z.number().default(5),
  numberOfHoles: z.number().default(2),
  fluidDensity: z.number().default(870),
  fluidViscosity: z.number().default(0.028),
  pressureDifference: z.number().default(100000),
  dischargeCoefficient: z.number().default(0.62),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Banjo_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.boltInnerDiameter * input.holeDiameter * input.numberOfHoles * input.fluidDensity; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.boltInnerDiameter * input.holeDiameter * input.numberOfHoles * input.fluidDensity * (input.fluidViscosity * input.pressureDifference * input.dischargeCoefficient); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.fluidViscosity * input.pressureDifference * input.dischargeCoefficient; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBanjo_calculator(input: Banjo_calculatorInput): Banjo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Banjo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
