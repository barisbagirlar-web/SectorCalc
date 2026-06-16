// Auto-generated from happiness-calculator-schema.json
import * as z from 'zod';

export interface Happiness_calculatorInput {
  health: number;
  wealth: number;
  relationships: number;
  career: number;
  leisure: number;
  environment: number;
}

export const Happiness_calculatorInputSchema = z.object({
  health: z.number().default(50),
  wealth: z.number().default(50),
  relationships: z.number().default(50),
  career: z.number().default(50),
  leisure: z.number().default(50),
  environment: z.number().default(50),
});

function evaluateAllFormulas(input: Happiness_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.health*0.25 + input.wealth*0.2 + input.relationships*0.2 + input.career*0.15 + input.leisure*0.1 + input.environment*0.1; results["happinessScore"] = Number.isFinite(v) ? v : 0; } catch { results["happinessScore"] = 0; }
  try { const v = input.health * 0.25; results["healthContribution"] = Number.isFinite(v) ? v : 0; } catch { results["healthContribution"] = 0; }
  try { const v = input.wealth * 0.2; results["wealthContribution"] = Number.isFinite(v) ? v : 0; } catch { results["wealthContribution"] = 0; }
  try { const v = input.relationships * 0.2; results["relationshipsContribution"] = Number.isFinite(v) ? v : 0; } catch { results["relationshipsContribution"] = 0; }
  try { const v = input.career * 0.15; results["careerContribution"] = Number.isFinite(v) ? v : 0; } catch { results["careerContribution"] = 0; }
  try { const v = input.leisure * 0.1; results["leisureContribution"] = Number.isFinite(v) ? v : 0; } catch { results["leisureContribution"] = 0; }
  try { const v = input.environment * 0.1; results["environmentContribution"] = Number.isFinite(v) ? v : 0; } catch { results["environmentContribution"] = 0; }
  return results;
}


export function calculateHappiness_calculator(input: Happiness_calculatorInput): Happiness_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["happinessScore"] ?? 0;
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


export interface Happiness_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
