// Auto-generated from drywall-mud-calculator-schema.json
import * as z from 'zod';

export interface Drywall_mud_calculatorInput {
  area: number;
  coats: number;
  coverage: number;
  wasteFactor: number;
}

export const Drywall_mud_calculatorInputSchema = z.object({
  area: z.number().default(500),
  coats: z.number().default(2),
  coverage: z.number().default(150),
  wasteFactor: z.number().default(10),
});

function evaluateAllFormulas(input: Drywall_mud_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.coats / input.coverage * (1 + input.wasteFactor / 100); results["totalMudGallons"] = Number.isFinite(v) ? v : 0; } catch { results["totalMudGallons"] = 0; }
  try { const v = Math.ceil(input.area * input.coats / input.coverage * (1 + input.wasteFactor / 100) / 4.5); results["buckets"] = Number.isFinite(v) ? v : 0; } catch { results["buckets"] = 0; }
  return results;
}


export function calculateDrywall_mud_calculator(input: Drywall_mud_calculatorInput): Drywall_mud_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalMudGallons"] ?? 0;
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


export interface Drywall_mud_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
