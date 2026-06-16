// Auto-generated from roi-calculator-schema.json
import * as z from 'zod';

export interface Roi_calculatorInput {
  annual_revenue: number;
  operating_margin: number;
  total_inventory_value: number;
  inventory_carrying_cost_percent: number;
  annual_labor_cost: number;
  defect_rate_percent: number;
  cost_per_defect: number;
  annual_energy_cost: number;
  lean_implementation_cost: number;
  expected_improvement_factor: number;
  industry_type: string;
  iso_certified: boolean;
}

export const Roi_calculatorInputSchema = z.object({
  annual_revenue: z.number().min(100000).max(10000000000).default(10000000),
  operating_margin: z.number().min(0).max(100).default(10),
  total_inventory_value: z.number().min(0).max(1000000000).default(2000000),
  inventory_carrying_cost_percent: z.number().min(0).max(50).default(25),
  annual_labor_cost: z.number().min(0).max(1000000000).default(3000000),
  defect_rate_percent: z.number().min(0).max(100).default(5),
  cost_per_defect: z.number().min(0).max(100000).default(500),
  annual_energy_cost: z.number().min(0).max(100000000).default(500000),
  lean_implementation_cost: z.number().min(0).max(10000000).default(200000),
  expected_improvement_factor: z.number().min(0).max(1).default(0.15),
  industry_type: z.enum(['manufacturing', 'logistics', 'warehousing', 'assembly', 'process']).default('manufacturing'),
  iso_certified: z.boolean().default(false),
});

function evaluateAllFormulas(input: Roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_revenue * (input.defect_rate_percent / 100) * input.cost_per_defect * input.expected_improvement_factor; results["quality_cost_savings"] = Number.isFinite(v) ? v : 0; } catch { results["quality_cost_savings"] = 0; }
  try { const v = input.total_inventory_value * (input.inventory_carrying_cost_percent / 100) * input.expected_improvement_factor; results["inventory_carrying_cost_savings"] = Number.isFinite(v) ? v : 0; } catch { results["inventory_carrying_cost_savings"] = 0; }
  try { const v = input.annual_labor_cost * input.expected_improvement_factor * 0.5; results["labor_efficiency_savings"] = Number.isFinite(v) ? v : 0; } catch { results["labor_efficiency_savings"] = 0; }
  try { const v = input.annual_energy_cost * input.expected_improvement_factor * 0.3; results["energy_savings"] = Number.isFinite(v) ? v : 0; } catch { results["energy_savings"] = 0; }
  try { const v = (results["quality_cost_savings"] ?? 0) + (results["inventory_carrying_cost_savings"] ?? 0) + (results["labor_efficiency_savings"] ?? 0) + (results["energy_savings"] ?? 0); results["total_annual_benefit"] = Number.isFinite(v) ? v : 0; } catch { results["total_annual_benefit"] = 0; }
  try { const v = (results["total_annual_benefit"] ?? 0) * ((1 - (1 + 0.10)^-5) / 0.10) - input.lean_implementation_cost; results["net_present_value"] = Number.isFinite(v) ? v : 0; } catch { results["net_present_value"] = 0; }
  try { const v = (((results["total_annual_benefit"] ?? 0) * 5) - input.lean_implementation_cost) / input.lean_implementation_cost * 100; results["roi_percent"] = Number.isFinite(v) ? v : 0; } catch { results["roi_percent"] = 0; }
  return results;
}


export function calculateRoi_calculator(input: Roi_calculatorInput): Roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roi_percent"] ?? 0;
  const breakdown = {
    quality_cost_savings: values["quality_cost_savings"] ?? 0,
    inventory_carrying_cost_savings: values["inventory_carrying_cost_savings"] ?? 0,
    labor_efficiency_savings: values["labor_efficiency_savings"] ?? 0,
    energy_savings: values["energy_savings"] ?? 0,
    total_annual_benefit: values["total_annual_benefit"] ?? 0,
    net_present_value: values["net_present_value"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excess Motion Waste","Overprocessing Waste","Waiting Time Waste"];
  const suggestedActions: string[] = ["Implement 5S workplace organization to reduce motion and waiting waste.","Deploy Statistical Process Control (SPC) to reduce defect rates.","Conduct value stream mapping to identify and eliminate overprocessing.","Optimize inventory levels using Kanban systems.","Invest in energy-efficient equipment and lighting."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-scenario simulation"],
  };
}


export interface Roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: { quality_cost_savings: number; inventory_carrying_cost_savings: number; labor_efficiency_savings: number; energy_savings: number; total_annual_benefit: number; net_present_value: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
