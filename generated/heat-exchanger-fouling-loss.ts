// Auto-generated from heat-exchanger-fouling-loss-schema.json
import * as z from 'zod';

export interface Heat_exchanger_fouling_lossInput {
  design_ua: number;
  actual_ua: number;
  hot_inlet_temp: number;
  cold_inlet_temp: number;
  hot_flow_rate: number;
  hot_specific_heat: number;
  energy_cost: number;
  operating_hours_per_year: number;
  production_loss_factor: number;
  revenue_per_unit_product: number;
  exchanger_type: string;
  fouling_factor_known: boolean;
  measured_fouling_factor: number;
}

export const Heat_exchanger_fouling_lossInputSchema = z.object({
  design_ua: z.number().min(10).max(10000).default(500),
  actual_ua: z.number().min(5).max(10000).default(350),
  hot_inlet_temp: z.number().min(0).max(500).default(120),
  cold_inlet_temp: z.number().min(-20).max(200).default(30),
  hot_flow_rate: z.number().min(0.1).max(1000).default(50),
  hot_specific_heat: z.number().min(0.5).max(5).default(2.5),
  energy_cost: z.number().min(0.01).max(1).default(0.08),
  operating_hours_per_year: z.number().min(100).max(8760).default(8000),
  production_loss_factor: z.number().min(0).max(100).default(5),
  revenue_per_unit_product: z.number().min(0).max(100).default(0.5),
  exchanger_type: z.enum(['Shell-and-Tube', 'Plate', 'Double Pipe', 'Spiral']).default('Shell-and-Tube'),
  fouling_factor_known: z.boolean().default(false),
  measured_fouling_factor: z.number().min(0).max(0.01).default(0.0005),
});

function evaluateAllFormulas(input: Heat_exchanger_fouling_lossInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (((input.fouling_factor_known)) ? (input.measured_fouling_factor) : ((1/input.actual_ua - 1/input.design_ua))); results["fouling_resistance"] = Number.isFinite(v) ? v : 0; } catch { results["fouling_resistance"] = 0; }
  try { const v = input.design_ua * ((input.hot_inlet_temp - input.cold_inlet_temp) / 2); results["heat_duty_design"] = Number.isFinite(v) ? v : 0; } catch { results["heat_duty_design"] = 0; }
  try { const v = input.actual_ua * ((input.hot_inlet_temp - input.cold_inlet_temp) / 2); results["heat_duty_actual"] = Number.isFinite(v) ? v : 0; } catch { results["heat_duty_actual"] = 0; }
  try { const v = (results["heat_duty_design"] ?? 0) - (results["heat_duty_actual"] ?? 0); results["energy_loss"] = Number.isFinite(v) ? v : 0; } catch { results["energy_loss"] = 0; }
  try { const v = (results["energy_loss"] ?? 0) * input.energy_cost * input.operating_hours_per_year; results["energy_loss_cost"] = Number.isFinite(v) ? v : 0; } catch { results["energy_loss_cost"] = 0; }
  try { const v = (input.production_loss_factor / 100) * input.hot_flow_rate * input.revenue_per_unit_product * input.operating_hours_per_year * 3600; results["production_loss_cost"] = Number.isFinite(v) ? v : 0; } catch { results["production_loss_cost"] = 0; }
  try { const v = (results["energy_loss_cost"] ?? 0) + (results["production_loss_cost"] ?? 0); results["total_fouling_loss"] = Number.isFinite(v) ? v : 0; } catch { results["total_fouling_loss"] = 0; }
  return results;
}


export function calculateHeat_exchanger_fouling_loss(input: Heat_exchanger_fouling_lossInput): Heat_exchanger_fouling_lossOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["total_fouling_loss"] ?? 0;
  const breakdown = {
    fouling_resistance: values["fouling_resistance"] ?? 0,
    heat_duty_design: values["heat_duty_design"] ?? 0,
    heat_duty_actual: values["heat_duty_actual"] ?? 0,
    energy_loss: values["energy_loss"] ?? 0,
    energy_loss_cost: values["energy_loss_cost"] ?? 0,
    production_loss_cost: values["production_loss_cost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Increased Pumping Cost","Maintenance Downtime","Reduced Equipment Life"];
  const suggestedActions: string[] = ["Schedule chemical cleaning or mechanical brushing within next 2 weeks.","Install online fouling monitoring system (e.g., thermal resistance sensors).","Evaluate anti-fouling coatings or surface modifications for future replacement.","Review process conditions (velocity, temperature) to minimize fouling rate."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-unit comparison","Custom threshold alerts"],
  };
}


export interface Heat_exchanger_fouling_lossOutput {
  totalWasteCost: number;
  breakdown: { fouling_resistance: number; heat_duty_design: number; heat_duty_actual: number; energy_loss: number; energy_loss_cost: number; production_loss_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
