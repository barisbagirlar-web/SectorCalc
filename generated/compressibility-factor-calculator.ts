// Auto-generated from compressibility-factor-calculator-schema.json
import * as z from 'zod';

export interface Compressibility_factor_calculatorInput {
  pressure: number;
  volume: number;
  moles: number;
  temperature: number;
  gasConstant: number;
  dataConfidence?: number;
}

export const Compressibility_factor_calculatorInputSchema = z.object({
  pressure: z.number().default(101325),
  volume: z.number().default(0.0224),
  moles: z.number().default(1),
  temperature: z.number().default(273.15),
  gasConstant: z.number().default(8.314),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compressibility_factor_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.pressure * input.volume) / (input.moles * input.gasConstant * input.temperature); results["Z"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Z"] = 0; }
  try { const v = (input.moles * input.gasConstant * input.temperature) / input.pressure; results["idealVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["idealVolume"] = 0; }
  try { const v = ((((input.pressure * input.volume) / (input.moles * input.gasConstant * input.temperature)) - 1) * 100); results["percentDeviation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percentDeviation"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCompressibility_factor_calculator(input: Compressibility_factor_calculatorInput): Compressibility_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["Z"]));
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


export interface Compressibility_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
