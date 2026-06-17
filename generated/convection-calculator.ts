// @ts-nocheck
// Auto-generated from convection-calculator-schema.json
import * as z from 'zod';

export interface Convection_calculatorInput {
  L: number;
  W: number;
  Ts: number;
  Tinf: number;
  k: number;
  nu: number;
  Pr: number;
}

export const Convection_calculatorInputSchema = z.object({
  L: z.number().default(0.5),
  W: z.number().default(0.3),
  Ts: z.number().default(50),
  Tinf: z.number().default(25),
  k: z.number().default(0.0257),
  nu: z.number().default(0.000016),
  Pr: z.number().default(0.7),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Convection_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.Ts - input.Tinf; results["deltaT"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deltaT"] = 0; }
  try { const v = input.Tinf + 273.15; results["Tf_K"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["Tf_K"] = 0; }
  try { const v = 1 / (asFormulaNumber(results["Tf_K"])); results["beta"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["beta"] = 0; }
  try { const v = input.L * input.W; results["A"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["A"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConvection_calculator(input: Convection_calculatorInput): Convection_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["A"]);
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


export interface Convection_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
