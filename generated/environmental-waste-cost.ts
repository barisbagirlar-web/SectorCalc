// Auto-generated from environmental-waste-cost-schema.json
import * as z from 'zod';

export interface Environmental_waste_costInput {
  waste_type: string;
  waste_volume_kg: number;
  disposal_cost_per_kg: number;
  transport_distance_km: number;
  transport_cost_per_km: number;
  labor_hours_per_ton: number;
  labor_rate_per_hour: number;
  recycling_revenue_per_kg: number;
  recycling_rate: number;
  carbon_cost_per_kg_co2: number;
  emission_factor_kg_co2_per_kg_waste: number;
  compliance_penalty_per_kg: number;
  waste_volume_limit_kg: number;
}

export const Environmental_waste_costInputSchema = z.object({
  waste_type: z.enum(['mixed_solid', 'hazardous', 'organic', 'recyclable', 'e_waste']).default('mixed_solid'),
  waste_volume_kg: z.number().min(0).max(1000000).default(1000),
  disposal_cost_per_kg: z.number().min(0).max(10).default(0.15),
  transport_distance_km: z.number().min(0).max(5000).default(50),
  transport_cost_per_km: z.number().min(0).max(100).default(2.5),
  labor_hours_per_ton: z.number().min(0).max(50).default(2),
  labor_rate_per_hour: z.number().min(0).max(200).default(25),
  recycling_revenue_per_kg: z.number().min(0).max(5).default(0.05),
  recycling_rate: z.number().min(0).max(100).default(30),
  carbon_cost_per_kg_co2: z.number().min(0).max(1).default(0.05),
  emission_factor_kg_co2_per_kg_waste: z.number().min(0).max(10).default(0.5),
  compliance_penalty_per_kg: z.number().min(0).max(50).default(0.1),
  waste_volume_limit_kg: z.number().min(0).max(1000000).default(5000),
});

function evaluateAllFormulas(input: Environmental_waste_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["disposal_cost"] = input.waste_volume_kg * input.disposal_cost_per_kg; } catch { results["disposal_cost"] = 0; }
  try { results["transport_cost"] = input.transport_distance_km * input.transport_cost_per_km * (input.waste_volume_kg / 1000); } catch { results["transport_cost"] = 0; }
  try { results["labor_cost"] = (input.waste_volume_kg / 1000) * input.labor_hours_per_ton * input.labor_rate_per_hour; } catch { results["labor_cost"] = 0; }
  try { results["recycling_revenue"] = input.waste_volume_kg * (input.recycling_rate / 100) * input.recycling_revenue_per_kg; } catch { results["recycling_revenue"] = 0; }
  try { results["carbon_cost"] = input.waste_volume_kg * input.emission_factor_kg_co2_per_kg_waste * input.carbon_cost_per_kg_co2; } catch { results["carbon_cost"] = 0; }
  try { results["compliance_penalty"] = Math.max(0, (input.waste_volume_kg - input.waste_volume_limit_kg)) * input.compliance_penalty_per_kg; } catch { results["compliance_penalty"] = 0; }
  try { results["total_waste_cost"] = (results["disposal_cost"] ?? 0) + (results["transport_cost"] ?? 0) + (results["labor_cost"] ?? 0) + (results["carbon_cost"] ?? 0) + (results["compliance_penalty"] ?? 0) - (results["recycling_revenue"] ?? 0); } catch { results["total_waste_cost"] = 0; }
  return results;
}


export function calculateEnvironmental_waste_cost(input: Environmental_waste_costInput): Environmental_waste_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_waste_cost"] ?? 0;
  const breakdown = {
    disposal_cost: values["disposal_cost"] ?? 0,
    transport_cost: values["transport_cost"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    recycling_revenue: values["recycling_revenue"] ?? 0,
    carbon_cost: values["carbon_cost"] ?? 0,
    compliance_penalty: values["compliance_penalty"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Inefficient Sorting","Excessive Transport Distance","High Emission Factor"];
  const suggestedActions: string[] = ["Increase Recycling Rate","Optimize Transport Routes","Reduce Waste Volume","Audit Compliance Limits"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-site comparison"],
  };
}


export interface Environmental_waste_costOutput {
  totalWasteCost: number;
  breakdown: { disposal_cost: number; transport_cost: number; labor_cost: number; recycling_revenue: number; carbon_cost: number; compliance_penalty: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
