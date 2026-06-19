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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sourdough_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flourWeight * input.loafCount; results["totalFlour"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFlour"] = 0; }
  try { const v = input.flourWeight * input.loafCount * input.hydration / 100; results["water"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["water"] = 0; }
  try { const v = input.flourWeight * input.loafCount * input.starterPercent / 100; results["starter"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["starter"] = 0; }
  try { const v = input.flourWeight * input.loafCount * input.saltPercent / 100; results["salt"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["salt"] = 0; }
  try { const v = input.flourWeight * input.loafCount * (1 + input.hydration/100 + input.starterPercent/100 + input.saltPercent/100); results["totalDough"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDough"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
