// Auto-generated from slump-test-calculator-schema.json
import * as z from 'zod';

export interface Slump_test_calculatorInput {
  moldHeight: number;
  topDiameter: number;
  bottomDiameter: number;
  measuredHeight: number;
  specMin: number;
  specMax: number;
  dataConfidence?: number;
}

export const Slump_test_calculatorInputSchema = z.object({
  moldHeight: z.number().default(300),
  topDiameter: z.number().default(100),
  bottomDiameter: z.number().default(200),
  measuredHeight: z.number().default(150),
  specMin: z.number().default(50),
  specMax: z.number().default(100),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Slump_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.topDiameter / 2; results["topRadius"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["topRadius"] = Number.NaN; }
  try { const v = input.bottomDiameter / 2; results["bottomRadius"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bottomRadius"] = Number.NaN; }
  try { const v = input.moldHeight - input.measuredHeight; results["slump"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["slump"] = Number.NaN; }
  return results;
}


export function calculateSlump_test_calculator(input: Slump_test_calculatorInput): Slump_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["slump"]);
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


export interface Slump_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
