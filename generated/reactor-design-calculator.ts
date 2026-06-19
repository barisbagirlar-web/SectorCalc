// Auto-generated from reactor-design-calculator-schema.json
import * as z from 'zod';

export interface Reactor_design_calculatorInput {
  volumetricFlowRate: number;
  inletConcentration: number;
  conversion: number;
  rateConstant: number;
  reactionOrder: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Reactor_design_calculatorInputSchema = z.object({
  volumetricFlowRate: z.number().default(0.1),
  inletConcentration: z.number().default(100),
  conversion: z.number().default(0.9),
  rateConstant: z.number().default(0.5),
  reactionOrder: z.number().default(1),
  safetyFactor: z.number().default(1.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reactor_design_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inletConcentration * (1 - input.conversion); results["outletConcentration"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outletConcentration"] = 0; }
  try { const v = input.inletConcentration * (1 - input.conversion); results["outletConcentration_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["outletConcentration_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReactor_design_calculator(input: Reactor_design_calculatorInput): Reactor_design_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["outletConcentration_aux"]);
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


export interface Reactor_design_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
