// Auto-generated from pulley-calculator-schema.json
import * as z from 'zod';

export interface Pulley_calculatorInput {
  driverDiameter: number;
  drivenDiameter: number;
  centerDistance: number;
  driverRPM: number;
  dataConfidence?: number;
}

export const Pulley_calculatorInputSchema = z.object({
  driverDiameter: z.number().default(100),
  drivenDiameter: z.number().default(200),
  centerDistance: z.number().default(500),
  driverRPM: z.number().default(1500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pulley_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.driverDiameter / input.drivenDiameter; results["speedRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedRatio"] = Number.NaN; }
  try { const v = input.driverRPM * (toNumericFormulaValue(results["speedRatio"])); results["drivenRPM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["drivenRPM"] = Number.NaN; }
  try { const v = 2 * input.centerDistance + 1.5708 * (input.driverDiameter + input.drivenDiameter) + ((input.drivenDiameter - input.driverDiameter) ** 2) / (4 * input.centerDistance); results["beltLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["beltLength"] = Number.NaN; }
  return results;
}


export function calculatePulley_calculator(input: Pulley_calculatorInput): Pulley_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["beltLength"]);
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


export interface Pulley_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
