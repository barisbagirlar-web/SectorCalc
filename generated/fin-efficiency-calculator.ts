// Auto-generated from fin-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Fin_efficiency_calculatorInput {
  finLength: number;
  finThickness: number;
  finWidth: number;
  heatTransferCoefficient: number;
  thermalConductivity: number;
  dataConfidence?: number;
}

export const Fin_efficiency_calculatorInputSchema = z.object({
  finLength: z.number().default(0.1),
  finThickness: z.number().default(0.001),
  finWidth: z.number().default(0.05),
  heatTransferCoefficient: z.number().default(25),
  thermalConductivity: z.number().default(200),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fin_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.finLength + input.finThickness / 2; results["correctedLength"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctedLength"] = 0; }
  try { const v = input.finLength + input.finThickness / 2; results["correctedLength_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["correctedLength_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFin_efficiency_calculator(input: Fin_efficiency_calculatorInput): Fin_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["correctedLength_aux"]);
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


export interface Fin_efficiency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
