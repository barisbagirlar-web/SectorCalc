// @ts-nocheck
// Auto-generated from mtbf-calculator-schema.json
import * as z from 'zod';

export interface Mtbf_calculatorInput {
  operatingHours: number;
  unitCount: number;
  failureCount: number;
  repairHours: number;
}

export const Mtbf_calculatorInputSchema = z.object({
  operatingHours: z.number().default(8760),
  unitCount: z.number().default(1),
  failureCount: z.number().default(5),
  repairHours: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mtbf_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.operatingHours * input.unitCount; results["totalOperationalTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalOperationalTime"] = 0; }
  try { const v = (asFormulaNumber(results["totalOperationalTime"])) / input.failureCount; results["MTBF"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["MTBF"] = 0; }
  try { const v = input.repairHours / input.failureCount; results["MTTR"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["MTTR"] = 0; }
  try { const v = (asFormulaNumber(results["MTBF"])) / ((asFormulaNumber(results["MTBF"])) + (asFormulaNumber(results["MTTR"]))); results["Availability"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["Availability"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateMtbf_calculator(input: Mtbf_calculatorInput): Mtbf_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["MTBF"]);
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


export interface Mtbf_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
