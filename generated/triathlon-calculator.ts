// Auto-generated from triathlon-calculator-schema.json
import * as z from 'zod';

export interface Triathlon_calculatorInput {
  swimDistance: number;
  bikeDistance: number;
  runDistance: number;
  swimPace: number;
  bikeSpeed: number;
  runPace: number;
  dataConfidence?: number;
}

export const Triathlon_calculatorInputSchema = z.object({
  swimDistance: z.number().default(1500),
  bikeDistance: z.number().default(40),
  runDistance: z.number().default(10),
  swimPace: z.number().default(2),
  bikeSpeed: z.number().default(30),
  runPace: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Triathlon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.swimDistance * input.bikeDistance * input.runDistance * input.swimPace; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.swimDistance * input.bikeDistance * input.runDistance * input.swimPace * (input.bikeSpeed * input.runPace); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.bikeSpeed * input.runPace; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateTriathlon_calculator(input: Triathlon_calculatorInput): Triathlon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Triathlon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
