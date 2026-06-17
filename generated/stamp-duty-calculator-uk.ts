// @ts-nocheck
// Auto-generated from stamp-duty-calculator-uk-schema.json
import * as z from 'zod';

export interface Stamp_duty_calculator_ukInput {
  propertyPrice: number;
  isFirstTimeBuyer: number;
  isAdditionalProperty: number;
  isNonUKResident: number;
}

export const Stamp_duty_calculator_ukInputSchema = z.object({
  propertyPrice: z.number().default(300000),
  isFirstTimeBuyer: z.number().default(0),
  isAdditionalProperty: z.number().default(0),
  isNonUKResident: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stamp_duty_calculator_ukInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.propertyPrice + input.isFirstTimeBuyer + input.isAdditionalProperty; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.propertyPrice + input.isFirstTimeBuyer + input.isAdditionalProperty; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStamp_duty_calculator_uk(input: Stamp_duty_calculator_ukInput): Stamp_duty_calculator_ukOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Stamp_duty_calculator_ukOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
