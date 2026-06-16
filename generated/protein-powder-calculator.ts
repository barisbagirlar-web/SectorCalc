// Auto-generated from protein-powder-calculator-schema.json
import * as z from 'zod';

export interface Protein_powder_calculatorInput {
  servingSize: number;
  proteinPerServing: number;
  scoopsUsed: number;
  containerSize: number;
  containerPrice: number;
}

export const Protein_powder_calculatorInputSchema = z.object({
  servingSize: z.number().default(30),
  proteinPerServing: z.number().default(25),
  scoopsUsed: z.number().default(1),
  containerSize: z.number().default(1000),
  containerPrice: z.number().default(29.99),
});

function evaluateAllFormulas(input: Protein_powder_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.proteinPerServing * input.scoopsUsed; results["totalProtein"] = Number.isFinite(v) ? v : 0; } catch { results["totalProtein"] = 0; }
  try { const v = input.containerSize / input.servingSize; results["totalServings"] = Number.isFinite(v) ? v : 0; } catch { results["totalServings"] = 0; }
  try { const v = input.containerPrice / (results["totalServings"] ?? 0); results["costPerServing"] = Number.isFinite(v) ? v : 0; } catch { results["costPerServing"] = 0; }
  try { const v = (results["costPerServing"] ?? 0) / input.proteinPerServing; results["costPerGram"] = Number.isFinite(v) ? v : 0; } catch { results["costPerGram"] = 0; }
  return results;
}


export function calculateProtein_powder_calculator(input: Protein_powder_calculatorInput): Protein_powder_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalProtein"] ?? 0;
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


export interface Protein_powder_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
