// Auto-generated from imperial-gallons-to-us-gallons-calculator-schema.json
import * as z from 'zod';

export interface Imperial_gallons_to_us_gallons_calculatorInput {
  imperialGallons: number;
  batchSize: number;
  tolerance: number;
  temperature: number;
}

export const Imperial_gallons_to_us_gallons_calculatorInputSchema = z.object({
  imperialGallons: z.number().default(1),
  batchSize: z.number().default(1),
  tolerance: z.number().default(0),
  temperature: z.number().default(20),
});

function evaluateAllFormulas(input: Imperial_gallons_to_us_gallons_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.2009499255; results["conversionFactor"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = input.imperialGallons * input.batchSize * (results["conversionFactor"] ?? 0); results["usGallonsNominal"] = Number.isFinite(v) ? v : 0; } catch { results["usGallonsNominal"] = 0; }
  try { const v = (results["usGallonsNominal"] ?? 0) * (1 - input.tolerance / 100); results["usGallonsMin"] = Number.isFinite(v) ? v : 0; } catch { results["usGallonsMin"] = 0; }
  try { const v = (results["usGallonsNominal"] ?? 0) * (1 + input.tolerance / 100); results["usGallonsMax"] = Number.isFinite(v) ? v : 0; } catch { results["usGallonsMax"] = 0; }
  return results;
}


export function calculateImperial_gallons_to_us_gallons_calculator(input: Imperial_gallons_to_us_gallons_calculatorInput): Imperial_gallons_to_us_gallons_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["usGallonsNominal"] ?? 0;
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


export interface Imperial_gallons_to_us_gallons_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
