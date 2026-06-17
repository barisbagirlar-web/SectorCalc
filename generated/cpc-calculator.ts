// @ts-nocheck
// Auto-generated from cpc-calculator-schema.json
import * as z from 'zod';

export interface Cpc_calculatorInput {
  total_cost: number;
  clicks: number;
  impressions: number;
  conversions: number;
}

export const Cpc_calculatorInputSchema = z.object({
  total_cost: z.number().default(10000),
  clicks: z.number().default(500),
  impressions: z.number().default(10000),
  conversions: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cpc_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.total_cost / input.clicks; results["cpc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cpc"] = 0; }
  try { const v = (input.clicks / input.impressions) * 100; results["ctr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ctr"] = 0; }
  try { const v = (input.conversions / input.clicks) * 100; results["conversion_rate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["conversion_rate"] = 0; }
  try { const v = input.total_cost / input.conversions; results["cpa"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cpa"] = 0; }
  try { const v = ((input.conversions * 100) - input.total_cost) / input.total_cost * 100; results["roi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["roi"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCpc_calculator(input: Cpc_calculatorInput): Cpc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cpc"]);
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


export interface Cpc_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
