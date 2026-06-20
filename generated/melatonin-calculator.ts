// Auto-generated from melatonin-calculator-schema.json
import * as z from 'zod';

export interface Melatonin_calculatorInput {
  age: number;
  weight: number;
  nightShift: number;
  jetLagFactor: number;
  dataConfidence?: number;
}

export const Melatonin_calculatorInputSchema = z.object({
  age: z.number().default(30),
  weight: z.number().default(70),
  nightShift: z.number().default(0),
  jetLagFactor: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Melatonin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age >= 60 ? 1 : 0.5; results["baseDose"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseDose"] = Number.NaN; }
  try { const v = input.weight > 90 ? 1.2 : 1; results["weightMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightMultiplier"] = Number.NaN; }
  try { const v = input.nightShift == 1 ? 1.5 : 1; results["shiftMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shiftMultiplier"] = Number.NaN; }
  try { const v = input.jetLagFactor * 0.5; results["jetLagAddition"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["jetLagAddition"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["baseDose"])) * (toNumericFormulaValue(results["weightMultiplier"])) * (toNumericFormulaValue(results["shiftMultiplier"]))) + (toNumericFormulaValue(results["jetLagAddition"])); results["doseUncapped"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["doseUncapped"] = Number.NaN; }
  return results;
}


export function calculateMelatonin_calculator(input: Melatonin_calculatorInput): Melatonin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["doseUncapped"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Melatonin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
