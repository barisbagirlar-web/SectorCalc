// Auto-generated from cpk-ppm-converter-calculator-schema.json
import * as z from 'zod';

export interface Cpk_ppm_converter_calculatorInput {
  cpk: number;
  sigmaShift: number;
  distributionType: string;
  sampleSize: number;
  confidenceLevel: string;
  useConfidenceInterval: boolean;
  dataConfidence?: number;
}

export const Cpk_ppm_converter_calculatorInputSchema = z.object({
  cpk: z.number().min(0).max(3).default(1.33),
  sigmaShift: z.number().min(0).max(2).default(1.5),
  distributionType: z.enum(['normal', 't-distribution']).default('normal'),
  sampleSize: z.number().min(2).max(100000).default(100),
  confidenceLevel: z.enum(['0.9', '0.95', '0.99']).default('0.95'),
  useConfidenceInterval: z.boolean().default(false),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cpk_ppm_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cpk * input.sigmaShift * input.sampleSize; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.cpk * input.sigmaShift * input.sampleSize; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCpk_ppm_converter_calculator(input: Cpk_ppm_converter_calculatorInput): Cpk_ppm_converter_calculatorOutput {
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Historical comparison","Multi-process dashboard"],
  };
}


export interface Cpk_ppm_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
