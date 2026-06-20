// Auto-generated from happiness-calculator-schema.json
import * as z from 'zod';

export interface Happiness_calculatorInput {
  health: number;
  wealth: number;
  relationships: number;
  career: number;
  leisure: number;
  environment: number;
  dataConfidence?: number;
}

export const Happiness_calculatorInputSchema = z.object({
  health: z.number().default(50),
  wealth: z.number().default(50),
  relationships: z.number().default(50),
  career: z.number().default(50),
  leisure: z.number().default(50),
  environment: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Happiness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.health*0.25 + input.wealth*0.2 + input.relationships*0.2 + input.career*0.15 + input.leisure*0.1 + input.environment*0.1; results["happinessScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["happinessScore"] = Number.NaN; }
  try { const v = input.health * 0.25; results["healthContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["healthContribution"] = Number.NaN; }
  try { const v = input.wealth * 0.2; results["wealthContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wealthContribution"] = Number.NaN; }
  try { const v = input.relationships * 0.2; results["relationshipsContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["relationshipsContribution"] = Number.NaN; }
  try { const v = input.career * 0.15; results["careerContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["careerContribution"] = Number.NaN; }
  try { const v = input.leisure * 0.1; results["leisureContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leisureContribution"] = Number.NaN; }
  try { const v = input.environment * 0.1; results["environmentContribution"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["environmentContribution"] = Number.NaN; }
  return results;
}


export function calculateHappiness_calculator(input: Happiness_calculatorInput): Happiness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["happinessScore"]);
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


export interface Happiness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
