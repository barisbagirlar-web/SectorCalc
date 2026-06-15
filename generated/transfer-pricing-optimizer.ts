// Auto-generated from transfer-pricing-optimizer-schema.json
import * as z from 'zod';

export interface Transfer_pricing_optimizerInput {
  production_cost_per_unit: number;
  market_price_per_unit: number;
  volume_units: number;
  tax_rate_producer: number;
  tax_rate_distributor: number;
  transfer_price_current: number;
  compliance_risk_tolerance: string;
  include_lean_waste_factor: boolean;
}

export const Transfer_pricing_optimizerInputSchema = z.object({
  production_cost_per_unit: z.number().min(0).max(10000).default(100),
  market_price_per_unit: z.number().min(0).max(50000).default(150),
  volume_units: z.number().min(1).max(10000000).default(10000),
  tax_rate_producer: z.number().min(0).max(50).default(21),
  tax_rate_distributor: z.number().min(0).max(50).default(25),
  transfer_price_current: z.number().min(0).max(50000).default(120),
  compliance_risk_tolerance: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  include_lean_waste_factor: z.boolean().default(true),
});

function evaluateAllFormulas(input: Transfer_pricing_optimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["adjusted_production_cost"] = IF(input.include_lean_waste_factor, input.production_cost_per_unit * 0.9, input.production_cost_per_unit); } catch { results["adjusted_production_cost"] = 0; }
  try { results["arm_length_range_lower"] = (results["adjusted_production_cost"] ?? 0) * 1.05; } catch { results["arm_length_range_lower"] = 0; }
  try { results["arm_length_range_upper"] = input.market_price_per_unit * 0.90; } catch { results["arm_length_range_upper"] = 0; }
  try { results["optimal_transfer_price"] = (input.compliance_risk_tolerance === 'Low' ? ((results["arm_length_range_lower"] ?? 0) + (results["arm_length_range_upper"] ?? 0))/2 : (input.compliance_risk_tolerance === 'Medium' ? ((results["arm_length_range_lower"] ?? 0) * 0.4 + (results["arm_length_range_upper"] ?? 0) * 0.6) : (input.compliance_risk_tolerance === 'High' ? ((results["arm_length_range_lower"] ?? 0) * 0.3 + (results["arm_length_range_upper"] ?? 0) * 0.7) : 0))); } catch { results["optimal_transfer_price"] = 0; }
  try { results["total_tax_savings"] = (input.transfer_price_current - (results["optimal_transfer_price"] ?? 0)) * input.volume_units * (input.tax_rate_distributor - input.tax_rate_producer) / 100; } catch { results["total_tax_savings"] = 0; }
  try { results["net_profit_shift"] = ((results["optimal_transfer_price"] ?? 0) - input.transfer_price_current) * input.volume_units; } catch { results["net_profit_shift"] = 0; }
  results["primary_result"] = 0;
  return results;
}


export function calculateTransfer_pricing_optimizer(input: Transfer_pricing_optimizerInput): Transfer_pricing_optimizerOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjusted_net_benefit"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    type: values["type"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive Waste in Production","Tax Rate Disparity Underutilized","Compliance Risk Penalty Eroding Benefit"];
  const suggestedActions: string[] = ["Implement Lean Six Sigma to reduce production cost","Adjust transfer price to optimal level","Review compliance risk tolerance policy","Document arm's length analysis thoroughly"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-entity scenario comparison","Automated compliance report (OECD/UN)"],
  };
}


export interface Transfer_pricing_optimizerOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; type: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
