// @ts-nocheck
// Auto-generated from triathlon-calculator-schema.json
import * as z from 'zod';

export interface Triathlon_calculatorInput {
  swimDistance: number;
  bikeDistance: number;
  runDistance: number;
  swimPace: number;
  bikeSpeed: number;
  runPace: number;
}

export const Triathlon_calculatorInputSchema = z.object({
  swimDistance: z.number().default(1500),
  bikeDistance: z.number().default(40),
  runDistance: z.number().default(10),
  swimPace: z.number().default(2),
  bikeSpeed: z.number().default(30),
  runPace: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Triathlon_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.swimDistance * input.bikeDistance * input.runDistance * input.swimPace; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.swimDistance * input.bikeDistance * input.runDistance * input.swimPace * (input.bikeSpeed * input.runPace); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.bikeSpeed * input.runPace; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTriathlon_calculator(input: Triathlon_calculatorInput): Triathlon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Triathlon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
