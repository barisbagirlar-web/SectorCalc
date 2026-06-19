// Auto-generated from system-of-equations-calculator-schema.json
import * as z from 'zod';

export interface System_of_equations_calculatorInput {
  machineHoursPerUnitProd1: number;
  machineHoursPerUnitProd2: number;
  totalMachineHours: number;
  materialPerUnitProd1: number;
  materialPerUnitProd2: number;
  totalMaterial: number;
  dataConfidence?: number;
}

export const System_of_equations_calculatorInputSchema = z.object({
  machineHoursPerUnitProd1: z.number().default(2),
  machineHoursPerUnitProd2: z.number().default(4),
  totalMachineHours: z.number().default(100),
  materialPerUnitProd1: z.number().default(3),
  materialPerUnitProd2: z.number().default(1),
  totalMaterial: z.number().default(60),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: System_of_equations_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.machineHoursPerUnitProd1 * input.materialPerUnitProd2) - (input.machineHoursPerUnitProd2 * input.materialPerUnitProd1); results["determinant"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["determinant"] = 0; }
  try { const v = ((input.totalMachineHours * input.materialPerUnitProd2) - (input.totalMaterial * input.machineHoursPerUnitProd2)) / (asFormulaNumber(results["determinant"])); results["product1Quantity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["product1Quantity"] = 0; }
  try { const v = ((input.machineHoursPerUnitProd1 * input.totalMaterial) - (input.materialPerUnitProd1 * input.totalMachineHours)) / (asFormulaNumber(results["determinant"])); results["product2Quantity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["product2Quantity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSystem_of_equations_calculator(input: System_of_equations_calculatorInput): System_of_equations_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["product1Quantity"]));
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


export interface System_of_equations_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
