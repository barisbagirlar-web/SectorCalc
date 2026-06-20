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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lcoe_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.capitalCostPerKW * input.plantCapacity; results["totalCapitalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCapitalCost"] = Number.NaN; }
  try { const v = input.discountRate / 100; results["discountRateDec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountRateDec"] = Number.NaN; }
  try { const v = input.fixedOandM * input.plantCapacity; results["annualFixedOandM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualFixedOandM"] = Number.NaN; }
  try { const v = input.capacityFactor / 100; results["capacityFactorDec"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["capacityFactorDec"] = Number.NaN; }
  try { const v = input.plantCapacity * (toNumericFormulaValue(results["capacityFactorDec"])) * 8760 / 1000; results["annualEnergyOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualEnergyOutput"] = Number.NaN; }
  try { const v = input.variableOandM * (toNumericFormulaValue(results["annualEnergyOutput"])); results["annualVariableOandM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualVariableOandM"] = Number.NaN; }
  try { const v = input.fuelCost * (toNumericFormulaValue(results["annualEnergyOutput"])); results["annualFuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualFuelCost"] = Number.NaN; }
  return results;
}


export function calculateLcoe_calculator(input: Lcoe_calculatorInput): Lcoe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualFuelCost"]);
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


export interface Lcoe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
