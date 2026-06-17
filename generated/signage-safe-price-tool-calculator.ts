// @ts-nocheck
// Auto-generated from signage-safe-price-tool-calculator-schema.json
import * as z from 'zod';

export interface Signage_safe_price_tool_calculatorInput {
  material_cost: number;
  labor_hours: number;
  labor_rate: number;
  overhead_rate: number;
  complexity_factor: string;
  quality_level: string;
  quantity: number;
  waste_factor: number;
}

export const Signage_safe_price_tool_calculatorInputSchema = z.object({
  material_cost: z.number().min(0).max(100000).default(100),
  labor_hours: z.number().min(0.1).max(100).default(2.5),
  labor_rate: z.number().min(0).max(200).default(35),
  overhead_rate: z.number().min(0).max(100).default(25),
  complexity_factor: z.enum(['low', 'medium', 'high']).default('medium'),
  quality_level: z.enum(['economy', 'standard', 'premium']).default('standard'),
  quantity: z.number().min(1).max(100000).default(100),
  waste_factor: z.number().min(0).max(50).default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Signage_safe_price_tool_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.material_cost + input.labor_hours + input.labor_rate; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.material_cost + input.labor_hours + input.labor_rate; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSignage_safe_price_tool_calculator(input: Signage_safe_price_tool_calculatorInput): Signage_safe_price_tool_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Signage_safe_price_tool_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
