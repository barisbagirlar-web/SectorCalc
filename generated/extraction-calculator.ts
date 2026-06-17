// @ts-nocheck
// Auto-generated from extraction-calculator-schema.json
import * as z from 'zod';

export interface Extraction_calculatorInput {
  totalMaterial: number;
  concentration: number;
  recoveryRate: number;
  targetPurity: number;
}

export const Extraction_calculatorInputSchema = z.object({
  totalMaterial: z.number().default(1000),
  concentration: z.number().default(10),
  recoveryRate: z.number().default(90),
  targetPurity: z.number().default(95),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Extraction_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100; results["primary"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary"] = 0; }
  try { const v = "Theoretical maximum: " + (input.totalMaterial * input.concentration / 100) + " kg"; results["breakdown1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = "Recovered before purification: " + (input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100) + " kg"; results["breakdown2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown2"] = 0; }
  try { const v = "Final pure product: " + (input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100) + " kg"; results["breakdown3"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown3"] = 0; }
  try { const v = input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateExtraction_calculator(input: Extraction_calculatorInput): Extraction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Extraction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
