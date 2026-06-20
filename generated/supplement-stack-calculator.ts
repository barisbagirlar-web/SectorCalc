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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Supplement_stack_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.supp1Amount * input.supp1DailyServings + input.supp2Amount * input.supp2DailyServings; results["dailyActive"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyActive"] = Number.NaN; }
  try { const v = (input.supp1Price / input.supp1ContainerServings) * input.supp1DailyServings + (input.supp2Price / input.supp2ContainerServings) * input.supp2DailyServings; results["dailyCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyCost"])) / (toNumericFormulaValue(results["dailyActive"])); results["costPerGram"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerGram"] = Number.NaN; }
  return results;
}


export function calculateSupplement_stack_calculator(input: Supplement_stack_calculatorInput): Supplement_stack_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyCost"]);
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


export interface Supplement_stack_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
