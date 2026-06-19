// Auto-generated from uk-mpg-to-us-mpg-calculator-schema.json
import * as z from 'zod';

export interface Uk_mpg_to_us_mpg_calculatorInput {
  uk_mpg: number;
  imp_gal_l: number;
  us_gal_l: number;
  uk_mpg_adjustment: number;
  dataConfidence?: number;
}

export const Uk_mpg_to_us_mpg_calculatorInputSchema = z.object({
  uk_mpg: z.number().default(40),
  imp_gal_l: z.number().default(4.54609),
  us_gal_l: z.number().default(3.785411784),
  uk_mpg_adjustment: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Uk_mpg_to_us_mpg_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.uk_mpg + input.uk_mpg_adjustment; results["adjusted_uk_mpg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_uk_mpg"] = 0; }
  try { const v = (asFormulaNumber(results["adjusted_uk_mpg"])) * (input.us_gal_l / input.imp_gal_l); results["us_mpg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["us_mpg"] = 0; }
  try { const v = input.us_gal_l / input.imp_gal_l; results["conversion_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversion_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateUk_mpg_to_us_mpg_calculator(input: Uk_mpg_to_us_mpg_calculatorInput): Uk_mpg_to_us_mpg_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["us_mpg"]);
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


export interface Uk_mpg_to_us_mpg_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
