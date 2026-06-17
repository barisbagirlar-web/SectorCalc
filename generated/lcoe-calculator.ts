// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lcoe_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.capitalCostPerKW * input.plantCapacity; results["totalCapitalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCapitalCost"] = 0; }
  try { const v = input.discountRate / 100; results["discountRateDec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discountRateDec"] = 0; }
  try { const v = input.fixedOandM * input.plantCapacity; results["annualFixedOandM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualFixedOandM"] = 0; }
  try { const v = input.capacityFactor / 100; results["capacityFactorDec"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["capacityFactorDec"] = 0; }
  try { const v = input.plantCapacity * (asFormulaNumber(results["capacityFactorDec"])) * 8760 / 1000; results["annualEnergyOutput"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualEnergyOutput"] = 0; }
  try { const v = input.variableOandM * (asFormulaNumber(results["annualEnergyOutput"])); results["annualVariableOandM"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualVariableOandM"] = 0; }
  try { const v = input.fuelCost * (asFormulaNumber(results["annualEnergyOutput"])); results["annualFuelCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualFuelCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLcoe_calculator(input: Lcoe_calculatorInput): Lcoe_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualFuelCost"]);
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


export interface Lcoe_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
