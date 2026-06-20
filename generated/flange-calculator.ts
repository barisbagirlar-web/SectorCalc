// Auto-generated from flange-calculator-schema.json
import * as z from 'zod';

export interface Flange_calculatorInput {
  outerDiameter: number;
  thickness: number;
  boltCircleDiameter: number;
  numberOfBolts: number;
  boltHoleDiameter: number;
  density: number;
  dataConfidence?: number;
}

export const Flange_calculatorInputSchema = z.object({
  outerDiameter: z.number().default(200),
  thickness: z.number().default(20),
  boltCircleDiameter: z.number().default(160),
  numberOfBolts: z.number().default(8),
  boltHoleDiameter: z.number().default(18),
  density: z.number().default(7850),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Flange_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.outerDiameter * input.thickness * input.boltCircleDiameter * input.numberOfBolts; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.outerDiameter * input.thickness * input.boltCircleDiameter * input.numberOfBolts * (input.boltHoleDiameter * input.density); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.boltHoleDiameter * input.density; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateFlange_calculator(input: Flange_calculatorInput): Flange_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Flange_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
