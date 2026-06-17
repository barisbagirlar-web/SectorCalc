// @ts-nocheck
// Auto-generated from ampacity-calculator-schema.json
import * as z from 'zod';

export interface Ampacity_calculatorInput {
  materialFactor: number;
  area: number;
  insulationTemp: number;
  ambientTemp: number;
  bundlingFactor: number;
}

export const Ampacity_calculatorInputSchema = z.object({
  materialFactor: z.number().default(1),
  area: z.number().default(2.5),
  insulationTemp: z.number().default(60),
  ambientTemp: z.number().default(30),
  bundlingFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ampacity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bundlingFactor; results["bundlingFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bundlingFactor"] = 0; }
  try { const v = input.materialFactor; results["materialFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["materialFactor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAmpacity_calculator(input: Ampacity_calculatorInput): Ampacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["materialFactor"]);
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


export interface Ampacity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
