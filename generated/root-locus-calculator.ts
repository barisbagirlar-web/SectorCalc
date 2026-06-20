// Auto-generated from root-locus-calculator-schema.json
import * as z from 'zod';

export interface Root_locus_calculatorInput {
  zeroReal: number;
  zeroImag: number;
  pole1Real: number;
  pole1Imag: number;
  pole2Real: number;
  pole2Imag: number;
  pole3Real: number;
  pole3Imag: number;
  dataConfidence?: number;
}

export const Root_locus_calculatorInputSchema = z.object({
  zeroReal: z.number().default(0),
  zeroImag: z.number().default(0),
  pole1Real: z.number().default(-1),
  pole1Imag: z.number().default(0),
  pole2Real: z.number().default(-2),
  pole2Imag: z.number().default(0),
  pole3Real: z.number().default(-3),
  pole3Imag: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Root_locus_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.zeroReal * input.zeroImag * input.pole1Real * input.pole1Imag; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.zeroReal * input.zeroImag * input.pole1Real * input.pole1Imag * (input.pole2Real * input.pole2Imag * input.pole3Real * input.pole3Imag); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.pole2Real * input.pole2Imag * input.pole3Real * input.pole3Imag; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateRoot_locus_calculator(input: Root_locus_calculatorInput): Root_locus_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Root_locus_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
