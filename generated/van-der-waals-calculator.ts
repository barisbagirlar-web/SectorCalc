// @ts-nocheck
// Auto-generated from van-der-waals-calculator-schema.json
import * as z from 'zod';

export interface Van_der_waals_calculatorInput {
  volume: number;
  temperature: number;
  moles: number;
  a: number;
  b: number;
  R: number;
}

export const Van_der_waals_calculatorInputSchema = z.object({
  volume: z.number().default(1),
  temperature: z.number().default(273.15),
  moles: z.number().default(1),
  a: z.number().default(1.355),
  b: z.number().default(0.032),
  R: z.number().default(0.082057),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Van_der_waals_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.moles * input.R * input.temperature) / (input.volume - input.moles * input.b); results["repulsiveTerm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["repulsiveTerm"] = 0; }
  try { const v = (input.a * input.moles**2) / (input.volume**2); results["attractiveTerm"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["attractiveTerm"] = 0; }
  try { const v = (asFormulaNumber(results["repulsiveTerm"])) - (asFormulaNumber(results["attractiveTerm"])); results["pressure"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["pressure"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVan_der_waals_calculator(input: Van_der_waals_calculatorInput): Van_der_waals_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pressure"]);
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


export interface Van_der_waals_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
