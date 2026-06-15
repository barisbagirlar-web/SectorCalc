// Auto-generated from saas-shelfware-cost-schema.json
import * as z from 'zod';

export interface Saas_shelfware_costInput {
  total_licenses: number;
  active_users: number;
  license_cost_per_month: number;
  implementation_cost: number;
  monthly_support_cost: number;
  contract_months_remaining: number;
  utilization_threshold: number;
}

export const Saas_shelfware_costInputSchema = z.object({
  total_licenses: z.number().min(1).max(100000).default(100),
  active_users: z.number().min(0).max(100000).default(60),
  license_cost_per_month: z.number().min(0).max(10000).default(50),
  implementation_cost: z.number().min(0).max(500000).default(5000),
  monthly_support_cost: z.number().min(0).max(50000).default(2000),
  contract_months_remaining: z.number().min(1).max(60).default(12),
  utilization_threshold: z.number().min(0).max(100).default(80),
});

function evaluateAllFormulas(input: Saas_shelfware_costInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["active_utilization_rate"] = (input.active_users / input.total_licenses) * 100; } catch { results["active_utilization_rate"] = 0; }
  try { results["shelfware_licenses"] = Math.max(0, input.total_licenses - (input.active_users * (100 / input.utilization_threshold))); } catch { results["shelfware_licenses"] = 0; }
  try { results["monthly_shelfware_cost"] = (results["shelfware_licenses"] ?? 0) * input.license_cost_per_month; } catch { results["monthly_shelfware_cost"] = 0; }
  try { results["total_waste_cost"] = ((results["monthly_shelfware_cost"] ?? 0) * input.contract_months_remaining) + (input.implementation_cost * ((results["shelfware_licenses"] ?? 0) / input.total_licenses)); } catch { results["total_waste_cost"] = 0; }
  try { results["waste_percentage_of_total"] = ((results["total_waste_cost"] ?? 0) / ((input.total_licenses * input.license_cost_per_month * input.contract_months_remaining) + input.implementation_cost + (input.monthly_support_cost * input.contract_months_remaining))) * 100; } catch { results["waste_percentage_of_total"] = 0; }
  try { results["shelfware_ratio"] = (results["shelfware_licenses"] ?? 0) / input.total_licenses; } catch { results["shelfware_ratio"] = 0; }
  try { results["data_confidence_adjusted_waste"] = (results["total_waste_cost"] ?? 0) * 0.9; } catch { results["data_confidence_adjusted_waste"] = 0; }
  return results;
}


export function calculateSaas_shelfware_cost(input: Saas_shelfware_costInput): Saas_shelfware_costOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_waste_cost"] ?? 0;
  const breakdown = {
    active_utilization_rate: values["active_utilization_rate"] ?? 0,
    shelfware_licenses: values["shelfware_licenses"] ?? 0,
    monthly_shelfware_cost: values["monthly_shelfware_cost"] ?? 0,
    waste_percentage_of_total: values["waste_percentage_of_total"] ?? 0,
    shelfware_ratio: values["shelfware_ratio"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Underutilized Enterprise Plans","Auto-Renewal Inertia","Shadow IT Duplication"];
  const suggestedActions: string[] = ["Renegotiate Contract","Implement Usage Monitoring","Consolidate Redundant Tools","Increase User Adoption"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-department roll-up","Automated alerting via email"],
  };
}


export interface Saas_shelfware_costOutput {
  totalWasteCost: number;
  breakdown: { active_utilization_rate: number; shelfware_licenses: number; monthly_shelfware_cost: number; waste_percentage_of_total: number; shelfware_ratio: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
