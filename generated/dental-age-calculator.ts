// Auto-generated from dental-age-calculator-schema.json
import * as z from 'zod';

export interface Dental_age_calculatorInput {
  mesiodistalWidth: number;
  buccolingualWidth: number;
  crownLength: number;
  rootLength: number;
  eruptedTeeth: number;
}

export const Dental_age_calculatorInputSchema = z.object({
  mesiodistalWidth: z.number().default(8.5),
  buccolingualWidth: z.number().default(10),
  crownLength: z.number().default(7),
  rootLength: z.number().default(12),
  eruptedTeeth: z.number().default(12),
});

function evaluateAllFormulas(input: Dental_age_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.25 * input.mesiodistalWidth + 0.15 * input.buccolingualWidth + 0.2 * input.crownLength + 0.1 * input.rootLength + 0.8 * Math.log(1 + input.eruptedTeeth) - 3.5; results["dentalAgeYears"] = Number.isFinite(v) ? v : 0; } catch { results["dentalAgeYears"] = 0; }
  try { const v = 0.25 * input.mesiodistalWidth; results["mesiodistalContribution"] = Number.isFinite(v) ? v : 0; } catch { results["mesiodistalContribution"] = 0; }
  try { const v = 0.15 * input.buccolingualWidth; results["buccolingualContribution"] = Number.isFinite(v) ? v : 0; } catch { results["buccolingualContribution"] = 0; }
  try { const v = 0.2 * input.crownLength; results["crownContribution"] = Number.isFinite(v) ? v : 0; } catch { results["crownContribution"] = 0; }
  try { const v = 0.1 * input.rootLength; results["rootContribution"] = Number.isFinite(v) ? v : 0; } catch { results["rootContribution"] = 0; }
  try { const v = 0.8 * Math.log(1 + input.eruptedTeeth); results["teethContribution"] = Number.isFinite(v) ? v : 0; } catch { results["teethContribution"] = 0; }
  return results;
}


export function calculateDental_age_calculator(input: Dental_age_calculatorInput): Dental_age_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dentalAgeYears"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
