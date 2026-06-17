// @ts-nocheck
// Auto-generated from recycling-calculator-schema.json
import * as z from 'zod';

export interface Recycling_calculatorInput {
  totalWaste: number;
  recycledAmount: number;
  contaminationRate: number;
  disposalCostPerKg: number;
  revenuePerKg: number;
}

export const Recycling_calculatorInputSchema = z.object({
  totalWaste: z.number().default(1000),
  recycledAmount: z.number().default(300),
  contaminationRate: z.number().default(5),
  disposalCostPerKg: z.number().default(0.5),
  revenuePerKg: z.number().default(1.2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Recycling_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.recycledAmount * (1 - input.contaminationRate / 100); results["effectiveRecycledWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["effectiveRecycledWeight"] = 0; }
  try { const v = ((input.recycledAmount * (1 - input.contaminationRate / 100)) / input.totalWaste) * 100; results["recyclingRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recyclingRate"] = 0; }
  try { const v = input.totalWaste - (input.recycledAmount * (1 - input.contaminationRate / 100)); results["disposalWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["disposalWeight"] = 0; }
  try { const v = (input.recycledAmount * (1 - input.contaminationRate / 100)) * input.disposalCostPerKg; results["costSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costSavings"] = 0; }
  try { const v = (input.recycledAmount * (1 - input.contaminationRate / 100)) * input.revenuePerKg; results["revenueGenerated"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["revenueGenerated"] = 0; }
  try { const v = (input.recycledAmount * (1 - input.contaminationRate / 100)) * (input.disposalCostPerKg + input.revenuePerKg); results["netSavings"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netSavings"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRecycling_calculator(input: Recycling_calculatorInput): Recycling_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recyclingRate"]);
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


export interface Recycling_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
