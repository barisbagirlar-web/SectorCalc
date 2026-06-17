// @ts-nocheck
// Auto-generated from scope-3-emissions-calculator-schema.json
import * as z from 'zod';

export interface Scope_3_emissions_calculatorInput {
  annualSpendOnPurchasedGoods: number;
  emissionFactorPurchasedGoods: number;
  businessTravelDistance: number;
  emissionFactorBusinessTravel: number;
  employeeCommutingDistance: number;
  emissionFactorCommuting: number;
  wasteGenerated: number;
  emissionFactorWaste: number;
}

export const Scope_3_emissions_calculatorInputSchema = z.object({
  annualSpendOnPurchasedGoods: z.number().default(1000000),
  emissionFactorPurchasedGoods: z.number().default(0.5),
  businessTravelDistance: z.number().default(50000),
  emissionFactorBusinessTravel: z.number().default(0.2),
  employeeCommutingDistance: z.number().default(200000),
  emissionFactorCommuting: z.number().default(0.15),
  wasteGenerated: z.number().default(100),
  emissionFactorWaste: z.number().default(500),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Scope_3_emissions_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annualSpendOnPurchasedGoods * input.emissionFactorPurchasedGoods + input.businessTravelDistance * input.emissionFactorBusinessTravel + input.employeeCommutingDistance * input.emissionFactorCommuting + input.wasteGenerated * input.emissionFactorWaste; results["totalScope3"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalScope3"] = 0; }
  try { const v = input.annualSpendOnPurchasedGoods * input.emissionFactorPurchasedGoods; results["purchasedEmissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["purchasedEmissions"] = 0; }
  try { const v = input.businessTravelDistance * input.emissionFactorBusinessTravel; results["businessTravelEmissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["businessTravelEmissions"] = 0; }
  try { const v = input.employeeCommutingDistance * input.emissionFactorCommuting; results["commutingEmissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["commutingEmissions"] = 0; }
  try { const v = input.wasteGenerated * input.emissionFactorWaste; results["wasteEmissions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wasteEmissions"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateScope_3_emissions_calculator(input: Scope_3_emissions_calculatorInput): Scope_3_emissions_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalScope3"]);
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


export interface Scope_3_emissions_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
