// Auto-generated from fabric-cutting-optimizer-schema.json
import * as z from 'zod';

export interface Fabric_cutting_optimizerInput {
  fabric_width: number;
  fabric_length: number;
  pattern_length: number;
  pattern_width: number;
  quantity: number;
  cutting_method: string;
  material_cost_per_m2: number;
  labor_rate_per_hour: number;
  allowance_percentage: number;
  use_nesting: boolean;
}

export const Fabric_cutting_optimizerInputSchema = z.object({
  fabric_width: z.number().min(50).max(320).default(150),
  fabric_length: z.number().min(10).max(500).default(100),
  pattern_length: z.number().min(10).max(200).default(120),
  pattern_width: z.number().min(5).max(150).default(60),
  quantity: z.number().min(1).max(100000).default(500),
  cutting_method: z.enum(['single_ply', 'multi_ply', 'laser']).default('single_ply'),
  material_cost_per_m2: z.number().min(0.5).max(200).default(12.5),
  labor_rate_per_hour: z.number().min(5).max(100).default(25),
  allowance_percentage: z.number().min(0).max(15).default(3),
  use_nesting: z.boolean().default(true),
});

function evaluateAllFormulas(input: Fabric_cutting_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.pattern_length * input.pattern_width) / 10000; results["pattern_area"] = Number.isFinite(v) ? v : 0; } catch { results["pattern_area"] = 0; }
  try { const v = (results["pattern_area"] ?? 0) * input.quantity; results["total_pattern_area"] = Number.isFinite(v) ? v : 0; } catch { results["total_pattern_area"] = 0; }
  try { const v = (input.fabric_width * input.fabric_length) / 10000; results["fabric_area"] = Number.isFinite(v) ? v : 0; } catch { results["fabric_area"] = 0; }
  try { const v = 1 + (input.allowance_percentage / 100); results["allowance_factor"] = Number.isFinite(v) ? v : 0; } catch { results["allowance_factor"] = 0; }
  try { const v = (results["total_pattern_area"] ?? 0) * (results["allowance_factor"] ?? 0); results["adjusted_pattern_area"] = Number.isFinite(v) ? v : 0; } catch { results["adjusted_pattern_area"] = 0; }
  try { const v = ((results["adjusted_pattern_area"] ?? 0) / (results["fabric_area"] ?? 0)) * 100; results["fabric_utilization"] = Number.isFinite(v) ? v : 0; } catch { results["fabric_utilization"] = 0; }
  try { const v = 100 - (results["fabric_utilization"] ?? 0); results["waste_percentage"] = Number.isFinite(v) ? v : 0; } catch { results["waste_percentage"] = 0; }
  try { const v = (results["fabric_area"] ?? 0) * input.material_cost_per_m2; results["total_material_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_material_cost"] = 0; }
  try { const v = input.cutting_method == 'single_ply' ? input.quantity * 0.02 : (input.cutting_method == 'multi_ply' ? input.quantity * 0.005 : input.quantity * 0.003); results["labor_hours"] = Number.isFinite(v) ? v : 0; } catch { results["labor_hours"] = 0; }
  try { const v = (results["labor_hours"] ?? 0) * input.labor_rate_per_hour; results["labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost"] = 0; }
  try { const v = (results["total_material_cost"] ?? 0) + (results["labor_cost"] ?? 0); results["total_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_cost"] = 0; }
  try { const v = (results["total_cost"] ?? 0) / input.quantity; results["cost_per_piece"] = Number.isFinite(v) ? v : 0; } catch { results["cost_per_piece"] = 0; }
  return results;
}


export function calculateFabric_cutting_optimizer(input: Fabric_cutting_optimizerInput): Fabric_cutting_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fabric_utilization"] ?? 0;
  const breakdown = {
    pattern_area: values["pattern_area"] ?? 0,
    total_pattern_area: values["total_pattern_area"] ?? 0,
    fabric_area: values["fabric_area"] ?? 0,
    adjusted_pattern_area: values["adjusted_pattern_area"] ?? 0,
    waste_percentage: values["waste_percentage"] ?? 0,
    total_material_cost: values["total_material_cost"] ?? 0,
    labor_hours: values["labor_hours"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    total_cost: values["total_cost"] ?? 0,
    cost_per_piece: values["cost_per_piece"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Allowance","Poor Nesting Efficiency","Cutting Method Inefficiency","Pattern Orientation Loss"];
  const suggestedActions: string[] = ["Reduce Allowance","Enable Nesting Optimization","Switch to Multi-Ply Cutting","Use Wider Fabric","Review Pattern Layout"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-roll nesting","Real-time waste tracking"],
  };
}


export interface Fabric_cutting_optimizerOutput {
  totalWasteCost: number;
  breakdown: { pattern_area: number; total_pattern_area: number; fabric_area: number; adjusted_pattern_area: number; waste_percentage: number; total_material_cost: number; labor_hours: number; labor_cost: number; total_cost: number; cost_per_piece: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
