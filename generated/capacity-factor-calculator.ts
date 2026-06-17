// @ts-nocheck
// Auto-generated from capacity-factor-calculator-schema.json
import * as z from 'zod';

export interface Capacity_factor_calculatorInput {
  actualEnergy: number;
  installedCapacity: number;
  hoursPeriod: number;
  availabilityFactor: number;
  targetCapacityFactor: number;
}

export const Capacity_factor_calculatorInputSchema = z.object({
  actualEnergy: z.number().default(0),
  installedCapacity: z.number().default(0),
  hoursPeriod: z.number().default(8760),
  availabilityFactor: z.number().default(1),
  targetCapacityFactor: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Capacity_factor_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.installedCapacity * input.hoursPeriod * input.availabilityFactor; results["maxPossibleEnergy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["maxPossibleEnergy"] = 0; }
  try { const v = (input.actualEnergy / (input.installedCapacity * input.hoursPeriod * input.availabilityFactor)) * 100; results["capacityFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["capacityFactor"] = 0; }
  try { const v = ((input.actualEnergy / (input.installedCapacity * input.hoursPeriod * input.availabilityFactor)) * 100) - input.targetCapacityFactor; results["deviation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["deviation"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCapacity_factor_calculator(input: Capacity_factor_calculatorInput): Capacity_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["capacityFactor"]);
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Capacity_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
