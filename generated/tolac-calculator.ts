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

function evaluateAllFormulas(input: Tolac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.laborRate * input.cycleTime) / 60; results["laborCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["laborCostPerUnit"] = 0; }
  try { const v = (input.machineRate * input.cycleTime) / 60; results["machineCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["machineCostPerUnit"] = 0; }
  try { const v = (results["laborCostPerUnit"] ?? 0) * (input.overheadPercentage / 100); results["overheadCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["overheadCostPerUnit"] = 0; }
  try { const v = input.materialCostPerUnit; results["materialCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["materialCostPerUnit"] = 0; }
  try { const v = (results["laborCostPerUnit"] ?? 0) + (results["machineCostPerUnit"] ?? 0) + (results["overheadCostPerUnit"] ?? 0) + input.materialCostPerUnit; results["totalCostPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostPerUnit"] = 0; }
  return results;
}


export function calculateTolac_calculator(input: Tolac_calculatorInput): Tolac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCostPerUnit"] ?? 0;
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


export interface Tolac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
