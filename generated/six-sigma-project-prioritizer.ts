// Auto-generated from six-sigma-project-prioritizer-schema.json
import * as z from 'zod';

export interface Six_sigma_project_prioritizerInput {
  defect_rate: number;
  process_sigma: number;
  annual_volume: number;
  cost_per_defect: number;
  implementation_cost: number;
  project_risk: string;
  strategic_alignment: number;
  customer_impact: number;
  data_confidence: number;
}

export const Six_sigma_project_prioritizerInputSchema = z.object({
  defect_rate: z.number().min(0).max(1000000).default(50000),
  process_sigma: z.number().min(0.5).max(6).default(3),
  annual_volume: z.number().min(100).max(1000000000).default(100000),
  cost_per_defect: z.number().min(0.01).max(100000).default(50),
  implementation_cost: z.number().min(0).max(10000000).default(50000),
  project_risk: z.enum(['low', 'medium', 'high']).default('medium'),
  strategic_alignment: z.number().min(1).max(10).default(7),
  customer_impact: z.number().min(1).max(10).default(8),
  data_confidence: z.number().min(0).max(100).default(80),
});

function evaluateAllFormulas(input: Six_sigma_project_prioritizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_volume * (input.defect_rate / 1000000); results["current_defects"] = Number.isFinite(v) ? v : 0; } catch { results["current_defects"] = 0; }
  try { const v = (results["current_defects"] ?? 0) * input.cost_per_defect; results["current_copq"] = Number.isFinite(v) ? v : 0; } catch { results["current_copq"] = 0; }
  try { const v = input.annual_volume * (3.4 / 1000000); results["target_defects"] = Number.isFinite(v) ? v : 0; } catch { results["target_defects"] = 0; }
  try { const v = (results["target_defects"] ?? 0) * input.cost_per_defect; results["target_copq"] = Number.isFinite(v) ? v : 0; } catch { results["target_copq"] = 0; }
  try { const v = (results["current_copq"] ?? 0) - (results["target_copq"] ?? 0); results["annual_savings"] = Number.isFinite(v) ? v : 0; } catch { results["annual_savings"] = 0; }
  try { const v = (((results["annual_savings"] ?? 0) - input.implementation_cost) / input.implementation_cost) * 100; results["roi"] = Number.isFinite(v) ? v : 0; } catch { results["roi"] = 0; }
  results["priority_score"] = 0;
  return results;
}


export function calculateSix_sigma_project_prioritizer(input: Six_sigma_project_prioritizerInput): Six_sigma_project_prioritizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["priority_score"] ?? 0;
  const breakdown = {
    current_defects: values["current_defects"] ?? 0,
    current_copq: values["current_copq"] ?? 0,
    target_defects: values["target_defects"] ?? 0,
    target_copq: values["target_copq"] ?? 0,
    annual_savings: values["annual_savings"] ?? 0,
    roi: values["roi"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["High Defect Rate","Low Sigma Level","High Cost of Poor Quality"];
  const suggestedActions: string[] = ["Implement SPC and DMAIC","Conduct Root Cause Analysis","Six Sigma Training for Team","Run Pilot Project"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Six_sigma_project_prioritizerOutput {
  totalWasteCost: number;
  breakdown: { current_defects: number; current_copq: number; target_defects: number; target_copq: number; annual_savings: number; roi: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
