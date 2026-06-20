// Auto-generated from focus-time-calculator-schema.json
import * as z from 'zod';

export interface Focus_time_calculatorInput {
  totalWorkHours: number;
  breakHours: number;
  meetingHours: number;
  interruptionCount: number;
  avgInterruptionDuration: number;
  dataConfidence?: number;
}

export const Focus_time_calculatorInputSchema = z.object({
  totalWorkHours: z.number().default(8),
  breakHours: z.number().default(1),
  meetingHours: z.number().default(1.5),
  interruptionCount: z.number().default(10),
  avgInterruptionDuration: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Focus_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.breakHours; results["breakOut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakOut"] = Number.NaN; }
  try { const v = input.meetingHours; results["meetingOut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meetingOut"] = Number.NaN; }
  try { const v = input.interruptionCount * input.avgInterruptionDuration / 60; results["interruptionOut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["interruptionOut"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["breakOut"])) + (toNumericFormulaValue(results["meetingOut"])) + (toNumericFormulaValue(results["interruptionOut"])); results["nonFocusOut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nonFocusOut"] = Number.NaN; }
  try { const v = input.totalWorkHours - (toNumericFormulaValue(results["nonFocusOut"])); results["focusOut"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["focusOut"] = Number.NaN; }
  return results;
}


export function calculateFocus_time_calculator(input: Focus_time_calculatorInput): Focus_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["focusOut"]);
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


export interface Focus_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
