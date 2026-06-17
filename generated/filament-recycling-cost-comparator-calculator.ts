// @ts-nocheck
// Auto-generated from filament-recycling-cost-comparator-calculator-schema.json
import * as z from 'zod';

export interface Filament_recycling_cost_comparator_calculatorInput {
  recycling_machine_cost: number;
  machine_life_years: number;
  annual_maintenance_cost: number;
  electricity_price: number;
  recycling_energy_consumption: number;
  labor_rate: number;
  labor_hours_per_kg: number;
  waste_collection_cost: number;
}

export const Filament_recycling_cost_comparator_calculatorInputSchema = z.object({
  recycling_machine_cost: z.number().min(10000).max(500000).default(50000),
  machine_life_years: z.number().min(3).max(20).default(10),
  annual_maintenance_cost: z.number().min(1000).max(50000).default(5000),
  electricity_price: z.number().min(0.05).max(0.4).default(0.12),
  recycling_energy_consumption: z.number().min(0.5).max(10).default(2.5),
  labor_rate: z.number().min(10).max(80).default(25),
  labor_hours_per_kg: z.number().min(0.01).max(0.5).default(0.05),
  waste_collection_cost: z.number().min(0.05).max(2).default(0.3),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Filament_recycling_cost_comparator_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.recycling_machine_cost + input.machine_life_years + input.annual_maintenance_cost; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.recycling_machine_cost + input.machine_life_years + input.annual_maintenance_cost; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFilament_recycling_cost_comparator_calculator(input: Filament_recycling_cost_comparator_calculatorInput): Filament_recycling_cost_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-plant comparison","Scenario simulation"],
  };
}


export interface Filament_recycling_cost_comparator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
