// Auto-generated from plate-cost-calculator-schema.json
import * as z from 'zod';

export interface Plate_cost_calculatorInput {
  length: number;
  width: number;
  thickness: number;
  density: number;
  costPerKg: number;
  overheadPercent: number;
  wastePercent: number;
  dataConfidence?: number;
}

export const Plate_cost_calculatorInputSchema = z.object({
  length: z.number().default(1000),
  width: z.number().default(500),
  thickness: z.number().default(10),
  density: z.number().default(7850),
  costPerKg: z.number().default(2.5),
  overheadPercent: z.number().default(20),
  wastePercent: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Plate_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.length * input.width * input.thickness / 1e9) * input.density * input.costPerKg; results["rawMaterialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawMaterialCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawMaterialCost"])) * (1 + input.wastePercent / 100); results["materialCostWithWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialCostWithWaste"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialCostWithWaste"])) * (input.overheadPercent / 100); results["overheadAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["materialCostWithWaste"])) + (toNumericFormulaValue(results["overheadAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculatePlate_cost_calculator(input: Plate_cost_calculatorInput): Plate_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Plate_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
