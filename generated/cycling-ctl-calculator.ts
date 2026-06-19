// Auto-generated from cycling-ctl-calculator-schema.json
import * as z from 'zod';

export interface Cycling_ctl_calculatorInput {
  startCTL: number;
  dailyTSS: number;
  timeConstant: number;
  numDays: number;
  dataConfidence?: number;
}

export const Cycling_ctl_calculatorInputSchema = z.object({
  startCTL: z.number().default(50),
  dailyTSS: z.number().default(70),
  timeConstant: z.number().default(42),
  numDays: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_ctl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyTSS; results["steadyStateCTL"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["steadyStateCTL"] = 0; }
  try { const v = input.dailyTSS; results["steadyStateCTL_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["steadyStateCTL_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCycling_ctl_calculator(input: Cycling_ctl_calculatorInput): Cycling_ctl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["steadyStateCTL_aux"]);
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


export interface Cycling_ctl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
