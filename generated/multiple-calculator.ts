// @ts-nocheck
// Auto-generated from multiple-calculator-schema.json
import * as z from 'zod';

export interface Multiple_calculatorInput {
  quantity: number;
  materialCostPerUnit: number;
  laborCostPerUnit: number;
  overheadFixed: number;
  profitMarginPercent: number;
  taxRatePercent: number;
}

export const Multiple_calculatorInputSchema = z.object({
  quantity: z.number().default(100),
  materialCostPerUnit: z.number().default(10),
  laborCostPerUnit: z.number().default(5),
  overheadFixed: z.number().default(1000),
  profitMarginPercent: z.number().default(20),
  taxRatePercent: z.number().default(18),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Multiple_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.materialCostPerUnit + input.laborCostPerUnit) * input.quantity + input.overheadFixed; results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = ((input.materialCostPerUnit + input.laborCostPerUnit) * input.quantity + input.overheadFixed) / input.quantity; results["costPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerUnit"] = 0; }
  try { const v = ((input.materialCostPerUnit + input.laborCostPerUnit) * input.quantity + input.overheadFixed) / input.quantity * (1 + input.profitMarginPercent / 100) * (1 + input.taxRatePercent / 100); results["sellingPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sellingPrice"] = 0; }
  try { const v = ((input.materialCostPerUnit + input.laborCostPerUnit) * input.quantity + input.overheadFixed) / input.quantity * (input.profitMarginPercent / 100); results["profitPerUnit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["profitPerUnit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMultiple_calculator(input: Multiple_calculatorInput): Multiple_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerUnit"]);
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


export interface Multiple_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
