// @ts-nocheck
// Auto-generated from tolac-calculator-schema.json
import * as z from 'zod';

export interface Tolac_calculatorInput {
  laborRate: number;
  machineRate: number;
  cycleTime: number;
  batchSize: number;
  materialCostPerUnit: number;
  overheadPercentage: number;
}

export const Tolac_calculatorInputSchema = z.object({
  laborRate: z.number().default(25),
  machineRate: z.number().default(50),
  cycleTime: z.number().default(5),
  batchSize: z.number().default(100),
  materialCostPerUnit: z.number().default(10),
  overheadPercentage: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tolac_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.laborRate * input.cycleTime) / 60; results["laborCostPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["laborCostPerUnit"] = 0; }
  try { const v = (input.machineRate * input.cycleTime) / 60; results["machineCostPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["machineCostPerUnit"] = 0; }
  try { const v = (asFormulaNumber(results["laborCostPerUnit"])) * (input.overheadPercentage / 100); results["overheadCostPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadCostPerUnit"] = 0; }
  try { const v = input.materialCostPerUnit; results["materialCostPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["materialCostPerUnit"] = 0; }
  try { const v = (asFormulaNumber(results["laborCostPerUnit"])) + (asFormulaNumber(results["machineCostPerUnit"])) + (asFormulaNumber(results["overheadCostPerUnit"])) + input.materialCostPerUnit; results["totalCostPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCostPerUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTolac_calculator(input: Tolac_calculatorInput): Tolac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostPerUnit"]);
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


export interface Tolac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
