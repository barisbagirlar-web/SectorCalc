// @ts-nocheck
// Auto-generated from powerball-calculator-schema.json
import * as z from 'zod';

export interface Powerball_calculatorInput {
  internalDiameter: number;
  internalLength: number;
  millSpeed: number;
  ballFillingFraction: number;
  ballBulkDensity: number;
  motorEfficiency: number;
}

export const Powerball_calculatorInputSchema = z.object({
  internalDiameter: z.number().default(3.5),
  internalLength: z.number().default(6),
  millSpeed: z.number().default(18),
  ballFillingFraction: z.number().default(0.3),
  ballBulkDensity: z.number().default(4800),
  motorEfficiency: z.number().default(0.95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Powerball_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.internalDiameter * input.internalLength * input.millSpeed * input.ballFillingFraction; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.internalDiameter * input.internalLength * input.millSpeed * input.ballFillingFraction * (input.ballBulkDensity * (input.motorEfficiency / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.ballBulkDensity * (input.motorEfficiency / 100); results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePowerball_calculator(input: Powerball_calculatorInput): Powerball_calculatorOutput {
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


export interface Powerball_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
