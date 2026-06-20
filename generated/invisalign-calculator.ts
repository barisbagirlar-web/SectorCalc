// Auto-generated from invisalign-calculator-schema.json
import * as z from 'zod';

export interface Invisalign_calculatorInput {
  numberOfAligners: number;
  materialCostPerAligner: number;
  laborCostPerAligner: number;
  overheadRate: number;
  sellingPricePerAligner: number;
  dataConfidence?: number;
}

export const Invisalign_calculatorInputSchema = z.object({
  numberOfAligners: z.number().default(20),
  materialCostPerAligner: z.number().default(50),
  laborCostPerAligner: z.number().default(30),
  overheadRate: z.number().default(15),
  sellingPricePerAligner: z.number().default(150),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Invisalign_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.materialCostPerAligner + input.laborCostPerAligner) * input.numberOfAligners; results["totalDirectCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDirectCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDirectCost"])) * (input.overheadRate / 100); results["totalOverhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOverhead"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDirectCost"])) + (toNumericFormulaValue(results["totalOverhead"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = input.sellingPricePerAligner * input.numberOfAligners; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRevenue"])) - (toNumericFormulaValue(results["totalCost"])); results["profit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["profit"])) / (toNumericFormulaValue(results["totalRevenue"]))) * 100; results["marginPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginPercentage"] = Number.NaN; }
  return results;
}


export function calculateInvisalign_calculator(input: Invisalign_calculatorInput): Invisalign_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["marginPercentage"]);
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


export interface Invisalign_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
