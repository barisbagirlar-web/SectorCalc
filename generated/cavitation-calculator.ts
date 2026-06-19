// Auto-generated from cavitation-calculator-schema.json
import * as z from 'zod';

export interface Cavitation_calculatorInput {
  fluidPressure: number;
  vaporPressure: number;
  density: number;
  velocity: number;
  dataConfidence?: number;
}

export const Cavitation_calculatorInputSchema = z.object({
  fluidPressure: z.number().default(101325),
  vaporPressure: z.number().default(2338),
  density: z.number().default(998),
  velocity: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cavitation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fluidPressure - input.vaporPressure; results["pressureDiff"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressureDiff"] = 0; }
  try { const v = input.fluidPressure - input.vaporPressure; results["pressureDiff_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pressureDiff_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCavitation_calculator(input: Cavitation_calculatorInput): Cavitation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["pressureDiff_aux"]));
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


export interface Cavitation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
