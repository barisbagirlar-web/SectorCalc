// @ts-nocheck
// Auto-generated from sailing-calculator-schema.json
import * as z from 'zod';

export interface Sailing_calculatorInput {
  windSpeed: number;
  sailArea: number;
  leverArm: number;
  airDensity: number;
  safetyFactor: number;
}

export const Sailing_calculatorInputSchema = z.object({
  windSpeed: z.number().default(10),
  sailArea: z.number().default(25),
  leverArm: z.number().default(5),
  airDensity: z.number().default(1.225),
  safetyFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sailing_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 0.5 * input.airDensity * (input.windSpeed ** 2) * input.sailArea * input.leverArm * input.safetyFactor; results["heelingMomentNm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heelingMomentNm"] = 0; }
  try { const v = 0.5 * input.airDensity * (input.windSpeed ** 2) * input.sailArea * input.safetyFactor; results["sailForceN"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sailForceN"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSailing_calculator(input: Sailing_calculatorInput): Sailing_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["heelingMomentNm"]);
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


export interface Sailing_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
