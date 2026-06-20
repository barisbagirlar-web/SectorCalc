// Auto-generated from dental-age-calculator-schema.json
import * as z from 'zod';

export interface Dental_age_calculatorInput {
  mesiodistalWidth: number;
  buccolingualWidth: number;
  crownLength: number;
  rootLength: number;
  eruptedTeeth: number;
  dataConfidence?: number;
}

export const Dental_age_calculatorInputSchema = z.object({
  mesiodistalWidth: z.number().default(8.5),
  buccolingualWidth: z.number().default(10),
  crownLength: z.number().default(7),
  rootLength: z.number().default(12),
  eruptedTeeth: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dental_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.25 * input.mesiodistalWidth; results["mesiodistalContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mesiodistalContribution"] = Number.NaN; }
  try { const v = 0.15 * input.buccolingualWidth; results["buccolingualContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["buccolingualContribution"] = Number.NaN; }
  try { const v = 0.2 * input.crownLength; results["crownContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["crownContribution"] = Number.NaN; }
  try { const v = 0.1 * input.rootLength; results["rootContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rootContribution"] = Number.NaN; }
  return results;
}


export function calculateDental_age_calculator(input: Dental_age_calculatorInput): Dental_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rootContribution"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Dental_age_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
