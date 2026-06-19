// Auto-generated from cycling-atl-calculator-schema.json
import * as z from 'zod';

export interface Cycling_atl_calculatorInput {
  atlPrevious: number;
  tssToday: number;
  timeConstant: number;
  precision: number;
  dataConfidence?: number;
}

export const Cycling_atl_calculatorInputSchema = z.object({
  atlPrevious: z.number().default(0),
  tssToday: z.number().default(0),
  timeConstant: z.number().default(7),
  precision: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cycling_atl_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.atlPrevious + (input.tssToday - input.atlPrevious) / input.timeConstant; results["atlCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["atlCurrent"] = 0; }
  try { const v = (input.tssToday - input.atlPrevious) / input.timeConstant; results["atlChange"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["atlChange"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCycling_atl_calculator(input: Cycling_atl_calculatorInput): Cycling_atl_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["atlChange"]));
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


export interface Cycling_atl_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
