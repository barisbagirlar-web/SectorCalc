// Auto-generated from harvest-calculator-schema.json
import * as z from 'zod';

export interface Harvest_calculatorInput {
  fieldArea: number;
  cropYieldPerHectare: number;
  fieldLossPercent: number;
  storageLossPercent: number;
  dataConfidence?: number;
}

export const Harvest_calculatorInputSchema = z.object({
  fieldArea: z.number().default(1),
  cropYieldPerHectare: z.number().default(5),
  fieldLossPercent: z.number().default(3),
  storageLossPercent: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Harvest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fieldArea * input.cropYieldPerHectare; results["grossHarvest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossHarvest"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossHarvest"])) * (input.fieldLossPercent / 100); results["fieldLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fieldLoss"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["grossHarvest"])) - (toNumericFormulaValue(results["fieldLoss"]))) * (input.storageLossPercent / 100); results["storageLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["storageLoss"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossHarvest"])) - (toNumericFormulaValue(results["fieldLoss"])) - (toNumericFormulaValue(results["storageLoss"])); results["netHarvest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netHarvest"] = Number.NaN; }
  return results;
}


export function calculateHarvest_calculator(input: Harvest_calculatorInput): Harvest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netHarvest"]);
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


export interface Harvest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
