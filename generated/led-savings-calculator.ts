// Auto-generated from led-savings-calculator-schema.json
import * as z from 'zod';

export interface Led_savings_calculatorInput {
  currentBulbWattage: number;
  ledBulbWattage: number;
  numberOfBulbs: number;
  dailyUsageHours: number;
  electricityRate: number;
  daysPerYear: number;
  currentBulbCost: number;
  ledBulbCost: number;
  dataConfidence?: number;
}

export const Led_savings_calculatorInputSchema = z.object({
  currentBulbWattage: z.number().default(60),
  ledBulbWattage: z.number().default(10),
  numberOfBulbs: z.number().default(10),
  dailyUsageHours: z.number().default(8),
  electricityRate: z.number().default(0.12),
  daysPerYear: z.number().default(365),
  currentBulbCost: z.number().default(1),
  ledBulbCost: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Led_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentBulbWattage - input.ledBulbWattage) * input.numberOfBulbs * input.dailyUsageHours * input.daysPerYear / 1000; results["annualEnergySavings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualEnergySavings"] = 0; }
  try { const v = (asFormulaNumber(results["annualEnergySavings"])) * input.electricityRate; results["annualCostSavings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualCostSavings"] = 0; }
  try { const v = (asFormulaNumber(results["annualCostSavings"])) > 0 ? (input.ledBulbCost - input.currentBulbCost) * input.numberOfBulbs / (asFormulaNumber(results["annualCostSavings"])) : null; results["paybackPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["paybackPeriod"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLed_savings_calculator(input: Led_savings_calculatorInput): Led_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["paybackPeriod"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Led_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
