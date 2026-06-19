// Auto-generated from static-pressure-calculator-schema.json
import * as z from 'zod';

export interface Static_pressure_calculatorInput {
  density: number;
  gravity: number;
  height: number;
  atmPressure: number;
  dataConfidence?: number;
}

export const Static_pressure_calculatorInputSchema = z.object({
  density: z.number().default(1000),
  gravity: z.number().default(9.81),
  height: z.number().default(0),
  atmPressure: z.number().default(101325),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Static_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.density * input.gravity * input.height; results["pressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressure"] = 0; }
  try { const v = input.atmPressure + (asFormulaNumber(results["pressure"])); results["absolutePressure"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["absolutePressure"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStatic_pressure_calculator(input: Static_pressure_calculatorInput): Static_pressure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["pressure"]));
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


export interface Static_pressure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
