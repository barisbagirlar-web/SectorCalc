// Auto-generated from fiber-calculator-schema.json
import * as z from 'zod';

export interface Fiber_calculatorInput {
  length: number;
  attenuation: number;
  connectors: number;
  connectorLoss: number;
  splices: number;
  spliceLoss: number;
  margin: number;
  dataConfidence?: number;
}

export const Fiber_calculatorInputSchema = z.object({
  length: z.number().default(1),
  attenuation: z.number().default(0.35),
  connectors: z.number().default(2),
  connectorLoss: z.number().default(0.5),
  splices: z.number().default(0),
  spliceLoss: z.number().default(0.1),
  margin: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fiber_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length * input.attenuation + input.connectors * input.connectorLoss + input.splices * input.spliceLoss + input.margin; results["totalLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLoss"] = 0; }
  try { const v = input.length * input.attenuation; results["fiberLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fiberLoss"] = 0; }
  try { const v = input.connectors * input.connectorLoss; results["connectorLossTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["connectorLossTotal"] = 0; }
  try { const v = input.splices * input.spliceLoss; results["spliceLossTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["spliceLossTotal"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFiber_calculator(input: Fiber_calculatorInput): Fiber_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLoss"]);
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


export interface Fiber_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
