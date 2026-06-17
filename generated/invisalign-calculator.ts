// @ts-nocheck
// Auto-generated from invisalign-calculator-schema.json
import * as z from 'zod';

export interface Invisalign_calculatorInput {
  numberOfAligners: number;
  materialCostPerAligner: number;
  laborCostPerAligner: number;
  overheadRate: number;
  sellingPricePerAligner: number;
}

export const Invisalign_calculatorInputSchema = z.object({
  numberOfAligners: z.number().default(20),
  materialCostPerAligner: z.number().default(50),
  laborCostPerAligner: z.number().default(30),
  overheadRate: z.number().default(15),
  sellingPricePerAligner: z.number().default(150),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Invisalign_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.materialCostPerAligner + input.laborCostPerAligner) * input.numberOfAligners; results["totalDirectCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDirectCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalDirectCost"])) * (input.overheadRate / 100); results["totalOverhead"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalOverhead"] = 0; }
  try { const v = (asFormulaNumber(results["totalDirectCost"])) + (asFormulaNumber(results["totalOverhead"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = input.sellingPricePerAligner * input.numberOfAligners; results["totalRevenue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - (asFormulaNumber(results["totalCost"])); results["profit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profit"] = 0; }
  try { const v = ((asFormulaNumber(results["profit"])) / (asFormulaNumber(results["totalRevenue"]))) * 100; results["marginPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["marginPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInvisalign_calculator(input: Invisalign_calculatorInput): Invisalign_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["marginPercentage"]);
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


export interface Invisalign_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
