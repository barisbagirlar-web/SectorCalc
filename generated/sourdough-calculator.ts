// Auto-generated from sourdough-calculator-schema.json
import * as z from 'zod';

export interface Sourdough_calculatorInput {
  flourWeight: number;
  hydration: number;
  starterPercent: number;
  saltPercent: number;
  loafCount: number;
  dataConfidence?: number;
}

export const Sourdough_calculatorInputSchema = z.object({
  flourWeight: z.number().default(500),
  hydration: z.number().default(70),
  starterPercent: z.number().default(20),
  saltPercent: z.number().default(2),
  loafCount: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sourdough_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flourWeight * input.loafCount; results["totalFlour"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFlour"] = Number.NaN; }
  try { const v = input.flourWeight * input.loafCount * input.hydration / 100; results["water"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["water"] = Number.NaN; }
  try { const v = input.flourWeight * input.loafCount * input.starterPercent / 100; results["starter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["starter"] = Number.NaN; }
  try { const v = input.flourWeight * input.loafCount * input.saltPercent / 100; results["salt"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["salt"] = Number.NaN; }
  try { const v = input.flourWeight * input.loafCount * (1 + input.hydration/100 + input.starterPercent/100 + input.saltPercent/100); results["totalDough"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDough"] = Number.NaN; }
  return results;
}


export function calculateSourdough_calculator(input: Sourdough_calculatorInput): Sourdough_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDough"]);
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


export interface Sourdough_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
