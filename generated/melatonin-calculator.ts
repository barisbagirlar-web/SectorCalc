// @ts-nocheck
// Auto-generated from melatonin-calculator-schema.json
import * as z from 'zod';

export interface Melatonin_calculatorInput {
  age: number;
  weight: number;
  nightShift: number;
  jetLagFactor: number;
}

export const Melatonin_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  nightShift: z.number().default(0),
  jetLagFactor: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Melatonin_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.age >= 60 ? 1 : 0.5; results["baseDose"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseDose"] = 0; }
  try { const v = input.weight > 90 ? 1.2 : 1; results["weightMultiplier"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["weightMultiplier"] = 0; }
  try { const v = input.nightShift == 1 ? 1.5 : 1; results["shiftMultiplier"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shiftMultiplier"] = 0; }
  try { const v = input.jetLagFactor * 0.5; results["jetLagAddition"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["jetLagAddition"] = 0; }
  try { const v = ((asFormulaNumber(results["baseDose"])) * (asFormulaNumber(results["weightMultiplier"])) * (asFormulaNumber(results["shiftMultiplier"]))) + (asFormulaNumber(results["jetLagAddition"])); results["doseUncapped"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["doseUncapped"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMelatonin_calculator(input: Melatonin_calculatorInput): Melatonin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["doseUncapped"]);
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


export interface Melatonin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
