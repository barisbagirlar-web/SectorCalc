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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hedge_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.correlation * (input.spotVol / input.futuresVol); results["optimalHedgeRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimalHedgeRatio"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["optimalHedgeRatio"])) * input.exposureUnits; results["totalHedgeUnits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalHedgeUnits"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalHedgeUnits"])) / input.contractSize; results["numberOfContracts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numberOfContracts"] = Number.NaN; }
  return results;
}


export function calculateHedge_calculator(input: Hedge_calculatorInput): Hedge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["numberOfContracts"]);
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


export interface Hedge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
