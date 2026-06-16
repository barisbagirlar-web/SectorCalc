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

function evaluateAllFormulas(input: Harvard_citation_generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.laborHours * input.hourlyRate; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = input.materialCost + (results["laborCost"] ?? 0); results["directCost"] = Number.isFinite(v) ? v : 0; } catch { results["directCost"] = 0; }
  try { const v = (results["directCost"] ?? 0) * input.overheadPercentage / 100; results["overheadCost"] = Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (results["directCost"] ?? 0) + (results["overheadCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) * (1 + input.profitMarginPercentage / 100); results["sellingPrice"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  return results;
}


export function calculateHarvard_citation_generator_calculator(input: Harvard_citation_generator_calculatorInput): Harvard_citation_generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sellingPrice"] ?? 0;
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


export interface Harvard_citation_generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
