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

function evaluateAllFormulas(input: Led_savings_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentBulbWattage - input.ledBulbWattage) * input.numberOfBulbs * input.dailyUsageHours * input.daysPerYear / 1000; results["annualEnergySavings"] = Number.isFinite(v) ? v : 0; } catch { results["annualEnergySavings"] = 0; }
  try { const v = (results["annualEnergySavings"] ?? 0) * input.electricityRate; results["annualCostSavings"] = Number.isFinite(v) ? v : 0; } catch { results["annualCostSavings"] = 0; }
  try { const v = (results["annualCostSavings"] ?? 0) > 0 ? (input.ledBulbCost - input.currentBulbCost) * input.numberOfBulbs / (results["annualCostSavings"] ?? 0) : null; results["paybackPeriod"] = Number.isFinite(v) ? v : 0; } catch { results["paybackPeriod"] = 0; }
  results["__annualEnergySavings_toFixed_2___kWh_ye"] = 0;
  results["__paybackPeriod_____null___paybackPeriod"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateLed_savings_calculator(input: Led_savings_calculatorInput): Led_savings_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
