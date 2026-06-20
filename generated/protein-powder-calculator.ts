// Auto-generated from protein-powder-calculator-schema.json
import * as z from 'zod';

export interface Protein_powder_calculatorInput {
  servingSize: number;
  proteinPerServing: number;
  scoopsUsed: number;
  containerSize: number;
  containerPrice: number;
  dataConfidence?: number;
}

export const Protein_powder_calculatorInputSchema = z.object({
  servingSize: z.number().default(30),
  proteinPerServing: z.number().default(25),
  scoopsUsed: z.number().default(1),
  containerSize: z.number().default(1000),
  containerPrice: z.number().default(29.99),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Protein_powder_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.proteinPerServing * input.scoopsUsed; results["totalProtein"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalProtein"] = Number.NaN; }
  try { const v = input.containerSize / input.servingSize; results["totalServings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalServings"] = Number.NaN; }
  try { const v = input.containerPrice / (toNumericFormulaValue(results["totalServings"])); results["costPerServing"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerServing"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["costPerServing"])) / input.proteinPerServing; results["costPerGram"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerGram"] = Number.NaN; }
  return results;
}


export function calculateProtein_powder_calculator(input: Protein_powder_calculatorInput): Protein_powder_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalProtein"]);
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


export interface Protein_powder_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
