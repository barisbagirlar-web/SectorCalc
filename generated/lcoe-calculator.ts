// Auto-generated from lcoe-calculator-schema.json
import * as z from 'zod';

export interface Lcoe_calculatorInput {
  capitalCostPerKW: number;
  plantCapacity: number;
  fixedOandM: number;
  variableOandM: number;
  fuelCost: number;
  capacityFactor: number;
  discountRate: number;
  lifetimeYears: number;
}

export const Lcoe_calculatorInputSchema = z.object({
  capitalCostPerKW: z.number().default(1000),
  plantCapacity: z.number().default(100000),
  fixedOandM: z.number().default(20),
  variableOandM: z.number().default(5),
  fuelCost: z.number().default(0),
  capacityFactor: z.number().default(25),
  discountRate: z.number().default(8),
  lifetimeYears: z.number().default(25),
});

function evaluateAllFormulas(input: Lcoe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.capitalCostPerKW * input.plantCapacity; results["totalCapitalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCapitalCost"] = 0; }
  try { const v = input.discountRate / 100; results["discountRateDec"] = Number.isFinite(v) ? v : 0; } catch { results["discountRateDec"] = 0; }
  try { const v = ((results["discountRateDec"] ?? 0) * Math.pow(1 + (results["discountRateDec"] ?? 0), input.lifetimeYears)) / (Math.pow(1 + (results["discountRateDec"] ?? 0), input.lifetimeYears) - 1); results["crf"] = Number.isFinite(v) ? v : 0; } catch { results["crf"] = 0; }
  try { const v = (results["totalCapitalCost"] ?? 0) * (results["crf"] ?? 0); results["annualCapitalCost"] = Number.isFinite(v) ? v : 0; } catch { results["annualCapitalCost"] = 0; }
  try { const v = input.fixedOandM * input.plantCapacity; results["annualFixedOandM"] = Number.isFinite(v) ? v : 0; } catch { results["annualFixedOandM"] = 0; }
  try { const v = input.capacityFactor / 100; results["capacityFactorDec"] = Number.isFinite(v) ? v : 0; } catch { results["capacityFactorDec"] = 0; }
  try { const v = input.plantCapacity * (results["capacityFactorDec"] ?? 0) * 8760 / 1000; results["annualEnergyOutput"] = Number.isFinite(v) ? v : 0; } catch { results["annualEnergyOutput"] = 0; }
  try { const v = input.variableOandM * (results["annualEnergyOutput"] ?? 0); results["annualVariableOandM"] = Number.isFinite(v) ? v : 0; } catch { results["annualVariableOandM"] = 0; }
  try { const v = input.fuelCost * (results["annualEnergyOutput"] ?? 0); results["annualFuelCost"] = Number.isFinite(v) ? v : 0; } catch { results["annualFuelCost"] = 0; }
  try { const v = (results["annualCapitalCost"] ?? 0) + (results["annualFixedOandM"] ?? 0) + (results["annualVariableOandM"] ?? 0) + (results["annualFuelCost"] ?? 0); results["totalAnnualCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalAnnualCost"] = 0; }
  try { const v = (results["totalAnnualCost"] ?? 0) / (results["annualEnergyOutput"] ?? 0); results["lcoe"] = Number.isFinite(v) ? v : 0; } catch { results["lcoe"] = 0; }
  return results;
}


export function calculateLcoe_calculator(input: Lcoe_calculatorInput): Lcoe_calculatorOutput {
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


export interface Lcoe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
