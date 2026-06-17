// @ts-nocheck
// Auto-generated from project-cost-estimator-calculator-schema.json
import * as z from 'zod';

export interface Project_cost_estimator_calculatorInput {
  labor_hours: number;
  labor_rate: number;
  material_cost: number;
  equipment_cost: number;
  overhead_percentage: number;
  complexity_factor: string;
  quality_level: string;
  use_lean_standardization: boolean;
}

export const Project_cost_estimator_calculatorInputSchema = z.object({
  labor_hours: z.number().min(0).max(100000).default(1000),
  labor_rate: z.number().min(0).max(500).default(45),
  material_cost: z.number().min(0).max(10000000).default(50000),
  equipment_cost: z.number().min(0).max(5000000).default(15000),
  overhead_percentage: z.number().min(0).max(100).default(15),
  complexity_factor: z.enum(['low', 'medium', 'high']).default('medium'),
  quality_level: z.enum(['3', '4', '5', '6']).default('3'),
  use_lean_standardization: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Project_cost_estimator_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.labor_hours + input.labor_rate + input.material_cost; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.labor_hours + input.labor_rate + input.material_cost; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateProject_cost_estimator_calculator(input: Project_cost_estimator_calculatorInput): Project_cost_estimator_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Benchmarking against industry standards"],
  };
}


export interface Project_cost_estimator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
