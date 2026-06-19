// Auto-generated from imperial-gallons-to-us-gallons-calculator-schema.json
import * as z from 'zod';

export interface Imperial_gallons_to_us_gallons_calculatorInput {
  imperialGallons: number;
  batchSize: number;
  tolerance: number;
  temperature: number;
  dataConfidence?: number;
}

export const Imperial_gallons_to_us_gallons_calculatorInputSchema = z.object({
  imperialGallons: z.number().default(1),
  batchSize: z.number().default(1),
  tolerance: z.number().default(0),
  temperature: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Imperial_gallons_to_us_gallons_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.imperialGallons * input.batchSize * (input.tolerance / 100) * input.temperature; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.imperialGallons * input.batchSize * (input.tolerance / 100) * input.temperature; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateImperial_gallons_to_us_gallons_calculator(input: Imperial_gallons_to_us_gallons_calculatorInput): Imperial_gallons_to_us_gallons_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Imperial_gallons_to_us_gallons_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
