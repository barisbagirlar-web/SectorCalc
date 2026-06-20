// Auto-generated from box-breathing-calculator-schema.json
import * as z from 'zod';

export interface Box_breathing_calculatorInput {
  inhaleTime: number;
  holdTime1: number;
  exhaleTime: number;
  holdTime2: number;
  numCycles: number;
  dataConfidence?: number;
}

export const Box_breathing_calculatorInputSchema = z.object({
  inhaleTime: z.number().default(4),
  holdTime1: z.number().default(4),
  exhaleTime: z.number().default(4),
  holdTime2: z.number().default(4),
  numCycles: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Box_breathing_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inhaleTime + input.holdTime1 + input.exhaleTime + input.holdTime2; results["cycleDuration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cycleDuration"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cycleDuration"])) * input.numCycles; results["totalDuration"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDuration"] = Number.NaN; }
  try { const v = 60 / (toNumericFormulaValue(results["cycleDuration"])); results["breathsPerMinute"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breathsPerMinute"] = Number.NaN; }
  return results;
}


export function calculateBox_breathing_calculator(input: Box_breathing_calculatorInput): Box_breathing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDuration"]);
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


export interface Box_breathing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
