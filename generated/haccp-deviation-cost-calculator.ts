// Auto-generated from haccp-deviation-cost-calculator-schema.json
import * as z from 'zod';

export interface Haccp_deviation_cost_calculatorInput {
  deviation_type: string;
  affected_batch_kg: number;
  unit_cost_per_kg: number;
  rework_percentage: number;
  rework_cost_per_kg: number;
  downtime_hours: number;
  hourly_overhead_rate: number;
  regulatory_penalty_flag: boolean;
  dataConfidence?: number;
}

export const Haccp_deviation_cost_calculatorInputSchema = z.object({
  deviation_type: z.enum(['temperature', 'time', 'cross_contamination', 'chemical', 'allergen', 'other']).default('temperature'),
  affected_batch_kg: z.number().min(0).max(100000).default(1000),
  unit_cost_per_kg: z.number().min(0).max(1000).default(5),
  rework_percentage: z.number().min(0).max(100).default(30),
  rework_cost_per_kg: z.number().min(0).max(500).default(2),
  downtime_hours: z.number().min(0).max(168).default(2),
  hourly_overhead_rate: z.number().min(0).max(10000).default(500),
  regulatory_penalty_flag: z.boolean().default(false),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Haccp_deviation_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.regulatory_penalty_flag * input.unit_cost_per_kg; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.regulatory_penalty_flag * input.unit_cost_per_kg * (1 + (input.rework_percentage / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.regulatory_penalty_flag * input.unit_cost_per_kg * (1 + (input.rework_percentage / 100)) * (input.affected_batch_kg); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.affected_batch_kg; results["factor_affected_batch_kg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_affected_batch_kg"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHaccp_deviation_cost_calculator(input: Haccp_deviation_cost_calculatorInput): Haccp_deviation_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Automated CAPA generation"],
  };
}


export interface Haccp_deviation_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
