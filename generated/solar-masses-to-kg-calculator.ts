// @ts-nocheck
// Auto-generated from solar-masses-to-kg-calculator-schema.json
import * as z from 'zod';

export interface Solar_masses_to_kg_calculatorInput {
  solarMassValue: number;
  conversionFactor: number;
  decimalPlaces: number;
  uncertaintyPercent: number;
}

export const Solar_masses_to_kg_calculatorInputSchema = z.object({
  solarMassValue: z.number().default(1),
  conversionFactor: z.number().default(1.989e+30),
  decimalPlaces: z.number().default(0),
  uncertaintyPercent: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Solar_masses_to_kg_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.solarMassValue * input.conversionFactor * input.decimalPlaces * (input.uncertaintyPercent / 100); results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.solarMassValue * input.conversionFactor * input.decimalPlaces * (input.uncertaintyPercent / 100); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSolar_masses_to_kg_calculator(input: Solar_masses_to_kg_calculatorInput): Solar_masses_to_kg_calculatorOutput {
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


export interface Solar_masses_to_kg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
