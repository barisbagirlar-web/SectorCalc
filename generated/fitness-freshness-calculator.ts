// @ts-nocheck
// Auto-generated from fitness-freshness-calculator-schema.json
import * as z from 'zod';

export interface Fitness_freshness_calculatorInput {
  machineAge: number;
  maintenanceFrequency: number;
  productShelfLife: number;
  productAge: number;
}

export const Fitness_freshness_calculatorInputSchema = z.object({
  machineAge: z.number().default(5),
  maintenanceFrequency: z.number().default(12),
  productShelfLife: z.number().default(30),
  productAge: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fitness_freshness_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.machineAge * input.maintenanceFrequency; results["machine_maintenance_annual"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["machine_maintenance_annual"] = 0; }
  try { const v = input.machineAge * 260; results["machine_runtime_hours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["machine_runtime_hours"] = 0; }
  try { const v = input.machineAge * input.maintenanceFrequency; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFitness_freshness_calculator(input: Fitness_freshness_calculatorInput): Fitness_freshness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Composite model — validate each cost leg against actuals","Physical exposure factors are normalized estimates"];
  const suggestedActions: string[] = ["Reconcile labor and maintenance legs separately","Benchmark noise/vibration factors with site measurement"];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Fitness_freshness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
