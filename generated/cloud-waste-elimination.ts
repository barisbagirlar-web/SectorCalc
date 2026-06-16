// Auto-generated from cloud-waste-elimination-schema.json
import * as z from 'zod';

export interface Cloud_waste_eliminationInput {
  total_cloud_spend: number;
  compute_utilization_rate: number;
  storage_waste_percentage: number;
  idle_resource_count: number;
  data_transfer_out_gb: number;
  reserved_instance_coverage: number;
  rightsizing_opportunity_score: number;
  cloud_provider: string;
  include_network_waste: boolean;
}

export const Cloud_waste_eliminationInputSchema = z.object({
  total_cloud_spend: z.number().min(0).max(10000000).default(100000),
  compute_utilization_rate: z.number().min(0).max(100).default(45),
  storage_waste_percentage: z.number().min(0).max(100).default(20),
  idle_resource_count: z.number().min(0).max(1000).default(15),
  data_transfer_out_gb: z.number().min(0).max(1000000).default(5000),
  reserved_instance_coverage: z.number().min(0).max(100).default(30),
  rightsizing_opportunity_score: z.number().min(0).max(100).default(60),
  cloud_provider: z.enum(['AWS', 'Azure', 'GCP', 'Other']).default('AWS'),
  include_network_waste: z.boolean().default(true),
});

function evaluateAllFormulas(input: Cloud_waste_eliminationInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.total_cloud_spend * (1 - input.compute_utilization_rate / 100) * 0.6; results["compute_waste_cost"] = Number.isFinite(v) ? v : 0; } catch { results["compute_waste_cost"] = 0; }
  try { const v = input.total_cloud_spend * (input.storage_waste_percentage / 100) * 0.15; results["storage_waste_cost"] = Number.isFinite(v) ? v : 0; } catch { results["storage_waste_cost"] = 0; }
  try { const v = input.idle_resource_count * 150; results["idle_resource_cost"] = Number.isFinite(v) ? v : 0; } catch { results["idle_resource_cost"] = 0; }
  try { const v = input.include_network_waste ? (input.data_transfer_out_gb * 0.08) : 0; results["network_waste_cost"] = Number.isFinite(v) ? v : 0; } catch { results["network_waste_cost"] = 0; }
  try { const v = input.total_cloud_spend * (input.rightsizing_opportunity_score / 100) * 0.25; results["rightsizing_savings_potential"] = Number.isFinite(v) ? v : 0; } catch { results["rightsizing_savings_potential"] = 0; }
  try { const v = input.total_cloud_spend * (0.6 - input.reserved_instance_coverage / 100) * 0.3; results["reserved_instance_savings_gap"] = Number.isFinite(v) ? v : 0; } catch { results["reserved_instance_savings_gap"] = 0; }
  try { const v = (results["compute_waste_cost"] ?? 0) + (results["storage_waste_cost"] ?? 0) + (results["idle_resource_cost"] ?? 0) + (results["network_waste_cost"] ?? 0); results["total_waste_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_waste_cost"] = 0; }
  return results;
}


export function calculateCloud_waste_elimination(input: Cloud_waste_eliminationInput): Cloud_waste_eliminationOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_waste_cost"] ?? 0;
  const breakdown = {
    compute_waste_cost: values["compute_waste_cost"] ?? 0,
    storage_waste_cost: values["storage_waste_cost"] ?? 0,
    idle_resource_cost: values["idle_resource_cost"] ?? 0,
    network_waste_cost: values["network_waste_cost"] ?? 0,
    rightsizing_savings_potential: values["rightsizing_savings_potential"] ?? 0,
    reserved_instance_savings_gap: values["reserved_instance_savings_gap"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unattached EBS volumes or orphaned snapshots incurring costs.","Instances with CPU/memory far above actual workload requirements.","Allocated but unused public IP addresses.","Cross-region or inter-AZ traffic that could be optimized.","Reserved instances that have expired and are running on-demand."];
  const suggestedActions: string[] = ["Implement auto-scaling and rightsizing policies for compute instances.","Set up lifecycle policies to delete or archive unused storage volumes.","Automate shutdown of idle resources using scheduling or idle detection.","Increase reserved instance coverage to at least 60% of compute spend.","Review and optimize data transfer paths; use CDN or direct connect where possible."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Anomaly detection","Multi-cloud comparison"],
  };
}


export interface Cloud_waste_eliminationOutput {
  totalWasteCost: number;
  breakdown: { compute_waste_cost: number; storage_waste_cost: number; idle_resource_cost: number; network_waste_cost: number; rightsizing_savings_potential: number; reserved_instance_savings_gap: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
