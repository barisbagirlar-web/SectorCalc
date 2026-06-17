// @ts-nocheck
// Auto-generated from dpi-to-ppi-calculator-schema.json
import * as z from 'zod';

export interface Dpi_to_ppi_calculatorInput {
  dpi: number;
  originalWidth: number;
  originalHeight: number;
  displayWidth: number;
  displayHeight: number;
}

export const Dpi_to_ppi_calculatorInputSchema = z.object({
  dpi: z.number().default(300),
  originalWidth: z.number().default(8.5),
  originalHeight: z.number().default(11),
  displayWidth: z.number().default(5),
  displayHeight: z.number().default(7),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dpi_to_ppi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.dpi * input.originalWidth) / input.displayWidth; results["horizontalPPI"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["horizontalPPI"] = 0; }
  try { const v = (input.dpi * input.originalHeight) / input.displayHeight; results["verticalPPI"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["verticalPPI"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDpi_to_ppi_calculator(input: Dpi_to_ppi_calculatorInput): Dpi_to_ppi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["verticalPPI"]);
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


export interface Dpi_to_ppi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
