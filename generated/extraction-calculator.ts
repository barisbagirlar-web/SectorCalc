// Auto-generated from extraction-calculator-schema.json
import * as z from 'zod';

export interface Extraction_calculatorInput {
  totalMaterial: number;
  concentration: number;
  recoveryRate: number;
  targetPurity: number;
  dataConfidence?: number;
}

export const Extraction_calculatorInputSchema = z.object({
  totalMaterial: z.number().default(1000),
  concentration: z.number().default(10),
  recoveryRate: z.number().default(90),
  targetPurity: z.number().default(95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Extraction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = "Theoretical maximum: " + (input.totalMaterial * input.concentration / 100) + " kg"; results["breakdown1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = "Recovered before purification: " + (input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100) + " kg"; results["breakdown2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown2"] = 0; }
  try { const v = "Final pure product: " + (input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100) + " kg"; results["breakdown3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown3"] = 0; }
  try { const v = input.totalMaterial * input.concentration / 100 * input.recoveryRate / 100 * input.targetPurity / 100; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateExtraction_calculator(input: Extraction_calculatorInput): Extraction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
