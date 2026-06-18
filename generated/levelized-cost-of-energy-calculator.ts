// @ts-nocheck
// Auto-generated from levelized-cost-of-energy-calculator-schema.json
import * as z from 'zod';

export interface Levelized_cost_of_energy_calculatorInput {
  capitalCost: number;
  annualOMCost: number;
  annualEnergyProduction: number;
  discountRate: number;
  projectLifetime: number;
  decommissioningCost: number;
}

export const Levelized_cost_of_energy_calculatorInputSchema = z.object({
  capitalCost: z.number().default(1000000),
  annualOMCost: z.number().default(20000),
  annualEnergyProduction: z.number().default(5000000),
  discountRate: z.number().default(5),
  projectLifetime: z.number().default(20),
  decommissioningCost: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Levelized_cost_of_energy_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.projectLifetime * input.capitalCost; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.projectLifetime * input.capitalCost * (1 + (input.discountRate / 100)); results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.projectLifetime * input.capitalCost * (1 + (input.discountRate / 100)); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLevelized_cost_of_energy_calculator(input: Levelized_cost_of_energy_calculatorInput): Levelized_cost_of_energy_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Levelized_cost_of_energy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
