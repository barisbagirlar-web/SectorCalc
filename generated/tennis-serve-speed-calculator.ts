// @ts-nocheck
// Auto-generated from tennis-serve-speed-calculator-schema.json
import * as z from 'zod';

export interface Tennis_serve_speed_calculatorInput {
  distance: number;
  timeOfFlight: number;
  ballMass: number;
  launchHeight: number;
  landingHeight: number;
}

export const Tennis_serve_speed_calculatorInputSchema = z.object({
  distance: z.number().default(18.29),
  timeOfFlight: z.number().default(0.5),
  ballMass: z.number().default(0.0577),
  launchHeight: z.number().default(2.6),
  landingHeight: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tennis_serve_speed_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.distance / input.timeOfFlight; results["vx"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vx"] = 0; }
  try { const v = (input.landingHeight - input.launchHeight + 0.5 * 9.81 * input.timeOfFlight**2) / input.timeOfFlight; results["vy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTennis_serve_speed_calculator(input: Tennis_serve_speed_calculatorInput): Tennis_serve_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vy"]);
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


export interface Tennis_serve_speed_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
