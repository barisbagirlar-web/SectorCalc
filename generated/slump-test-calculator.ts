// @ts-nocheck
// Auto-generated from slump-test-calculator-schema.json
import * as z from 'zod';

export interface Slump_test_calculatorInput {
  moldHeight: number;
  topDiameter: number;
  bottomDiameter: number;
  measuredHeight: number;
  specMin: number;
  specMax: number;
}

export const Slump_test_calculatorInputSchema = z.object({
  moldHeight: z.number().default(300),
  topDiameter: z.number().default(100),
  bottomDiameter: z.number().default(200),
  measuredHeight: z.number().default(150),
  specMin: z.number().default(50),
  specMax: z.number().default(100),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Slump_test_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.topDiameter / 2; results["topRadius"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["topRadius"] = 0; }
  try { const v = input.bottomDiameter / 2; results["bottomRadius"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bottomRadius"] = 0; }
  try { const v = input.moldHeight - input.measuredHeight; results["slump"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["slump"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSlump_test_calculator(input: Slump_test_calculatorInput): Slump_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["slump"]);
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


export interface Slump_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
