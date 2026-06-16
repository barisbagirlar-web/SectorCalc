// Auto-generated from crawl-space-calculator-schema.json
import * as z from 'zod';

export interface Crawl_space_calculatorInput {
  length: number;
  width: number;
  height: number;
  ventRatio: number;
}

export const Crawl_space_calculatorInputSchema = z.object({
  length: z.number().default(30),
  width: z.number().default(20),
  height: z.number().default(4),
  ventRatio: z.number().default(0.00667),
});

function evaluateAllFormulas(input: Crawl_space_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["floorArea"] = Number.isFinite(v) ? v : 0; } catch { results["floorArea"] = 0; }
  try { const v = (results["floorArea"] ?? 0) * input.height; results["volume"] = Number.isFinite(v) ? v : 0; } catch { results["volume"] = 0; }
  try { const v = 2 * (input.length + input.width); results["perimeter"] = Number.isFinite(v) ? v : 0; } catch { results["perimeter"] = 0; }
  try { const v = (results["floorArea"] ?? 0) * input.ventRatio; results["requiredVentArea"] = Number.isFinite(v) ? v : 0; } catch { results["requiredVentArea"] = 0; }
  return results;
}


export function calculateCrawl_space_calculator(input: Crawl_space_calculatorInput): Crawl_space_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredVentArea"] ?? 0;
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


export interface Crawl_space_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
