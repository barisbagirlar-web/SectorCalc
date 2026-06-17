// @ts-nocheck
// Auto-generated from cnc-machining-cost-calculator-schema.json
import * as z from 'zod';

export interface Cnc_machining_cost_calculatorInput {
  material_type: string;
  part_weight_kg: number;
  stock_volume_cm3: number;
  machining_time_min: number;
  setup_time_min: number;
  batch_size: number;
  machine_hourly_rate_usd: number;
  labor_hourly_rate_usd: number;
}

export const Cnc_machining_cost_calculatorInputSchema = z.object({
  material_type: z.enum(['aluminum_6061', 'steel_1018', 'stainless_304', 'titanium_6al4v', 'brass_c360']).default('aluminum_6061'),
  part_weight_kg: z.number().min(0.001).max(500).default(0.5),
  stock_volume_cm3: z.number().min(1).max(100000).default(200),
  machining_time_min: z.number().min(0.1).max(1440).default(15),
  setup_time_min: z.number().min(0).max(480).default(60),
  batch_size: z.number().min(1).max(100000).default(100),
  machine_hourly_rate_usd: z.number().min(20).max(500).default(85),
  labor_hourly_rate_usd: z.number().min(10).max(150).default(35),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cnc_machining_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.material_type + input.part_weight_kg + input.stock_volume_cm3; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.material_type + input.part_weight_kg + input.stock_volume_cm3; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCnc_machining_cost_calculator(input: Cnc_machining_cost_calculatorInput): Cnc_machining_cost_calculatorOutput {
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


export interface Cnc_machining_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
