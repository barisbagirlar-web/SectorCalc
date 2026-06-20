// Auto-generated from cost-estimation-calculator-schema.json
import * as z from 'zod';

export interface Cost_estimation_calculatorInput {
  materialCost: number;
  laborCost: number;
  machineCost: number;
  overheadPercent: number;
  markupPercent: number;
  units: number;
  dataConfidence?: number;
}

export const Cost_estimation_calculatorInputSchema = z.object({
  materialCost: z.number().default(0),
  laborCost: z.number().default(0),
  machineCost: z.number().default(0),
  overheadPercent: z.number().default(10),
  markupPercent: z.number().default(20),
  units: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cost_estimation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.materialCost + input.laborCost + input.machineCost; results["totalDirectCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDirectCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDirectCost"])) * (input.overheadPercent / 100); results["overheadAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overheadAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDirectCost"])) + (toNumericFormulaValue(results["overheadAmount"])); results["totalCostBeforeMarkup"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCostBeforeMarkup"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCostBeforeMarkup"])) * (1 + input.markupPercent / 100); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.units; results["costPerUnit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerUnit"] = Number.NaN; }
  return results;
}


export function calculateCost_estimation_calculator(input: Cost_estimation_calculatorInput): Cost_estimation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerUnit"]);
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


export interface Cost_estimation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
