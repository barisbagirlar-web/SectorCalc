// @ts-nocheck
// Auto-generated from availability-calculator-schema.json
import * as z from 'zod';

export interface Availability_calculatorInput {
  plannedAvailableTime: number;
  unplannedDowntime: number;
  plannedDowntime: number;
  numberOfFailures: number;
  meanTimeToRepair: number;
}

export const Availability_calculatorInputSchema = z.object({
  plannedAvailableTime: z.number().default(480),
  unplannedDowntime: z.number().default(30),
  plannedDowntime: z.number().default(20),
  numberOfFailures: z.number().default(2),
  meanTimeToRepair: z.number().default(15),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Availability_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.unplannedDowntime + input.plannedDowntime; results["totalDowntime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDowntime"] = 0; }
  try { const v = input.plannedAvailableTime - (input.unplannedDowntime + input.plannedDowntime); results["uptime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["uptime"] = 0; }
  try { const v = (input.plannedAvailableTime - input.unplannedDowntime - input.plannedDowntime) / input.plannedAvailableTime * 100; results["availability"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["availability"] = 0; }
  try { const v = (input.plannedAvailableTime - input.unplannedDowntime - input.plannedDowntime) / input.numberOfFailures; results["mtbf"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mtbf"] = 0; }
  try { const v = input.meanTimeToRepair; results["mttr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["mttr"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAvailability_calculator(input: Availability_calculatorInput): Availability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["availability"]);
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


export interface Availability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
