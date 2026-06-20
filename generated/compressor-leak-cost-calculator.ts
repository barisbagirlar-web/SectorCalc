// Auto-generated from compressor-leak-cost-calculator-schema.json
import * as z from 'zod';

export interface Compressor_leak_cost_calculatorInput {
  system_pressure: number;
  leak_diameter: number;
  number_of_leaks: number;
  operating_hours: number;
  electricity_cost: number;
  compressor_efficiency: number;
  leak_type: string;
  include_maintenance_cost: boolean;
  dataConfidence?: number;
}

export const Compressor_leak_cost_calculatorInputSchema = z.object({
  system_pressure: z.number().min(60).max(200).default(100),
  leak_diameter: z.number().min(0.01).max(1).default(0.125),
  number_of_leaks: z.number().min(1).max(1000).default(10),
  operating_hours: z.number().min(1000).max(8760).default(8760),
  electricity_cost: z.number().min(0.02).max(0.5).default(0.1),
  compressor_efficiency: z.number().min(50).max(95).default(75),
  leak_type: z.enum(['Round orifice', 'Crack', 'Threaded fitting']).default('Round orifice'),
  include_maintenance_cost: z.boolean().default(true),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compressor_leak_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.operating_hours; results["annual_exposure_hours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annual_exposure_hours"] = Number.NaN; }
  try { const v = 0; results["direct_labor_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["direct_labor_cost"] = Number.NaN; }
  try { const v = input.number_of_leaks * (input.compressor_efficiency / 100) * input.operating_hours * input.electricity_cost * input.leak_diameter; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateCompressor_leak_cost_calculator(input: Compressor_leak_cost_calculatorInput): Compressor_leak_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    annual_exposure_hours: toNumericFormulaValue(values["annual_exposure_hours"]),
    direct_labor_cost: toNumericFormulaValue(values["direct_labor_cost"])
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates","Direct labor cost is set to 0 because no labor-related inputs are available in this tool"];
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
    unit: "USD",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-site comparison","Custom reporting"],
  };
}


export interface Compressor_leak_cost_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { annual_exposure_hours: number; direct_labor_cost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Compressor_leak_cost_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "USD",
  breakdownKeys: ["annual_exposure_hours","direct_labor_cost"],
} as const;

