// Auto-generated from power-factor-calculator-schema.json
import * as z from 'zod';

export interface Power_factor_calculatorInput {
  realPower: number;
  apparentPower: number;
  voltage: number;
  current: number;
  dataConfidence?: number;
}

export const Power_factor_calculatorInputSchema = z.object({
  realPower: z.number().default(100),
  apparentPower: z.number().default(125),
  voltage: z.number().default(400),
  current: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Power_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.realPower / input.apparentPower; results["powerFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["powerFactor"] = 0; }
  try { const v = (input.voltage * input.current) / 1000; results["apparentPowerFromVI"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["apparentPowerFromVI"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePower_factor_calculator(input: Power_factor_calculatorInput): Power_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["powerFactor"]);
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


export interface Power_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
