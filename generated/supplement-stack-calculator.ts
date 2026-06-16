// Auto-generated from supplement-stack-calculator-schema.json
import * as z from 'zod';

export interface Supplement_stack_calculatorInput {
  supp1Amount: number;
  supp1Price: number;
  supp1ContainerServings: number;
  supp1DailyServings: number;
  supp2Amount: number;
  supp2Price: number;
  supp2ContainerServings: number;
  supp2DailyServings: number;
}

export const Supplement_stack_calculatorInputSchema = z.object({
  supp1Amount: z.number().default(5),
  supp1Price: z.number().default(30),
  supp1ContainerServings: z.number().default(30),
  supp1DailyServings: z.number().default(2),
  supp2Amount: z.number().default(3),
  supp2Price: z.number().default(25),
  supp2ContainerServings: z.number().default(60),
  supp2DailyServings: z.number().default(1),
});

function evaluateAllFormulas(input: Supplement_stack_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.supp1Amount * input.supp1DailyServings + input.supp2Amount * input.supp2DailyServings; results["dailyActive"] = Number.isFinite(v) ? v : 0; } catch { results["dailyActive"] = 0; }
  try { const v = (input.supp1Price / input.supp1ContainerServings) * input.supp1DailyServings + (input.supp2Price / input.supp2ContainerServings) * input.supp2DailyServings; results["dailyCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyCost"] = 0; }
  try { const v = (results["dailyCost"] ?? 0) / (results["dailyActive"] ?? 0); results["costPerGram"] = Number.isFinite(v) ? v : 0; } catch { results["costPerGram"] = 0; }
  return results;
}


export function calculateSupplement_stack_calculator(input: Supplement_stack_calculatorInput): Supplement_stack_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyCost"] ?? 0;
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


export interface Supplement_stack_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
