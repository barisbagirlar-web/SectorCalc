// @ts-nocheck
// Auto-generated from lightweight-cost-savings-calculator-schema.json
import * as z from 'zod';

export interface Lightweight_cost_savings_calculatorInput {
  current_weight_kg: number;
  new_weight_kg: number;
  annual_volume_units: number;
  material_cost_per_kg: number;
  shipping_cost_per_kg: number;
  waste_rate_percent: number;
  labor_hours_per_unit: number;
  labor_rate_per_hour: number;
}

export const Lightweight_cost_savings_calculatorInputSchema = z.object({
  current_weight_kg: z.number().min(0.1).max(10000).default(10),
  new_weight_kg: z.number().min(0.1).max(10000).default(8),
  annual_volume_units: z.number().min(1).max(1000000000).default(100000),
  material_cost_per_kg: z.number().min(0).max(1000).default(2.5),
  shipping_cost_per_kg: z.number().min(0).max(100).default(0.3),
  waste_rate_percent: z.number().min(0).max(100).default(5),
  labor_hours_per_unit: z.number().min(0).max(100).default(0.5),
  labor_rate_per_hour: z.number().min(0).max(500).default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Lightweight_cost_savings_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.current_weight_kg + input.new_weight_kg + input.annual_volume_units; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.current_weight_kg + input.new_weight_kg + input.annual_volume_units; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLightweight_cost_savings_calculator(input: Lightweight_cost_savings_calculatorInput): Lightweight_cost_savings_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Custom reporting"],
  };
}


export interface Lightweight_cost_savings_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
