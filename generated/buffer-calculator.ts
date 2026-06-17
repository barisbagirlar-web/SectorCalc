// @ts-nocheck
// Auto-generated from buffer-calculator-schema.json
import * as z from 'zod';

export interface Buffer_calculatorInput {
  average_daily_demand: number;
  demand_standard_deviation: number;
  average_lead_time_days: number;
  lead_time_standard_deviation: number;
  service_level_z: number;
}

export const Buffer_calculatorInputSchema = z.object({
  average_daily_demand: z.number().default(100),
  demand_standard_deviation: z.number().default(20),
  average_lead_time_days: z.number().default(5),
  lead_time_standard_deviation: z.number().default(1),
  service_level_z: z.number().default(1.65),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Buffer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.service_level_z * input.average_daily_demand * input.lead_time_standard_deviation; results["leadTimeVariabilityComponent"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leadTimeVariabilityComponent"] = 0; }
  try { const v = input.service_level_z * input.average_daily_demand * input.lead_time_standard_deviation; results["leadTimeVariabilityComponent_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leadTimeVariabilityComponent_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBuffer_calculator(input: Buffer_calculatorInput): Buffer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["leadTimeVariabilityComponent_aux"]);
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


export interface Buffer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
