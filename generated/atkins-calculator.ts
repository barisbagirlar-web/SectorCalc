// Auto-generated from atkins-calculator-schema.json
import * as z from 'zod';

export interface Atkins_calculatorInput {
  powerInput: number;
  massFlow: number;
  specificHeat: number;
  deltaTemp: number;
  efficiencyFactor: number;
  dataConfidence?: number;
}

export const Atkins_calculatorInputSchema = z.object({
  powerInput: z.number().default(100),
  massFlow: z.number().default(2),
  specificHeat: z.number().default(4.18),
  deltaTemp: z.number().default(10),
  efficiencyFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Atkins_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.massFlow * input.specificHeat * input.deltaTemp * input.efficiencyFactor; results["actualThermalPower"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualThermalPower"] = Number.NaN; }
  try { const v = input.powerInput / (toNumericFormulaValue(results["actualThermalPower"])); results["atkinsIndex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["atkinsIndex"] = Number.NaN; }
  return results;
}


export function calculateAtkins_calculator(input: Atkins_calculatorInput): Atkins_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["atkinsIndex"]);
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


export interface Atkins_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
