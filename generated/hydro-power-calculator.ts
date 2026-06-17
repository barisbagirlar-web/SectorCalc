// @ts-nocheck
// Auto-generated from hydro-power-calculator-schema.json
import * as z from 'zod';

export interface Hydro_power_calculatorInput {
  flowRate: number;
  head: number;
  turbineEfficiency: number;
  generatorEfficiency: number;
  waterDensity: number;
  gravity: number;
}

export const Hydro_power_calculatorInputSchema = z.object({
  flowRate: z.number().default(1),
  head: z.number().default(10),
  turbineEfficiency: z.number().default(85),
  generatorEfficiency: z.number().default(95),
  waterDensity: z.number().default(1000),
  gravity: z.number().default(9.81),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hydro_power_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.turbineEfficiency * input.generatorEfficiency) / 100; results["overallEfficiencyPercent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overallEfficiencyPercent"] = 0; }
  try { const v = ((asFormulaNumber(results["overallEfficiencyPercent"])) / 100) * input.waterDensity * input.gravity * input.flowRate * input.head; results["powerWatts"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["powerWatts"] = 0; }
  try { const v = (asFormulaNumber(results["powerWatts"])) / 1000; results["powerKW"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["powerKW"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHydro_power_calculator(input: Hydro_power_calculatorInput): Hydro_power_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["powerKW"]);
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


export interface Hydro_power_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
