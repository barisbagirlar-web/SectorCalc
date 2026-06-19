// Auto-generated from spackle-calculator-schema.json
import * as z from 'zod';

export interface Spackle_calculatorInput {
  areaToCover: number;
  numberOfHoles: number;
  holeDiameter: number;
  holeDepth: number;
  spackleDensity: number;
  containerSize: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Spackle_calculatorInputSchema = z.object({
  areaToCover: z.number().default(10),
  numberOfHoles: z.number().default(50),
  holeDiameter: z.number().default(5),
  holeDepth: z.number().default(3),
  spackleDensity: z.number().default(1500),
  containerSize: z.number().default(5),
  wasteFactor: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Spackle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.areaToCover * input.numberOfHoles * input.holeDiameter * input.holeDepth; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.areaToCover * input.numberOfHoles * input.holeDiameter * input.holeDepth * (input.spackleDensity * input.containerSize * (input.wasteFactor / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.spackleDensity * input.containerSize * (input.wasteFactor / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSpackle_calculator(input: Spackle_calculatorInput): Spackle_calculatorOutput {
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


export interface Spackle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
