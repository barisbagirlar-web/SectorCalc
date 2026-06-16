// Auto-generated from hedge-calculator-schema.json
import * as z from 'zod';

export interface Hedge_calculatorInput {
  spotPrice: number;
  futuresPrice: number;
  spotVol: number;
  futuresVol: number;
  correlation: number;
  exposureUnits: number;
  contractSize: number;
}

export const Hedge_calculatorInputSchema = z.object({
  spotPrice: z.number().default(100),
  futuresPrice: z.number().default(105),
  spotVol: z.number().default(0.25),
  futuresVol: z.number().default(0.2),
  correlation: z.number().default(0.9),
  exposureUnits: z.number().default(10000),
  contractSize: z.number().default(5000),
});

function evaluateAllFormulas(input: Hedge_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.correlation * (input.spotVol / input.futuresVol); results["optimalHedgeRatio"] = Number.isFinite(v) ? v : 0; } catch { results["optimalHedgeRatio"] = 0; }
  try { const v = (results["optimalHedgeRatio"] ?? 0) * input.exposureUnits; results["totalHedgeUnits"] = Number.isFinite(v) ? v : 0; } catch { results["totalHedgeUnits"] = 0; }
  try { const v = (results["totalHedgeUnits"] ?? 0) / input.contractSize; results["numberOfContracts"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfContracts"] = 0; }
  return results;
}


export function calculateHedge_calculator(input: Hedge_calculatorInput): Hedge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["numberOfContracts"] ?? 0;
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


export interface Hedge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
