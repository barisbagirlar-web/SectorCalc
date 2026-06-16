// Auto-generated from system-of-equations-calculator-schema.json
import * as z from 'zod';

export interface System_of_equations_calculatorInput {
  machineHoursPerUnitProd1: number;
  machineHoursPerUnitProd2: number;
  totalMachineHours: number;
  materialPerUnitProd1: number;
  materialPerUnitProd2: number;
  totalMaterial: number;
}

export const System_of_equations_calculatorInputSchema = z.object({
  machineHoursPerUnitProd1: z.number().default(2),
  machineHoursPerUnitProd2: z.number().default(4),
  totalMachineHours: z.number().default(100),
  materialPerUnitProd1: z.number().default(3),
  materialPerUnitProd2: z.number().default(1),
  totalMaterial: z.number().default(60),
});

function evaluateAllFormulas(input: System_of_equations_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.machineHoursPerUnitProd1 * input.materialPerUnitProd2) - (input.machineHoursPerUnitProd2 * input.materialPerUnitProd1); results["determinant"] = Number.isFinite(v) ? v : 0; } catch { results["determinant"] = 0; }
  try { const v = ((input.totalMachineHours * input.materialPerUnitProd2) - (input.totalMaterial * input.machineHoursPerUnitProd2)) / (results["determinant"] ?? 0); results["product1Quantity"] = Number.isFinite(v) ? v : 0; } catch { results["product1Quantity"] = 0; }
  try { const v = ((input.machineHoursPerUnitProd1 * input.totalMaterial) - (input.materialPerUnitProd1 * input.totalMachineHours)) / (results["determinant"] ?? 0); results["product2Quantity"] = Number.isFinite(v) ? v : 0; } catch { results["product2Quantity"] = 0; }
  return results;
}


export function calculateSystem_of_equations_calculator(input: System_of_equations_calculatorInput): System_of_equations_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["product1Quantity"] ?? 0;
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


export interface System_of_equations_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
