// Auto-generated from 5k-calculator-schema.json
import * as z from 'zod';

export interface _5k_calculatorInput {
  fixedCosts: number;
  materialCostPerUnit: number;
  laborCostPerUnit: number;
  machineCostPerHour: number;
  machineHoursPerUnit: number;
  productionQuantity: number;
  sellingPricePerUnit: number;
  dataConfidence?: number;
}

export const _5k_calculatorInputSchema = z.object({
  fixedCosts: z.number().default(10000),
  materialCostPerUnit: z.number().default(5),
  laborCostPerUnit: z.number().default(3),
  machineCostPerHour: z.number().default(100),
  machineHoursPerUnit: z.number().default(0.1),
  productionQuantity: z.number().default(5000),
  sellingPricePerUnit: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _5k_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.machineCostPerHour * input.machineHoursPerUnit * input.productionQuantity; results["totalMachineCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMachineCost"] = 0; }
  try { const v = (input.materialCostPerUnit + input.laborCostPerUnit) * input.productionQuantity; results["totalVariableCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVariableCost"] = 0; }
  try { const v = input.fixedCosts + (asFormulaNumber(results["totalVariableCost"])) + (asFormulaNumber(results["totalMachineCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.sellingPricePerUnit * input.productionQuantity; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - (asFormulaNumber(results["totalCost"])); results["profit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = (asFormulaNumber(results["profit"])) / (asFormulaNumber(results["totalRevenue"])); results["profitMargin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_5k_calculator(input: _5k_calculatorInput): _5k_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["profitMargin"]);
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


export interface _5k_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
