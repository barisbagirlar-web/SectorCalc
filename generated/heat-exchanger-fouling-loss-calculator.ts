// Auto-generated from heat-exchanger-fouling-loss-calculator-schema.json
import * as z from 'zod';

export interface Heat_exchanger_fouling_loss_calculatorInput {
  design_ua: number;
  actual_ua: number;
  hot_inlet_temp: number;
  cold_inlet_temp: number;
  hot_flow_rate: number;
  hot_specific_heat: number;
  energy_cost: number;
  operating_hours_per_year: number;
  dataConfidence?: number;
}

export const Heat_exchanger_fouling_loss_calculatorInputSchema = z.object({
  design_ua: z.number().min(10).max(10000).default(500),
  actual_ua: z.number().min(5).max(10000).default(350),
  hot_inlet_temp: z.number().min(0).max(500).default(120),
  cold_inlet_temp: z.number().min(-20).max(200).default(30),
  hot_flow_rate: z.number().min(0.1).max(1000).default(50),
  hot_specific_heat: z.number().min(0.5).max(5).default(2.5),
  energy_cost: z.number().min(0.01).max(1).default(0.08),
  operating_hours_per_year: z.number().min(100).max(8760).default(8000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Heat_exchanger_fouling_loss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 * input.design_ua * input.operating_hours_per_year * (input.hot_flow_rate / 100); results["annual_kwh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_kwh"] = 0; }
  try { const v = 1 * input.design_ua * input.operating_hours_per_year * (input.hot_flow_rate / 100) * input.energy_cost; results["annual_energy_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annual_energy_cost"] = 0; }
  try { const v = 1 * input.design_ua * input.operating_hours_per_year * (input.hot_flow_rate / 100) * input.energy_cost; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHeat_exchanger_fouling_loss_calculator(input: Heat_exchanger_fouling_loss_calculatorInput): Heat_exchanger_fouling_loss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Off-shift idle load","Leak or standby losses"];
  const suggestedActions: string[] = ["Meter validate kWh per shift","Prioritize top leak sources"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Heat_exchanger_fouling_loss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
