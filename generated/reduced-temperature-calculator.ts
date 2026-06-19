// Auto-generated from reduced-temperature-calculator-schema.json
import * as z from 'zod';

export interface Reduced_temperature_calculatorInput {
  actual_temperature_value: number;
  actual_temperature_unit: number;
  critical_temperature_value: number;
  critical_temperature_unit: number;
  dataConfidence?: number;
}

export const Reduced_temperature_calculatorInputSchema = z.object({
  actual_temperature_value: z.number().default(300),
  actual_temperature_unit: z.number().default(1),
  critical_temperature_value: z.number().default(400),
  critical_temperature_unit: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reduced_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (asFormulaNumber(results["actual_temperature_K"])) / (asFormulaNumber(results["critical_temperature_K"])); results["reduced_temperature"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reduced_temperature"] = 0; }
  try { const v = (input.actual_temperature_unit == 1 ? input.actual_temperature_value : (input.actual_temperature_unit == 2 ? input.actual_temperature_value + 273.15 : (input.actual_temperature_unit == 3 ? (input.actual_temperature_value - 32) * 5/9 + 273.15 : (input.actual_temperature_unit == 4 ? input.actual_temperature_value * 5/9 : 0)))); results["actual_temperature_K"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["actual_temperature_K"] = 0; }
  try { const v = (input.critical_temperature_unit == 1 ? input.critical_temperature_value : (input.critical_temperature_unit == 2 ? input.critical_temperature_value + 273.15 : (input.critical_temperature_unit == 3 ? (input.critical_temperature_value - 32) * 5/9 + 273.15 : (input.critical_temperature_unit == 4 ? input.critical_temperature_value * 5/9 : 0)))); results["critical_temperature_K"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["critical_temperature_K"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReduced_temperature_calculator(input: Reduced_temperature_calculatorInput): Reduced_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reduced_temperature"]);
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


export interface Reduced_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
