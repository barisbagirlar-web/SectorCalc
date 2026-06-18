// @ts-nocheck
// Auto-generated from font-size-calculator-schema.json
import * as z from 'zod';

export interface Font_size_calculatorInput {
  viewingDistance: number;
  visualAcuity: number;
  safetyFactor: number;
  pointConversion: number;
  pixelDensity: number;
}

export const Font_size_calculatorInputSchema = z.object({
  viewingDistance: z.number().default(1),
  visualAcuity: z.number().default(5),
  safetyFactor: z.number().default(1.2),
  pointConversion: z.number().default(0.3528),
  pixelDensity: z.number().default(96),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Font_size_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.viewingDistance * input.visualAcuity * input.safetyFactor * input.pointConversion; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.viewingDistance * input.visualAcuity * input.safetyFactor * input.pointConversion * (input.pixelDensity); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.pixelDensity; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateFont_size_calculator(input: Font_size_calculatorInput): Font_size_calculatorOutput {
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


export interface Font_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
