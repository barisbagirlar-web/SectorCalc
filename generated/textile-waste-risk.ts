// Auto-generated from textile-waste-risk-schema.json
import * as z from 'zod';

export interface Textile_waste_riskInput {
  production_volume_meters: number;
  fabric_type: string;
  waste_percentage: number;
  rework_rate: number;
  defect_density: number;
  energy_cost_per_kwh: number;
  labor_cost_per_hour: number;
  recycling_capability: string;
  iso_14001_certified: boolean;
}

export const Textile_waste_riskInputSchema = z.object({
  production_volume_meters: z.number().min(0).max(10000000).default(100000),
  fabric_type: z.enum(['cotton', 'polyester', 'blend', 'denim', 'knit']).default('cotton'),
  waste_percentage: z.number().min(0).max(100).default(8.5),
  rework_rate: z.number().min(0).max(100).default(3),
  defect_density: z.number().min(0).max(1000).default(12),
  energy_cost_per_kwh: z.number().min(0).max(1).default(0.12),
  labor_cost_per_hour: z.number().min(0).max(100).default(15),
  recycling_capability: z.enum(['none', 'low', 'medium', 'high']).default('low'),
  iso_14001_certified: z.boolean().default(false),
});

function evaluateAllFormulas(input: Textile_waste_riskInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["material_waste_cost"] = input.production_volume_meters * (input.waste_percentage / 100) * 0.5; } catch { results["material_waste_cost"] = 0; }
  try { results["rework_labor_cost"] = input.production_volume_meters * (input.rework_rate / 100) * 0.1 * input.labor_cost_per_hour; } catch { results["rework_labor_cost"] = 0; }
  try { results["energy_waste_cost"] = (input.defect_density / 1000) * input.production_volume_meters * 0.05 * input.energy_cost_per_kwh; } catch { results["energy_waste_cost"] = 0; }
  try { results["waste_disposal_cost"] = input.production_volume_meters * (input.waste_percentage / 100) * (1 - recycling_factor(input.recycling_capability)) * 0.02; } catch { results["waste_disposal_cost"] = 0; }
  try { results["total_waste_cost"] = (results["material_waste_cost"] ?? 0) + (results["rework_labor_cost"] ?? 0) + (results["energy_waste_cost"] ?? 0) + (results["waste_disposal_cost"] ?? 0); } catch { results["total_waste_cost"] = 0; }
  try { results["waste_risk_index"] = Math.min(100, (input.waste_percentage * 3 + input.rework_rate * 2 + input.defect_density * 0.5)); } catch { results["waste_risk_index"] = 0; }
  try { results["data_confidence_adjusted"] = (results["waste_risk_index"] ?? 0) * (1 - 0.1 * input.iso_14001_certified - 0.05 * recycling_factor(input.recycling_capability)); } catch { results["data_confidence_adjusted"] = 0; }
  return results;
}


export function calculateTextile_waste_risk(input: Textile_waste_riskInput): Textile_waste_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["waste_risk_index"] ?? 0;
  const breakdown = {
    material_waste_cost: values["material_waste_cost"] ?? 0,
    rework_labor_cost: values["rework_labor_cost"] ?? 0,
    energy_waste_cost: values["energy_waste_cost"] ?? 0,
    waste_disposal_cost: values["waste_disposal_cost"] ?? 0,
    total_waste_cost: values["total_waste_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Material Allowance","Setup/Changeover Loss","Idle Time Waste"];
  const suggestedActions: string[] = ["Implement Lean Six Sigma DMAIC","Upgrade Recycling Capability","Obtain ISO 14001 Certification","Defect Reduction Program"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Real-time dashboard"],
  };
}


export interface Textile_waste_riskOutput {
  totalWasteCost: number;
  breakdown: { material_waste_cost: number; rework_labor_cost: number; energy_waste_cost: number; waste_disposal_cost: number; total_waste_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
