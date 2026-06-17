// @ts-nocheck
// Auto-generated from bar-to-psi-calculator-schema.json
import * as z from 'zod';

export interface Bar_to_psi_calculatorInput {
  pressureBar: number;
  refType: number;
  atmBar: number;
  precision: number;
  conversionFactor: number;
  tempC: number;
}

export const Bar_to_psi_calculatorInputSchema = z.object({
  pressureBar: z.number().default(1),
  refType: z.number().default(1),
  atmBar: z.number().default(1.01325),
  precision: z.number().default(2),
  conversionFactor: z.number().default(14.503773773),
  tempC: z.number().default(20),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bar_to_psi_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (((input.refType === 1 ? (input.pressureBar + input.atmBar) : input.pressureBar)) ? 1 : 0); results["absoluteBar"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["absoluteBar"] = 0; }
  try { const v = (asFormulaNumber(results["absoluteBar"])) * input.conversionFactor; results["exactPsi"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["exactPsi"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateBar_to_psi_calculator(input: Bar_to_psi_calculatorInput): Bar_to_psi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["exactPsi"]);
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


export interface Bar_to_psi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
