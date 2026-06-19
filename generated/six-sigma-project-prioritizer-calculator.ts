// Auto-generated from six-sigma-project-prioritizer-calculator-schema.json
import * as z from 'zod';

export interface Six_sigma_project_prioritizer_calculatorInput {
  defect_rate: number;
  process_sigma: number;
  annual_volume: number;
  cost_per_defect: number;
  implementation_cost: number;
  project_risk: string;
  strategic_alignment: number;
  customer_impact: number;
  dataConfidence?: number;
}

export const Six_sigma_project_prioritizer_calculatorInputSchema = z.object({
  defect_rate: z.number().min(0).max(1000000).default(50000),
  process_sigma: z.number().min(0.5).max(6).default(3),
  annual_volume: z.number().min(100).max(1000000000).default(100000),
  cost_per_defect: z.number().min(0.01).max(100000).default(50),
  implementation_cost: z.number().min(0).max(10000000).default(50000),
  project_risk: z.enum(['low', 'medium', 'high']).default('medium'),
  strategic_alignment: z.number().min(1).max(10).default(7),
  customer_impact: z.number().min(1).max(10).default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Six_sigma_project_prioritizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_volume * input.cost_per_defect; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.annual_volume * input.cost_per_defect * (1 + (input.defect_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.annual_volume * input.cost_per_defect * (1 + (input.defect_rate / 100)) * (input.process_sigma); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.process_sigma; results["factor_process_sigma"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_process_sigma"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSix_sigma_project_prioritizer_calculator(input: Six_sigma_project_prioritizer_calculatorInput): Six_sigma_project_prioritizer_calculatorOutput {
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


export interface Six_sigma_project_prioritizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
