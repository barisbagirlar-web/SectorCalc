// @ts-nocheck
// Auto-generated from break-even-safety-margin-calculator-schema.json
import * as z from 'zod';

export interface Break_even_safety_margin_calculatorInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  actualSalesVolume: number;
  capacityVolume: number;
  demandUncertainty: number;
  costEscalationRate: number;
  includeTax: boolean;
}

export const Break_even_safety_margin_calculatorInputSchema = z.object({
  fixedCosts: z.number().min(0).max(100000000).default(500000),
  variableCostPerUnit: z.number().min(0).max(10000).default(15),
  sellingPricePerUnit: z.number().min(0).max(100000).default(25),
  actualSalesVolume: z.number().min(0).max(10000000).default(80000),
  capacityVolume: z.number().min(0).max(20000000).default(120000),
  demandUncertainty: z.number().min(0).max(100).default(10),
  costEscalationRate: z.number().min(0).max(50).default(3),
  includeTax: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Break_even_safety_margin_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fixedCosts + input.variableCostPerUnit + input.sellingPricePerUnit; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.fixedCosts + input.variableCostPerUnit + input.sellingPricePerUnit; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBreak_even_safety_margin_calculator(input: Break_even_safety_margin_calculatorInput): Break_even_safety_margin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated alerting"],
  };
}


export interface Break_even_safety_margin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
