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
  try { const v = input.isFirstTimeBuyer * input.propertyPrice; results["base_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.isFirstTimeBuyer * input.propertyPrice; results["adjusted_cost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.isFirstTimeBuyer * input.propertyPrice; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
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


export interface Stamp_duty_calculator_ukOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
