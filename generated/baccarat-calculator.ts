// Auto-generated from baccarat-calculator-schema.json
import * as z from 'zod';

export interface Baccarat_calculatorInput {
  rawMaterialCost: number;
  laborCostPerHour: number;
  hoursPerUnit: number;
  energyCostPerUnit: number;
  additionalCost: number;
  overheadRate: number;
  profitMargin: number;
  dataConfidence?: number;
}

export const Baccarat_calculatorInputSchema = z.object({
  rawMaterialCost: z.number().default(10),
  laborCostPerHour: z.number().default(50),
  hoursPerUnit: z.number().default(0.5),
  energyCostPerUnit: z.number().default(2),
  additionalCost: z.number().default(5),
  overheadRate: z.number().default(20),
  profitMargin: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baccarat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rawMaterialCost + input.laborCostPerHour * input.hoursPerUnit + input.energyCostPerUnit; results["directCosts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directCosts"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["directCosts"])) * input.overheadRate / 100; results["overheadAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["directCosts"])) + input.additionalCost + (toNumericFormulaValue(results["overheadAmount"])); results["totalProductionCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalProductionCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalProductionCost"])) * input.profitMargin / 100; results["profitAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalProductionCost"])) + (toNumericFormulaValue(results["profitAmount"])); results["sellingPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPrice"] = Number.NaN; }
  return results;
}


export function calculateBaccarat_calculator(input: Baccarat_calculatorInput): Baccarat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPrice"]);
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


export interface Baccarat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
