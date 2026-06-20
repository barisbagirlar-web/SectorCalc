// Auto-generated from lifo-fifo-calculator-schema.json
import * as z from 'zod';

export interface Lifo_fifo_calculatorInput {
  openingUnits: number;
  openingCostPerUnit: number;
  purchase1Units: number;
  purchase1CostPerUnit: number;
  purchase2Units: number;
  purchase2CostPerUnit: number;
  unitsSold: number;
  dataConfidence?: number;
}

export const Lifo_fifo_calculatorInputSchema = z.object({
  openingUnits: z.number().default(0),
  openingCostPerUnit: z.number().default(0),
  purchase1Units: z.number().default(0),
  purchase1CostPerUnit: z.number().default(0),
  purchase2Units: z.number().default(0),
  purchase2CostPerUnit: z.number().default(0),
  unitsSold: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lifo_fifo_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.openingUnits * input.openingCostPerUnit + input.purchase1Units * input.purchase1CostPerUnit + input.purchase2Units * input.purchase2CostPerUnit; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.unitsSold <= input.purchase2Units ? input.unitsSold * input.purchase2CostPerUnit : input.unitsSold - input.purchase2Units <= input.purchase1Units ? input.purchase2Units * input.purchase2CostPerUnit + (input.unitsSold - input.purchase2Units) * input.purchase1CostPerUnit : input.purchase2Units * input.purchase2CostPerUnit + input.purchase1Units * input.purchase1CostPerUnit + (input.unitsSold - input.purchase2Units - input.purchase1Units) * input.openingCostPerUnit; results["cogsLifo"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cogsLifo"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) - (toNumericFormulaValue(results["cogsLifo"])); results["endingInventoryLifo"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["endingInventoryLifo"] = Number.NaN; }
  try { const v = input.unitsSold <= input.openingUnits ? input.unitsSold * input.openingCostPerUnit : input.unitsSold - input.openingUnits <= input.purchase1Units ? input.openingUnits * input.openingCostPerUnit + (input.unitsSold - input.openingUnits) * input.purchase1CostPerUnit : input.openingUnits * input.openingCostPerUnit + input.purchase1Units * input.purchase1CostPerUnit + (input.unitsSold - input.openingUnits - input.purchase1Units) * input.purchase2CostPerUnit; results["cogsFifo"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cogsFifo"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) - (toNumericFormulaValue(results["cogsFifo"])); results["endingInventoryFifo"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["endingInventoryFifo"] = Number.NaN; }
  return results;
}


export function calculateLifo_fifo_calculator(input: Lifo_fifo_calculatorInput): Lifo_fifo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cogsLifo"]);
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


export interface Lifo_fifo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
