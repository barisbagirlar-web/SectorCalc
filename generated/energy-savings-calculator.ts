// Auto-generated from energy-savings-calculator-schema.json
import * as z from 'zod';

export interface Energy_savings_calculatorInput {
  currentEnergyUsage: number;
  energyCostPerUnit: number;
  efficiencyGain: number;
  operatingHours: number;
  emissionFactor: number;
  dataConfidence?: number;
}

export const Energy_savings_calculatorInputSchema = z.object({
  currentEnergyUsage: z.number().default(1000),
  energyCostPerUnit: z.number().default(0.12),
  efficiencyGain: z.number().default(15),
  operatingHours: z.number().default(720),
  emissionFactor: z.number().default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Energy_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentEnergyUsage * (input.efficiencyGain / 100); results["energySaved"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energySaved"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energySaved"])) * input.energyCostPerUnit; results["costSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["energySaved"])) * input.emissionFactor; results["co2Reduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["co2Reduction"] = Number.NaN; }
  return results;
}


export function calculateEnergy_savings_calculator(input: Energy_savings_calculatorInput): Energy_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costSavings"]);
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


export interface Energy_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
