// Auto-generated from drywall-mud-calculator-schema.json
import * as z from 'zod';

export interface Drywall_mud_calculatorInput {
  area: number;
  coats: number;
  coverage: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Drywall_mud_calculatorInputSchema = z.object({
  area: z.number().default(500),
  coats: z.number().default(2),
  coverage: z.number().default(150),
  wasteFactor: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drywall_mud_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.coats / input.coverage * (1 + input.wasteFactor / 100); results["totalMudGallons"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMudGallons"] = Number.NaN; }
  try { const v = input.area * input.coats / input.coverage * (1 + input.wasteFactor / 100); results["totalMudGallons_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMudGallons_aux"] = Number.NaN; }
  return results;
}


export function calculateDrywall_mud_calculator(input: Drywall_mud_calculatorInput): Drywall_mud_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMudGallons"]);
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


export interface Drywall_mud_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
