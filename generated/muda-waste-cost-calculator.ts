// Auto-generated from muda-waste-cost-calculator-schema.json
import * as z from 'zod';

export interface Muda_waste_cost_calculatorInput {
  material_cost_per_unit: number;
  labor_cost_per_hour: number;
  overhead_rate: number;
  defect_rate: number;
  rework_time_per_unit: number;
  scrap_rate: number;
  waiting_time_per_unit: number;
  excess_motion_cost_per_unit: number;
  inventory_holding_cost_per_unit: number;
  overproduction_quantity: number;
  transportation_cost_per_unit: number;
  processing_waste_per_unit: number;
  production_volume: number;
  shift_hours_per_day: number;
  working_days_per_year: number;
  industry_type: string;
  include_hidden_losses: boolean;
}

export const Muda_waste_cost_calculatorInputSchema = z.object({
  material_cost_per_unit: z.number().min(0).max(10000).default(0.5),
  labor_cost_per_hour: z.number().min(0).max(500).default(25),
  overhead_rate: z.number().min(0).max(500).default(150),
  defect_rate: z.number().min(0).max(100).default(5),
  rework_time_per_unit: z.number().min(0).max(10).default(0.25),
  scrap_rate: z.number().min(0).max(100).default(2),
  waiting_time_per_unit: z.number().min(0).max(10).default(0.1),
  excess_motion_cost_per_unit: z.number().min(0).max(100).default(0.05),
  inventory_holding_cost_per_unit: z.number().min(0).max(1000).default(0.2),
  overproduction_quantity: z.number().min(0).max(1000000).default(100),
  transportation_cost_per_unit: z.number().min(0).max(100).default(0.1),
  processing_waste_per_unit: z.number().min(0).max(100).default(0.15),
  production_volume: z.number().min(1).max(100000000).default(10000),
  shift_hours_per_day: z.number().min(1).max(24).default(8),
  working_days_per_year: z.number().min(1).max(365).default(250),
  industry_type: z.enum(['Automotive', 'Electronics', 'Pharmaceutical', 'Food & Beverage', 'Logistics', 'General Manufacturing']).default('General Manufacturing'),
  include_hidden_losses: z.boolean().default(true),
});

function evaluateAllFormulas(input: Muda_waste_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["defect_cost"] = input.production_volume * (input.defect_rate/100) * ( (input.rework_time_per_unit * input.labor_cost_per_hour * (1 + input.overhead_rate/100)) + (input.scrap_rate/100 * input.material_cost_per_unit) ); } catch { results["defect_cost"] = 0; }
  try { results["waiting_cost"] = input.production_volume * input.waiting_time_per_unit * input.labor_cost_per_hour * (1 + input.overhead_rate/100); } catch { results["waiting_cost"] = 0; }
  try { results["overproduction_cost"] = input.overproduction_quantity * (input.material_cost_per_unit + input.labor_cost_per_hour * (1 + input.overhead_rate/100) * (input.shift_hours_per_day / input.production_volume) + input.inventory_holding_cost_per_unit); } catch { results["overproduction_cost"] = 0; }
  try { results["motion_transport_processing_cost"] = input.production_volume * (input.excess_motion_cost_per_unit + input.transportation_cost_per_unit + input.processing_waste_per_unit); } catch { results["motion_transport_processing_cost"] = 0; }
  try { results["inventory_waste_cost"] = input.production_volume * input.inventory_holding_cost_per_unit * (1 + input.defect_rate/100); } catch { results["inventory_waste_cost"] = 0; }
  try { results["hidden_losses"] = input.include_hidden_losses ? ((results["defect_cost"] ?? 0) * 0.15 + (results["waiting_cost"] ?? 0) * 0.1 + (results["overproduction_cost"] ?? 0) * 0.2) : 0; } catch { results["hidden_losses"] = 0; }
  try { results["total_waste_cost"] = ((results["defect_cost"] ?? 0) + (results["waiting_cost"] ?? 0) + (results["overproduction_cost"] ?? 0) + (results["motion_transport_processing_cost"] ?? 0) + (results["inventory_waste_cost"] ?? 0) + (results["hidden_losses"] ?? 0)) * dataConfidenceAdjusted; } catch { results["total_waste_cost"] = 0; }
  return results;
}


export function calculateMuda_waste_cost_calculator(input: Muda_waste_cost_calculatorInput): Muda_waste_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_waste_cost"] ?? 0;
  const breakdown = {
    defect_cost: values["defect_cost"] ?? 0,
    waiting_cost: values["waiting_cost"] ?? 0,
    overproduction_cost: values["overproduction_cost"] ?? 0,
    motion_transport_processing_cost: values["motion_transport_processing_cost"] ?? 0,
    inventory_waste_cost: values["inventory_waste_cost"] ?? 0,
    hidden_losses: values["hidden_losses"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Lost Opportunity Cost","Brand Impact Cost","Employee Morale Cost"];
  const suggestedActions: string[] = ["Implement Statistical Process Control (SPC) and root cause analysis (5 Whys) to reduce defect rate.","Conduct value stream mapping to identify bottlenecks and implement Takt time balancing.","Switch to a pull-based Kanban system and reduce batch sizes.","Redesign workstations using 5S and ergonomic principles to reduce excess motion.","Implement Just-In-Time (JIT) delivery and reduce safety stock levels."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom threshold configuration"],
  };
}


export interface Muda_waste_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: { defect_cost: number; waiting_cost: number; overproduction_cost: number; motion_transport_processing_cost: number; inventory_waste_cost: number; hidden_losses: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
