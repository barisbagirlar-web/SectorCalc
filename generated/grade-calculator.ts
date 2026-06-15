// Auto-generated from grade-calculator-schema.json
import * as z from 'zod';

export interface Grade_calculatorInput {
  defect_rate: number;
  throughput: number;
  planned_throughput: number;
  cost_per_unit: number;
  target_cost_per_unit: number;
  safety_incidents: number;
  on_time_delivery_pct: number;
  shift_type: string;
  oee_override: boolean;
  manual_oee: number;
}

export const Grade_calculatorInputSchema = z.object({
  defect_rate: z.number().min(0).max(100000).default(5000),
  throughput: z.number().min(0).max(10000).default(100),
  planned_throughput: z.number().min(1).max(10000).default(120),
  cost_per_unit: z.number().min(0).max(10000).default(50),
  target_cost_per_unit: z.number().min(0.01).max(10000).default(45),
  safety_incidents: z.number().min(0).max(1000).default(2),
  on_time_delivery_pct: z.number().min(0).max(100).default(95),
  shift_type: z.enum(['day', 'night', 'rotating']).default('day'),
  oee_override: z.boolean().default(false),
  manual_oee: z.number().min(0).max(100).default(85),
});

function evaluateAllFormulas(input: Grade_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["quality_score"] = Math.max(0, 100 - (input.defect_rate / 1000)); } catch { results["quality_score"] = 0; }
  results["oee"] = 0;
  try { results["cost_efficiency"] = Math.min(100, (input.target_cost_per_unit / input.cost_per_unit) * 100); } catch { results["cost_efficiency"] = 0; }
  try { results["safety_score"] = Math.max(0, 100 - (input.safety_incidents * 10) - (input.shift_type == 'night' ? 5 : 0)); } catch { results["safety_score"] = 0; }
  try { results["delivery_score"] = input.on_time_delivery_pct; } catch { results["delivery_score"] = 0; }
  try { results["weighted_grade"] = ((results["quality_score"] ?? 0) * 0.2) + ((results["oee"] ?? 0) * 0.2) + ((results["cost_efficiency"] ?? 0) * 0.2) + ((results["safety_score"] ?? 0) * 0.2) + ((results["delivery_score"] ?? 0) * 0.2); } catch { results["weighted_grade"] = 0; }
  results["data_confidence_adjusted"] = 0;
  return results;
}


export function calculateGrade_calculator(input: Grade_calculatorInput): Grade_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overall_grade"] ?? 0;
  const breakdown = {
    quality_score: values["quality_score"] ?? 0,
    oee: values["oee"] ?? 0,
    cost_efficiency: values["cost_efficiency"] ?? 0,
    safety_score: values["safety_score"] ?? 0,
    delivery_score: values["delivery_score"] ?? 0,
    weighted_grade: values["weighted_grade"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Low Quality","Low OEE","High Cost","Safety Risk","Delivery Failure"];
  const suggestedActions: string[] = ["Implement Six Sigma DMAIC project to reduce defect rate. Consider root cause analysis and SPC.","Conduct TPM (Total Productive Maintenance) and reduce changeover times using SMED.","Perform value stream mapping to identify waste. Target material and labor cost reduction.","Review safety protocols, increase training, and implement near-miss reporting per ISO 45001.","Analyze supply chain lead times, implement Kanban or pull system to improve on-time delivery."];
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
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Custom weighting profiles"],
  };
}


export interface Grade_calculatorOutput {
  totalWasteCost: number;
  breakdown: { quality_score: number; oee: number; cost_efficiency: number; safety_score: number; delivery_score: number; weighted_grade: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
