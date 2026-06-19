// Auto-generated from differential-amplifier-calculator-schema.json
import * as z from 'zod';

export interface Differential_amplifier_calculatorInput {
  V1: number;
  V2: number;
  R1: number;
  R2: number;
  R3: number;
  R4: number;
  dataConfidence?: number;
}

export const Differential_amplifier_calculatorInputSchema = z.object({
  V1: z.number().default(1),
  V2: z.number().default(2),
  R1: z.number().default(10000),
  R2: z.number().default(10000),
  R3: z.number().default(10000),
  R4: z.number().default(10000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Differential_amplifier_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.V2 * (input.R4 / (input.R3 + input.R4)) * (1 + input.R2 / input.R1) - input.V1 * (input.R2 / input.R1); results["Vout"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["Vout"] = 0; }
  try { const v = input.R2 / input.R1; results["gain_inv"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gain_inv"] = 0; }
  try { const v = (input.R4 / (input.R3 + input.R4)) * (1 + input.R2 / input.R1); results["gain_noninv"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["gain_noninv"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDifferential_amplifier_calculator(input: Differential_amplifier_calculatorInput): Differential_amplifier_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Vout"]);
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


export interface Differential_amplifier_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
