// Auto-generated from meat-cooking-temperature-calculator-schema.json
import * as z from 'zod';

export interface Meat_cooking_temperature_calculatorInput {
  weight: number;
  startTemp: number;
  targetTemp: number;
  ovenTemp: number;
  thermalFactor: number;
  dataConfidence?: number;
}

export const Meat_cooking_temperature_calculatorInputSchema = z.object({
  weight: z.number().default(1),
  startTemp: z.number().default(20),
  targetTemp: z.number().default(70),
  ovenTemp: z.number().default(180),
  thermalFactor: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Meat_cooking_temperature_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.ovenTemp - input.startTemp) / (input.ovenTemp - input.targetTemp); results["tempRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tempRatio"] = 0; }
  try { const v = (input.ovenTemp - input.startTemp) / (input.ovenTemp - input.targetTemp); results["tempRatio_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tempRatio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMeat_cooking_temperature_calculator(input: Meat_cooking_temperature_calculatorInput): Meat_cooking_temperature_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tempRatio_aux"]);
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


export interface Meat_cooking_temperature_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
