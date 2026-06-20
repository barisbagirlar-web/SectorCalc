// Auto-generated from stamp-duty-calculator-uk-schema.json
import * as z from 'zod';

export interface Stamp_duty_calculator_ukInput {
  propertyPrice: number;
  isFirstTimeBuyer: number;
  isAdditionalProperty: number;
  isNonUKResident: number;
  dataConfidence?: number;
}

export const Stamp_duty_calculator_ukInputSchema = z.object({
  propertyPrice: z.number().default(300000),
  isFirstTimeBuyer: z.number().default(0),
  isAdditionalProperty: z.number().default(0),
  isNonUKResident: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Stamp_duty_calculator_ukInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.isFirstTimeBuyer * input.propertyPrice; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["base_cost"] = Number.NaN; }
  try { const v = input.isFirstTimeBuyer * input.propertyPrice; results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost"] = Number.NaN; }
  try { const v = input.isFirstTimeBuyer * input.propertyPrice; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateStamp_duty_calculator_uk(input: Stamp_duty_calculator_ukInput): Stamp_duty_calculator_ukOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
