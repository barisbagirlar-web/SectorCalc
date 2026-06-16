// Auto-generated from haccp-deviation-cost-schema.json
import * as z from 'zod';

export interface Haccp_deviation_costInput {
  deviation_type: string;
  affected_batch_kg: number;
  unit_cost_per_kg: number;
  rework_percentage: number;
  rework_cost_per_kg: number;
  downtime_hours: number;
  hourly_overhead_rate: number;
  regulatory_penalty_flag: boolean;
  base_penalty_amount: number;
  recall_cost_flag: boolean;
  recall_fixed_cost: number;
  recall_variable_per_kg: number;
  data_confidence: number;
}

export const Haccp_deviation_costInputSchema = z.object({
  deviation_type: z.enum(['temperature', 'time', 'cross_contamination', 'chemical', 'allergen', 'other']).default('temperature'),
  affected_batch_kg: z.number().min(0).max(100000).default(1000),
  unit_cost_per_kg: z.number().min(0).max(1000).default(5),
  rework_percentage: z.number().min(0).max(100).default(30),
  rework_cost_per_kg: z.number().min(0).max(500).default(2),
  downtime_hours: z.number().min(0).max(168).default(2),
  hourly_overhead_rate: z.number().min(0).max(10000).default(500),
  regulatory_penalty_flag: z.boolean().default(false),
  base_penalty_amount: z.number().min(0).max(10000000).default(10000),
  recall_cost_flag: z.boolean().default(false),
  recall_fixed_cost: z.number().min(0).max(5000000).default(50000),
  recall_variable_per_kg: z.number().min(0).max(100).default(1),
  data_confidence: z.number().min(0).max(1).default(0.85),
});

function evaluateAllFormulas(input: Haccp_deviation_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.affected_batch_kg * (1 - input.rework_percentage/100) * input.unit_cost_per_kg; results["material_loss_cost"] = Number.isFinite(v) ? v : 0; } catch { results["material_loss_cost"] = 0; }
  try { const v = input.affected_batch_kg * (input.rework_percentage/100) * input.rework_cost_per_kg; results["rework_cost"] = Number.isFinite(v) ? v : 0; } catch { results["rework_cost"] = 0; }
  try { const v = input.downtime_hours * input.hourly_overhead_rate; results["downtime_cost"] = Number.isFinite(v) ? v : 0; } catch { results["downtime_cost"] = 0; }
  try { const v = input.regulatory_penalty_flag ? input.base_penalty_amount : 0; results["regulatory_penalty_cost"] = Number.isFinite(v) ? v : 0; } catch { results["regulatory_penalty_cost"] = 0; }
  try { const v = input.recall_cost_flag ? (input.recall_fixed_cost + input.affected_batch_kg * input.recall_variable_per_kg) : 0; results["recall_cost"] = Number.isFinite(v) ? v : 0; } catch { results["recall_cost"] = 0; }
  try { const v = (results["material_loss_cost"] ?? 0); results["waste_cost"] = Number.isFinite(v) ? v : 0; } catch { results["waste_cost"] = 0; }
  try { const v = (results["material_loss_cost"] ?? 0) + (results["rework_cost"] ?? 0) + (results["downtime_cost"] ?? 0) + (results["regulatory_penalty_cost"] ?? 0) + (results["recall_cost"] ?? 0); results["total_deviation_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_deviation_cost"] = 0; }
  return results;
}


export function calculateHaccp_deviation_cost(input: Haccp_deviation_costInput): Haccp_deviation_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_deviation_cost"] ?? 0;
  const breakdown = {
    material_loss_cost: values["material_loss_cost"] ?? 0,
    rework_cost: values["rework_cost"] ?? 0,
    downtime_cost: values["downtime_cost"] ?? 0,
    regulatory_penalty_cost: values["regulatory_penalty_cost"] ?? 0,
    recall_cost: values["recall_cost"] ?? 0,
    waste_cost: values["waste_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Brand Damage Multiplier","Customer Compensation","Increased Inspection Cost"];
  const suggestedActions: string[] = ["Perform Root Cause Analysis (RCA)","Update HACCP Plan","Retrain Personnel","Implement Corrective and Preventive Actions (CAPA)","Notify Regulatory Authorities if Required"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Automated CAPA generation"],
  };
}


export interface Haccp_deviation_costOutput {
  totalWasteCost: number;
  breakdown: { material_loss_cost: number; rework_cost: number; downtime_cost: number; regulatory_penalty_cost: number; recall_cost: number; waste_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
