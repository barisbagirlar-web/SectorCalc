// Auto-generated from bbt-calculator-schema.json
import * as z from 'zod';

export interface Bbt_calculatorInput {
  speed: number;
  frictionCoeff: number;
  load: number;
  boreDiameter: number;
  ambientTemp: number;
  coolingCoeff: number;
  dataConfidence?: number;
}

export const Bbt_calculatorInputSchema = z.object({
  speed: z.number().default(1500),
  frictionCoeff: z.number().default(0.001),
  load: z.number().default(1000),
  boreDiameter: z.number().default(50),
  ambientTemp: z.number().default(20),
  coolingCoeff: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bbt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.frictionCoeff * input.load * (Math.PI * input.boreDiameter * input.speed / 60) / 1000; results["powerLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["powerLoss"] = 0; }
  try { const v = (asFormulaNumber(results["powerLoss"])) / input.coolingCoeff; results["tempRise"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tempRise"] = 0; }
  try { const v = input.ambientTemp + (asFormulaNumber(results["tempRise"])); results["bearingTemp"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bearingTemp"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBbt_calculator(input: Bbt_calculatorInput): Bbt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bearingTemp"]);
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


export interface Bbt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
