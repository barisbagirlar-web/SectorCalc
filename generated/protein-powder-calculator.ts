// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Protein_powder_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.proteinPerServing * input.scoopsUsed; results["totalProtein"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalProtein"] = 0; }
  try { const v = input.containerSize / input.servingSize; results["totalServings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalServings"] = 0; }
  try { const v = input.containerPrice / (asFormulaNumber(results["totalServings"])); results["costPerServing"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerServing"] = 0; }
  try { const v = (asFormulaNumber(results["costPerServing"])) / input.proteinPerServing; results["costPerGram"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerGram"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateProtein_powder_calculator(input: Protein_powder_calculatorInput): Protein_powder_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalProtein"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
