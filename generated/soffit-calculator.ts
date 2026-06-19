// Auto-generated from soffit-calculator-schema.json
import * as z from 'zod';

export interface Soffit_calculatorInput {
  runLength: number;
  overhangWidth: number;
  panelLength: number;
  panelWidth: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Soffit_calculatorInputSchema = z.object({
  runLength: z.number().default(10),
  overhangWidth: z.number().default(0.5),
  panelLength: z.number().default(2.44),
  panelWidth: z.number().default(0.3),
  wasteFactor: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Soffit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.runLength * input.overhangWidth; results["total_area"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_area"] = 0; }
  try { const v = input.runLength * input.overhangWidth * (1 + input.wasteFactor / 100); results["area_with_waste"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["area_with_waste"] = 0; }
  try { const v = (input.runLength * input.overhangWidth * (1 + input.wasteFactor / 100)) / (input.panelLength * input.panelWidth); results["panels_exact"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["panels_exact"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSoffit_calculator(input: Soffit_calculatorInput): Soffit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["panels_exact"]);
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


export interface Soffit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
