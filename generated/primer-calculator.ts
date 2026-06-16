// Auto-generated from primer-calculator-schema.json
import * as z from 'zod';

export interface Primer_calculatorInput {
  surfaceArea: number;
  coverageRate: number;
  coats: number;
  wasteFactor: number;
  containerSize: number;
  pricePerContainer: number;
}

export const Primer_calculatorInputSchema = z.object({
  surfaceArea: z.number().default(100),
  coverageRate: z.number().default(10),
  coats: z.number().default(1),
  wasteFactor: z.number().default(5),
  containerSize: z.number().default(20),
  pricePerContainer: z.number().default(100),
});

function evaluateAllFormulas(input: Primer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.surfaceArea * input.coats / input.coverageRate; results["baseVolume"] = Number.isFinite(v) ? v : 0; } catch { results["baseVolume"] = 0; }
  try { const v = (results["baseVolume"] ?? 0) * input.wasteFactor / 100; results["wasteVolume"] = Number.isFinite(v) ? v : 0; } catch { results["wasteVolume"] = 0; }
  try { const v = (results["baseVolume"] ?? 0) + (results["wasteVolume"] ?? 0); results["adjustedVolume"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedVolume"] = 0; }
  try { const v = (results["adjustedVolume"] ?? 0) / input.containerSize; results["containersDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["containersDecimal"] = 0; }
  try { const v = (results["containersDecimal"] ?? 0) * input.pricePerContainer; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculatePrimer_calculator(input: Primer_calculatorInput): Primer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedVolume"] ?? 0;
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


export interface Primer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
