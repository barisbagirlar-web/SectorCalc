// @ts-nocheck
// Auto-generated from calorie-surplus-calculator-schema.json
import * as z from 'zod';

export interface Calorie_surplus_calculatorInput {
  totalGenerated: number;
  totalConsumed: number;
  lossPercent: number;
  storageEfficiency: number;
  auxConsumption: number;
}

export const Calorie_surplus_calculatorInputSchema = z.object({
  totalGenerated: z.number().default(10000),
  totalConsumed: z.number().default(8000),
  lossPercent: z.number().default(5),
  storageEfficiency: z.number().default(90),
  auxConsumption: z.number().default(200),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Calorie_surplus_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalGenerated - input.totalConsumed; results["grossSurplus"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossSurplus"] = 0; }
  try { const v = (asFormulaNumber(results["grossSurplus"])) * (1 - input.lossPercent / 100) * (input.storageEfficiency / 100) - input.auxConsumption; results["netSurplus"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netSurplus"] = 0; }
  try { const v = (asFormulaNumber(results["grossSurplus"])) - (asFormulaNumber(results["netSurplus"])); results["totalLosses"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLosses"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCalorie_surplus_calculator(input: Calorie_surplus_calculatorInput): Calorie_surplus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netSurplus"]);
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


export interface Calorie_surplus_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
