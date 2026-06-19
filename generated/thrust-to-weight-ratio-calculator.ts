// Auto-generated from thrust-to-weight-ratio-calculator-schema.json
import * as z from 'zod';

export interface Thrust_to_weight_ratio_calculatorInput {
  emptyMass: number;
  fuelMass: number;
  payloadMass: number;
  thrust: number;
  gravity: number;
  dataConfidence?: number;
}

export const Thrust_to_weight_ratio_calculatorInputSchema = z.object({
  emptyMass: z.number().default(5000),
  fuelMass: z.number().default(3000),
  payloadMass: z.number().default(2000),
  thrust: z.number().default(120000),
  gravity: z.number().default(9.81),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Thrust_to_weight_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.emptyMass + input.fuelMass + input.payloadMass; results["totalMass"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMass"] = 0; }
  try { const v = (asFormulaNumber(results["totalMass"])) * input.gravity; results["weight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weight"] = 0; }
  try { const v = input.thrust / (asFormulaNumber(results["weight"])); results["thrustToWeightRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["thrustToWeightRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateThrust_to_weight_ratio_calculator(input: Thrust_to_weight_ratio_calculatorInput): Thrust_to_weight_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["thrustToWeightRatio"]));
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


export interface Thrust_to_weight_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
