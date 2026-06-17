// @ts-nocheck
// Auto-generated from energy-savings-calculator-schema.json
import * as z from 'zod';

export interface Energy_savings_calculatorInput {
  currentEnergyUsage: number;
  energyCostPerUnit: number;
  efficiencyGain: number;
  operatingHours: number;
  emissionFactor: number;
}

export const Energy_savings_calculatorInputSchema = z.object({
  currentEnergyUsage: z.number().default(1000),
  energyCostPerUnit: z.number().default(0.12),
  efficiencyGain: z.number().default(15),
  operatingHours: z.number().default(720),
  emissionFactor: z.number().default(0.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Energy_savings_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.currentEnergyUsage * (input.efficiencyGain / 100); results["energySaved"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["energySaved"] = 0; }
  try { const v = (asFormulaNumber(results["energySaved"])) * input.energyCostPerUnit; results["costSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costSavings"] = 0; }
  try { const v = (asFormulaNumber(results["energySaved"])) * input.emissionFactor; results["co2Reduction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["co2Reduction"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEnergy_savings_calculator(input: Energy_savings_calculatorInput): Energy_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costSavings"]);
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


export interface Energy_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
