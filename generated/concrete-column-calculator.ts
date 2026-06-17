// Auto-generated from concrete-column-calculator-schema.json
import * as z from 'zod';

export interface Concrete_column_calculatorInput {
  width: number;
  depth: number;
  fc: number;
  fy: number;
  as: number;
  phi: number;
}

export const Concrete_column_calculatorInputSchema = z.object({
  width: z.number().default(300),
  depth: z.number().default(300),
  fc: z.number().default(25),
  fy: z.number().default(420),
  as: z.number().default(1256),
  phi: z.number().default(0.65),
});

function evaluateAllFormulas(input: Concrete_column_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.width * input.depth; results["ag"] = Number.isFinite(v) ? v : 0; } catch { results["ag"] = 0; }
  try { const v = input.as / (results["ag"] ?? 0); results["ro"] = Number.isFinite(v) ? v : 0; } catch { results["ro"] = 0; }
  try { const v = 0.85 * input.fc * ((results["ag"] ?? 0) - input.as) + input.fy * input.as; results["pn"] = Number.isFinite(v) ? v : 0; } catch { results["pn"] = 0; }
  try { const v = input.phi * (results["pn"] ?? 0) / 1000; results["phiPn_kN"] = Number.isFinite(v) ? v : 0; } catch { results["phiPn_kN"] = 0; }
  results["_ag__mm_"] = 0;
  try { const v = (results["ro"] ?? 0); results["_ro_"] = Number.isFinite(v) ? v : 0; } catch { results["_ro_"] = 0; }
  results["_pn__N"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateConcrete_column_calculator(input: Concrete_column_calculatorInput): Concrete_column_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
