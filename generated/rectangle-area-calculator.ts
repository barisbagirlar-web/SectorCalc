// Auto-generated from rectangle-area-calculator-schema.json
import * as z from 'zod';

export interface Rectangle_area_calculatorInput {
  lengthMm: number;
  widthMm: number;
  conversionFactor: number;
  tolerancePercent: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Rectangle_area_calculatorInputSchema = z.object({
  lengthMm: z.number().default(1000),
  widthMm: z.number().default(1000),
  conversionFactor: z.number().default(0.000001),
  tolerancePercent: z.number().default(0),
  safetyFactor: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rectangle_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.lengthMm * (1 + input.tolerancePercent/100); results["effectiveLengthMm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveLengthMm"] = Number.NaN; }
  try { const v = input.widthMm * (1 + input.tolerancePercent/100); results["effectiveWidthMm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveWidthMm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["effectiveLengthMm"])) * (toNumericFormulaValue(results["effectiveWidthMm"])); results["rawAreaMm2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawAreaMm2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rawAreaMm2"])) * input.conversionFactor * input.safetyFactor; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["area"] = Number.NaN; }
  return results;
}


export function calculateRectangle_area_calculator(input: Rectangle_area_calculatorInput): Rectangle_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["area"]);
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


export interface Rectangle_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
