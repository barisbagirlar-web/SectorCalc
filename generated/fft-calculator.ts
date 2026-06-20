// Auto-generated from fft-calculator-schema.json
import * as z from 'zod';

export interface Fft_calculatorInput {
  shaftSpeed: number;
  numBalls: number;
  ballDiameter: number;
  pitchDiameter: number;
  contactAngle: number;
  dataConfidence?: number;
}

export const Fft_calculatorInputSchema = z.object({
  shaftSpeed: z.number().default(1500),
  numBalls: z.number().default(9),
  ballDiameter: z.number().default(12),
  pitchDiameter: z.number().default(60),
  contactAngle: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fft_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.shaftSpeed * input.numBalls * input.ballDiameter * input.pitchDiameter; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.shaftSpeed * input.numBalls * input.ballDiameter * input.pitchDiameter * (input.contactAngle); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.contactAngle; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateFft_calculator(input: Fft_calculatorInput): Fft_calculatorOutput {
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


export interface Fft_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
