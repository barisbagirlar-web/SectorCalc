// Auto-generated from crawl-space-calculator-schema.json
import * as z from 'zod';

export interface Crawl_space_calculatorInput {
  length: number;
  width: number;
  height: number;
  ventRatio: number;
  dataConfidence?: number;
}

export const Crawl_space_calculatorInputSchema = z.object({
  length: z.number().default(30),
  width: z.number().default(20),
  height: z.number().default(4),
  ventRatio: z.number().default(0.00667),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Crawl_space_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.width; results["floorArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["floorArea"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["floorArea"])) * input.height; results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volume"] = Number.NaN; }
  try { const v = 2 * (input.length + input.width); results["perimeter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perimeter"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["floorArea"])) * input.ventRatio; results["requiredVentArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredVentArea"] = Number.NaN; }
  return results;
}


export function calculateCrawl_space_calculator(input: Crawl_space_calculatorInput): Crawl_space_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredVentArea"]);
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


export interface Crawl_space_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
