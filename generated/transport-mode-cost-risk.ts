// Auto-generated from transport-mode-cost-risk-schema.json
import * as z from 'zod';

export interface Transport_mode_cost_riskInput {
  annual_volume: number;
  avg_shipment_weight: number;
  distance_km: number;
  mode: string;
  fuel_price_per_liter: number;
  labor_rate_per_hour: number;
  transit_time_days: number;
  damage_rate_percent: number;
  insurance_rate_per_1000: number;
  cargo_value_per_unit: number;
  inventory_holding_cost_percent: number;
  carbon_tax_per_ton_co2: number;
  use_lean_metrics: boolean;
}

export const Transport_mode_cost_riskInputSchema = z.object({
  annual_volume: z.number().min(100).max(10000000).default(10000),
  avg_shipment_weight: z.number().min(1).max(50000).default(500),
  distance_km: z.number().min(10).max(20000).default(800),
  mode: z.enum(['truck', 'rail', 'ocean', 'air']).default('truck'),
  fuel_price_per_liter: z.number().min(0.5).max(3).default(1.2),
  labor_rate_per_hour: z.number().min(10).max(80).default(25),
  transit_time_days: z.number().min(0.1).max(60).default(3),
  damage_rate_percent: z.number().min(0).max(20).default(1.5),
  insurance_rate_per_1000: z.number().min(0.5).max(50).default(5),
  cargo_value_per_unit: z.number().min(1).max(100000).default(200),
  inventory_holding_cost_percent: z.number().min(5).max(50).default(20),
  carbon_tax_per_ton_co2: z.number().min(0).max(200).default(50),
  use_lean_metrics: z.boolean().default(false),
});

function evaluateAllFormulas(input: Transport_mode_cost_riskInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annual_volume * (mode_base_rate + fuel_surcharge); results["freight_cost"] = Number.isFinite(v) ? v : 0; } catch { results["freight_cost"] = 0; }
  try { const v = input.annual_volume * (input.transit_time_days * 8 * input.labor_rate_per_hour / 1000); results["labor_cost"] = Number.isFinite(v) ? v : 0; } catch { results["labor_cost"] = 0; }
  try { const v = input.annual_volume * input.cargo_value_per_unit * (input.transit_time_days / 365) * (input.inventory_holding_cost_percent / 100); results["inventory_carrying_cost"] = Number.isFinite(v) ? v : 0; } catch { results["inventory_carrying_cost"] = 0; }
  try { const v = input.annual_volume * input.cargo_value_per_unit * (input.damage_rate_percent / 100) + input.annual_volume * input.cargo_value_per_unit * (input.insurance_rate_per_1000 / 1000); results["damage_and_insurance_cost"] = Number.isFinite(v) ? v : 0; } catch { results["damage_and_insurance_cost"] = 0; }
  try { const v = input.annual_volume * (input.distance_km * emission_factor * input.carbon_tax_per_ton_co2 / 1000); results["carbon_cost"] = Number.isFinite(v) ? v : 0; } catch { results["carbon_cost"] = 0; }
  results["lean_waste_cost"] = 0;
  try { const v = ((results["freight_cost"] ?? 0) + (results["labor_cost"] ?? 0) + (results["inventory_carrying_cost"] ?? 0) + (results["damage_and_insurance_cost"] ?? 0) + (results["carbon_cost"] ?? 0) + (results["lean_waste_cost"] ?? 0)) * (1 + (1 - dataConfidenceAdjusted)); results["primaryResult"] = Number.isFinite(v) ? v : 0; } catch { results["primaryResult"] = 0; }
  return results;
}


export function calculateTransport_mode_cost_risk(input: Transport_mode_cost_riskInput): Transport_mode_cost_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_annual_cost"] ?? 0;
  const breakdown = {
    freight_cost: values["freight_cost"] ?? 0,
    labor_cost: values["labor_cost"] ?? 0,
    inventory_carrying_cost: values["inventory_carrying_cost"] ?? 0,
    damage_and_insurance_cost: values["damage_and_insurance_cost"] ?? 0,
    carbon_cost: values["carbon_cost"] ?? 0,
    lean_waste_cost: values["lean_waste_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Excessive transit time variability","Underestimated damage rate","Fuel price volatility","Mode mismatch with distance"];
  const suggestedActions: string[] = ["Consolidate shipments","Shift to intermodal","Negotiate insurance rates","Implement real-time tracking","Adopt lean logistics"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario simulation","Benchmarking against industry standards"],
  };
}


export interface Transport_mode_cost_riskOutput {
  totalWasteCost: number;
  breakdown: { freight_cost: number; labor_cost: number; inventory_carrying_cost: number; damage_and_insurance_cost: number; carbon_cost: number; lean_waste_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
