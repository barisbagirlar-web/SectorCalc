// @ts-nocheck
// Auto-generated from hiking-calculator-schema.json
import * as z from 'zod';

export interface Hiking_calculatorInput {
  distance: number;
  elevationGain: number;
  averageSpeed: number;
  backpackWeight: number;
}

export const Hiking_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  elevationGain: z.number().default(500),
  averageSpeed: z.number().default(5),
  backpackWeight: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hiking_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.averageSpeed * (1 - 0.005 * input.backpackWeight); results["adjustedSpeed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedSpeed"] = 0; }
  try { const v = input.distance / (asFormulaNumber(results["adjustedSpeed"])); results["baseTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseTime"] = 0; }
  try { const v = input.elevationGain / 600; results["ascentTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ascentTime"] = 0; }
  try { const v = (asFormulaNumber(results["baseTime"])) + (asFormulaNumber(results["ascentTime"])); results["totalTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHiking_calculator(input: Hiking_calculatorInput): Hiking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedSpeed"]);
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


export interface Hiking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
