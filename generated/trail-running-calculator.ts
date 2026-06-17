// @ts-nocheck
// Auto-generated from trail-running-calculator-schema.json
import * as z from 'zod';

export interface Trail_running_calculatorInput {
  distance: number;
  elevation_gain: number;
  elevation_loss: number;
  base_pace: number;
  ascent_factor: number;
  descent_factor: number;
}

export const Trail_running_calculatorInputSchema = z.object({
  distance: z.number().default(10),
  elevation_gain: z.number().default(500),
  elevation_loss: z.number().default(500),
  base_pace: z.number().default(6),
  ascent_factor: z.number().default(0.1),
  descent_factor: z.number().default(0.05),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Trail_running_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance * input.base_pace; results["flatTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["flatTime"] = 0; }
  try { const v = input.elevation_gain * input.ascent_factor; results["ascentTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ascentTime"] = 0; }
  try { const v = input.elevation_loss * input.descent_factor; results["descentTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["descentTime"] = 0; }
  try { const v = (asFormulaNumber(results["flatTime"])) + (asFormulaNumber(results["ascentTime"])) + (asFormulaNumber(results["descentTime"])); results["totalTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTrail_running_calculator(input: Trail_running_calculatorInput): Trail_running_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTime"]);
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


export interface Trail_running_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
