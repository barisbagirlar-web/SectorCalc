// @ts-nocheck
// Auto-generated from fabric-cutting-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Fabric_cutting_optimizer_calculatorInput {
  fabric_width: number;
  fabric_length: number;
  pattern_length: number;
  pattern_width: number;
  quantity: number;
  cutting_method: string;
  material_cost_per_m2: number;
  labor_rate_per_hour: number;
}

export const Fabric_cutting_optimizer_calculatorInputSchema = z.object({
  fabric_width: z.number().min(50).max(320).default(150),
  fabric_length: z.number().min(10).max(500).default(100),
  pattern_length: z.number().min(10).max(200).default(120),
  pattern_width: z.number().min(5).max(150).default(60),
  quantity: z.number().min(1).max(100000).default(500),
  cutting_method: z.enum(['single_ply', 'multi_ply', 'laser']).default('single_ply'),
  material_cost_per_m2: z.number().min(0.5).max(200).default(12.5),
  labor_rate_per_hour: z.number().min(5).max(100).default(25),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fabric_cutting_optimizer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.fabric_width + input.fabric_length + input.pattern_length; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.fabric_width + input.fabric_length + input.pattern_length; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFabric_cutting_optimizer_calculator(input: Fabric_cutting_optimizer_calculatorInput): Fabric_cutting_optimizer_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-roll nesting","Real-time waste tracking"],
  };
}


export interface Fabric_cutting_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
