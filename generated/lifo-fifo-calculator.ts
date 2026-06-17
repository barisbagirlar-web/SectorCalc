// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lifo_fifo_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.openingUnits * input.openingCostPerUnit + input.purchase1Units * input.purchase1CostPerUnit + input.purchase2Units * input.purchase2CostPerUnit; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.unitsSold <= input.purchase2Units ? input.unitsSold * input.purchase2CostPerUnit : input.unitsSold - input.purchase2Units <= input.purchase1Units ? input.purchase2Units * input.purchase2CostPerUnit + (input.unitsSold - input.purchase2Units) * input.purchase1CostPerUnit : input.purchase2Units * input.purchase2CostPerUnit + input.purchase1Units * input.purchase1CostPerUnit + (input.unitsSold - input.purchase2Units - input.purchase1Units) * input.openingCostPerUnit; results["cogsLifo"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cogsLifo"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) - (asFormulaNumber(results["cogsLifo"])); results["endingInventoryLifo"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["endingInventoryLifo"] = 0; }
  try { const v = input.unitsSold <= input.openingUnits ? input.unitsSold * input.openingCostPerUnit : input.unitsSold - input.openingUnits <= input.purchase1Units ? input.openingUnits * input.openingCostPerUnit + (input.unitsSold - input.openingUnits) * input.purchase1CostPerUnit : input.openingUnits * input.openingCostPerUnit + input.purchase1Units * input.purchase1CostPerUnit + (input.unitsSold - input.openingUnits - input.purchase1Units) * input.purchase2CostPerUnit; results["cogsFifo"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cogsFifo"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) - (asFormulaNumber(results["cogsFifo"])); results["endingInventoryFifo"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["endingInventoryFifo"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLifo_fifo_calculator(input: Lifo_fifo_calculatorInput): Lifo_fifo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cogsLifo"]);
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


export interface Lifo_fifo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
