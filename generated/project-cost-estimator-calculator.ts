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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Project_cost_estimator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.use_lean_standardization * input.material_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.use_lean_standardization * input.material_cost * (1 + (input.labor_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.use_lean_standardization * input.material_cost * (1 + (input.labor_rate / 100)) * (input.labor_hours); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.labor_hours; results["factor_labor_hours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_labor_hours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProject_cost_estimator_calculator(input: Project_cost_estimator_calculatorInput): Project_cost_estimator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
