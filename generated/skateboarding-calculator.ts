// Auto-generated from skateboarding-calculator-schema.json
import * as z from 'zod';

export interface Skateboarding_calculatorInput {
  deckLength: number;
  deckWidth: number;
  wheelDiameter: number;
  wheelHardness: number;
  bearingRating: number;
  truckWidth: number;
  riderWeight: number;
  skateStyle: number;
  dataConfidence?: number;
}

export const Skateboarding_calculatorInputSchema = z.object({
  deckLength: z.number().default(32),
  deckWidth: z.number().default(8),
  wheelDiameter: z.number().default(54),
  wheelHardness: z.number().default(99),
  bearingRating: z.number().default(5),
  truckWidth: z.number().default(5.5),
  riderWeight: z.number().default(150),
  skateStyle: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Skateboarding_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.deckLength * input.deckWidth; results["deckArea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deckArea"] = Number.NaN; }
  try { const v = input.wheelDiameter * (100 - input.wheelHardness) / 100; results["wheelPerformance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wheelPerformance"] = Number.NaN; }
  try { const v = input.bearingRating * 10; results["bearingSpeed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bearingSpeed"] = Number.NaN; }
  try { const v = input.truckWidth / input.deckWidth; results["truckStability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["truckStability"] = Number.NaN; }
  try { const v = input.riderWeight / 150; results["weightFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightFactor"] = Number.NaN; }
  try { const v = input.skateStyle === 1 ? 1.2 : (input.skateStyle === 2 ? 1.0 : 0.8); results["styleMultiplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["styleMultiplier"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["deckArea"])) * 0.2 + (toNumericFormulaValue(results["wheelPerformance"])) * 0.3 + (toNumericFormulaValue(results["bearingSpeed"])) * 0.25 + (toNumericFormulaValue(results["truckStability"])) * 0.15 + (toNumericFormulaValue(results["weightFactor"])) * 0.1) * (toNumericFormulaValue(results["styleMultiplier"])); results["overallScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overallScore"] = Number.NaN; }
  return results;
}


export function calculateSkateboarding_calculator(input: Skateboarding_calculatorInput): Skateboarding_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["overallScore"]);
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


export interface Skateboarding_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
