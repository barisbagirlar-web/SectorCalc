// @ts-nocheck
// Auto-generated from convergent-divergent-nozzle-calculator-schema.json
import * as z from 'zod';

export interface Convergent_divergent_nozzle_calculatorInput {
  totalPressure: number;
  totalTemperature: number;
  throatArea: number;
  exitArea: number;
  gasConstant: number;
  specificHeatRatio: number;
  ambientPressure: number;
}

export const Convergent_divergent_nozzle_calculatorInputSchema = z.object({
  totalPressure: z.number().default(500000),
  totalTemperature: z.number().default(300),
  throatArea: z.number().default(0.001),
  exitArea: z.number().default(0.005),
  gasConstant: z.number().default(287),
  specificHeatRatio: z.number().default(1.4),
  ambientPressure: z.number().default(101325),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Convergent_divergent_nozzle_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalPressure + input.totalTemperature + input.throatArea; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.totalPressure + input.totalTemperature + input.throatArea; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConvergent_divergent_nozzle_calculator(input: Convergent_divergent_nozzle_calculatorInput): Convergent_divergent_nozzle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Convergent_divergent_nozzle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
