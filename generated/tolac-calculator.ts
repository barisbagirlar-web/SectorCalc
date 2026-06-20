// Auto-generated from tolac-calculator-schema.json
import * as z from 'zod';

export interface Tolac_calculatorInput {
  laborRate: number;
  machineRate: number;
  cycleTime: number;
  batchSize: number;
  materialCostPerUnit: number;
  overheadPercentage: number;
  dataConfidence?: number;
}

export const Tolac_calculatorInputSchema = z.object({
  laborRate: z.number().default(25),
  machineRate: z.number().default(50),
  cycleTime: z.number().default(5),
  batchSize: z.number().default(100),
  materialCostPerUnit: z.number().default(10),
  overheadPercentage: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tolac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.laborRate * input.cycleTime) / 60; results["laborCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCostPerUnit"] = Number.NaN; }
  try { const v = (input.machineRate * input.cycleTime) / 60; results["machineCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["machineCostPerUnit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["laborCostPerUnit"])) * (input.overheadPercentage / 100); results["overheadCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadCostPerUnit"] = Number.NaN; }
  try { const v = input.materialCostPerUnit; results["materialCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialCostPerUnit"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["laborCostPerUnit"])) + (toNumericFormulaValue(results["machineCostPerUnit"])) + (toNumericFormulaValue(results["overheadCostPerUnit"])) + input.materialCostPerUnit; results["totalCostPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostPerUnit"] = Number.NaN; }
  return results;
}


export function calculateTolac_calculator(input: Tolac_calculatorInput): Tolac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCostPerUnit"]);
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


export interface Tolac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
