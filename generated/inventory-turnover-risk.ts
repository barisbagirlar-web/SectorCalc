// Auto-generated from inventory-turnover-risk-schema.json
import * as z from 'zod';

export interface Inventory_turnover_riskInput {
  avg_inventory_value: number;
  cogs_annual: number;
  demand_variability_coefficient: number;
  obsolescence_rate: number;
  carrying_cost_rate: number;
  lead_time_days: number;
  service_level_target: number;
  inventory_accuracy_pct: number;
  industry_benchmark_turnover: number;
}

export const Inventory_turnover_riskInputSchema = z.object({
  avg_inventory_value: z.number().min(0).max(1000000000).default(1000000),
  cogs_annual: z.number().min(0).max(10000000000).default(5000000),
  demand_variability_coefficient: z.number().min(0).max(2).default(0.3),
  obsolescence_rate: z.number().min(0).max(100).default(5),
  carrying_cost_rate: z.number().min(0).max(100).default(25),
  lead_time_days: z.number().min(1).max(365).default(30),
  service_level_target: z.number().min(50).max(99.99).default(95),
  inventory_accuracy_pct: z.number().min(0).max(100).default(98),
  industry_benchmark_turnover: z.number().min(0.1).max(100).default(6),
});

function evaluateAllFormulas(input: Inventory_turnover_riskInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["basic_turnover"] = input.cogs_annual / input.avg_inventory_value; } catch { results["basic_turnover"] = 0; }
  try { results["adjusted_turnover"] = (results["basic_turnover"] ?? 0) * (1 - input.demand_variability_coefficient * 0.5); } catch { results["adjusted_turnover"] = 0; }
  try { results["obsolescence_impact"] = 1 - (input.obsolescence_rate / 100); } catch { results["obsolescence_impact"] = 0; }
  try { results["carrying_cost_exposure"] = (input.carrying_cost_rate / 100) * input.avg_inventory_value; } catch { results["carrying_cost_exposure"] = 0; }
  try { results["safety_stock_factor"] = qnorm(input.service_level_target / 100) * Math.sqrt(input.lead_time_days / 365) * input.demand_variability_coefficient; } catch { results["safety_stock_factor"] = 0; }
  try { results["accuracy_adjustment"] = input.inventory_accuracy_pct / 100; } catch { results["accuracy_adjustment"] = 0; }
  try { results["primary_result"] = (results["adjusted_turnover"] ?? 0) * (results["obsolescence_impact"] ?? 0) * (results["accuracy_adjustment"] ?? 0) / (1 + (results["safety_stock_factor"] ?? 0)); } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateInventory_turnover_risk(input: Inventory_turnover_riskInput): Inventory_turnover_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effective_turns"] ?? 0;
  const breakdown = {
    basic_turnover: values["basic_turnover"] ?? 0,
    adjusted_turnover: values["adjusted_turnover"] ?? 0,
    obsolescence_impact: values["obsolescence_impact"] ?? 0,
    carrying_cost_exposure: values["carrying_cost_exposure"] ?? 0,
    safety_stock_factor: values["safety_stock_factor"] ?? 0,
    accuracy_adjustment: values["accuracy_adjustment"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Demand Variability Loss","Obsolescence Loss","Inventory Inaccuracy Loss"];
  const suggestedActions: string[] = ["Implement demand sensing and S&OP to reduce variability. Consider postponement strategies.","Conduct ABC-XYZ analysis and phase out slow movers. Use markdown optimization.","Implement cycle counting program (ISO 9001:2015 clause 7.1.5). Use barcode/RFID.","Review safety stock levels using Six Sigma DMAIC. Reduce lead time variability.","Negotiate lower storage rates, reduce excess inventory, or use consignment."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Automated alerting via email"],
  };
}


export interface Inventory_turnover_riskOutput {
  totalWasteCost: number;
  breakdown: { basic_turnover: number; adjusted_turnover: number; obsolescence_impact: number; carrying_cost_exposure: number; safety_stock_factor: number; accuracy_adjustment: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
