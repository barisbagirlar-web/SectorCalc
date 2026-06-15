// Auto-generated from subcontractor-margin-leak-detector-schema.json
import * as z from 'zod';

export interface Subcontractor_margin_leak_detectorInput {
  contract_value: number;
  actual_labor_cost: number;
  actual_material_cost: number;
  actual_equipment_cost: number;
  overhead_percentage: number;
  quality_rework_cost: number;
  schedule_delay_penalty: number;
  waste_factor: number;
  labor_efficiency_index: number;
  material_price_variance: number;
  scope_change_cost: number;
  inventory_holding_cost: number;
  currency_exchange_loss: number;
  contract_type: string;
  use_lean_accounting: boolean;
}

export const Subcontractor_margin_leak_detectorInputSchema = z.object({
  contract_value: z.number().min(0).max(100000000).default(1000000),
  actual_labor_cost: z.number().min(0).max(50000000).default(350000),
  actual_material_cost: z.number().min(0).max(50000000).default(250000),
  actual_equipment_cost: z.number().min(0).max(20000000).default(100000),
  overhead_percentage: z.number().min(0).max(50).default(15),
  quality_rework_cost: z.number().min(0).max(10000000).default(50000),
  schedule_delay_penalty: z.number().min(0).max(5000000).default(20000),
  waste_factor: z.number().min(0).max(30).default(8),
  labor_efficiency_index: z.number().min(0.5).max(1.2).default(0.85),
  material_price_variance: z.number().min(-100000).max(100000).default(15000),
  scope_change_cost: z.number().min(0).max(5000000).default(30000),
  inventory_holding_cost: z.number().min(0).max(1000000).default(10000),
  currency_exchange_loss: z.number().min(0).max(500000).default(5000),
  contract_type: z.enum(['Fixed Price', 'Cost Plus', 'Time and Materials']).default('Fixed Price'),
  use_lean_accounting: z.boolean().default(true),
});

function evaluateAllFormulas(input: Subcontractor_margin_leak_detectorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["total_direct_cost"] = input.actual_labor_cost + input.actual_material_cost + input.actual_equipment_cost; } catch { results["total_direct_cost"] = 0; }
  try { results["overhead_cost"] = (results["total_direct_cost"] ?? 0) * (input.overhead_percentage / 100); } catch { results["overhead_cost"] = 0; }
  try { results["lean_waste_cost"] = (results["total_direct_cost"] ?? 0) * (input.waste_factor / 100); } catch { results["lean_waste_cost"] = 0; }
  try { results["labor_inefficiency_cost"] = input.actual_labor_cost * (1 - input.labor_efficiency_index); } catch { results["labor_inefficiency_cost"] = 0; }
  try { results["total_hidden_loss"] = input.quality_rework_cost + input.schedule_delay_penalty + input.material_price_variance + input.scope_change_cost + input.inventory_holding_cost + input.currency_exchange_loss + (results["lean_waste_cost"] ?? 0) + (results["labor_inefficiency_cost"] ?? 0); } catch { results["total_hidden_loss"] = 0; }
  try { results["total_actual_cost"] = (results["total_direct_cost"] ?? 0) + (results["overhead_cost"] ?? 0) + (results["total_hidden_loss"] ?? 0); } catch { results["total_actual_cost"] = 0; }
  try { results["margin_leak_percentage"] = ((input.contract_value - (results["total_actual_cost"] ?? 0)) / input.contract_value) * 100; } catch { results["margin_leak_percentage"] = 0; }
  return results;
}


export function calculateSubcontractor_margin_leak_detector(input: Subcontractor_margin_leak_detectorInput): Subcontractor_margin_leak_detectorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["margin_leak_percentage"] ?? 0;
  const breakdown = {
    total_direct_cost: values["total_direct_cost"] ?? 0,
    overhead_cost: values["overhead_cost"] ?? 0,
    total_hidden_loss: values["total_hidden_loss"] ?? 0,
    total_actual_cost: values["total_actual_cost"] ?? 0,
    contract_value: values["contract_value"] ?? 0,
    margin_leak_amount: values["margin_leak_amount"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Quality Rework Cost","Schedule Delay Penalty","Waste Factor","Labor Inefficiency Cost","Material Price Variance","Scope Change Cost","Inventory Holding Cost","Currency Exchange Loss"];
  const suggestedActions: string[] = ["Conduct Lean Kaizen Event","Implement Six Sigma DMAIC Project","Labor Efficiency Training Program","Strengthen Scope Change Control","Optimize Inventory Levels","Implement Currency Hedging Strategy"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Benchmarking against industry standards"],
  };
}


export interface Subcontractor_margin_leak_detectorOutput {
  totalWasteCost: number;
  breakdown: { total_direct_cost: number; overhead_cost: number; total_hidden_loss: number; total_actual_cost: number; contract_value: number; margin_leak_amount: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
