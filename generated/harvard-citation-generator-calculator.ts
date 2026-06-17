// @ts-nocheck
// Auto-generated from harvard-citation-generator-calculator-schema.json
import * as z from 'zod';

export interface Harvard_citation_generator_calculatorInput {
  materialCost: number;
  laborHours: number;
  hourlyRate: number;
  overheadPercentage: number;
  profitMarginPercentage: number;
}

export const Harvard_citation_generator_calculatorInputSchema = z.object({
  materialCost: z.number().default(100),
  laborHours: z.number().default(8),
  hourlyRate: z.number().default(25),
  overheadPercentage: z.number().default(20),
  profitMarginPercentage: z.number().default(15),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Harvard_citation_generator_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.laborHours * input.hourlyRate; results["laborCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = input.materialCost + (asFormulaNumber(results["laborCost"])); results["directCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["directCost"] = 0; }
  try { const v = (asFormulaNumber(results["directCost"])) * input.overheadPercentage / 100; results["overheadCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (asFormulaNumber(results["directCost"])) + (asFormulaNumber(results["overheadCost"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) * (1 + input.profitMarginPercentage / 100); results["sellingPrice"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sellingPrice"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHarvard_citation_generator_calculator(input: Harvard_citation_generator_calculatorInput): Harvard_citation_generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sellingPrice"]);
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


export interface Harvard_citation_generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
