// Auto-generated from dpi-calculator-schema.json
import * as z from 'zod';

export interface Dpi_calculatorInput {
  widthPixels: number;
  heightPixels: number;
  widthInches: number;
  heightInches: number;
  dataConfidence?: number;
}

export const Dpi_calculatorInputSchema = z.object({
  widthPixels: z.number().default(1920),
  heightPixels: z.number().default(1080),
  widthInches: z.number().default(13.6),
  heightInches: z.number().default(7.65),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dpi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.widthPixels / input.widthInches; results["horizontalDpi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["horizontalDpi"] = Number.NaN; }
  try { const v = input.heightPixels / input.heightInches; results["verticalDpi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["verticalDpi"] = Number.NaN; }
  return results;
}


export function calculateDpi_calculator(input: Dpi_calculatorInput): Dpi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["verticalDpi"]);
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


export interface Dpi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
