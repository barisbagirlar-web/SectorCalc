// @ts-nocheck
// Auto-generated from npsh-calculator-schema.json
import * as z from 'zod';

export interface Npsh_calculatorInput {
  atmosphericPressure: number;
  vaporPressure: number;
  liquidDensity: number;
  staticSuctionHead: number;
  frictionHeadLoss: number;
  velocityHead: number;
}

export const Npsh_calculatorInputSchema = z.object({
  atmosphericPressure: z.number().default(1.01325),
  vaporPressure: z.number().default(0.02339),
  liquidDensity: z.number().default(1000),
  staticSuctionHead: z.number().default(0),
  frictionHeadLoss: z.number().default(0.5),
  velocityHead: z.number().default(0.2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Npsh_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.atmosphericPressure * 100000) / (input.liquidDensity * 9.80665); results["atmHead"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["atmHead"] = 0; }
  try { const v = (input.vaporPressure * 100000) / (input.liquidDensity * 9.80665); results["vaporHead"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["vaporHead"] = 0; }
  try { const v = (asFormulaNumber(results["atmHead"])) - (asFormulaNumber(results["vaporHead"])) + input.staticSuctionHead + input.velocityHead - input.frictionHeadLoss; results["npsha"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["npsha"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNpsh_calculator(input: Npsh_calculatorInput): Npsh_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["npsha"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Npsh_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
