// @ts-nocheck
// Auto-generated from met-calculator-schema.json
import * as z from 'zod';

export interface Met_calculatorInput {
  metValue: number;
  weightKg: number;
  durationMin: number;
  adjustmentFactor: number;
}

export const Met_calculatorInputSchema = z.object({
  metValue: z.number().default(1),
  weightKg: z.number().default(70),
  durationMin: z.number().default(30),
  adjustmentFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Met_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.metValue * input.weightKg * (input.durationMin / 60) * input.adjustmentFactor; results["totalCal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCal"] = 0; }
  try { const v = (asFormulaNumber(results["totalCal"])) / input.durationMin; results["calPerMin"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["calPerMin"] = 0; }
  try { const v = input.metValue * (input.durationMin / 60); results["metHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["metHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMet_calculator(input: Met_calculatorInput): Met_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCal"]);
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


export interface Met_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
