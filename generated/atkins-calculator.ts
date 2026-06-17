// @ts-nocheck
// Auto-generated from atkins-calculator-schema.json
import * as z from 'zod';

export interface Atkins_calculatorInput {
  powerInput: number;
  massFlow: number;
  specificHeat: number;
  deltaTemp: number;
  efficiencyFactor: number;
}

export const Atkins_calculatorInputSchema = z.object({
  powerInput: z.number().default(100),
  massFlow: z.number().default(2),
  specificHeat: z.number().default(4.18),
  deltaTemp: z.number().default(10),
  efficiencyFactor: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Atkins_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.massFlow * input.specificHeat * input.deltaTemp * input.efficiencyFactor; results["actualThermalPower"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualThermalPower"] = 0; }
  try { const v = input.powerInput / (asFormulaNumber(results["actualThermalPower"])); results["atkinsIndex"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["atkinsIndex"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAtkins_calculator(input: Atkins_calculatorInput): Atkins_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["atkinsIndex"]);
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


export interface Atkins_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
