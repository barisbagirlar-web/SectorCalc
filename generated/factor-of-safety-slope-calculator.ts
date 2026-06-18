// @ts-nocheck
// Auto-generated from factor-of-safety-slope-calculator-schema.json
import * as z from 'zod';

export interface Factor_of_safety_slope_calculatorInput {
  slopeAngle: number;
  cohesion: number;
  frictionAngle: number;
  soilUnitWeight: number;
  slipDepth: number;
  waterDepthAboveSlip: number;
}

export const Factor_of_safety_slope_calculatorInputSchema = z.object({
  slopeAngle: z.number().default(30),
  cohesion: z.number().default(0),
  frictionAngle: z.number().default(25),
  soilUnitWeight: z.number().default(18),
  slipDepth: z.number().default(2),
  waterDepthAboveSlip: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Factor_of_safety_slope_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.slopeAngle * input.cohesion * input.frictionAngle * input.soilUnitWeight; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.slopeAngle * input.cohesion * input.frictionAngle * input.soilUnitWeight * (input.slipDepth * input.waterDepthAboveSlip); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.slipDepth * input.waterDepthAboveSlip; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFactor_of_safety_slope_calculator(input: Factor_of_safety_slope_calculatorInput): Factor_of_safety_slope_calculatorOutput {
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


export interface Factor_of_safety_slope_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
