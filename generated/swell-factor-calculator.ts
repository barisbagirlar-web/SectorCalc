// @ts-nocheck
// Auto-generated from swell-factor-calculator-schema.json
import * as z from 'zod';

export interface Swell_factor_calculatorInput {
  bankVolume: number;
  swellFactorPercent: number;
  wasteFactorPercent: number;
  truckCapacity: number;
}

export const Swell_factor_calculatorInputSchema = z.object({
  bankVolume: z.number().default(100),
  swellFactorPercent: z.number().default(25),
  wasteFactorPercent: z.number().default(5),
  truckCapacity: z.number().default(10),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Swell_factor_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bankVolume * (1 + input.swellFactorPercent/100) * (1 + input.wasteFactorPercent/100); results["totalLooseVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLooseVolume"] = 0; }
  try { const v = input.swellFactorPercent / 100; results["swellRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["swellRatio"] = 0; }
  try { const v = input.bankVolume * (input.swellFactorPercent / 100); results["volumeIncrease"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["volumeIncrease"] = 0; }
  try { const v = (input.bankVolume * (1 + input.swellFactorPercent/100) * (1 + input.wasteFactorPercent/100)) - input.bankVolume; results["adjustedVolumeIncrease"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustedVolumeIncrease"] = 0; }
  try { const v = (input.bankVolume * (1 + input.swellFactorPercent/100) * (1 + input.wasteFactorPercent/100)) / input.truckCapacity; results["loadsRequired"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["loadsRequired"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSwell_factor_calculator(input: Swell_factor_calculatorInput): Swell_factor_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLooseVolume"]);
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


export interface Swell_factor_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
