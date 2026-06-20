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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Filament_recycling_cost_comparator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.labor_hours_per_kg; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_exposure_hours"] = Number.NaN; }
  try { const v = input.machine_life_years * (input.labor_rate / 100) * input.labor_hours_per_kg * input.recycling_machine_cost; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["direct_labor_cost"] = Number.NaN; }
  try { const v = (input.machine_life_years * (input.labor_rate / 100) * input.labor_hours_per_kg * input.recycling_machine_cost) + (input.machine_life_years * input.recycling_machine_cost); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.machine_life_years * input.recycling_machine_cost; results["machine_maintenance_annual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["machine_maintenance_annual"] = Number.NaN; }
  try { const v = input.machine_life_years * input.labor_hours_per_kg; results["machine_runtime_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["machine_runtime_hours"] = Number.NaN; }
  return results;
}


export function calculateFilament_recycling_cost_comparator_calculator(input: Filament_recycling_cost_comparator_calculatorInput): Filament_recycling_cost_comparator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
