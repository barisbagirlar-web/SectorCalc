// @ts-nocheck
// Auto-generated from transformer-calculator-schema.json
import * as z from 'zod';

export interface Transformer_calculatorInput {
  primaryVoltage: number;
  secondaryVoltage: number;
  powerRating: number;
  primaryTurns: number;
}

export const Transformer_calculatorInputSchema = z.object({
  primaryVoltage: z.number().default(230),
  secondaryVoltage: z.number().default(12),
  powerRating: z.number().default(100),
  primaryTurns: z.number().default(1000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Transformer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.primaryTurns * input.secondaryVoltage / input.primaryVoltage; results["secondaryTurns"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["secondaryTurns"] = 0; }
  try { const v = input.powerRating / input.primaryVoltage; results["primaryCurrent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primaryCurrent"] = 0; }
  try { const v = input.powerRating / input.secondaryVoltage; results["secondaryCurrent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["secondaryCurrent"] = 0; }
  try { const v = input.primaryVoltage / input.secondaryVoltage; results["turnsRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["turnsRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTransformer_calculator(input: Transformer_calculatorInput): Transformer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["secondaryTurns"]);
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


export interface Transformer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
