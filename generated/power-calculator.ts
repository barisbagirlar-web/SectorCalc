// Auto-generated from power-calculator-schema.json
import * as z from 'zod';

export interface Power_calculatorInput {
  voltage: number;
  current: number;
  powerFactor: number;
  dataConfidence?: number;
}

export const Power_calculatorInputSchema = z.object({
  voltage: z.number().default(230),
  current: z.number().default(10),
  powerFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Power_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.voltage * input.current * input.powerFactor; results["realPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["realPower"] = 0; }
  try { const v = input.voltage * input.current; results["apparentPower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["apparentPower"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePower_calculator(input: Power_calculatorInput): Power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["realPower"]));
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


export interface Power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
