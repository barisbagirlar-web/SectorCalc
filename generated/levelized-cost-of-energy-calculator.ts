// Auto-generated from levelized-cost-of-energy-calculator-schema.json
import * as z from 'zod';

export interface Levelized_cost_of_energy_calculatorInput {
  capitalCost: number;
  annualOMCost: number;
  annualEnergyProduction: number;
  discountRate: number;
  projectLifetime: number;
  decommissioningCost: number;
}

export const Levelized_cost_of_energy_calculatorInputSchema = z.object({
  capitalCost: z.number().default(1000000),
  annualOMCost: z.number().default(20000),
  annualEnergyProduction: z.number().default(5000000),
  discountRate: z.number().default(5),
  projectLifetime: z.number().default(20),
  decommissioningCost: z.number().default(0),
});

function evaluateAllFormulas(input: Levelized_cost_of_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.capitalCost + input.decommissioningCost / Math.pow(1 + input.discountRate/100, input.projectLifetime) + input.annualOMCost * ((1 - Math.pow(1 + input.discountRate/100, -input.projectLifetime)) / (input.discountRate/100)); results["totalDiscountedCosts"] = Number.isFinite(v) ? v : 0; } catch { results["totalDiscountedCosts"] = 0; }
  try { const v = input.annualEnergyProduction * ((1 - Math.pow(1 + input.discountRate/100, -input.projectLifetime)) / (input.discountRate/100)); results["totalDiscountedEnergy"] = Number.isFinite(v) ? v : 0; } catch { results["totalDiscountedEnergy"] = 0; }
  try { const v = (results["totalDiscountedCosts"] ?? 0) / (results["totalDiscountedEnergy"] ?? 0); results["lcoe"] = Number.isFinite(v) ? v : 0; } catch { results["lcoe"] = 0; }
  return results;
}


export function calculateLevelized_cost_of_energy_calculator(input: Levelized_cost_of_energy_calculatorInput): Levelized_cost_of_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["lcoe"] ?? 0;
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


export interface Levelized_cost_of_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
