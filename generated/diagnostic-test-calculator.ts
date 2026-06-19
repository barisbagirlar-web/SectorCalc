// Auto-generated from diagnostic-test-calculator-schema.json
import * as z from 'zod';

export interface Diagnostic_test_calculatorInput {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  dataConfidence?: number;
}

export const Diagnostic_test_calculatorInputSchema = z.object({
  truePositives: z.number().default(80),
  falsePositives: z.number().default(20),
  trueNegatives: z.number().default(100),
  falseNegatives: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Diagnostic_test_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.truePositives / (input.truePositives + input.falseNegatives); results["sensitivity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sensitivity"] = 0; }
  try { const v = input.trueNegatives / (input.trueNegatives + input.falsePositives); results["specificity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["specificity"] = 0; }
  try { const v = (input.truePositives + input.trueNegatives) / (input.truePositives + input.falsePositives + input.trueNegatives + input.falseNegatives); results["accuracy"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["accuracy"] = 0; }
  try { const v = input.truePositives / (input.truePositives + input.falsePositives); results["ppv"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ppv"] = 0; }
  try { const v = input.trueNegatives / (input.trueNegatives + input.falseNegatives); results["npv"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["npv"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDiagnostic_test_calculator(input: Diagnostic_test_calculatorInput): Diagnostic_test_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["accuracy"]);
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


export interface Diagnostic_test_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
