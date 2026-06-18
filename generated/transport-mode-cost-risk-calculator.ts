// @ts-nocheck
// Auto-generated from transport-mode-cost-risk-calculator-schema.json
import * as z from 'zod';

export interface Transport_mode_cost_risk_calculatorInput {
  annual_volume: number;
  avg_shipment_weight: number;
  distance_km: number;
  mode: string;
  fuel_price_per_liter: number;
  labor_rate_per_hour: number;
  transit_time_days: number;
  damage_rate_percent: number;
}

export const Transport_mode_cost_risk_calculatorInputSchema = z.object({
  annual_volume: z.number().min(100).max(10000000).default(10000),
  avg_shipment_weight: z.number().min(1).max(50000).default(500),
  distance_km: z.number().min(10).max(20000).default(800),
  mode: z.enum(['truck', 'rail', 'ocean', 'air']).default('truck'),
  fuel_price_per_liter: z.number().min(0.5).max(3).default(1.2),
  labor_rate_per_hour: z.number().min(10).max(80).default(25),
  transit_time_days: z.number().min(0.1).max(60).default(3),
  damage_rate_percent: z.number().min(0).max(20).default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Transport_mode_cost_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.annual_volume * input.fuel_price_per_liter; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.annual_volume * input.fuel_price_per_liter * (1 + (input.labor_rate_per_hour / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.annual_volume * input.fuel_price_per_liter * (1 + (input.labor_rate_per_hour / 100)) * (input.avg_shipment_weight); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.avg_shipment_weight; results["factor_avg_shipment_weight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["factor_avg_shipment_weight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTransport_mode_cost_risk_calculator(input: Transport_mode_cost_risk_calculatorInput): Transport_mode_cost_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Transport_mode_cost_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
