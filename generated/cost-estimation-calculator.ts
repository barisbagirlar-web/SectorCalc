// Auto-generated from cost-estimation-calculator-schema.json
import * as z from 'zod';

export interface Cost_estimation_calculatorInput {
  materialCost: number;
  laborCost: number;
  machineCost: number;
  overheadPercent: number;
  markupPercent: number;
  units: number;
}

export const Cost_estimation_calculatorInputSchema = z.object({
  materialCost: z.number().default(0),
  laborCost: z.number().default(0),
  machineCost: z.number().default(0),
  overheadPercent: z.number().default(10),
  markupPercent: z.number().default(20),
  units: z.number().default(1),
});

function evaluateAllFormulas(input: Cost_estimation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialCost + input.laborCost + input.machineCost; results["totalDirectCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (results["totalDirectCost"] ?? 0) * (input.overheadPercent / 100); results["overheadAmount"] = Number.isFinite(v) ? v : 0; } catch { results["overheadAmount"] = 0; }
  try { const v = (results["totalDirectCost"] ?? 0) + (results["overheadAmount"] ?? 0); results["totalCostBeforeMarkup"] = Number.isFinite(v) ? v : 0; } catch { results["totalCostBeforeMarkup"] = 0; }
  try { const v = (results["totalCostBeforeMarkup"] ?? 0) * (1 + input.markupPercent / 100); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.units; results["costPerUnit"] = Number.isFinite(v) ? v : 0; } catch { results["costPerUnit"] = 0; }
  return results;
}


export function calculateCost_estimation_calculator(input: Cost_estimation_calculatorInput): Cost_estimation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["costPerUnit"] ?? 0;
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


export interface Cost_estimation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
