// @ts-nocheck
// Auto-generated from cows-calculator-schema.json
import * as z from 'zod';

export interface Cows_calculatorInput {
  downtimeHours: number;
  affectedMachines: number;
  hourlyCostPerMachine: number;
  lostProductionPerHour: number;
  profitPerUnit: number;
  overheadMultiplier: number;
}

export const Cows_calculatorInputSchema = z.object({
  downtimeHours: z.number().default(1),
  affectedMachines: z.number().default(1),
  hourlyCostPerMachine: z.number().default(100),
  lostProductionPerHour: z.number().default(10),
  profitPerUnit: z.number().default(20),
  overheadMultiplier: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cows_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.downtimeHours * input.affectedMachines * input.hourlyCostPerMachine; results["directCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["directCost"] = 0; }
  try { const v = input.downtimeHours * input.affectedMachines * input.lostProductionPerHour * input.profitPerUnit; results["lostProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lostProfit"] = 0; }
  try { const v = ((asFormulaNumber(results["directCost"])) + (asFormulaNumber(results["lostProfit"]))) * input.overheadMultiplier; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCows_calculator(input: Cows_calculatorInput): Cows_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Cows_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
