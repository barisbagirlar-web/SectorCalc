// Auto-generated from refrigerator-energy-calculator-schema.json
import * as z from 'zod';

export interface Refrigerator_energy_calculatorInput {
  compressorPower: number;
  dutyCycle: number;
  daysPerYear: number;
  costPerKwh: number;
}

export const Refrigerator_energy_calculatorInputSchema = z.object({
  compressorPower: z.number().default(150),
  dutyCycle: z.number().default(50),
  daysPerYear: z.number().default(365),
  costPerKwh: z.number().default(0.15),
});

function evaluateAllFormulas(input: Refrigerator_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.compressorPower * input.dutyCycle / 100 * 24 * input.daysPerYear) / 1000; results["annualEnergyKwh"] = Number.isFinite(v) ? v : 0; } catch { results["annualEnergyKwh"] = 0; }
  try { const v = (results["annualEnergyKwh"] ?? 0) * input.costPerKwh; results["annualCost"] = Number.isFinite(v) ? v : 0; } catch { results["annualCost"] = 0; }
  try { const v = (results["annualCost"] ?? 0) / 12; results["monthlyCost"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyCost"] = 0; }
  try { const v = (results["annualCost"] ?? 0) / input.daysPerYear; results["dailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  results["__annualCost_toFixed_2__"] = 0;
  results["__monthlyCost_toFixed_2__"] = 0;
  results["__dailyCost_toFixed_4__"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateRefrigerator_energy_calculator(input: Refrigerator_energy_calculatorInput): Refrigerator_energy_calculatorOutput {
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


export interface Refrigerator_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
