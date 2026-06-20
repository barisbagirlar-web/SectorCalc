// Auto-generated from ironman-70-3-calculator-schema.json
import * as z from 'zod';

export interface Ironman_70_3_calculatorInput {
  swim_pace: number;
  bike_speed: number;
  run_pace: number;
  t1: number;
  t2: number;
  dataConfidence?: number;
}

export const Ironman_70_3_calculatorInputSchema = z.object({
  swim_pace: z.number().default(2),
  bike_speed: z.number().default(30),
  run_pace: z.number().default(5.5),
  t1: z.number().default(3),
  t2: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ironman_70_3_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 19 * input.swim_pace; results["swim_time"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["swim_time"] = Number.NaN; }
  try { const v = (90 / input.bike_speed) * 60; results["bike_time"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bike_time"] = Number.NaN; }
  try { const v = 21.1 * input.run_pace; results["run_time"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["run_time"] = Number.NaN; }
  try { const v = input.t1 + input.t2; results["transition_time"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transition_time"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["swim_time"])) + (toNumericFormulaValue(results["bike_time"])) + (toNumericFormulaValue(results["run_time"])) + (toNumericFormulaValue(results["transition_time"])); results["total_time_minutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_time_minutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_time_minutes"])) / 60; results["total_time_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_time_hours"] = Number.NaN; }
  return results;
}


export function calculateIronman_70_3_calculator(input: Ironman_70_3_calculatorInput): Ironman_70_3_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_time_hours"]);
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


export interface Ironman_70_3_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
