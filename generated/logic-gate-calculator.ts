// Auto-generated from logic-gate-calculator-schema.json
import * as z from 'zod';

export interface Logic_gate_calculatorInput {
  gateType: number;
  A: number;
  B: number;
  C: number;
  D: number;
  dataConfidence?: number;
}

export const Logic_gate_calculatorInputSchema = z.object({
  gateType: z.number().default(1),
  A: z.number().default(0),
  B: z.number().default(0),
  C: z.number().default(0),
  D: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Logic_gate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.A * input.B * input.C * input.D; results["product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["product"] = 0; }
  try { const v = input.A + input.B + input.C + input.D; results["sum"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sum"] = 0; }
  try { const v = (asFormulaNumber(results["product"])); results["andResult"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["andResult"] = 0; }
  try { const v = (asFormulaNumber(results["sum"])) > 0 ? 1 : 0; results["orResult"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["orResult"] = 0; }
  try { const v = 1 - (asFormulaNumber(results["andResult"])); results["nandResult"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nandResult"] = 0; }
  try { const v = 1 - (asFormulaNumber(results["orResult"])); results["norResult"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["norResult"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLogic_gate_calculator(input: Logic_gate_calculatorInput): Logic_gate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["norResult"]));
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


export interface Logic_gate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
