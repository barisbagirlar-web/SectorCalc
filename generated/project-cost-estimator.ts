// Auto-generated from project-cost-estimator-schema.json
import * as z from 'zod';

export interface Project_cost_estimatorInput {
  labor_hours: number;
  labor_rate: number;
  material_cost: number;
  equipment_cost: number;
  overhead_percentage: number;
  complexity_factor: string;
  quality_level: string;
  use_lean_standardization: boolean;
}

export const Project_cost_estimatorInputSchema = z.object({
  labor_hours: z.number().min(0).max(100000).default(1000),
  labor_rate: z.number().min(0).max(500).default(45),
  material_cost: z.number().min(0).max(10000000).default(50000),
  equipment_cost: z.number().min(0).max(5000000).default(15000),
  overhead_percentage: z.number().min(0).max(100).default(15),
  complexity_factor: z.enum(['low', 'medium', 'high']).default('medium'),
  quality_level: z.enum(['3', '4', '5', '6']).default('3'),
  use_lean_standardization: z.boolean().default(false),
});

function evaluateAllFormulas(input: Project_cost_estimatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["direct_labor_cost"] = input.labor_hours * input.labor_rate; } catch { results["direct_labor_cost"] = 0; }
  try { results["direct_material_cost"] = input.material_cost * (1 - ((input.use_lean_standardization) ? (0.05) : (0))); } catch { results["direct_material_cost"] = 0; }
  try { results["direct_equipment_cost"] = input.equipment_cost; } catch { results["direct_equipment_cost"] = 0; }
  try { results["total_direct_cost"] = (results["direct_labor_cost"] ?? 0) + (results["direct_material_cost"] ?? 0) + (results["direct_equipment_cost"] ?? 0); } catch { results["total_direct_cost"] = 0; }
  try { results["overhead_cost"] = (results["total_direct_cost"] ?? 0) * (input.overhead_percentage / 100); } catch { results["overhead_cost"] = 0; }
  try { results["complexity_multiplier"] = (input.complexity_factor === 'low' ? 1.0 : (input.complexity_factor === 'medium' ? 1.15 : (input.complexity_factor === 'high' ? 1.35 : 0))); } catch { results["complexity_multiplier"] = 0; }
  try { results["quality_adjustment"] = (input.quality_level === '3' ? 1.0 : (input.quality_level === '4' ? 0.95 : (input.quality_level === '5' ? 0.90 : (input.quality_level === '6' ? 0.85 : 0)))); } catch { results["quality_adjustment"] = 0; }
  try { results["primaryResult"] = ((results["total_direct_cost"] ?? 0) + (results["overhead_cost"] ?? 0)) * (results["complexity_multiplier"] ?? 0) * (results["quality_adjustment"] ?? 0); } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateProject_cost_estimator(input: Project_cost_estimatorInput): Project_cost_estimatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? 0;
  const breakdown = {
    directLaborCost: values["directLaborCost"] ?? 0,
    directMaterialCost: values["directMaterialCost"] ?? 0,
    directEquipmentCost: values["directEquipmentCost"] ?? 0,
    totalDirectCost: values["totalDirectCost"] ?? 0,
    overheadCost: values["overheadCost"] ?? 0,
    complexityMultiplier: values["complexityMultiplier"] ?? 0,
    qualityAdjustment: values["qualityAdjustment"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Rework Cost Estimate","Lean Waste Factor","Schedule Risk Premium"];
  const suggestedActions: string[] = ["Consider applying Lean standardization to reduce labor and material costs by up to 5%.","Improve quality level to 5 or 6 Sigma to reduce rework and hidden costs.","Break down project into smaller phases to reduce complexity multiplier.","Review overhead allocation; consider activity-based costing for more accuracy."];
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


export interface Project_cost_estimatorOutput {
  totalWasteCost: number;
  breakdown: { directLaborCost: number; directMaterialCost: number; directEquipmentCost: number; totalDirectCost: number; overheadCost: number; complexityMultiplier: number; qualityAdjustment: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
