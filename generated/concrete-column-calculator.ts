// Auto-generated from concrete-column-calculator-schema.json
import * as z from 'zod';

export interface Concrete_column_calculatorInput {
  width: number;
  depth: number;
  fc: number;
  fy: number;
  as: number;
  phi: number;
  dataConfidence?: number;
}

export const Concrete_column_calculatorInputSchema = z.object({
  width: z.number().default(300),
  depth: z.number().default(300),
  fc: z.number().default(25),
  fy: z.number().default(420),
  as: z.number().default(1256),
  phi: z.number().default(0.65),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_column_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.width * input.depth; results["ag"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ag"] = 0; }
  try { const v = input.as / (asFormulaNumber(results["ag"])); results["ro"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ro"] = 0; }
  try { const v = 0.85 * input.fc * ((asFormulaNumber(results["ag"])) - input.as) + input.fy * input.as; results["pn"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pn"] = 0; }
  try { const v = input.phi * (asFormulaNumber(results["pn"])) / 1000; results["phiPn_kN"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["phiPn_kN"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_column_calculator(input: Concrete_column_calculatorInput): Concrete_column_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["phiPn_kN"]));
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


export interface Concrete_column_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
