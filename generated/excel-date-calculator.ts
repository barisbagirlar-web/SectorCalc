// @ts-nocheck
// Auto-generated from excel-date-calculator-schema.json
import * as z from 'zod';

export interface Excel_date_calculatorInput {
  startSerial: number;
  endSerial: number;
  daysOffset: number;
  adjustStart: number;
}

export const Excel_date_calculatorInputSchema = z.object({
  startSerial: z.number().default(44927),
  endSerial: z.number().default(44927),
  daysOffset: z.number().default(0),
  adjustStart: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Excel_date_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.endSerial - input.startSerial + input.adjustStart; results["daysDifference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["daysDifference"] = 0; }
  try { const v = input.startSerial + input.daysOffset; results["projectedDateSerial"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["projectedDateSerial"] = 0; }
  try { const v = input.endSerial - input.startSerial; results["rawDifference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rawDifference"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateExcel_date_calculator(input: Excel_date_calculatorInput): Excel_date_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["daysDifference"]);
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


export interface Excel_date_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
