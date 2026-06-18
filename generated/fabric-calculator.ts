// @ts-nocheck
// Auto-generated from fabric-calculator-schema.json
import * as z from 'zod';

export interface Fabric_calculatorInput {
  itemLength: number;
  itemWidth: number;
  quantity: number;
  fabricWidth: number;
  wasteFactor: number;
  patternRepeat: number;
}

export const Fabric_calculatorInputSchema = z.object({
  itemLength: z.number().default(50),
  itemWidth: z.number().default(30),
  quantity: z.number().default(10),
  fabricWidth: z.number().default(150),
  wasteFactor: z.number().default(5),
  patternRepeat: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fabric_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.itemLength * input.itemWidth * input.quantity * input.fabricWidth; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.itemLength * input.itemWidth * input.quantity * input.fabricWidth * ((input.wasteFactor / 100) * input.patternRepeat); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.wasteFactor / 100) * input.patternRepeat; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFabric_calculator(input: Fabric_calculatorInput): Fabric_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Fabric_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
