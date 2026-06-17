// @ts-nocheck
// Auto-generated from doppler-effect-calculator-schema.json
import * as z from 'zod';

export interface Doppler_effect_calculatorInput {
  sourceFrequency: number;
  waveSpeed: number;
  sourceVelocity: number;
  observerVelocity: number;
}

export const Doppler_effect_calculatorInputSchema = z.object({
  sourceFrequency: z.number().default(1000),
  waveSpeed: z.number().default(343),
  sourceVelocity: z.number().default(0),
  observerVelocity: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Doppler_effect_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.waveSpeed + input.observerVelocity; results["numerator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["numerator"] = 0; }
  try { const v = input.waveSpeed - input.sourceVelocity; results["denominator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["denominator"] = 0; }
  try { const v = input.sourceFrequency * (asFormulaNumber(results["numerator"])) / (asFormulaNumber(results["denominator"])); results["observedFrequency"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["observedFrequency"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDoppler_effect_calculator(input: Doppler_effect_calculatorInput): Doppler_effect_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["observedFrequency"]);
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


export interface Doppler_effect_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
